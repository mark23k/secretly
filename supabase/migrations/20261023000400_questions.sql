-- =============================================================================
-- Feature 2: "The question you can't ask"
--
-- Anonymous questions and answers. Answers can be marked helpful by anyone and
-- "this helped me" by the asker. Similar-question search uses full-text search
-- plus pg_trgm, all behind search_similar_questions() so it can later blend in
-- embeddings without touching the app.
-- =============================================================================

create type public.question_category as enum (
  'relationships', 'money', 'body', 'social', 'behavior', 'religion', 'work', 'family', 'other'
);

create table public.questions (
  id                uuid primary key default gen_random_uuid(),
  author_id         uuid not null references public.visitors (id) on delete cascade,
  title             text not null check (char_length(title) between 10 and 200),
  body              text not null default '' check (char_length(body) <= 1000),
  category          public.question_category not null default 'other',
  status            public.content_status not null default 'pending',
  report_count      integer not null default 0,
  answer_count      integer not null default 0,
  helped_answer_id  uuid,
  search            tsvector generated always as (
                      setweight(to_tsvector('english', title), 'A') ||
                      setweight(to_tsvector('english', body), 'B')
                    ) stored,
  created_at        timestamptz not null default now()
);

create index questions_feed_idx on public.questions (created_at desc) where status = 'published';
create index questions_category_idx on public.questions (category, created_at desc) where status = 'published';
create index questions_author_idx on public.questions (author_id, created_at desc);
create index questions_moderation_idx on public.questions (status) where status in ('pending', 'hidden');
create index questions_search_idx on public.questions using gin (search);
create index questions_title_trgm_idx on public.questions using gin (title extensions.gin_trgm_ops);

create table public.answers (
  id             uuid primary key default gen_random_uuid(),
  question_id    uuid not null references public.questions (id) on delete cascade,
  author_id      uuid not null references public.visitors (id) on delete cascade,
  body           text not null check (char_length(body) between 5 and 1000),
  status         public.content_status not null default 'pending',
  report_count   integer not null default 0,
  helpful_count  integer not null default 0,
  created_at     timestamptz not null default now()
);

create index answers_thread_idx on public.answers (question_id, helpful_count desc, created_at)
  where status = 'published';
create index answers_author_idx on public.answers (author_id, created_at desc);
create index answers_moderation_idx on public.answers (status) where status in ('pending', 'hidden');

alter table public.questions
  add constraint questions_helped_answer_fkey
  foreign key (helped_answer_id) references public.answers (id) on delete set null;

create table public.answer_votes (
  answer_id   uuid not null references public.answers (id) on delete cascade,
  visitor_id  uuid not null references public.visitors (id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (answer_id, visitor_id)
);

create index answer_votes_visitor_idx on public.answer_votes (visitor_id);

-- -----------------------------------------------------------------------------
-- Triggers keeping counts in sync
-- -----------------------------------------------------------------------------
create or replace function public.answers_count()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_question uuid := coalesce(new.question_id, old.question_id);
begin
  update questions
     set answer_count = (select count(*) from answers
                          where question_id = v_question and status = 'published')
   where id = v_question;
  return null;
end;
$$;

create trigger answers_count after insert or delete or update of status on public.answers
  for each row execute function public.answers_count();

create or replace function public.answer_votes_count()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_answer uuid := coalesce(new.answer_id, old.answer_id);
begin
  update answers
     set helpful_count = (select count(*) from answer_votes where answer_id = v_answer)
   where id = v_answer;
  return null;
end;
$$;

create trigger answer_votes_count after insert or delete on public.answer_votes
  for each row execute function public.answer_votes_count();

create trigger questions_activity after insert on public.questions
  for each row execute function public.log_activity('question', 'author_id');
create trigger answers_activity after insert on public.answers
  for each row execute function public.log_activity('answer', 'author_id');
create trigger answer_votes_activity after insert on public.answer_votes
  for each row execute function public.log_activity('answer_vote', 'visitor_id');

-- -----------------------------------------------------------------------------
-- RLS + column privileges: author_id is never readable by clients
-- -----------------------------------------------------------------------------
alter table public.questions enable row level security;
alter table public.answers enable row level security;
alter table public.answer_votes enable row level security;

revoke all on public.questions, public.answers, public.answer_votes from anon, authenticated;

grant select (id, title, body, category, status, answer_count, helped_answer_id, created_at)
  on public.questions to anon, authenticated;
grant select (id, question_id, body, status, helpful_count, created_at)
  on public.answers to anon, authenticated;
grant select on public.answer_votes to authenticated;

create policy "Published questions are public"
  on public.questions for select to anon, authenticated
  using (status = 'published');

create policy "Published answers are public"
  on public.answers for select to anon, authenticated
  using (status = 'published');

create policy "Visitors can read their own answer votes"
  on public.answer_votes for select to authenticated
  using (visitor_id = (select auth.uid()));

-- -----------------------------------------------------------------------------
-- Read API
-- -----------------------------------------------------------------------------
create type public.question_view as (
  id                uuid,
  title             text,
  body              text,
  category          public.question_category,
  status            public.content_status,
  created_at        timestamptz,
  answer_count      integer,
  helped_answer_id  uuid,
  is_mine           boolean
);

create or replace function public.to_question_view(q public.questions, p_viewer uuid)
returns public.question_view
language sql stable security definer set search_path = public as $$
  select q.id, q.title, q.body, q.category, q.status, q.created_at, q.answer_count,
         q.helped_answer_id, p_viewer is not null and q.author_id = p_viewer;
$$;

-- An OR-of-words query, so "how do I know if someone likes me" still matches
-- "how can you tell if a person likes you".
create or replace function public.loose_tsquery(p_text text)
returns tsquery
language sql immutable set search_path = public as $$
  select nullif(replace(plainto_tsquery('english', coalesce(p_text, ''))::text, '&', '|'), '')::tsquery;
$$;

-- One relevance score for "similar" and search: trigram similarity of the
-- title blended with full-text rank. To add embeddings later, blend a third
-- term here.
create or replace function public.question_relevance(q public.questions, p_text text)
returns double precision
language sql stable set search_path = public, extensions as $$
  select 0.6 * extensions.word_similarity(lower(p_text), lower(q.title))
       + 0.4 * coalesce(ts_rank(q.search, loose_tsquery(p_text)), 0);
$$;

-- Similar-question panel while typing.
create or replace function public.search_similar_questions(p_text text, p_limit integer default 5)
returns table (id uuid, title text, answer_count integer, helped boolean, score double precision)
language sql stable security definer set search_path = public, extensions as $$
  select q.id, q.title, q.answer_count, q.helped_answer_id is not null,
         question_relevance(q, p_text) as score
  from questions q
  where q.status = 'published'
    and char_length(trim(coalesce(p_text, ''))) >= 6
    and (q.search @@ loose_tsquery(p_text)
         or extensions.word_similarity(lower(p_text), lower(q.title)) > 0.35)
  order by score desc
  limit least(greatest(p_limit, 1), 10);
$$;

-- Browse. p_sort: 'newest' | 'top' | 'unanswered'. With p_query, results are
-- ranked by relevance instead.
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
    and (p_category is null or q.category = p_category)
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

-- A single question: published ones for everyone, plus your own pending ones.
create or replace function public.get_question(p_id uuid)
returns setof public.question_view
language sql stable security definer set search_path = public as $$
  select to_question_view(q, auth.uid())
  from questions q
  where q.id = p_id
    and (q.status = 'published' or (q.author_id = auth.uid() and q.status = 'pending'));
$$;

create type public.answer_view as (
  id             uuid,
  body           text,
  created_at     timestamptz,
  helpful_count  integer,
  voted          boolean,
  is_mine        boolean,
  helped_asker   boolean
);

-- Answers, best first: the asker's pick, then most helpful, then oldest.
create or replace function public.get_answers(p_question uuid)
returns setof public.answer_view
language sql stable security definer set search_path = public as $$
  select a.id, a.body, a.created_at, a.helpful_count,
         exists (select 1 from answer_votes v where v.answer_id = a.id and v.visitor_id = auth.uid()),
         auth.uid() is not null and a.author_id = auth.uid(),
         q.helped_answer_id = a.id
  from answers a
  join questions q on q.id = a.question_id
  where a.question_id = p_question
    and a.status = 'published'
    and q.status = 'published'
  order by (q.helped_answer_id = a.id) desc nulls last, a.helpful_count desc, a.created_at
  limit 200;
$$;

create or replace function public.get_my_questions()
returns setof public.question_view
language sql stable security definer set search_path = public as $$
  select to_question_view(q, auth.uid())
  from questions q
  where q.author_id = auth.uid() and q.status in ('published', 'pending', 'hidden')
  order by q.created_at desc
  limit 100;
$$;

revoke all on function public.to_question_view(public.questions, uuid) from public, anon, authenticated;
revoke all on function public.question_relevance(public.questions, text) from public, anon, authenticated;
revoke all on function public.get_my_questions() from public, anon;
grant execute on function public.search_similar_questions(text, integer) to anon, authenticated, service_role;
grant execute on function public.get_question_feed(text, public.question_category, text, integer, integer) to anon, authenticated, service_role;
grant execute on function public.get_question(uuid) to anon, authenticated, service_role;
grant execute on function public.get_answers(uuid) to anon, authenticated, service_role;
grant execute on function public.get_my_questions() to authenticated, service_role;
