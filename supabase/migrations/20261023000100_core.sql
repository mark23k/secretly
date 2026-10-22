-- =============================================================================
-- Secretly core: visitors, rate limiting, reports, moderation log.
--
-- Security model
--   * The browser only ever READS through RLS (published content, own rows).
--   * All writes happen in Next.js server actions using the service role,
--     after session, ban, rate-limit, validation and moderation checks.
--   * No table grants client-side INSERT/UPDATE/DELETE policies.
-- =============================================================================

create extension if not exists pg_trgm with schema extensions;

-- Lifecycle shared by every piece of user content.
create type public.content_status as enum ('pending', 'published', 'hidden', 'removed');

-- Every reportable / moderatable thing. Each maps to a table with
-- `status content_status` and `report_count int` columns (see content_table()).
create type public.content_kind as enum (
  'thought', 'thought_comment', 'question', 'answer', 'secret', 'secret_reply'
);

-- -----------------------------------------------------------------------------
-- visitors: one row per account (Supabase email + password auth user).
-- Accounts are private: nothing here is ever shown publicly.
-- -----------------------------------------------------------------------------
create table public.visitors (
  id           uuid primary key references auth.users (id) on delete cascade,
  -- IANA zone captured at sign-up, then locked (drives the daily secret reset).
  time_zone    text not null default 'UTC'
               check (now() at time zone time_zone is not null),
  -- HMAC of the IP at sign-up, for abuse correlation only. Never the raw IP.
  ip_hash      text,
  banned       boolean not null default false,
  banned_at    timestamptz,
  ban_reason   text,
  created_at   timestamptz not null default now()
);

create index visitors_ip_hash_idx on public.visitors (ip_hash) where ip_hash is not null;
create index visitors_banned_idx on public.visitors (id) where banned;

alter table public.visitors enable row level security;

create policy "Visitors can read their own row"
  on public.visitors for select
  to authenticated
  using (id = (select auth.uid()));

-- Creates the visitor row at sign-up. The browser passes its time zone as
-- sign-up metadata; anything unrecognised falls back to UTC.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tz text := new.raw_user_meta_data ->> 'time_zone';
begin
  if coalesce(new.is_anonymous, false) then
    return new;
  end if;
  if v_tz is null or not exists (select 1 from pg_timezone_names where name = v_tz) then
    v_tz := 'UTC';
  end if;
  insert into public.visitors (id, time_zone) values (new.id, v_tz)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

revoke all on function public.handle_new_user() from public, anon, authenticated;

-- -----------------------------------------------------------------------------
-- rate_limits: fixed-window counters, written only via hit_rate_limit()
-- -----------------------------------------------------------------------------
create table public.rate_limits (
  key          text        not null,
  window_start timestamptz not null,
  hits         integer     not null default 0,
  primary key (key, window_start)
);

alter table public.rate_limits enable row level security;
-- No policies: service role only.

-- Records a hit and returns true while the caller is within the limit.
create or replace function public.hit_rate_limit(p_key text, p_limit integer, p_window_seconds integer)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_window timestamptz :=
    to_timestamp(floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds);
  v_hits integer;
begin
  insert into rate_limits (key, window_start, hits)
  values (p_key, v_window, 1)
  on conflict (key, window_start) do update set hits = rate_limits.hits + 1
  returning hits into v_hits;

  -- Opportunistic cleanup keeps the table small without a cron job.
  if random() < 0.01 then
    delete from rate_limits where window_start < now() - interval '2 days';
  end if;

  return v_hits <= p_limit;
end;
$$;

-- -----------------------------------------------------------------------------
-- reports
-- -----------------------------------------------------------------------------
create table public.reports (
  id           uuid primary key default gen_random_uuid(),
  target_kind  public.content_kind not null,
  target_id    uuid not null,
  reporter_id  uuid not null references public.visitors (id) on delete cascade,
  reason       text not null check (reason in (
                 'harassment', 'personal_info', 'hate', 'sexual', 'self_harm', 'spam', 'other')),
  details      text check (char_length(details) <= 300),
  resolved     boolean not null default false,
  created_at   timestamptz not null default now(),
  unique (target_kind, target_id, reporter_id)
);

create index reports_open_idx on public.reports (target_kind, target_id) where not resolved;

alter table public.reports enable row level security;
-- No policies: service role only.

-- -----------------------------------------------------------------------------
-- moderation_events: audit log of automated + admin decisions
-- -----------------------------------------------------------------------------
create table public.moderation_events (
  id           bigint generated always as identity primary key,
  target_kind  public.content_kind not null,
  target_id    uuid not null,
  visitor_id   uuid references public.visitors (id) on delete set null,
  actor        text not null check (actor in ('auto', 'admin')),
  decision     text not null,
  reasons      text[] not null default '{}',
  created_at   timestamptz not null default now()
);

create index moderation_events_target_idx on public.moderation_events (target_kind, target_id);

alter table public.moderation_events enable row level security;
-- No policies: service role only.

-- -----------------------------------------------------------------------------
-- Helpers shared by all content tables
-- -----------------------------------------------------------------------------
create or replace function public.content_table(p_kind public.content_kind)
returns text
language sql
immutable
as $$
  select case p_kind
    when 'thought'         then 'thoughts'
    when 'thought_comment' then 'thought_comments'
    when 'question'        then 'questions'
    when 'answer'          then 'answers'
    when 'secret'          then 'secrets'
    when 'secret_reply'    then 'secret_replies'
  end;
$$;

-- Recounts open reports for a target and auto-hides published content once
-- it reaches p_threshold. Returns the new report count (null if not found).
create or replace function public.register_report(
  p_kind public.content_kind,
  p_id uuid,
  p_threshold integer default 3
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
  v_updated integer;
begin
  select count(*) into v_count
  from reports
  where target_kind = p_kind and target_id = p_id and not resolved;

  execute format(
    'update public.%I
        set report_count = $1,
            status = case when status = ''published'' and $1 >= $2
                          then ''hidden''::content_status else status end
      where id = $3',
    content_table(p_kind)
  ) using v_count, p_threshold, p_id;

  get diagnostics v_updated = row_count;
  return case when v_updated = 0 then null else v_count end;
end;
$$;

-- Lock down security-definer functions to the service role.
revoke all on function public.hit_rate_limit(text, integer, integer) from public, anon, authenticated;
revoke all on function public.register_report(public.content_kind, uuid, integer) from public, anon, authenticated;
grant execute on function public.hit_rate_limit(text, integer, integer) to service_role;
grant execute on function public.register_report(public.content_kind, uuid, integer) to service_role;
