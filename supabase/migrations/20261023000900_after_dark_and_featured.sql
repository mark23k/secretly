-- =============================================================================
-- After Dark stays opt-in: it never appears in the default feeds, the card
-- deck or similar-question suggestions, only when asked for by category.
-- Featured thoughts open the home page deck. Guests can "peek" at a result
-- without voting (their vote isn't counted until they have an account).
-- Category comparisons use ::text so this doesn't depend on enum literals.
-- =============================================================================

alter table public.thoughts add column featured_rank integer;
create index thoughts_featured_idx on public.thoughts (featured_rank) where featured_rank is not null;

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
      (tt.me_too + tt.not_me + t.reaction_total + 2 * t.comment_count + 1)
        / power(extract(epoch from now() - t.created_at) / 3600 + 2, 1.5)
    end desc nulls last,
    case when p_sort = 'relatable' then wilson_lower_bound(tt.me_too, tt.me_too + tt.not_me) end desc nulls last,
    t.created_at desc
  limit least(p_limit, 50) offset greatest(p_offset, 0);
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
    random() * ln(tt.me_too + tt.not_me + t.comment_count + 3)
      / power(extract(epoch from now() - t.created_at) / 86400 + 1, 0.5) desc
  limit least(p_limit, 20);
$$;

-- The hand-picked thoughts that open the home page deck (unvoted ones only).
create or replace function public.get_featured_thoughts(p_limit integer default 12)
returns setof public.thought_view
language sql stable security definer set search_path = public as $$
  select to_thought_view(t, auth.uid())
  from thoughts t
  where t.status = 'published'
    and t.featured_rank is not null
    and (auth.uid() is null or (
      t.author_id <> auth.uid()
      and not exists (select 1 from thought_votes v where v.thought_id = t.id and v.visitor_id = auth.uid())
    ))
  order by t.featured_rank
  limit least(p_limit, 30);
$$;

-- A thought with its result, for signed-out visitors who picked an answer.
-- Nothing is recorded. Service role only (called by a rate-limited action).
create or replace function public.peek_thought(p_id uuid)
returns public.thought_view
language sql stable security definer set search_path = public as $$
  select t.id, t.body, t.category, t.status, t.created_at, t.comment_count, t.reaction_counts,
         '{}'::text[], false, null::boolean, tt.me_too, tt.not_me
  from thoughts t
  join thought_tallies tt on tt.thought_id = t.id
  where t.id = p_id and t.status = 'published';
$$;

create or replace function public.get_question_feed(
  p_sort text default 'newest',
  p_category public.question_category default null,
  p_query text default null,
  p_limit integer default 20,
  p_offset integer default 0
)
returns setof public.question_view
language sql stable security definer set search_path = public, extensions as $$
  select to_question_view(q, auth.uid())
  from questions q
  where q.status = 'published'
    and (case when p_category is null then q.category::text <> 'after_dark' else q.category = p_category end)
    and (p_sort <> 'unanswered' or q.answer_count = 0)
    and (nullif(trim(p_query), '') is null
         or q.search @@ loose_tsquery(p_query)
         or extensions.word_similarity(lower(p_query), lower(q.title)) > 0.35)
  order by
    case when nullif(trim(p_query), '') is not null then question_relevance(q, p_query) end desc nulls last,
    case when p_sort = 'top' then q.answer_count end desc nulls last,
    q.created_at desc
  limit least(p_limit, 50) offset greatest(p_offset, 0);
$$;

create or replace function public.search_similar_questions(p_text text, p_limit integer default 5)
returns table (id uuid, title text, answer_count integer, helped boolean, score double precision)
language sql stable security definer set search_path = public, extensions as $$
  select q.id, q.title, q.answer_count, q.helped_answer_id is not null,
         question_relevance(q, p_text) as score
  from questions q
  where q.status = 'published'
    and q.category::text <> 'after_dark'
    and char_length(trim(coalesce(p_text, ''))) >= 6
    and (q.search @@ loose_tsquery(p_text)
         or extensions.word_similarity(lower(p_text), lower(q.title)) > 0.35)
  order by score desc
  limit least(greatest(p_limit, 1), 10);
$$;

revoke all on function public.peek_thought(uuid) from public, anon, authenticated;
grant execute on function public.peek_thought(uuid) to service_role;
grant execute on function public.get_featured_thoughts(integer) to anon, authenticated, service_role;
