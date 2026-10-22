-- =============================================================================
-- Feature 3: "The secret exchange"
--
-- Give a secret, get a stranger's secret back. Secrets are never readable by
-- clients: no grants, no policies. Everything goes through the service-role
-- functions below, called by server actions after the account is verified.
--
-- Daily limit: 3 secrets given per day, resetting at midnight in the account's
-- time zone (captured at sign-up and locked).
-- =============================================================================

create table public.secrets (
  id               uuid primary key default gen_random_uuid(),
  author_id        uuid not null references public.visitors (id) on delete cascade,
  body             text not null check (char_length(body) between 10 and 500),
  status           public.content_status not null default 'pending',
  report_count     integer not null default 0,
  times_delivered  integer not null default 0,
  -- The author's local day when it was given (counts towards the daily limit).
  local_day        date not null,
  created_at       timestamptz not null default now()
);

-- Matching: least-delivered published secrets first.
create index secrets_match_idx on public.secrets (times_delivered, created_at) where status = 'published';
create index secrets_author_day_idx on public.secrets (author_id, local_day);
create index secrets_moderation_idx on public.secrets (status) where status in ('pending', 'hidden');

-- One row per secret handed to someone. given_secret_id is the secret they
-- gave in exchange; it's what "pays" for the delivery.
create table public.secret_deliveries (
  id               uuid primary key default gen_random_uuid(),
  secret_id        uuid not null references public.secrets (id) on delete cascade,
  recipient_id     uuid not null references public.visitors (id) on delete cascade,
  given_secret_id  uuid unique references public.secrets (id) on delete set null,
  created_at       timestamptz not null default now(),
  unique (secret_id, recipient_id)
);

create index secret_deliveries_recipient_idx on public.secret_deliveries (recipient_id, created_at desc);

-- One short reply per delivery, sent to the secret's author.
create table public.secret_replies (
  id            uuid primary key default gen_random_uuid(),
  delivery_id   uuid not null unique references public.secret_deliveries (id) on delete cascade,
  secret_id     uuid not null references public.secrets (id) on delete cascade,
  author_id     uuid not null references public.visitors (id) on delete cascade,
  body          text not null check (char_length(body) between 2 and 200),
  status        public.content_status not null default 'pending',
  report_count  integer not null default 0,
  read_at       timestamptz,
  created_at    timestamptz not null default now()
);

create index secret_replies_secret_idx on public.secret_replies (secret_id, created_at);
create index secret_replies_moderation_idx on public.secret_replies (status) where status in ('pending', 'hidden');

create trigger secrets_activity after insert on public.secrets
  for each row execute function public.log_activity('secret', 'author_id');
create trigger secret_replies_activity after insert on public.secret_replies
  for each row execute function public.log_activity('secret_reply', 'author_id');

alter table public.secrets enable row level security;
alter table public.secret_deliveries enable row level security;
alter table public.secret_replies enable row level security;
revoke all on public.secrets, public.secret_deliveries, public.secret_replies from anon, authenticated;
-- No policies: service role only.

-- -----------------------------------------------------------------------------
-- Matching
-- -----------------------------------------------------------------------------

-- Hands p_visitor one stranger's secret in return for p_given (which must be
-- theirs and not yet paid out). Never their own secret, never one they've had
-- before, never from a banned author; least-delivered first, random among ties.
-- Returns the delivery id, or null if there's nothing to give right now.
create or replace function public.deliver_secret(p_visitor uuid, p_given uuid)
returns uuid
language plpgsql security definer set search_path = public as $$
declare
  v_secret uuid;
  v_delivery uuid;
begin
  select s.id into v_secret
  from secrets s
  join visitors a on a.id = s.author_id and not a.banned
  where s.status = 'published'
    and s.author_id <> p_visitor
    and not exists (select 1 from secret_deliveries d where d.secret_id = s.id and d.recipient_id = p_visitor)
  order by s.times_delivered, random()
  limit 1
  for update of s skip locked;

  if v_secret is null then
    return null;
  end if;

  insert into secret_deliveries (secret_id, recipient_id, given_secret_id)
  values (v_secret, p_visitor, p_given)
  returning id into v_delivery;

  update secrets set times_delivered = times_delivered + 1 where id = v_secret;
  return v_delivery;
end;
$$;

-- Pays out secrets given earlier when nothing was available at the time.
create or replace function public.settle_owed_secrets(p_visitor uuid)
returns void
language plpgsql security definer set search_path = public as $$
declare
  v_given uuid;
begin
  for v_given in
    select s.id from secrets s
    where s.author_id = p_visitor
      and s.status <> 'removed'
      and not exists (select 1 from secret_deliveries d where d.given_secret_id = s.id)
    order by s.created_at
  loop
    exit when deliver_secret(p_visitor, v_given) is null;
  end loop;
end;
$$;

-- -----------------------------------------------------------------------------
-- API (service role only; p_visitor is the verified account)
-- -----------------------------------------------------------------------------

-- Today's exchange state: how many are left, when the day resets, and the
-- secrets received today (with whether they've been replied to).
create or replace function public.get_exchange_state(p_visitor uuid, p_daily_limit integer)
returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare
  v_tz text;
  v_today date;
  v_used integer;
begin
  select time_zone into v_tz from visitors where id = p_visitor;
  if v_tz is null then
    raise exception 'visitor not found' using errcode = 'P0002';
  end if;

  perform settle_owed_secrets(p_visitor);

  v_today := (now() at time zone v_tz)::date;
  select count(*) into v_used from secrets where author_id = p_visitor and local_day = v_today;

  return jsonb_build_object(
    'used', v_used,
    'limit', p_daily_limit,
    'resetsAt', ((v_today + 1)::timestamp at time zone v_tz),
    'owed', (select count(*) from secrets s
              where s.author_id = p_visitor and s.status <> 'removed'
                and not exists (select 1 from secret_deliveries d where d.given_secret_id = s.id)),
    'unreadReplies', (select count(*) from secret_replies r
                       join secrets s on s.id = r.secret_id
                       where s.author_id = p_visitor and r.status = 'published' and r.read_at is null),
    'received', coalesce((
      select jsonb_agg(jsonb_build_object(
               'deliveryId', d.id,
               'secretId', s.id,
               'body', s.body,
               'receivedAt', d.created_at,
               'replied', exists (select 1 from secret_replies r where r.delivery_id = d.id)
             ) order by d.created_at desc)
      from secret_deliveries d
      join secrets s on s.id = d.secret_id
      where d.recipient_id = p_visitor
        and (d.created_at at time zone v_tz)::date = v_today
        and s.status in ('published', 'pending')
    ), '[]'::jsonb)
  );
end;
$$;

-- Gives a secret (already moderated by the server action, which passes the
-- resulting status) and returns the stranger's secret received for it.
-- Raises 'P0001' with message 'daily_limit' when the day's exchanges are used up.
create or replace function public.exchange_secret(
  p_visitor uuid,
  p_body text,
  p_status public.content_status,
  p_daily_limit integer
)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_tz text;
  v_today date;
  v_used integer;
  v_given uuid;
  v_delivery uuid;
begin
  -- Lock the account row so parallel requests can't exceed the limit.
  select time_zone into v_tz from visitors where id = p_visitor for update;
  if v_tz is null then
    raise exception 'visitor not found' using errcode = 'P0002';
  end if;

  v_today := (now() at time zone v_tz)::date;
  select count(*) into v_used from secrets where author_id = p_visitor and local_day = v_today;
  if v_used >= p_daily_limit then
    raise exception 'daily_limit' using errcode = 'P0001';
  end if;

  insert into secrets (author_id, body, status, local_day)
  values (p_visitor, p_body, p_status, v_today)
  returning id into v_given;

  v_delivery := deliver_secret(p_visitor, v_given);

  return jsonb_build_object(
    'givenId', v_given,
    'used', v_used + 1,
    'limit', p_daily_limit,
    'resetsAt', ((v_today + 1)::timestamp at time zone v_tz),
    'received', (
      select jsonb_build_object(
               'deliveryId', d.id, 'secretId', s.id, 'body', s.body,
               'receivedAt', d.created_at, 'replied', false)
      from secret_deliveries d join secrets s on s.id = d.secret_id
      where d.id = v_delivery
    )
  );
end;
$$;

-- Validates that p_visitor received this delivery and hasn't replied yet.
-- Returns the secret id the reply belongs to.
create or replace function public.check_secret_reply(p_visitor uuid, p_delivery uuid)
returns uuid
language plpgsql stable security definer set search_path = public as $$
declare
  v_secret uuid;
begin
  select d.secret_id into v_secret
  from secret_deliveries d
  join secrets s on s.id = d.secret_id
  where d.id = p_delivery and d.recipient_id = p_visitor and s.status = 'published';
  if v_secret is null then
    raise exception 'delivery not found' using errcode = 'P0002';
  end if;
  if exists (select 1 from secret_replies where delivery_id = p_delivery) then
    raise exception 'already replied' using errcode = '23505';
  end if;
  return v_secret;
end;
$$;

-- "My secrets": everything you've given, how many people read each one, and
-- the (published) replies strangers sent you. Marks those replies as read.
create or replace function public.get_my_secrets(p_visitor uuid)
returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare
  v_result jsonb;
begin
  select coalesce(jsonb_agg(jsonb_build_object(
           'id', s.id,
           'body', s.body,
           'status', s.status,
           'createdAt', s.created_at,
           'timesDelivered', s.times_delivered,
           'replies', coalesce((
             select jsonb_agg(jsonb_build_object(
                      'id', r.id, 'body', r.body, 'createdAt', r.created_at, 'unread', r.read_at is null
                    ) order by r.created_at desc)
             from secret_replies r
             where r.secret_id = s.id and r.status = 'published'
           ), '[]'::jsonb)
         ) order by s.created_at desc), '[]'::jsonb)
  into v_result
  from secrets s
  where s.author_id = p_visitor and s.status in ('published', 'pending', 'hidden');

  update secret_replies r set read_at = now()
  from secrets s
  where s.id = r.secret_id and s.author_id = p_visitor
    and r.status = 'published' and r.read_at is null;

  return v_result;
end;
$$;

-- Every secret you've received, newest first, with your reply if any.
create or replace function public.get_received_secrets(p_visitor uuid)
returns jsonb
language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(jsonb_build_object(
           'deliveryId', d.id,
           'secretId', s.id,
           'body', s.body,
           'receivedAt', d.created_at,
           'replied', r.id is not null,
           'reply', r.body
         ) order by d.created_at desc), '[]'::jsonb)
  from secret_deliveries d
  join secrets s on s.id = d.secret_id
  left join secret_replies r on r.delivery_id = d.id
  where d.recipient_id = p_visitor and s.status in ('published', 'pending');
$$;

revoke all on function public.deliver_secret(uuid, uuid) from public, anon, authenticated;
revoke all on function public.settle_owed_secrets(uuid) from public, anon, authenticated;
revoke all on function public.get_exchange_state(uuid, integer) from public, anon, authenticated;
revoke all on function public.exchange_secret(uuid, text, public.content_status, integer) from public, anon, authenticated;
revoke all on function public.check_secret_reply(uuid, uuid) from public, anon, authenticated;
revoke all on function public.get_my_secrets(uuid) from public, anon, authenticated;
revoke all on function public.get_received_secrets(uuid) from public, anon, authenticated;
grant execute on function public.get_exchange_state(uuid, integer) to service_role;
grant execute on function public.exchange_secret(uuid, text, public.content_status, integer) to service_role;
grant execute on function public.check_secret_reply(uuid, uuid) to service_role;
grant execute on function public.get_my_secrets(uuid) to service_role;
grant execute on function public.get_received_secrets(uuid) to service_role;
