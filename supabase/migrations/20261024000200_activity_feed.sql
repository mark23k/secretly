-- =============================================================================
-- Live activity feed for managers: what happened and to which post, never who.
--
-- The activity log now also records the post an event is about (target_id)
-- and a detail (the answer picked, the reaction). Older rows have neither.
-- Secrets and secret replies are listed without their text.
-- =============================================================================

alter table public.activity
  add column target_id uuid,
  add column detail text;

create index activity_feed_idx on public.activity (created_at desc);

-- Trigger: log_activity(<activity_kind>, <user id column>[, <target column>[, <detail column>]])
create or replace function public.log_activity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row jsonb := to_jsonb(new);
begin
  insert into activity (user_id, kind, target_id, detail)
  values (
    (v_row ->> tg_argv[1])::uuid,
    tg_argv[0]::activity_kind,
    case when tg_nargs > 2 then (v_row ->> tg_argv[2])::uuid end,
    case when tg_nargs > 3 then v_row ->> tg_argv[3] end
  );
  return new;
end;
$$;

drop trigger if exists thoughts_activity on public.thoughts;
drop trigger if exists thought_comments_activity on public.thought_comments;
drop trigger if exists thought_votes_activity on public.thought_votes;
drop trigger if exists thought_reactions_activity on public.thought_reactions;
drop trigger if exists questions_activity on public.questions;
drop trigger if exists answers_activity on public.answers;
drop trigger if exists answer_votes_activity on public.answer_votes;
drop trigger if exists secrets_activity on public.secrets;
drop trigger if exists secret_replies_activity on public.secret_replies;

create trigger thoughts_activity after insert on public.thoughts
  for each row execute function public.log_activity('thought', 'author_id', 'id');
create trigger thought_comments_activity after insert on public.thought_comments
  for each row execute function public.log_activity('thought_comment', 'author_id', 'id');
create trigger thought_votes_activity after insert on public.thought_votes
  for each row execute function public.log_activity('thought_vote', 'visitor_id', 'thought_id', 'choice');
create trigger thought_reactions_activity after insert on public.thought_reactions
  for each row execute function public.log_activity('thought_reaction', 'visitor_id', 'thought_id', 'reaction');
create trigger questions_activity after insert on public.questions
  for each row execute function public.log_activity('question', 'author_id', 'id');
create trigger answers_activity after insert on public.answers
  for each row execute function public.log_activity('answer', 'author_id', 'id');
create trigger answer_votes_activity after insert on public.answer_votes
  for each row execute function public.log_activity('answer_vote', 'visitor_id', 'answer_id');
create trigger secrets_activity after insert on public.secrets
  for each row execute function public.log_activity('secret', 'author_id', 'id');
create trigger secret_replies_activity after insert on public.secret_replies
  for each row execute function public.log_activity('secret_reply', 'author_id', 'id');

-- Newest events first. p_group: null (all), 'post', 'reply' or 'reaction'.
-- Each item says what happened and to what, with no account information.
create or replace function public.admin_recent_activity(
  p_limit integer default 60,
  p_before timestamptz default null,
  p_group text default null
)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(jsonb_agg(item order by created_at desc), '[]'::jsonb)
  from (
    select a.created_at, jsonb_build_object(
      'id', a.id,
      'kind', a.kind,
      'createdAt', a.created_at,
      -- The text of the new post or reply itself (never for secrets).
      'text', case a.kind
        when 'thought' then t.body
        when 'question' then q.title
        when 'thought_comment' then c.body
        when 'answer' then an.body
      end,
      -- What it was about.
      'context', case a.kind
        when 'thought_comment' then ct.body
        when 'thought_vote' then t.body
        when 'thought_reaction' then t.body
        when 'answer' then aq.title
        when 'answer_vote' then coalesce(avq.title, '') || case when av.body is not null then ' — ' || left(av.body, 140) else '' end
      end,
      'detail', case a.kind
        when 'thought_vote' then (thought_options(t))[a.detail::integer + 1]
        when 'thought_reaction' then a.detail
      end,
      'status', case a.kind
        when 'thought' then t.status::text
        when 'question' then q.status::text
        when 'thought_comment' then c.status::text
        when 'answer' then an.status::text
      end,
      -- Where to see it on the site (published thoughts and questions only).
      'href', case
        when a.kind in ('thought', 'thought_vote', 'thought_reaction') and t.status = 'published' then '/only-one/' || t.id
        when a.kind = 'thought_comment' and ct.status = 'published' then '/only-one/' || ct.id
        when a.kind = 'question' and q.status = 'published' then '/ask/' || q.id
        when a.kind = 'answer' and aq.status = 'published' then '/ask/' || aq.id
        when a.kind = 'answer_vote' and avq.status = 'published' then '/ask/' || avq.id
      end
    ) as item
    from activity a
    left join thoughts t on a.kind in ('thought', 'thought_vote', 'thought_reaction') and t.id = a.target_id
    left join questions q on a.kind = 'question' and q.id = a.target_id
    left join thought_comments c on a.kind = 'thought_comment' and c.id = a.target_id
    left join thoughts ct on ct.id = c.thought_id
    left join answers an on a.kind = 'answer' and an.id = a.target_id
    left join questions aq on aq.id = an.question_id
    left join answers av on a.kind = 'answer_vote' and av.id = a.target_id
    left join questions avq on avq.id = av.question_id
    where (p_before is null or a.created_at < p_before)
      and (p_group is null or activity_group(a.kind) = p_group)
      and not exists (select 1 from visitors v where v.id = a.user_id and v.is_seed)
    order by a.created_at desc
    limit least(greatest(coalesce(p_limit, 60), 1), 200)
  ) rows;
$$;

revoke all on function public.admin_recent_activity(integer, timestamptz, text) from public, anon, authenticated;
grant execute on function public.admin_recent_activity(integer, timestamptz, text) to service_role;
