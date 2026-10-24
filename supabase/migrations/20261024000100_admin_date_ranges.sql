-- =============================================================================
-- Manager dashboard: any date range, and a page per day.
--
--   * admin_stats_range(from, to, tz): the dashboard numbers for any range of
--     local days (admin_stats(days, tz) now wraps it for "last N days").
--   * admin_day_posts(day, tz): what was posted on one day.
--   * visitors.is_seed marks launch-content accounts, which never count as
--     members or appear in the day lists.
-- =============================================================================

alter table public.visitors add column is_seed boolean not null default false;

-- The launch-content account created by supabase/seed/launch-content.sql.
update public.visitors set is_seed = true
where id in (select id from auth.users where email like 'quiet-%@example.com');

create or replace function public.admin_stats_range(p_from date, p_to date, p_tz text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tz      text := case when exists (select 1 from pg_timezone_names where name = p_tz)
                         then p_tz else 'UTC' end;
  v_today   date;
  v_first   date;
  v_last    date;
  v_from    timestamptz;
  v_until   timestamptz;
  v_result  jsonb;
begin
  v_today := (now() at time zone v_tz)::date;
  v_last  := least(coalesce(p_to, v_today), v_today);
  v_first := greatest(coalesce(p_from, v_last - 29), v_last - 365);
  if v_first > v_last then
    v_first := v_last;
  end if;
  v_from  := v_first::timestamp at time zone v_tz;
  v_until := (v_last + 1)::timestamp at time zone v_tz;

  with
  members as (
    select v.id, v.created_at from visitors v where not v.is_seed
  ),
  sess as (
    select s.*, (s.started_at at time zone v_tz) as local_start
    from analytics_sessions s
    where s.started_at >= v_from and s.started_at < v_until
  ),
  act as (
    select a.*, activity_group(a.kind) as grp, (a.created_at at time zone v_tz) as local_at
    from activity a
    where a.created_at >= v_from and a.created_at < v_until
  ),
  posts_all as (
    select user_id, count(*) as n
    from activity
    where activity_group(kind) = 'post' and user_id is not null
    group by user_id
  ),
  days as (
    select d::date as day from generate_series(v_first, v_last, interval '1 day') d
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
      from members where created_at >= v_from and created_at < v_until group by 1
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
    'from', v_first,
    'to', v_last,
    'days', v_last - v_first + 1,
    'timeZone', v_tz,
    'generatedAt', now(),
    'totals', jsonb_build_object(
      'members',            (select count(*) from members),
      'newMembers',         (select count(*) from members where created_at >= v_from and created_at < v_until),
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

-- "Last N days" (kept for callers of the original function).
create or replace function public.admin_stats(p_days integer, p_tz text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select admin_stats_range(
    (now() at time zone coalesce(nullif(p_tz, ''), 'UTC'))::date - (least(greatest(coalesce(p_days, 30), 1), 365) - 1),
    null,
    p_tz
  );
$$;

-- Thoughts and questions posted on one local day (launch content excluded),
-- plus how many comments, answers, secrets and replies there were.
create or replace function public.admin_day_posts(p_day date, p_tz text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  with bounds as (
    select (p_day::timestamp at time zone tz) as since, ((p_day + 1)::timestamp at time zone tz) as until
    from (select case when exists (select 1 from pg_timezone_names where name = p_tz) then p_tz else 'UTC' end as tz) z
  ),
  real_authors as (select id from visitors where not is_seed)
  select jsonb_build_object(
    'posts', coalesce((
      select jsonb_agg(p order by p->>'createdAt' desc) from (
        select jsonb_build_object('kind', 'thought', 'id', t.id, 'text', t.body, 'category', t.category,
                                  'status', t.status, 'createdAt', t.created_at,
                                  'options', t.options, 'comments', t.comment_count) as p
        from thoughts t, bounds b
        where t.created_at >= b.since and t.created_at < b.until and t.author_id in (select id from real_authors)
        union all
        select jsonb_build_object('kind', 'question', 'id', q.id, 'text', q.title, 'category', q.category,
                                  'status', q.status, 'createdAt', q.created_at,
                                  'options', null, 'comments', q.answer_count)
        from questions q, bounds b
        where q.created_at >= b.since and q.created_at < b.until and q.author_id in (select id from real_authors)
      ) x
    ), '[]'::jsonb),
    'counts', jsonb_build_object(
      'comments', (select count(*) from thought_comments c, bounds b
                   where c.created_at >= b.since and c.created_at < b.until and c.author_id in (select id from real_authors)),
      'answers', (select count(*) from answers a, bounds b
                  where a.created_at >= b.since and a.created_at < b.until and a.author_id in (select id from real_authors)),
      'secrets', (select count(*) from secrets s, bounds b
                  where s.created_at >= b.since and s.created_at < b.until and s.author_id in (select id from real_authors)),
      'secretReplies', (select count(*) from secret_replies r, bounds b
                        where r.created_at >= b.since and r.created_at < b.until and r.author_id in (select id from real_authors))
    )
  );
$$;

revoke all on function public.admin_stats_range(date, date, text) from public, anon, authenticated;
revoke all on function public.admin_day_posts(date, text) from public, anon, authenticated;
grant execute on function public.admin_stats_range(date, date, text) to service_role;
grant execute on function public.admin_day_posts(date, text) to service_role;
