-- =============================================================================
-- Launch content, part 3 (after the after_dark migrations): 12 featured
-- thoughts that open the home page deck, and After Dark starter content
-- (15 thoughts, 12 questions with answers). Suggestive, never explicit.
-- Starting votes/reactions are baselines; real activity adds on top.
-- Runs once. Remove everything with: delete from auth.users where id = '5eed0000-0000-4000-8000-64d27f3e2ab9';
-- =============================================================================
do $seed$
declare
  v_user uuid := '5eed0000-0000-4000-8000-64d27f3e2ab9';
  v_t uuid;
  v_q uuid;
begin
  if not exists (select 1 from auth.users where id = v_user) then
    raise exception 'Run launch-content.sql first.';
  end if;
  if exists (select 1 from public.thoughts where author_id = v_user and featured_rank is not null) then
    raise notice 'Part 3 already applied; nothing to do.';
    return;
  end if;

  insert into public.thoughts (author_id, body, category, status, created_at, featured_rank, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I''ve stalked someone''s profile so deep I accidentally liked a photo from 2017.', 'relationships', 'published', now() - interval '30 hours', 1, '{"heart": 23, "hug": 48, "laugh": 112, "sad": 5}', '{"heart": 23, "hug": 48, "laugh": 112, "sad": 5}',
          (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 23, "hug": 48, "laugh": 112, "sad": 5}'::jsonb)))
  returning id into v_t;
  update public.thought_tallies set me_too = me_too + 242, not_me = not_me + 80 where thought_id = v_t;
  insert into public.thoughts (author_id, body, category, status, created_at, featured_rank, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I check if one specific person viewed my story before I look at anyone else.', 'relationships', 'published', now() - interval '67 hours', 2, '{"heart": 43, "hug": 1, "laugh": 77, "sad": 21}', '{"heart": 43, "hug": 1, "laugh": 77, "sad": 21}',
          (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 43, "hug": 1, "laugh": 77, "sad": 21}'::jsonb)))
  returning id into v_t;
  update public.thought_tallies set me_too = me_too + 200, not_me = not_me + 27 where thought_id = v_t;
  insert into public.thoughts (author_id, body, category, status, created_at, featured_rank, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I''ve written a long reply, deleted it, and just sent "haha" instead.', 'social', 'published', now() - interval '104 hours', 3, '{"heart": 27, "hug": 1, "wow": 1, "laugh": 67, "sad": 1}', '{"heart": 27, "hug": 1, "wow": 1, "laugh": 67, "sad": 1}',
          (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 27, "hug": 1, "wow": 1, "laugh": 67, "sad": 1}'::jsonb)))
  returning id into v_t;
  update public.thought_tallies set me_too = me_too + 215, not_me = not_me + 107 where thought_id = v_t;
  insert into public.thoughts (author_id, body, category, status, created_at, featured_rank, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I''ve rehearsed what I''d say if my crush ever texted me first.', 'relationships', 'published', now() - interval '141 hours', 4, '{"heart": 20, "hug": 37, "wow": 20, "laugh": 56, "sad": 7}', '{"heart": 20, "hug": 37, "wow": 20, "laugh": 56, "sad": 7}',
          (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 20, "hug": 37, "wow": 20, "laugh": 56, "sad": 7}'::jsonb)))
  returning id into v_t;
  update public.thought_tallies set me_too = me_too + 305, not_me = not_me + 55 where thought_id = v_t;
  insert into public.thoughts (author_id, body, category, status, created_at, featured_rank, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I''ve hidden in a supermarket aisle to avoid someone I know.', 'social', 'published', now() - interval '178 hours', 5, '{"heart": 15, "wow": 5, "laugh": 56, "sad": 1}', '{"heart": 15, "wow": 5, "laugh": 56, "sad": 1}',
          (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 15, "wow": 5, "laugh": 56, "sad": 1}'::jsonb)))
  returning id into v_t;
  update public.thought_tallies set me_too = me_too + 349, not_me = not_me + 57 where thought_id = v_t;
  insert into public.thoughts (author_id, body, category, status, created_at, featured_rank, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I''ve laughed at a joke I didn''t get because the person telling it was cute.', 'relationships', 'published', now() - interval '215 hours', 6, '{"heart": 20, "laugh": 49, "sad": 21}', '{"heart": 20, "laugh": 49, "sad": 21}',
          (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 20, "laugh": 49, "sad": 21}'::jsonb)))
  returning id into v_t;
  update public.thought_tallies set me_too = me_too + 153, not_me = not_me + 75 where thought_id = v_t;
  insert into public.thoughts (author_id, body, category, status, created_at, featured_rank, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I talk to myself in the mirror like I''m being interviewed on a talk show.', 'habits', 'published', now() - interval '252 hours', 7, '{"heart": 9, "hug": 9, "laugh": 34, "sad": 16}', '{"heart": 9, "hug": 9, "laugh": 34, "sad": 16}',
          (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 9, "hug": 9, "laugh": 34, "sad": 16}'::jsonb)))
  returning id into v_t;
  update public.thought_tallies set me_too = me_too + 139, not_me = not_me + 52 where thought_id = v_t;
  insert into public.thoughts (author_id, body, category, status, created_at, featured_rank, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I''ve changed my profile picture just hoping one person would notice.', 'relationships', 'published', now() - interval '289 hours', 8, '{"heart": 19, "hug": 14, "wow": 14, "laugh": 32, "sad": 1}', '{"heart": 19, "hug": 14, "wow": 14, "laugh": 32, "sad": 1}',
          (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 19, "hug": 14, "wow": 14, "laugh": 32, "sad": 1}'::jsonb)))
  returning id into v_t;
  update public.thought_tallies set me_too = me_too + 260, not_me = not_me + 31 where thought_id = v_t;
  insert into public.thoughts (author_id, body, category, status, created_at, featured_rank, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I''ve been more nervous texting someone than I was in my last job interview.', 'work', 'published', now() - interval '326 hours', 9, '{"heart": 24, "hug": 6, "laugh": 28, "sad": 14}', '{"heart": 24, "hug": 6, "laugh": 28, "sad": 14}',
          (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 24, "hug": 6, "laugh": 28, "sad": 14}'::jsonb)))
  returning id into v_t;
  update public.thought_tallies set me_too = me_too + 220, not_me = not_me + 35 where thought_id = v_t;
  insert into public.thoughts (author_id, body, category, status, created_at, featured_rank, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I''ve gone to the gym at a certain time only because someone I like goes then.', 'habits', 'published', now() - interval '363 hours', 10, '{"heart": 23, "hug": 1, "wow": 2, "laugh": 45, "sad": 20}', '{"heart": 23, "hug": 1, "wow": 2, "laugh": 45, "sad": 20}',
          (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 23, "hug": 1, "wow": 2, "laugh": 45, "sad": 20}'::jsonb)))
  returning id into v_t;
  update public.thought_tallies set me_too = me_too + 312, not_me = not_me + 56 where thought_id = v_t;
  insert into public.thoughts (author_id, body, category, status, created_at, featured_rank, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I''ve pretended to be on the phone so I didn''t have to say hi to someone.', 'social', 'published', now() - interval '400 hours', 11, '{"heart": 27, "wow": 8, "laugh": 28, "sad": 14}', '{"heart": 27, "wow": 8, "laugh": 28, "sad": 14}',
          (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 27, "wow": 8, "laugh": 28, "sad": 14}'::jsonb)))
  returning id into v_t;
  update public.thought_tallies set me_too = me_too + 140, not_me = not_me + 48 where thought_id = v_t;
  insert into public.thoughts (author_id, body, category, status, created_at, featured_rank, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I''ve eaten something off the floor when nobody was looking. More than once.', 'habits', 'published', now() - interval '437 hours', 12, '{"heart": 15, "hug": 3, "wow": 16, "laugh": 49, "sad": 18}', '{"heart": 15, "hug": 3, "wow": 16, "laugh": 49, "sad": 18}',
          (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 15, "hug": 3, "wow": 16, "laugh": 49, "sad": 18}'::jsonb)))
  returning id into v_t;
  update public.thought_tallies set me_too = me_too + 244, not_me = not_me + 136 where thought_id = v_t;
  insert into public.thoughts (author_id, body, category, status, created_at, featured_rank, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I''ve reread a flirty text so many times I could recite it word for word.', 'after_dark', 'published', now() - interval '20 hours', null, '{"heart": 39, "hug": 17, "laugh": 41, "sad": 21}', '{"heart": 39, "hug": 17, "laugh": 41, "sad": 21}',
          (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 39, "hug": 17, "laugh": 41, "sad": 21}'::jsonb)))
  returning id into v_t;
  update public.thought_tallies set me_too = me_too + 173, not_me = not_me + 50 where thought_id = v_t;
  insert into public.thoughts (author_id, body, category, status, created_at, featured_rank, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I''ve had a crush on a friend''s partner and never told a single person.', 'after_dark', 'published', now() - interval '49 hours', null, '{"heart": 27, "wow": 10, "laugh": 14, "sad": 8}', '{"heart": 27, "wow": 10, "laugh": 14, "sad": 8}',
          (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 27, "wow": 10, "laugh": 14, "sad": 8}'::jsonb)))
  returning id into v_t;
  update public.thought_tallies set me_too = me_too + 96, not_me = not_me + 119 where thought_id = v_t;
  insert into public.thoughts (author_id, body, category, status, created_at, featured_rank, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'Sometimes I''m more attracted to someone''s voice than to their looks.', 'after_dark', 'published', now() - interval '78 hours', null, '{"heart": 8, "hug": 6, "wow": 7, "laugh": 49, "sad": 6}', '{"heart": 8, "hug": 6, "wow": 7, "laugh": 49, "sad": 6}',
          (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 8, "hug": 6, "wow": 7, "laugh": 49, "sad": 6}'::jsonb)))
  returning id into v_t;
  update public.thought_tallies set me_too = me_too + 77, not_me = not_me + 92 where thought_id = v_t;
  insert into public.thoughts (author_id, body, category, status, created_at, featured_rank, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I still think about a kiss from years ago more than I''d ever admit.', 'after_dark', 'published', now() - interval '107 hours', null, '{"heart": 35, "hug": 19, "wow": 45, "laugh": 18, "sad": 14}', '{"heart": 35, "hug": 19, "wow": 45, "laugh": 18, "sad": 14}',
          (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 35, "hug": 19, "wow": 45, "laugh": 18, "sad": 14}'::jsonb)))
  returning id into v_t;
  update public.thought_tallies set me_too = me_too + 103, not_me = not_me + 124 where thought_id = v_t;
  insert into public.thoughts (author_id, body, category, status, created_at, featured_rank, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I''ve pretended to be more experienced than I really am.', 'after_dark', 'published', now() - interval '136 hours', null, '{"heart": 4, "hug": 7, "wow": 1, "laugh": 11, "sad": 8}', '{"heart": 4, "hug": 7, "wow": 1, "laugh": 11, "sad": 8}',
          (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 4, "hug": 7, "wow": 1, "laugh": 11, "sad": 8}'::jsonb)))
  returning id into v_t;
  update public.thought_tallies set me_too = me_too + 120, not_me = not_me + 43 where thought_id = v_t;
  insert into public.thoughts (author_id, body, category, status, created_at, featured_rank, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I''ve pretended to be less experienced than I really am.', 'after_dark', 'published', now() - interval '165 hours', null, '{"heart": 26, "wow": 38, "laugh": 2, "sad": 23}', '{"heart": 26, "wow": 38, "laugh": 2, "sad": 23}',
          (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 26, "wow": 38, "laugh": 2, "sad": 23}'::jsonb)))
  returning id into v_t;
  update public.thought_tallies set me_too = me_too + 99, not_me = not_me + 64 where thought_id = v_t;
  insert into public.thoughts (author_id, body, category, status, created_at, featured_rank, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I get jealous of my partner''s exes even though I''ve never met them.', 'after_dark', 'published', now() - interval '194 hours', null, '{"heart": 22, "hug": 4, "laugh": 28, "sad": 2}', '{"heart": 22, "hug": 4, "laugh": 28, "sad": 2}',
          (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 22, "hug": 4, "laugh": 28, "sad": 2}'::jsonb)))
  returning id into v_t;
  update public.thought_tallies set me_too = me_too + 74, not_me = not_me + 38 where thought_id = v_t;
  insert into public.thoughts (author_id, body, category, status, created_at, featured_rank, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I flirt so much better over text than I ever could in person.', 'after_dark', 'published', now() - interval '223 hours', null, '{"heart": 33, "hug": 11, "wow": 34, "laugh": 5, "sad": 10}', '{"heart": 33, "hug": 11, "wow": 34, "laugh": 5, "sad": 10}',
          (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 33, "hug": 11, "wow": 34, "laugh": 5, "sad": 10}'::jsonb)))
  returning id into v_t;
  update public.thought_tallies set me_too = me_too + 120, not_me = not_me + 75 where thought_id = v_t;
  insert into public.thoughts (author_id, body, category, status, created_at, featured_rank, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I''ve had a dream about a coworker and couldn''t look them in the eye the next day.', 'after_dark', 'published', now() - interval '252 hours', null, '{"heart": 8, "hug": 17, "laugh": 25, "sad": 14}', '{"heart": 8, "hug": 17, "laugh": 25, "sad": 14}',
          (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 8, "hug": 17, "laugh": 25, "sad": 14}'::jsonb)))
  returning id into v_t;
  update public.thought_tallies set me_too = me_too + 90, not_me = not_me + 95 where thought_id = v_t;
  insert into public.thoughts (author_id, body, category, status, created_at, featured_rank, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I''m more nervous about the first kiss than about the whole date.', 'after_dark', 'published', now() - interval '281 hours', null, '{"heart": 43, "hug": 22, "wow": 19, "laugh": 16, "sad": 16}', '{"heart": 43, "hug": 22, "wow": 19, "laugh": 16, "sad": 16}',
          (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 43, "hug": 22, "wow": 19, "laugh": 16, "sad": 16}'::jsonb)))
  returning id into v_t;
  update public.thought_tallies set me_too = me_too + 113, not_me = not_me + 66 where thought_id = v_t;
  insert into public.thoughts (author_id, body, category, status, created_at, featured_rank, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I''ve stayed with someone longer than I should have because the chemistry was that good.', 'after_dark', 'published', now() - interval '310 hours', null, '{"heart": 17, "hug": 1, "wow": 32, "laugh": 75, "sad": 12}', '{"heart": 17, "hug": 1, "wow": 32, "laugh": 75, "sad": 12}',
          (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 17, "hug": 1, "wow": 32, "laugh": 75, "sad": 12}'::jsonb)))
  returning id into v_t;
  update public.thought_tallies set me_too = me_too + 157, not_me = not_me + 36 where thought_id = v_t;
  insert into public.thoughts (author_id, body, category, status, created_at, featured_rank, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I''ve dressed up for someone who I knew wouldn''t even notice.', 'after_dark', 'published', now() - interval '339 hours', null, '{"heart": 14, "hug": 13, "wow": 8, "laugh": 6, "sad": 12}', '{"heart": 14, "hug": 13, "wow": 8, "laugh": 6, "sad": 12}',
          (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 14, "hug": 13, "wow": 8, "laugh": 6, "sad": 12}'::jsonb)))
  returning id into v_t;
  update public.thought_tallies set me_too = me_too + 39, not_me = not_me + 47 where thought_id = v_t;
  insert into public.thoughts (author_id, body, category, status, created_at, featured_rank, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I find confidence more attractive than looks, and I''m still working on having either.', 'after_dark', 'published', now() - interval '368 hours', null, '{"heart": 24, "hug": 14, "laugh": 58, "sad": 19}', '{"heart": 24, "hug": 14, "laugh": 58, "sad": 19}',
          (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 24, "hug": 14, "laugh": 58, "sad": 19}'::jsonb)))
  returning id into v_t;
  update public.thought_tallies set me_too = me_too + 183, not_me = not_me + 27 where thought_id = v_t;
  insert into public.thoughts (author_id, body, category, status, created_at, featured_rank, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I''ve sent a risky text and then put my phone in another room for an hour.', 'after_dark', 'published', now() - interval '397 hours', null, '{"heart": 35, "hug": 8, "wow": 12, "laugh": 1, "sad": 5}', '{"heart": 35, "hug": 8, "wow": 12, "laugh": 1, "sad": 5}',
          (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 35, "hug": 8, "wow": 12, "laugh": 1, "sad": 5}'::jsonb)))
  returning id into v_t;
  update public.thought_tallies set me_too = me_too + 144, not_me = not_me + 62 where thought_id = v_t;
  insert into public.thoughts (author_id, body, category, status, created_at, featured_rank, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I''ve fallen for someone just because of the way they looked at me once.', 'after_dark', 'published', now() - interval '426 hours', null, '{"heart": 8, "hug": 2, "wow": 1, "laugh": 10, "sad": 5}', '{"heart": 8, "hug": 2, "wow": 1, "laugh": 10, "sad": 5}',
          (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 8, "hug": 2, "wow": 1, "laugh": 10, "sad": 5}'::jsonb)))
  returning id into v_t;
  update public.thought_tallies set me_too = me_too + 160, not_me = not_me + 74 where thought_id = v_t;
  insert into public.questions (author_id, title, body, category, status, created_at)
  values (v_user, 'How do you know if you''re actually good in bed?', '', 'after_dark', 'published', now() - interval '26 hours')
  returning id into v_q;
  insert into public.answers (question_id, author_id, body, status, seed_helpful, helpful_count, created_at) values
    (v_q, v_user, 'Ask. Honestly, the best partners are the ones who check in and actually listen to the answer.', 'published', 43, 43, now() - interval '24 hours'),
    (v_q, v_user, 'Enthusiasm and paying attention matter way more than any technique.', 'published', 37, 37, now() - interval '20 hours'),
    (v_q, v_user, 'If you''re asking this, you probably care about your partner, which is already most of it.', 'published', 30, 30, now() - interval '16 hours');
  update public.questions set helped_answer_id = (select id from public.answers where question_id = v_q order by helpful_count desc limit 1) where id = v_q;
  insert into public.questions (author_id, title, body, category, status, created_at)
  values (v_user, 'Is it normal to have a lower sex drive than your partner?', 'It''s starting to feel like a problem between us.', 'after_dark', 'published', now() - interval '59 hours')
  returning id into v_q;
  insert into public.answers (question_id, author_id, body, status, seed_helpful, helpful_count, created_at) values
    (v_q, v_user, 'Very normal. Mismatched drives are one of the most common things couples deal with.', 'published', 57, 57, now() - interval '57 hours'),
    (v_q, v_user, 'Talk about it outside the bedroom, when nobody feels rejected. It takes the pressure off.', 'published', 29, 29, now() - interval '53 hours'),
    (v_q, v_user, 'Stress, sleep and mood affect it a lot. If it changed suddenly, a doctor''s check-up is worth it.', 'published', 4, 4, now() - interval '49 hours');
  insert into public.questions (author_id, title, body, category, status, created_at)
  values (v_user, 'How do you bring up something new you want to try with your partner?', '', 'after_dark', 'published', now() - interval '92 hours')
  returning id into v_q;
  insert into public.answers (question_id, author_id, body, status, seed_helpful, helpful_count, created_at) values
    (v_q, v_user, 'Bring it up casually, not in the moment. "I read about this and it sounded fun" works well.', 'published', 47, 47, now() - interval '90 hours'),
    (v_q, v_user, 'Make it clear it''s an idea, not a demand. It''s much easier for them to say yes or no.', 'published', 39, 39, now() - interval '86 hours'),
    (v_q, v_user, 'Ask what they''d like to try too. It turns it into something you explore together.', 'published', 39, 39, now() - interval '82 hours');
  insert into public.questions (author_id, title, body, category, status, created_at)
  values (v_user, 'Is it weird to have never been kissed at 22?', '', 'after_dark', 'published', now() - interval '125 hours')
  returning id into v_q;
  insert into public.answers (question_id, author_id, body, status, seed_helpful, helpful_count, created_at) values
    (v_q, v_user, 'Not at all. Lots of people start later than you''d think. Nobody is keeping score.', 'published', 28, 28, now() - interval '123 hours'),
    (v_q, v_user, 'I was 24. When it happened, nobody asked and nobody cared about the timing.', 'published', 5, 5, now() - interval '119 hours'),
    (v_q, v_user, 'There''s no deadline. It''s better with the right person than early with the wrong one.', 'published', 0, 0, now() - interval '115 hours');
  update public.questions set helped_answer_id = (select id from public.answers where question_id = v_q order by helpful_count desc limit 1) where id = v_q;
  insert into public.questions (author_id, title, body, category, status, created_at)
  values (v_user, 'How do you tell someone you''re interested without making it awkward?', '', 'after_dark', 'published', now() - interval '158 hours')
  returning id into v_q;
  insert into public.answers (question_id, author_id, body, status, seed_helpful, helpful_count, created_at) values
    (v_q, v_user, 'Keep it light and give them an easy out: "I''d love to get a drink sometime, no pressure."', 'published', 30, 30, now() - interval '156 hours'),
    (v_q, v_user, 'Most people are flattered, even if they say no. It''s rarely as awkward as you imagine.', 'published', 10, 10, now() - interval '152 hours'),
    (v_q, v_user, 'If it''s a friend, say you value the friendship either way. Then actually mean it.', 'published', 40, 40, now() - interval '148 hours');
  insert into public.questions (author_id, title, body, category, status, created_at)
  values (v_user, 'Is it normal to fantasize about someone other than your partner?', '', 'after_dark', 'published', now() - interval '191 hours')
  returning id into v_q;
  insert into public.answers (question_id, author_id, body, status, seed_helpful, helpful_count, created_at) values
    (v_q, v_user, 'Extremely common. Thoughts aren''t actions, and most people have them.', 'published', 21, 21, now() - interval '189 hours'),
    (v_q, v_user, 'It only matters if it makes you unhappy in your relationship. Then it''s worth thinking about why.', 'published', 28, 28, now() - interval '185 hours'),
    (v_q, v_user, 'Fantasies are often about novelty, not about wanting to leave. Don''t panic over it.', 'published', 12, 12, now() - interval '181 hours');
  insert into public.questions (author_id, title, body, category, status, created_at)
  values (v_user, 'How do you tell your partner you want more without hurting them?', '', 'after_dark', 'published', now() - interval '224 hours')
  returning id into v_q;
  insert into public.answers (question_id, author_id, body, status, seed_helpful, helpful_count, created_at) values
    (v_q, v_user, 'Start with what you love, then what you''d like more of. "I love when we… can we do more of that?"', 'published', 55, 55, now() - interval '222 hours'),
    (v_q, v_user, 'Pick a calm moment, not right after. And make it about the two of you, not their performance.', 'published', 21, 21, now() - interval '218 hours'),
    (v_q, v_user, 'Most partners want to know. It''s harder to keep it in than to say it kindly.', 'published', 30, 30, now() - interval '214 hours');
  update public.questions set helped_answer_id = (select id from public.answers where question_id = v_q order by helpful_count desc limit 1) where id = v_q;
  insert into public.questions (author_id, title, body, category, status, created_at)
  values (v_user, 'How do you stop being nervous about being seen naked by someone new?', '', 'after_dark', 'published', now() - interval '257 hours')
  returning id into v_q;
  insert into public.answers (question_id, author_id, body, status, seed_helpful, helpful_count, created_at) values
    (v_q, v_user, 'Remember they''re probably nervous too. Almost everyone is the first time.', 'published', 31, 31, now() - interval '255 hours'),
    (v_q, v_user, 'Dim lights help, honestly. So does someone who makes you laugh.', 'published', 5, 5, now() - interval '251 hours'),
    (v_q, v_user, 'The people worth being with are just happy to be there with you, not judging you.', 'published', 14, 14, now() - interval '247 hours');
  insert into public.questions (author_id, title, body, category, status, created_at)
  values (v_user, 'Is it okay to only want something casual?', '', 'after_dark', 'published', now() - interval '290 hours')
  returning id into v_q;
  insert into public.answers (question_id, author_id, body, status, seed_helpful, helpful_count, created_at) values
    (v_q, v_user, 'Completely okay, as long as you''re honest about it with the other person.', 'published', 50, 50, now() - interval '288 hours'),
    (v_q, v_user, 'Being upfront early avoids almost all the drama.', 'published', 19, 19, now() - interval '284 hours'),
    (v_q, v_user, 'Wanting different things at different times in life is normal.', 'published', 16, 16, now() - interval '280 hours');
  insert into public.questions (author_id, title, body, category, status, created_at)
  values (v_user, 'How soon is too soon to sleep with someone new?', '', 'after_dark', 'published', now() - interval '323 hours')
  returning id into v_q;
  insert into public.answers (question_id, author_id, body, status, seed_helpful, helpful_count, created_at) values
    (v_q, v_user, 'There''s no rule. It''s too soon if either of you isn''t fully sure.', 'published', 10, 10, now() - interval '321 hours'),
    (v_q, v_user, 'When you both genuinely want to, and you feel safe with them. That''s the only real test.', 'published', 21, 21, now() - interval '317 hours'),
    (v_q, v_user, 'Ignore what friends say is "normal". Some people wait months, some don''t, and both are fine.', 'published', 31, 31, now() - interval '313 hours');
  update public.questions set helped_answer_id = (select id from public.answers where question_id = v_q order by helpful_count desc limit 1) where id = v_q;
  insert into public.questions (author_id, title, body, category, status, created_at)
  values (v_user, 'Why do I always fall for people who aren''t available?', '', 'after_dark', 'published', now() - interval '356 hours')
  returning id into v_q;
  insert into public.answers (question_id, author_id, body, status, seed_helpful, helpful_count, created_at) values
    (v_q, v_user, 'Sometimes unavailable feels safer: there''s no risk of it actually getting real.', 'published', 26, 26, now() - interval '354 hours'),
    (v_q, v_user, 'Notice the pattern, then be curious about it rather than harsh. A therapist helped me with this one.', 'published', 13, 13, now() - interval '350 hours'),
    (v_q, v_user, 'The chase can feel like chemistry. Calm and consistent can feel boring at first but it isn''t.', 'published', 2, 2, now() - interval '346 hours');
  insert into public.questions (author_id, title, body, category, status, created_at)
  values (v_user, 'How do you know if someone just wants to hook up or actually likes you?', '', 'after_dark', 'published', now() - interval '389 hours')
  returning id into v_q;
  insert into public.answers (question_id, author_id, body, status, seed_helpful, helpful_count, created_at) values
    (v_q, v_user, 'Watch if they make plans in daylight. Interest shows up in boring, everyday ways.', 'published', 39, 39, now() - interval '387 hours'),
    (v_q, v_user, 'If they only text late at night, that tells you a lot.', 'published', 32, 32, now() - interval '383 hours'),
    (v_q, v_user, 'Ask directly. It''s scary, but the answer saves you weeks of guessing.', 'published', 40, 40, now() - interval '379 hours');

  delete from public.activity where user_id = v_user;
end
$seed$;
