-- =============================================================================
-- Custom answer options for "Am I the only one?".
--
-- A thought keeps the default answers ("Me too" / "Not me") unless its author
-- writes their own: 2 to 4 options. Votes record the chosen option index.
-- Option 1 and 2 counts stay in thought_tallies.me_too / not_me (so existing
-- votes and starting baselines keep working); options 3 and 4 get new columns.
-- =============================================================================

create or replace function public.valid_thought_options(p text[])
returns boolean
language sql
immutable
as $$
  select p is null or (
    array_length(p, 1) between 2 and 4
    and not exists (select 1 from unnest(p) o where char_length(trim(o)) not between 1 and 40)
    and (select count(distinct lower(trim(o))) from unnest(p) o) = array_length(p, 1)
  );
$$;

alter table public.thoughts
  add column options text[] check (public.valid_thought_options(options));

alter table public.thought_tallies
  add column opt3 integer not null default 0,
  add column opt4 integer not null default 0;

-- Votes: me_too (boolean) becomes choice (0-3).
alter table public.thought_votes add column choice smallint;
update public.thought_votes set choice = case when me_too then 0 else 1 end;
alter table public.thought_votes
  alter column choice set not null,
  add constraint thought_votes_choice_check check (choice between 0 and 3);

-- Everything built on the old vote shape is dropped and rebuilt below.
drop function if exists public.cast_thought_vote(uuid, uuid, boolean);
drop function if exists public.peek_thought(uuid);
drop function if exists public.get_featured_thoughts(integer);
drop function if exists public.get_my_thoughts();
drop function if exists public.get_next_thoughts(integer, uuid[], public.thought_category);
drop function if exists public.get_thought(uuid);
drop function if exists public.get_thought_feed(text, public.thought_category, integer, integer);
drop function if exists public.to_thought_view(public.thoughts, uuid);
drop type if exists public.thought_view;

create or replace function public.thought_votes_tally()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update thought_tallies
     set me_too = me_too + (case when new.choice = 0 then 1 else 0 end),
         not_me = not_me + (case when new.choice = 1 then 1 else 0 end),
         opt3   = opt3   + (case when new.choice = 2 then 1 else 0 end),
         opt4   = opt4   + (case when new.choice = 3 then 1 else 0 end)
   where thought_id = new.thought_id;
  return new;
end;
$$;

alter table public.thought_votes drop column me_too;

-- The answers to show: the author's, or the defaults.
create or replace function public.thought_options(t public.thoughts)
returns text[]
language sql immutable as $$
  select coalesce(t.options, array['Me too', 'Not me']);
$$;

create type public.thought_view as (
  id               uuid,
  body             text,
  category         public.thought_category,
  status           public.content_status,
  created_at       timestamptz,
  comment_count    integer,
  reaction_counts  jsonb,
  my_reactions     text[],
  is_mine          boolean,
  options          text[],
  my_choice        smallint,   -- null = not voted
  counts           integer[]   -- one per option; null unless voted or mine
);

create or replace function public.to_thought_view(t public.thoughts, p_viewer uuid)
returns public.thought_view
language sql stable security definer set search_path = public as $$
  select
    t.id, t.body, t.category, t.status, t.created_at, t.comment_count, t.reaction_counts,
    coalesce((select array_agg(r.reaction) from thought_reactions r
               where r.thought_id = t.id and r.visitor_id = p_viewer), '{}'),
    p_viewer is not null and t.author_id = p_viewer,
    thought_options(t),
    v.choice,
    case when v.choice is not null or t.author_id = p_viewer then
      (array[tt.me_too, tt.not_me, tt.opt3, tt.opt4])[1:array_length(thought_options(t), 1)]
    end
  from thought_tallies tt
  left join thought_votes v on v.thought_id = t.id and v.visitor_id = p_viewer
  where tt.thought_id = t.id;
$$;

create or replace function public.get_thought_feed(
  p_sort text default 'trending',
  p_category public.thought_category default null,
  p_limit integer default 20,
  p_offset integer default 0
)
returns setof public.thought_view
language sql stable security definer set search_path = public as $$
  select to_thought_view(t, auth.uid())
  from thoughts t
  join thought_tallies tt on tt.thought_id = t.id
  where t.status = 'published'
    and (case when p_category is null then t.category::text <> 'after_dark' else t.category = p_category end)
  order by
    case when p_sort = 'trending' then
      (tt.me_too + tt.not_me + tt.opt3 + tt.opt4 + t.reaction_total + 2 * t.comment_count + 1)
        / power(extract(epoch from now() - t.created_at) / 3600 + 2, 1.5)
    end desc nulls last,
    case when p_sort = 'relatable' then
      wilson_lower_bound(tt.me_too, tt.me_too + tt.not_me + tt.opt3 + tt.opt4)
    end desc nulls last,
    t.created_at desc
  limit least(p_limit, 50) offset greatest(p_offset, 0);
$$;

-- A single thought: published ones for everyone, plus your own pending ones.
create or replace function public.get_thought(p_id uuid)
returns setof public.thought_view
language sql stable security definer set search_path = public as $$
  select to_thought_view(t, auth.uid())
  from thoughts t
  where t.id = p_id
    and (t.status = 'published' or (t.author_id = auth.uid() and t.status = 'pending'));
$$;

create or replace function public.get_next_thoughts(
  p_limit integer default 5,
  p_exclude uuid[] default '{}',
  p_category public.thought_category default null
)
returns setof public.thought_view
language sql volatile security definer set search_path = public as $$
  select to_thought_view(t, auth.uid())
  from thoughts t
  join thought_tallies tt on tt.thought_id = t.id
  where t.status = 'published'
    and (case when p_category is null then t.category::text <> 'after_dark' else t.category = p_category end)
    and not (t.id = any (p_exclude))
    and (auth.uid() is null or (
      t.author_id <> auth.uid()
      and not exists (select 1 from thought_votes v where v.thought_id = t.id and v.visitor_id = auth.uid())
    ))
  order by
    random() * ln(tt.me_too + tt.not_me + tt.opt3 + tt.opt4 + t.comment_count + 3)
      / power(extract(epoch from now() - t.created_at) / 86400 + 1, 0.5) desc
  limit least(p_limit, 20);
$$;

-- The hand-picked thoughts that open the home page deck (ranks below 100;
-- 100+ are home page teasers).
create or replace function public.get_featured_thoughts(p_limit integer default 12)
returns setof public.thought_view
language sql stable security definer set search_path = public as $$
  select to_thought_view(t, auth.uid())
  from thoughts t
  where t.status = 'published'
    and t.featured_rank < 100
    and (auth.uid() is null or (
      t.author_id <> auth.uid()
      and not exists (select 1 from thought_votes v where v.thought_id = t.id and v.visitor_id = auth.uid())
    ))
  order by t.featured_rank
  limit least(p_limit, 30);
$$;

create or replace function public.get_my_thoughts()
returns setof public.thought_view
language sql stable security definer set search_path = public as $$
  select to_thought_view(t, auth.uid())
  from thoughts t
  where t.author_id = auth.uid() and t.status in ('published', 'pending', 'hidden')
  order by t.created_at desc
  limit 100;
$$;

-- For signed-out visitors who picked an answer: the result, nothing recorded.
create or replace function public.peek_thought(p_id uuid)
returns public.thought_view
language sql stable security definer set search_path = public as $$
  select t.id, t.body, t.category, t.status, t.created_at, t.comment_count, t.reaction_counts,
         '{}'::text[], false, thought_options(t), null::smallint,
         (array[tt.me_too, tt.not_me, tt.opt3, tt.opt4])[1:array_length(thought_options(t), 1)]
  from thoughts t
  join thought_tallies tt on tt.thought_id = t.id
  where t.id = p_id and t.status = 'published';
$$;

-- Records a vote (first one wins) and returns the now-visible result.
create or replace function public.cast_thought_vote(p_thought uuid, p_visitor uuid, p_choice integer)
returns public.thought_view
language plpgsql security definer set search_path = public as $$
declare
  v_thought thoughts;
begin
  select * into v_thought from thoughts where id = p_thought and status = 'published';
  if not found then
    raise exception 'thought not found' using errcode = 'P0002';
  end if;
  if v_thought.author_id = p_visitor then
    raise exception 'cannot vote on own thought' using errcode = '42501';
  end if;
  if p_choice < 0 or p_choice >= array_length(thought_options(v_thought), 1) then
    raise exception 'invalid choice' using errcode = '22023';
  end if;

  insert into thought_votes (thought_id, visitor_id, choice)
  values (p_thought, p_visitor, p_choice)
  on conflict do nothing;

  return to_thought_view(v_thought, p_visitor);
end;
$$;

-- Home page teasers: curated thoughts (rank 100+) and questions.
alter table public.questions add column featured_rank integer;

create or replace function public.get_home_teasers()
returns table (kind text, id uuid, body text)
language sql stable security definer set search_path = public as $$
  (select 'thought', t.id, t.body from thoughts t
    where t.status = 'published' and t.featured_rank >= 100 order by t.featured_rank limit 4)
  union all
  (select 'question', q.id, q.title from questions q
    where q.status = 'published' and q.featured_rank is not null order by q.featured_rank limit 2);
$$;

revoke all on function public.to_thought_view(public.thoughts, uuid) from public, anon, authenticated;
revoke all on function public.cast_thought_vote(uuid, uuid, integer) from public, anon, authenticated;
revoke all on function public.peek_thought(uuid) from public, anon, authenticated;
revoke all on function public.get_my_thoughts() from public, anon;
grant execute on function public.cast_thought_vote(uuid, uuid, integer) to service_role;
grant execute on function public.peek_thought(uuid) to service_role;
grant execute on function public.get_thought_feed(text, public.thought_category, integer, integer) to anon, authenticated, service_role;
grant execute on function public.get_thought(uuid) to anon, authenticated, service_role;
grant execute on function public.get_next_thoughts(integer, uuid[], public.thought_category) to anon, authenticated, service_role;
grant execute on function public.get_featured_thoughts(integer) to anon, authenticated, service_role;
grant execute on function public.get_my_thoughts() to authenticated, service_role;
grant execute on function public.get_home_teasers() to anon, authenticated, service_role;
