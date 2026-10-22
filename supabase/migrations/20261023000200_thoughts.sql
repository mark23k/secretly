-- =============================================================================
-- Feature 1: "Am I the only one?"
--
-- Results stay hidden until you vote: tallies live in thought_tallies, which
-- clients can't read. The read functions below only return counts to people
-- who have voted (or to the author).
-- =============================================================================

create type public.thought_category as enum (
  'relationships', 'work', 'social', 'habits', 'feelings', 'body', 'other'
);

create table public.thoughts (
  id              uuid primary key default gen_random_uuid(),
  author_id       uuid not null references public.visitors (id) on delete cascade,
  body            text not null check (char_length(body) between 10 and 300),
  category        public.thought_category not null default 'other',
  status          public.content_status not null default 'pending',
  report_count    integer not null default 0,
  comment_count   integer not null default 0,
  -- {"heart": 3, "hug": 1, ...}, maintained by trigger
  reaction_counts jsonb not null default '{}'::jsonb,
  reaction_total  integer not null default 0,
  created_at      timestamptz not null default now()
);

create index thoughts_feed_idx on public.thoughts (created_at desc) where status = 'published';
create index thoughts_category_idx on public.thoughts (category, created_at desc) where status = 'published';
create index thoughts_author_idx on public.thoughts (author_id, created_at desc);
create index thoughts_moderation_idx on public.thoughts (status) where status in ('pending', 'hidden');

-- Vote tallies, kept apart so they can't be read before voting.
create table public.thought_tallies (
  thought_id  uuid primary key references public.thoughts (id) on delete cascade,
  me_too      integer not null default 0,
  not_me      integer not null default 0
);

create table public.thought_votes (
  thought_id  uuid not null references public.thoughts (id) on delete cascade,
  visitor_id  uuid not null references public.visitors (id) on delete cascade,
  me_too      boolean not null,
  created_at  timestamptz not null default now(),
  primary key (thought_id, visitor_id)
);

create index thought_votes_visitor_idx on public.thought_votes (visitor_id, thought_id);

create table public.thought_reactions (
  thought_id  uuid not null references public.thoughts (id) on delete cascade,
  visitor_id  uuid not null references public.visitors (id) on delete cascade,
  reaction    text not null check (reaction in ('heart', 'hug', 'wow', 'laugh', 'sad')),
  created_at  timestamptz not null default now(),
  primary key (thought_id, visitor_id, reaction)
);

create table public.thought_comments (
  id            uuid primary key default gen_random_uuid(),
  thought_id    uuid not null references public.thoughts (id) on delete cascade,
  author_id     uuid not null references public.visitors (id) on delete cascade,
  body          text not null check (char_length(body) between 2 and 300),
  status        public.content_status not null default 'pending',
  report_count  integer not null default 0,
  created_at    timestamptz not null default now()
);

create index thought_comments_thread_idx on public.thought_comments (thought_id, created_at)
  where status = 'published';
create index thought_comments_moderation_idx on public.thought_comments (status)
  where status in ('pending', 'hidden');

-- -----------------------------------------------------------------------------
-- Triggers keeping denormalized counts in sync
-- -----------------------------------------------------------------------------
create or replace function public.thoughts_init_tally()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into thought_tallies (thought_id) values (new.id);
  return new;
end;
$$;

create trigger thoughts_init_tally after insert on public.thoughts
  for each row execute function public.thoughts_init_tally();

create or replace function public.thought_votes_tally()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update thought_tallies
     set me_too = me_too + (case when new.me_too then 1 else 0 end),
         not_me = not_me + (case when new.me_too then 0 else 1 end)
   where thought_id = new.thought_id;
  return new;
end;
$$;

create trigger thought_votes_tally after insert on public.thought_votes
  for each row execute function public.thought_votes_tally();

create or replace function public.thought_reactions_count()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_thought uuid := coalesce(new.thought_id, old.thought_id);
begin
  update thoughts t
     set reaction_counts = coalesce((
           select jsonb_object_agg(reaction, n)
             from (select reaction, count(*) as n from thought_reactions
                    where thought_id = v_thought group by reaction) r
         ), '{}'::jsonb),
         reaction_total = (select count(*) from thought_reactions where thought_id = v_thought)
   where t.id = v_thought;
  return null;
end;
$$;

create trigger thought_reactions_count after insert or delete on public.thought_reactions
  for each row execute function public.thought_reactions_count();

create or replace function public.thought_comments_count()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_thought uuid := coalesce(new.thought_id, old.thought_id);
begin
  update thoughts
     set comment_count = (select count(*) from thought_comments
                           where thought_id = v_thought and status = 'published')
   where id = v_thought;
  return null;
end;
$$;

create trigger thought_comments_count after insert or delete or update of status on public.thought_comments
  for each row execute function public.thought_comments_count();

-- -----------------------------------------------------------------------------
-- RLS + column privileges: author_id is never readable by clients
-- -----------------------------------------------------------------------------
alter table public.thoughts enable row level security;
alter table public.thought_tallies enable row level security;
alter table public.thought_votes enable row level security;
alter table public.thought_reactions enable row level security;
alter table public.thought_comments enable row level security;

revoke all on public.thoughts, public.thought_comments, public.thought_tallies,
              public.thought_votes, public.thought_reactions
  from anon, authenticated;

grant select (id, body, category, status, comment_count, reaction_counts, reaction_total, created_at)
  on public.thoughts to anon, authenticated;
grant select (id, thought_id, body, status, created_at)
  on public.thought_comments to anon, authenticated;
grant select on public.thought_votes, public.thought_reactions to authenticated;

create policy "Published thoughts are public"
  on public.thoughts for select to anon, authenticated
  using (status = 'published');

create policy "Published comments are public"
  on public.thought_comments for select to anon, authenticated
  using (status = 'published');

create policy "Visitors can read their own votes"
  on public.thought_votes for select to authenticated
  using (visitor_id = (select auth.uid()));

create policy "Visitors can read their own reactions"
  on public.thought_reactions for select to authenticated
  using (visitor_id = (select auth.uid()));

-- thought_tallies: no policies, no grants. Only reachable via functions below.

-- -----------------------------------------------------------------------------
-- Read API (security definer; results gated on having voted)
-- -----------------------------------------------------------------------------

-- Lower bound of the Wilson score interval: "most relatable" without letting
-- a 1-for-1 post outrank a 480-for-500 one.
create or replace function public.wilson_lower_bound(p_pos integer, p_total integer)
returns double precision language sql immutable as $$
  select case when p_total = 0 then 0 else
    ((p_pos::float8 / p_total) + 1.9208 / p_total
      - 1.96 * sqrt((p_pos::float8 / p_total) * (1 - p_pos::float8 / p_total) / p_total + 0.9604 / (p_total::float8 * p_total)))
    / (1 + 3.8416 / p_total)
  end;
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
  my_vote          boolean,   -- null = not voted
  me_too           integer,   -- null unless voted or mine
  not_me           integer
);

create or replace function public.to_thought_view(t public.thoughts, p_viewer uuid)
returns public.thought_view
language sql stable security definer set search_path = public as $$
  select
    t.id, t.body, t.category, t.status, t.created_at, t.comment_count, t.reaction_counts,
    coalesce((select array_agg(r.reaction) from thought_reactions r
               where r.thought_id = t.id and r.visitor_id = p_viewer), '{}'),
    p_viewer is not null and t.author_id = p_viewer,
    v.me_too,
    case when v.me_too is not null or t.author_id = p_viewer then tt.me_too end,
    case when v.me_too is not null or t.author_id = p_viewer then tt.not_me end
  from thought_tallies tt
  left join thought_votes v on v.thought_id = t.id and v.visitor_id = p_viewer
  where tt.thought_id = t.id;
$$;

-- Browse feed. p_sort: 'trending' | 'newest' | 'relatable'.
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
    and (p_category is null or t.category = p_category)
  order by
    case when p_sort = 'trending' then
      (tt.me_too + tt.not_me + t.reaction_total + 2 * t.comment_count + 1)
        / power(extract(epoch from now() - t.created_at) / 3600 + 2, 1.5)
    end desc nulls last,
    case when p_sort = 'relatable' then wilson_lower_bound(tt.me_too, tt.me_too + tt.not_me) end desc nulls last,
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

-- Card mode: thoughts you haven't voted on yet, favouring fresh and active
-- ones with some randomness. p_exclude lets the client skip what it already has.
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
    and (p_category is null or t.category = p_category)
    and not (t.id = any (p_exclude))
    and (auth.uid() is null or (
      t.author_id <> auth.uid()
      and not exists (select 1 from thought_votes v where v.thought_id = t.id and v.visitor_id = auth.uid())
    ))
  order by
    random() * ln(tt.me_too + tt.not_me + t.comment_count + 3)
      / power(extract(epoch from now() - t.created_at) / 86400 + 1, 0.5) desc
  limit least(p_limit, 20);
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

-- -----------------------------------------------------------------------------
-- Write API (service role only; called from server actions)
-- -----------------------------------------------------------------------------

-- Records a vote (first one wins) and returns the now-visible result.
create or replace function public.cast_thought_vote(p_thought uuid, p_visitor uuid, p_me_too boolean)
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

  insert into thought_votes (thought_id, visitor_id, me_too)
  values (p_thought, p_visitor, p_me_too)
  on conflict do nothing;

  return to_thought_view(v_thought, p_visitor);
end;
$$;

revoke all on function public.to_thought_view(public.thoughts, uuid) from public, anon, authenticated;
revoke all on function public.cast_thought_vote(uuid, uuid, boolean) from public, anon, authenticated;
revoke all on function public.get_my_thoughts() from public, anon;
grant execute on function public.cast_thought_vote(uuid, uuid, boolean) to service_role;
grant execute on function public.get_thought_feed(text, public.thought_category, integer, integer) to anon, authenticated, service_role;
grant execute on function public.get_thought(uuid) to anon, authenticated, service_role;
grant execute on function public.get_next_thoughts(integer, uuid[], public.thought_category) to anon, authenticated, service_role;
grant execute on function public.get_my_thoughts() to authenticated, service_role;
