-- =============================================================================
-- Launch content, part 4 (after the thought_options migration): a flirtier
-- opening deck for the home page (12 cards, three of them multi-answer polls),
-- 4 teaser thoughts and 2 teaser questions. Suggestive, never explicit: this
-- is the ad landing page. The previous opening cards stay as normal posts.
-- Runs once. Remove everything with: delete from auth.users where id = '5eed0000-0000-4000-8000-64d27f3e2ab9';
-- =============================================================================
do $seed$
declare
  v_user uuid := '5eed0000-0000-4000-8000-64d27f3e2ab9';
  v_t uuid;
  v_q uuid;
begin
  if exists (select 1 from public.thoughts where author_id = v_user and featured_rank >= 100) then
    raise notice 'Part 4 already applied; nothing to do.';
    return;
  end if;

  update public.thoughts set featured_rank = null where author_id = v_user and featured_rank is not null;

  -- Card 1 already exists from the first opening deck: feature it again rather than duplicate it.
  update public.thoughts set featured_rank = 1
  where author_id = v_user and body = 'I''ve stalked someone''s profile so deep I accidentally liked a photo from 2017.';

  insert into public.thoughts (author_id, body, category, status, created_at, featured_rank, options, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I''ve had a dream about someone I know and couldn''t look them in the eye the next day.', 'relationships', 'published', now() - interval '37 hours', 2, null, '{"heart": 20, "hug": 18, "wow": 20, "laugh": 42, "sad": 8}', '{"heart": 20, "hug": 18, "wow": 20, "laugh": 42, "sad": 8}',
          (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 20, "hug": 18, "wow": 20, "laugh": 42, "sad": 8}'::jsonb)))
  returning id into v_t;
  update public.thought_tallies set me_too = me_too + 230, not_me = not_me + 82, opt3 = opt3 + 0, opt4 = opt4 + 0 where thought_id = v_t;
  insert into public.thoughts (author_id, body, category, status, created_at, featured_rank, options, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'How long do you wait before texting back someone you like?', 'relationships', 'published', now() - interval '60 hours', 3, array['Instantly', 'A few minutes', 'Hours, on purpose', 'Until they text again'], '{"heart": 24, "hug": 16, "wow": 16, "laugh": 37, "sad": 18}', '{"heart": 24, "hug": 16, "wow": 16, "laugh": 37, "sad": 18}',
          (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 24, "hug": 16, "wow": 16, "laugh": 37, "sad": 18}'::jsonb)))
  returning id into v_t;
  update public.thought_tallies set me_too = me_too + 102, not_me = not_me + 55, opt3 = opt3 + 53, opt4 = opt4 + 41 where thought_id = v_t;
  insert into public.thoughts (author_id, body, category, status, created_at, featured_rank, options, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I''ve typed "you up?" at 1am and deleted it more times than I''d like to admit.', 'relationships', 'published', now() - interval '83 hours', 4, null, '{"heart": 36, "hug": 12, "wow": 19, "laugh": 64, "sad": 21}', '{"heart": 36, "hug": 12, "wow": 19, "laugh": 64, "sad": 21}',
          (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 36, "hug": 12, "wow": 19, "laugh": 64, "sad": 21}'::jsonb)))
  returning id into v_t;
  update public.thought_tallies set me_too = me_too + 322, not_me = not_me + 74, opt3 = opt3 + 0, opt4 = opt4 + 0 where thought_id = v_t;
  insert into public.thoughts (author_id, body, category, status, created_at, featured_rank, options, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I''ve laughed way too hard at someone''s joke just because they were hot.', 'social', 'published', now() - interval '106 hours', 5, null, '{"heart": 33, "wow": 57, "laugh": 99, "sad": 3}', '{"heart": 33, "wow": 57, "laugh": 99, "sad": 3}',
          (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 33, "wow": 57, "laugh": 99, "sad": 3}'::jsonb)))
  returning id into v_t;
  update public.thought_tallies set me_too = me_too + 276, not_me = not_me + 29, opt3 = opt3 + 0, opt4 = opt4 + 0 where thought_id = v_t;
  insert into public.thoughts (author_id, body, category, status, created_at, featured_rank, options, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'Be honest: have you checked your ex''s profile this month?', 'relationships', 'published', now() - interval '129 hours', 6, array['Guilty', 'Never', 'Every single week'], '{"heart": 47, "wow": 29, "laugh": 102, "sad": 13}', '{"heart": 47, "wow": 29, "laugh": 102, "sad": 13}',
          (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 47, "wow": 29, "laugh": 102, "sad": 13}'::jsonb)))
  returning id into v_t;
  update public.thought_tallies set me_too = me_too + 178, not_me = not_me + 183, opt3 = opt3 + 97, opt4 = opt4 + 0 where thought_id = v_t;
  insert into public.thoughts (author_id, body, category, status, created_at, featured_rank, options, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I''ve flirted with someone just to see if I still could.', 'relationships', 'published', now() - interval '152 hours', 7, null, '{"heart": 36, "hug": 35, "wow": 21, "laugh": 65, "sad": 24}', '{"heart": 36, "hug": 35, "wow": 21, "laugh": 65, "sad": 24}',
          (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 36, "hug": 35, "wow": 21, "laugh": 65, "sad": 24}'::jsonb)))
  returning id into v_t;
  update public.thought_tallies set me_too = me_too + 276, not_me = not_me + 139, opt3 = opt3 + 0, opt4 = opt4 + 0 where thought_id = v_t;
  insert into public.thoughts (author_id, body, category, status, created_at, featured_rank, options, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I''ve pretended to need help with something just to talk to someone cute.', 'relationships', 'published', now() - interval '175 hours', 8, null, '{"heart": 53, "wow": 17, "laugh": 56, "sad": 21}', '{"heart": 53, "wow": 17, "laugh": 56, "sad": 21}',
          (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 53, "wow": 17, "laugh": 56, "sad": 21}'::jsonb)))
  returning id into v_t;
  update public.thought_tallies set me_too = me_too + 357, not_me = not_me + 82, opt3 = opt3 + 0, opt4 = opt4 + 0 where thought_id = v_t;
  insert into public.thoughts (author_id, body, category, status, created_at, featured_rank, options, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'What''s the biggest green flag?', 'relationships', 'published', now() - interval '198 hours', 9, array['Texts back fast', 'Makes me laugh', 'Smells incredible', 'Remembers the small things'], '{"heart": 28, "hug": 40, "wow": 39, "laugh": 66, "sad": 42}', '{"heart": 28, "hug": 40, "wow": 39, "laugh": 66, "sad": 42}',
          (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 28, "hug": 40, "wow": 39, "laugh": 66, "sad": 42}'::jsonb)))
  returning id into v_t;
  update public.thought_tallies set me_too = me_too + 97, not_me = not_me + 70, opt3 = opt3 + 163, opt4 = opt4 + 106 where thought_id = v_t;
  insert into public.thoughts (author_id, body, category, status, created_at, featured_rank, options, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I''ve sent a risky text and turned my phone face down for an hour.', 'relationships', 'published', now() - interval '221 hours', 10, null, '{"heart": 79, "hug": 12, "wow": 27, "laugh": 66, "sad": 11}', '{"heart": 79, "hug": 12, "wow": 27, "laugh": 66, "sad": 11}',
          (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 79, "hug": 12, "wow": 27, "laugh": 66, "sad": 11}'::jsonb)))
  returning id into v_t;
  update public.thought_tallies set me_too = me_too + 258, not_me = not_me + 75, opt3 = opt3 + 0, opt4 = opt4 + 0 where thought_id = v_t;
  insert into public.thoughts (author_id, body, category, status, created_at, featured_rank, options, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I get way braver at flirting after midnight.', 'social', 'published', now() - interval '244 hours', 11, null, '{"heart": 25, "hug": 12, "wow": 17, "laugh": 54, "sad": 34}', '{"heart": 25, "hug": 12, "wow": 17, "laugh": 54, "sad": 34}',
          (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 25, "hug": 12, "wow": 17, "laugh": 54, "sad": 34}'::jsonb)))
  returning id into v_t;
  update public.thought_tallies set me_too = me_too + 205, not_me = not_me + 108, opt3 = opt3 + 0, opt4 = opt4 + 0 where thought_id = v_t;
  insert into public.thoughts (author_id, body, category, status, created_at, featured_rank, options, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I''ve spent an hour getting ready just to look like I didn''t try.', 'relationships', 'published', now() - interval '267 hours', 12, null, '{"heart": 45, "hug": 3, "wow": 40, "laugh": 98}', '{"heart": 45, "hug": 3, "wow": 40, "laugh": 98}',
          (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 45, "hug": 3, "wow": 40, "laugh": 98}'::jsonb)))
  returning id into v_t;
  update public.thought_tallies set me_too = me_too + 352, not_me = not_me + 103, opt3 = opt3 + 0, opt4 = opt4 + 0 where thought_id = v_t;
  insert into public.thoughts (author_id, body, category, status, created_at, featured_rank, options, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I''ve never told my partner that the best kiss of my life was with a stranger at a wedding, and I still think about it.', 'relationships', 'published', now() - interval '9 hours', 101, null, '{"heart": 20, "hug": 14, "wow": 6, "laugh": 32}', '{"heart": 20, "hug": 14, "wow": 6, "laugh": 32}',
          (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 20, "hug": 14, "wow": 6, "laugh": 32}'::jsonb)))
  returning id into v_t;
  update public.thought_tallies set me_too = me_too + 263, not_me = not_me + 52, opt3 = opt3 + 0, opt4 = opt4 + 0 where thought_id = v_t;
  insert into public.thoughts (author_id, body, category, status, created_at, featured_rank, options, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I once pretended to be asleep on a train so the cute stranger next to me would keep leaning on my shoulder.', 'relationships', 'published', now() - interval '40 hours', 102, null, '{"heart": 35, "hug": 26, "wow": 24, "laugh": 93, "sad": 38}', '{"heart": 35, "hug": 26, "wow": 24, "laugh": 93, "sad": 38}',
          (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 35, "hug": 26, "wow": 24, "laugh": 93, "sad": 38}'::jsonb)))
  returning id into v_t;
  update public.thought_tallies set me_too = me_too + 200, not_me = not_me + 33, opt3 = opt3 + 0, opt4 = opt4 + 0 where thought_id = v_t;
  insert into public.thoughts (author_id, body, category, status, created_at, featured_rank, options, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'My friends think I''m shy, but my texts at 1am would absolutely shock every single one of them.', 'relationships', 'published', now() - interval '71 hours', 103, null, '{"heart": 22, "hug": 1, "wow": 24, "laugh": 45, "sad": 23}', '{"heart": 22, "hug": 1, "wow": 24, "laugh": 45, "sad": 23}',
          (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 22, "hug": 1, "wow": 24, "laugh": 45, "sad": 23}'::jsonb)))
  returning id into v_t;
  update public.thought_tallies set me_too = me_too + 338, not_me = not_me + 108, opt3 = opt3 + 0, opt4 = opt4 + 0 where thought_id = v_t;
  insert into public.thoughts (author_id, body, category, status, created_at, featured_rank, options, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I went on a second date with someone I wasn''t into, just because they smelled incredible.', 'relationships', 'published', now() - interval '102 hours', 104, null, '{"heart": 34, "wow": 25, "laugh": 116, "sad": 14}', '{"heart": 34, "wow": 25, "laugh": 116, "sad": 14}',
          (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 34, "wow": 25, "laugh": 116, "sad": 14}'::jsonb)))
  returning id into v_t;
  update public.thought_tallies set me_too = me_too + 216, not_me = not_me + 34, opt3 = opt3 + 0, opt4 = opt4 + 0 where thought_id = v_t;
  insert into public.questions (author_id, title, body, category, status, created_at, featured_rank)
  values (v_user, 'How do you know if someone wants you to kiss them?', '', 'relationships', 'published', now() - interval '20 hours', 1)
  returning id into v_q;
  insert into public.answers (question_id, author_id, body, status, seed_helpful, helpful_count, created_at) values
    (v_q, v_user, 'They hold eye contact a beat too long and glance at your lips. That''s the classic sign.', 'published', 87, 87, now() - interval '18 hours'),
    (v_q, v_user, 'They lean in, find reasons to touch your arm, and don''t rush to leave. If you''re unsure, just ask: "Can I kiss you?" It''s actually really attractive.', 'published', 29, 29, now() - interval '15 hours'),
    (v_q, v_user, 'Asking never ruins the moment. Guessing wrong does.', 'published', 44, 44, now() - interval '12 hours');
  update public.questions set helped_answer_id = (select id from public.answers where question_id = v_q order by helpful_count desc limit 1) where id = v_q;
  insert into public.questions (author_id, title, body, category, status, created_at, featured_rank)
  values (v_user, 'Is it normal to be more attracted to someone the more they ignore you?', '', 'relationships', 'published', now() - interval '60 hours', 2)
  returning id into v_q;
  insert into public.answers (question_id, author_id, body, status, seed_helpful, helpful_count, created_at) values
    (v_q, v_user, 'Very normal, and very common. Mixed signals hit the same part of the brain as a slot machine.', 'published', 90, 90, now() - interval '58 hours'),
    (v_q, v_user, 'The chase feels like chemistry, but it''s mostly uncertainty. Notice how you feel around people who are consistently kind.', 'published', 32, 32, now() - interval '55 hours'),
    (v_q, v_user, 'Been there. The moment they started texting back properly, I lost interest. Says more about me than them.', 'published', 16, 16, now() - interval '52 hours');
  update public.questions set helped_answer_id = (select id from public.answers where question_id = v_q order by helpful_count desc limit 1) where id = v_q;

  delete from public.activity where user_id = v_user;
end
$seed$;
