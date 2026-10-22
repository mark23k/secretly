-- =============================================================================
-- Analytics for the manager dashboard.
--
--   * analytics_sessions: one row per visit (signed in or not), kept alive by a
--     30s heartbeat from the browser while the tab is visible. The device id is
--     a random value from the browser's localStorage: no cookies, no IPs.
--   * activity: one row per post / reply / vote / reaction, written by triggers
--     on the content tables, so every feature is counted the same way.
--
-- Everything is service-role only. The dashboard shows totals, never who did what.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Visits
-- -----------------------------------------------------------------------------
create table public.analytics_sessions (
  id              uuid primary key,
  device_id       uuid not null,
  user_id         uuid references public.visitors (id) on delete set null,
  started_at      timestamptz not null default now(),
  last_seen_at    timestamptz not null default now(),
  -- Time the tab was actually visible (heartbeat gaps capped at 45s).
  active_seconds  integer not null default 0,
  page_views      integer not null default 1
);

create index analytics_sessions_started_idx on public.analytics_sessions (started_at);
create index analytics_sessions_last_seen_idx on public.analytics_sessions (last_seen_at);

alter table public.analytics_sessions enable row level security;
-- No policies: service role only.

-- p_event: 'page' (a page view; starts the visit if new), 'ping' (heartbeat,
-- or the tab being hidden) or 'resume' (tab visible again: no time added for
-- the hidden stretch). Unknown or stale visits are ignored for ping/resume.
create or replace function public.track_visit(
  p_session uuid,
  p_device uuid,
  p_user uuid,
  p_event text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_event = 'page' then
    insert into analytics_sessions as s (id, device_id, user_id)
    values (p_session, p_device, p_user)
    on conflict (id) do update set
      page_views     = s.page_views + 1,
      user_id        = coalesce(excluded.user_id, s.user_id),
      active_seconds = s.active_seconds
                       + least(greatest(extract(epoch from now() - s.last_seen_at), 0), 45)::integer,
      last_seen_at   = now()
    where s.device_id = excluded.device_id;
  else
    update analytics_sessions s set
      active_seconds = s.active_seconds + case when p_event = 'ping'
                         then least(greatest(extract(epoch from now() - s.last_seen_at), 0), 45)::integer
                         else 0 end,
      last_seen_at   = now()
    where s.id = p_session
      and s.device_id = p_device
      and s.last_seen_at > now() - interval '30 minutes';
  end if;
end;
$$;

-- -----------------------------------------------------------------------------
-- Activity
-- -----------------------------------------------------------------------------
create type public.activity_kind as enum (
  'thought', 'thought_comment', 'thought_vote', 'thought_reaction',
  'question', 'answer', 'answer_vote',
  'secret', 'secret_reply'
);

create table public.activity (
  id          bigint generated always as identity primary key,
  user_id     uuid references public.visitors (id) on delete set null,
  kind        public.activity_kind not null,
  created_at  timestamptz not null default now()
);

create index activity_created_idx on public.activity (created_at);
create index activity_user_idx on public.activity (user_id, kind);

alter table public.activity enable row level security;
-- No policies: service role only.

-- 'post' (new thought / question / secret), 'reply' (comment / answer /
-- secret reply) or 'reaction' (votes and emoji reactions).
create or replace function public.activity_group(p_kind public.activity_kind)
returns text
language sql
immutable
as $$
  select case
    when p_kind in ('thought', 'question', 'secret') then 'post'
    when p_kind in ('thought_comment', 'answer', 'secret_reply') then 'reply'
    else 'reaction'
  end;
$$;

-- Trigger: log_activity(<activity_kind>, <user id column>)
create or replace function public.log_activity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into activity (user_id, kind)
  values ((to_jsonb(new) ->> tg_argv[1])::uuid, tg_argv[0]::activity_kind);
  return new;
end;
$$;

create trigger thoughts_activity after insert on public.thoughts
  for each row execute function public.log_activity('thought', 'author_id');
create trigger thought_comments_activity after insert on public.thought_comments
  for each row execute function public.log_activity('thought_comment', 'author_id');
create trigger thought_votes_activity after insert on public.thought_votes
  for each row execute function public.log_activity('thought_vote', 'visitor_id');
create trigger thought_reactions_activity after insert on public.thought_reactions
  for each row execute function public.log_activity('thought_reaction', 'visitor_id');

-- -----------------------------------------------------------------------------
-- Dashboard reads
-- -----------------------------------------------------------------------------

-- People on the site right now (heartbeat in the last 75 seconds).
create or replace function public.admin_live_stats()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'online',  count(distinct device_id),
    'members', count(distinct user_id),
    'guests',  count(distinct device_id) filter (where user_id is null)
  )
  from analytics_sessions
  where last_seen_at > now() - interval '75 seconds';
$$;

-- Everything else on the dashboard for the last p_days days, with days and
-- hours in time zone p_tz.
create or replace function public.admin_stats(p_days integer, p_tz text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tz    text := case when exists (select 1 from pg_timezone_names where name = p_tz)
                       then p_tz else 'UTC' end;
  v_today date;
  v_first date;
  v_from  timestamptz;
  v_result jsonb;
begin
  p_days  := least(greatest(coalesce(p_days, 30), 1), 365);
  v_today := (now() at time zone v_tz)::date;
  v_first := v_today - (p_days - 1);
  v_from  := v_first::timestamp at time zone v_tz;

  with
  members as (
    select v.id, v.created_at from visitors v
  ),
  sess as (
    select s.*, (s.started_at at time zone v_tz) as local_start
    from analytics_sessions s
    where s.started_at >= v_from
  ),
  act as (
    select a.*, activity_group(a.kind) as grp, (a.created_at at time zone v_tz) as local_at
    from activity a
    where a.created_at >= v_from
  ),
  posts_all as (
    select user_id, count(*) as n
    from activity
    where activity_group(kind) = 'post' and user_id is not null
    group by user_id
  ),
  days as (
    select d::date as day from generate_series(v_first, v_today, interval '1 day') d
  ),
  daily as (
    select
      d.day,
      coalesce(sv.visitors, 0)       as visitors,
      coalesce(sv.members, 0)        as active_members,
      coalesce(sv.visits, 0)         as visits,
      coalesce(su.signups, 0)        as signups,
      coalesce(ac.posts, 0)          as posts,
      coalesce(ac.interactions, 0)   as interactions
    from days d
    left join (
      select local_start::date as day,
             count(distinct device_id) as visitors,
             count(distinct user_id) as members,
             count(*) as visits
      from sess group by 1
    ) sv on sv.day = d.day
    left join (
      select (created_at at time zone v_tz)::date as day, count(*) as signups
      from members where created_at >= v_from group by 1
    ) su on su.day = d.day
    left join (
      select local_at::date as day,
             count(*) filter (where grp = 'post') as posts,
             count(*) as interactions
      from act group by 1
    ) ac on ac.day = d.day
  ),
  hourly as (
    select
      h as hour,
      (select count(*) from act where extract(hour from local_at) = h) as interactions,
      (select count(*) from sess where extract(hour from local_start) = h) as visits
    from generate_series(0, 23) h
  )
  select jsonb_build_object(
    'days', p_days,
    'timeZone', v_tz,
    'generatedAt', now(),
    'totals', jsonb_build_object(
      'members',            (select count(*) from members),
      'newMembers',         (select count(*) from members where created_at >= v_from),
      'visitors',           (select count(distinct device_id) from sess),
      'visits',             (select count(*) from sess),
      'pageViews',          (select coalesce(sum(page_views), 0) from sess),
      'avgVisitSeconds',    (select coalesce(round(avg(active_seconds)), 0) from sess),
      'medianVisitSeconds', (select coalesce(round(percentile_cont(0.5) within group (order by active_seconds)), 0) from sess),
      'posts',              (select count(*) from act where grp = 'post'),
      'replies',            (select count(*) from act where grp = 'reply'),
      'reactions',          (select count(*) from act where grp = 'reaction'),
      'interactions',       (select count(*) from act),
      'activeMembers',      (select count(distinct user_id) from act),
      'postsAllTime',       (select coalesce(sum(n), 0) from posts_all),
      'posters',            (select count(*) from posts_all),
      'postsPerMember',     (select round(coalesce(sum(n), 0)::numeric
                                     / nullif((select count(*) from members), 0), 2)
                             from posts_all),
      'postsPerPoster',     (select round(avg(n), 2) from posts_all)
    ),
    'daily',  (select jsonb_agg(to_jsonb(daily) order by day) from daily),
    'hourly', (select jsonb_agg(to_jsonb(hourly) order by hour) from hourly),
    'byKind', (select coalesce(jsonb_object_agg(kind, n), '{}')
               from (select kind, count(*) as n from act group by kind) k)
  ) into v_result;

  return v_result;
end;
$$;

revoke all on function public.track_visit(uuid, uuid, uuid, text) from public, anon, authenticated;
revoke all on function public.log_activity() from public, anon, authenticated;
revoke all on function public.admin_live_stats() from public, anon, authenticated;
revoke all on function public.admin_stats(integer, text) from public, anon, authenticated;
grant execute on function public.track_visit(uuid, uuid, uuid, text) to service_role;
grant execute on function public.admin_live_stats() to service_role;
grant execute on function public.admin_stats(integer, text) to service_role;
revoke all on public.analytics_sessions, public.activity from anon, authenticated;
