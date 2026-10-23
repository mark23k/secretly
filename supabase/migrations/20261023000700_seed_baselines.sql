-- =============================================================================
-- Starting baselines for launch content.
--
-- Launch posts can start with some reactions / "helpful" votes. They're kept
-- in their own columns so real activity always adds on top (the counting
-- triggers below recompute from real rows + baseline). Vote baselines need no
-- column: thought_tallies already only ever gets incremented.
-- =============================================================================

alter table public.thoughts add column seed_reactions jsonb not null default '{}'::jsonb;
alter table public.answers add column seed_helpful integer not null default 0;

create or replace function public.thought_reactions_count()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_thought uuid := coalesce(new.thought_id, old.thought_id);
begin
  update thoughts t
     set reaction_counts = coalesce((
           select jsonb_object_agg(k, n)
           from (
             select k, sum(n)::integer as n
             from (
               select reaction as k, count(*)::integer as n
               from thought_reactions where thought_id = v_thought group by reaction
               union all
               select key, value::integer from jsonb_each_text(t.seed_reactions)
             ) all_counts
             group by k
           ) merged
         ), '{}'::jsonb),
         reaction_total = (select count(*) from thought_reactions where thought_id = v_thought)
                          + coalesce((select sum(value::integer) from jsonb_each_text(t.seed_reactions)), 0)
   where t.id = v_thought;
  return null;
end;
$$;

create or replace function public.answer_votes_count()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_answer uuid := coalesce(new.answer_id, old.answer_id);
begin
  update answers a
     set helpful_count = (select count(*) from answer_votes where answer_id = v_answer) + a.seed_helpful
   where a.id = v_answer;
  return null;
end;
$$;
