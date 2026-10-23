-- =============================================================================
-- Launch content, part 2 (run after launch-content.sql and the
-- seed_baselines migration). Adds 30 more thoughts (with starting reactions),
-- 30 more questions (each with 2-4 answers and starting "helpful" votes; a
-- third marked as helping the asker) and 30 more secrets. Then gives every
-- launch thought a starting vote count (40-260, varied yes/no split).
--
-- Starting numbers are baselines: real votes and reactions add on top.
-- Runs once: it does nothing if part 2 was already applied.
-- Remove everything with: delete from auth.users where id = '5eed0000-0000-4000-8000-64d27f3e2ab9';
-- =============================================================================
do $seed$
declare
  v_user uuid := '5eed0000-0000-4000-8000-64d27f3e2ab9';
  v_q uuid;
begin
  if not exists (select 1 from auth.users where id = v_user) then
    raise exception 'Run launch-content.sql first.';
  end if;
  if (select count(*) from public.thoughts where author_id = v_user) > 30 then
    raise notice 'Part 2 already applied; nothing to do.';
    return;
  end if;

  insert into public.thoughts (author_id, body, category, status, created_at, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I open the fridge, close it, then open it again five minutes later like something new might have appeared.', 'habits', 'published', now() - interval '473 hours 0 minutes',
          '{"heart": 15, "hug": 1, "wow": 3, "laugh": 32}', '{"heart": 15, "hug": 1, "wow": 3, "laugh": 32}', (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 15, "hug": 1, "wow": 3, "laugh": 32}'::jsonb)));
  insert into public.thoughts (author_id, body, category, status, created_at, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I pretend to text someone when I''m standing alone at a party.', 'social', 'published', now() - interval '457 hours 41 minutes',
          '{"heart": 11, "hug": 5, "laugh": 8, "sad": 3}', '{"heart": 11, "hug": 5, "laugh": 8, "sad": 3}', (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 11, "hug": 5, "laugh": 8, "sad": 3}'::jsonb)));
  insert into public.thoughts (author_id, body, category, status, created_at, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I feel weirdly emotional when I finish a really good TV show, like I lost friends.', 'feelings', 'published', now() - interval '441 hours 22 minutes',
          '{"heart": 44, "hug": 3, "wow": 10, "laugh": 28, "sad": 6}', '{"heart": 44, "hug": 3, "wow": 10, "laugh": 28, "sad": 6}', (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 44, "hug": 3, "wow": 10, "laugh": 28, "sad": 6}'::jsonb)));
  insert into public.thoughts (author_id, body, category, status, created_at, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I''ve drafted long messages to people from my past and then deleted every single one.', 'relationships', 'published', now() - interval '425 hours 3 minutes',
          '{"heart": 41, "wow": 19, "laugh": 32, "sad": 1}', '{"heart": 41, "wow": 19, "laugh": 32, "sad": 1}', (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 41, "wow": 19, "laugh": 32, "sad": 1}'::jsonb)));
  insert into public.thoughts (author_id, body, category, status, created_at, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I rehearse what I''ll say before every meeting, even when I''m only going to say hello.', 'work', 'published', now() - interval '409 hours 44 minutes',
          '{"heart": 15, "hug": 16, "wow": 14, "laugh": 25}', '{"heart": 15, "hug": 16, "wow": 14, "laugh": 25}', (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 15, "hug": 16, "wow": 14, "laugh": 25}'::jsonb)));
  insert into public.thoughts (author_id, body, category, status, created_at, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I''m convinced every small ache is something serious until I''ve googled it for an hour.', 'body', 'published', now() - interval '393 hours 25 minutes',
          '{"heart": 7, "hug": 10, "wow": 11, "laugh": 18, "sad": 6}', '{"heart": 7, "hug": 10, "wow": 11, "laugh": 18, "sad": 6}', (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 7, "hug": 10, "wow": 11, "laugh": 18, "sad": 6}'::jsonb)));
  insert into public.thoughts (author_id, body, category, status, created_at, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I keep 40 browser tabs open because closing them feels like giving up on something.', 'habits', 'published', now() - interval '377 hours 6 minutes',
          '{"heart": 28, "hug": 7, "wow": 14, "laugh": 35, "sad": 13}', '{"heart": 28, "hug": 7, "wow": 14, "laugh": 35, "sad": 13}', (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 28, "hug": 7, "wow": 14, "laugh": 35, "sad": 13}'::jsonb)));
  insert into public.thoughts (author_id, body, category, status, created_at, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I walk faster when someone is behind me on the stairs so I don''t make them wait.', 'social', 'published', now() - interval '361 hours 47 minutes',
          '{"heart": 18, "hug": 1, "wow": 14, "laugh": 24, "sad": 1}', '{"heart": 18, "hug": 1, "wow": 14, "laugh": 24, "sad": 1}', (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 18, "hug": 1, "wow": 14, "laugh": 24, "sad": 1}'::jsonb)));
  insert into public.thoughts (author_id, body, category, status, created_at, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'Compliments make me so uncomfortable that I immediately change the subject.', 'feelings', 'published', now() - interval '345 hours 28 minutes',
          '{"heart": 24, "hug": 40, "wow": 2, "laugh": 41}', '{"heart": 24, "hug": 40, "wow": 2, "laugh": 41}', (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 24, "hug": 40, "wow": 2, "laugh": 41}'::jsonb)));
  insert into public.thoughts (author_id, body, category, status, created_at, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I''m scared that the people closest to me only like a version of me I perform.', 'relationships', 'published', now() - interval '329 hours 9 minutes',
          '{"heart": 9, "hug": 21, "wow": 7, "laugh": 5, "sad": 16}', '{"heart": 9, "hug": 21, "wow": 7, "laugh": 5, "sad": 16}', (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 9, "hug": 21, "wow": 7, "laugh": 5, "sad": 16}'::jsonb)));
  insert into public.thoughts (author_id, body, category, status, created_at, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I talk to my plants and genuinely believe it helps them grow.', 'other', 'published', now() - interval '313 hours 50 minutes',
          '{"heart": 33, "wow": 2, "laugh": 57, "sad": 18}', '{"heart": 33, "wow": 2, "laugh": 57, "sad": 18}', (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 33, "wow": 2, "laugh": 57, "sad": 18}'::jsonb)));
  insert into public.thoughts (author_id, body, category, status, created_at, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I''ve pretended my internet was bad to get out of a video call.', 'work', 'published', now() - interval '297 hours 31 minutes',
          '{"heart": 13, "hug": 14, "wow": 1, "laugh": 25, "sad": 5}', '{"heart": 13, "hug": 14, "wow": 1, "laugh": 25, "sad": 5}', (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 13, "hug": 14, "wow": 1, "laugh": 25, "sad": 5}'::jsonb)));
  insert into public.thoughts (author_id, body, category, status, created_at, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I set five alarms in the morning and still wake up before the first one, then go back to sleep.', 'habits', 'published', now() - interval '281 hours 12 minutes',
          '{"heart": 16, "hug": 9, "wow": 23, "laugh": 34}', '{"heart": 16, "hug": 9, "wow": 23, "laugh": 34}', (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 16, "hug": 9, "wow": 23, "laugh": 34}'::jsonb)));
  insert into public.thoughts (author_id, body, category, status, created_at, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I''ve replied "haha" to something that wasn''t funny at all just to end the conversation.', 'social', 'published', now() - interval '265 hours 53 minutes',
          '{"heart": 15, "hug": 7, "wow": 19, "laugh": 24, "sad": 12}', '{"heart": 15, "hug": 7, "wow": 19, "laugh": 24, "sad": 12}', (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 15, "hug": 7, "wow": 19, "laugh": 24, "sad": 12}'::jsonb)));
  insert into public.thoughts (author_id, body, category, status, created_at, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I miss people I barely knew, like a classmate I sat next to years ago.', 'feelings', 'published', now() - interval '249 hours 34 minutes',
          '{"heart": 3, "hug": 16, "sad": 15}', '{"heart": 3, "hug": 16, "sad": 15}', (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 3, "hug": 16, "sad": 15}'::jsonb)));
  insert into public.thoughts (author_id, body, category, status, created_at, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I hold my breath when I walk past someone smoking, even outdoors.', 'body', 'published', now() - interval '233 hours 15 minutes',
          '{"heart": 12, "hug": 1, "wow": 11, "laugh": 12, "sad": 2}', '{"heart": 12, "hug": 1, "wow": 11, "laugh": 12, "sad": 2}', (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 12, "hug": 1, "wow": 11, "laugh": 12, "sad": 2}'::jsonb)));
  insert into public.thoughts (author_id, body, category, status, created_at, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I keep score of who texts first, and I hate that I do.', 'relationships', 'published', now() - interval '217 hours 56 minutes',
          '{"heart": 26, "hug": 3, "wow": 4, "laugh": 42, "sad": 12}', '{"heart": 26, "hug": 3, "wow": 4, "laugh": 42, "sad": 12}', (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 26, "hug": 3, "wow": 4, "laugh": 42, "sad": 12}'::jsonb)));
  insert into public.thoughts (author_id, body, category, status, created_at, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I still get a little excited when it snows, even though I''m an adult with a commute.', 'other', 'published', now() - interval '201 hours 37 minutes',
          '{"heart": 38, "wow": 9, "laugh": 38, "sad": 10}', '{"heart": 38, "wow": 9, "laugh": 38, "sad": 10}', (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 38, "wow": 9, "laugh": 38, "sad": 10}'::jsonb)));
  insert into public.thoughts (author_id, body, category, status, created_at, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I feel like everyone else got a manual for adult life that I never received.', 'work', 'published', now() - interval '185 hours 18 minutes',
          '{"heart": 22, "hug": 2, "wow": 10, "laugh": 15, "sad": 1}', '{"heart": 22, "hug": 2, "wow": 10, "laugh": 15, "sad": 1}', (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 22, "hug": 2, "wow": 10, "laugh": 15, "sad": 1}'::jsonb)));
  insert into public.thoughts (author_id, body, category, status, created_at, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I re-watch the same comfort show over and over instead of starting anything new.', 'habits', 'published', now() - interval '169 hours 59 minutes',
          '{"heart": 13, "hug": 6, "wow": 2, "laugh": 17, "sad": 9}', '{"heart": 13, "hug": 6, "wow": 2, "laugh": 17, "sad": 9}', (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 13, "hug": 6, "wow": 2, "laugh": 17, "sad": 9}'::jsonb)));
  insert into public.thoughts (author_id, body, category, status, created_at, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I check if a restaurant has a menu online before going, so I don''t panic ordering.', 'social', 'published', now() - interval '153 hours 40 minutes',
          '{"heart": 9, "hug": 14, "wow": 9, "laugh": 17, "sad": 15}', '{"heart": 9, "hug": 14, "wow": 9, "laugh": 17, "sad": 15}', (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 9, "hug": 14, "wow": 9, "laugh": 17, "sad": 15}'::jsonb)));
  insert into public.thoughts (author_id, body, category, status, created_at, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I sometimes feel homesick even when I''m at home.', 'feelings', 'published', now() - interval '137 hours 21 minutes',
          '{"heart": 1, "hug": 36, "wow": 7, "sad": 18}', '{"heart": 1, "hug": 36, "wow": 7, "sad": 18}', (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 1, "hug": 36, "wow": 7, "sad": 18}'::jsonb)));
  insert into public.thoughts (author_id, body, category, status, created_at, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I''m afraid of being too much for people, so I end up being too little.', 'relationships', 'published', now() - interval '121 hours 2 minutes',
          '{"hug": 15, "sad": 12}', '{"hug": 15, "sad": 12}', (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"hug": 15, "sad": 12}'::jsonb)));
  insert into public.thoughts (author_id, body, category, status, created_at, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I''ve avoided the dentist for years because I''m embarrassed about how long it''s been.', 'body', 'published', now() - interval '105 hours 43 minutes',
          '{"heart": 27, "wow": 18, "laugh": 51, "sad": 22}', '{"heart": 27, "wow": 18, "laugh": 51, "sad": 22}', (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 27, "wow": 18, "laugh": 51, "sad": 22}'::jsonb)));
  insert into public.thoughts (author_id, body, category, status, created_at, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I make up backstories for strangers on the train.', 'other', 'published', now() - interval '89 hours 24 minutes',
          '{"heart": 40, "hug": 1, "wow": 9, "laugh": 59, "sad": 4}', '{"heart": 40, "hug": 1, "wow": 9, "laugh": 59, "sad": 4}', (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 40, "hug": 1, "wow": 9, "laugh": 59, "sad": 4}'::jsonb)));
  insert into public.thoughts (author_id, body, category, status, created_at, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I answer emails late at night so people think I''m hardworking.', 'work', 'published', now() - interval '73 hours 5 minutes',
          '{"heart": 7, "hug": 7, "wow": 3, "laugh": 20, "sad": 10}', '{"heart": 7, "hug": 7, "wow": 3, "laugh": 20, "sad": 10}', (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 7, "hug": 7, "wow": 3, "laugh": 20, "sad": 10}'::jsonb)));
  insert into public.thoughts (author_id, body, category, status, created_at, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I buy a planner every January and stop using it by February.', 'habits', 'published', now() - interval '57 hours 46 minutes',
          '{"heart": 22, "hug": 15, "wow": 16, "laugh": 38, "sad": 6}', '{"heart": 22, "hug": 15, "wow": 16, "laugh": 38, "sad": 6}', (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 22, "hug": 15, "wow": 16, "laugh": 38, "sad": 6}'::jsonb)));
  insert into public.thoughts (author_id, body, category, status, created_at, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I''ve practiced my laugh because I once heard a recording of it.', 'social', 'published', now() - interval '41 hours 27 minutes',
          '{"heart": 8, "hug": 5, "wow": 1, "laugh": 7, "sad": 4}', '{"heart": 8, "hug": 5, "wow": 1, "laugh": 7, "sad": 4}', (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 8, "hug": 5, "wow": 1, "laugh": 7, "sad": 4}'::jsonb)));
  insert into public.thoughts (author_id, body, category, status, created_at, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'Getting a reply that says "we need to talk" ruins my whole day, even when it''s nothing.', 'feelings', 'published', now() - interval '25 hours 8 minutes',
          '{"heart": 7, "hug": 6, "laugh": 6, "sad": 4}', '{"heart": 7, "hug": 6, "laugh": 6, "sad": 4}', (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 7, "hug": 6, "laugh": 6, "sad": 4}'::jsonb)));
  insert into public.thoughts (author_id, body, category, status, created_at, seed_reactions, reaction_counts, reaction_total)
  values (v_user, 'I''m jealous of how easily some people make friends as adults.', 'relationships', 'published', now() - interval '9 hours 49 minutes',
          '{"heart": 22, "hug": 11, "wow": 14, "laugh": 57, "sad": 13}', '{"heart": 22, "hug": 11, "wow": 14, "laugh": 57, "sad": 13}', (select coalesce(sum(value::integer), 0) from jsonb_each_text('{"heart": 22, "hug": 11, "wow": 14, "laugh": 57, "sad": 13}'::jsonb)));
  insert into public.questions (author_id, title, body, category, status, created_at)
  values (v_user, 'How do you get better at small talk without feeling fake?', '', 'social', 'published', now() - interval '477 hours 0 minutes')
  returning id into v_q;
  insert into public.answers (question_id, author_id, body, status, seed_helpful, helpful_count, created_at) values
    (v_q, v_user, 'Ask questions you''re actually curious about. People can tell the difference, and it stops feeling fake once you care about the answer.', 'published', 37, 37, now() - interval '475 hours'),
    (v_q, v_user, 'I treat it like a warm-up, not the main event. Small talk is just the door; nobody expects it to be deep.', 'published', 9, 9, now() - interval '472 hours'),
    (v_q, v_user, 'Have two or three go-to questions ready, like "what''s keeping you busy lately?" It takes the pressure off.', 'published', 38, 38, now() - interval '469 hours');
  update public.questions set helped_answer_id = (select id from public.answers where question_id = v_q order by helpful_count desc limit 1) where id = v_q;
  insert into public.questions (author_id, title, body, category, status, created_at)
  values (v_user, 'How much should you have saved before quitting a job?', 'I hate my job but I''m scared to leave without something lined up.', 'money', 'published', now() - interval '461 hours 17 minutes')
  returning id into v_q;
  insert into public.answers (question_id, author_id, body, status, seed_helpful, helpful_count, created_at) values
    (v_q, v_user, 'The usual advice is three to six months of expenses. If that''s impossible, start applying while you''re still employed.', 'published', 15, 15, now() - interval '459 hours'),
    (v_q, v_user, 'I left with two months saved and it was stressful but survivable. Cut every subscription first.', 'published', 23, 23, now() - interval '456 hours'),
    (v_q, v_user, 'Having an offer first beats any savings number. Job hunting while employed is exhausting but much safer.', 'published', 37, 37, now() - interval '453 hours');
  insert into public.questions (author_id, title, body, category, status, created_at)
  values (v_user, 'Is it normal to need nine or ten hours of sleep?', '', 'body', 'published', now() - interval '445 hours 34 minutes')
  returning id into v_q;
  insert into public.answers (question_id, author_id, body, status, seed_helpful, helpful_count, created_at) values
    (v_q, v_user, 'Some people genuinely need more sleep. If you''ve always been like this and feel fine, it''s probably just you.', 'published', 50, 50, now() - interval '443 hours'),
    (v_q, v_user, 'If it''s new or you still wake up exhausted, it''s worth getting bloodwork. Low iron made me sleep forever.', 'published', 16, 16, now() - interval '440 hours'),
    (v_q, v_user, 'I''m a ten-hour person too. I stopped fighting it and planned my evenings around it, and life got easier.', 'published', 21, 21, now() - interval '437 hours');
  insert into public.questions (author_id, title, body, category, status, created_at)
  values (v_user, 'How do you know when it''s time to end a long friendship?', '', 'relationships', 'published', now() - interval '429 hours 51 minutes')
  returning id into v_q;
  insert into public.answers (question_id, author_id, body, status, seed_helpful, helpful_count, created_at) values
    (v_q, v_user, 'When you feel relief instead of sadness after they cancel plans, that''s usually your answer.', 'published', 36, 36, now() - interval '427 hours'),
    (v_q, v_user, 'Friendships can fade without a big ending. You don''t always need a conversation; sometimes you just let it drift.', 'published', 29, 29, now() - interval '424 hours'),
    (v_q, v_user, 'Try one honest conversation first. Some of my best friendships survived because someone finally said something.', 'published', 44, 44, now() - interval '421 hours'),
    (v_q, v_user, 'If you leave every hangout feeling smaller, you''re allowed to step back.', 'published', 16, 16, now() - interval '418 hours');
  update public.questions set helped_answer_id = (select id from public.answers where question_id = v_q order by helpful_count desc limit 1) where id = v_q;
  insert into public.questions (author_id, title, body, category, status, created_at)
  values (v_user, 'Is it normal to replay conversations in your head for days?', '', 'behavior', 'published', now() - interval '413 hours 8 minutes')
  returning id into v_q;
  insert into public.answers (question_id, author_id, body, status, seed_helpful, helpful_count, created_at) values
    (v_q, v_user, 'Extremely normal. Most people are too busy worrying about what they said to analyze what you said.', 'published', 11, 11, now() - interval '411 hours'),
    (v_q, v_user, 'It helped me to ask: will anyone remember this in a week? Almost always no.', 'published', 3, 3, now() - interval '408 hours'),
    (v_q, v_user, 'If it''s every conversation and it''s draining you, talking to a therapist about anxiety really helped me.', 'published', 8, 8, now() - interval '405 hours');
  insert into public.questions (author_id, title, body, category, status, created_at)
  values (v_user, 'How do you say no to your boss without seeming lazy?', '', 'work', 'published', now() - interval '397 hours 25 minutes')
  returning id into v_q;
  insert into public.answers (question_id, author_id, body, status, seed_helpful, helpful_count, created_at) values
    (v_q, v_user, 'Don''t say no, say "yes, and here''s what would need to move." It shows you''re prioritizing, not refusing.', 'published', 39, 39, now() - interval '395 hours'),
    (v_q, v_user, 'Give a reason tied to the work, not your feelings. "If I take this, X will be late" lands well.', 'published', 34, 34, now() - interval '392 hours'),
    (v_q, v_user, 'Good managers respect people who protect their workload. Bad ones will push anyway, which tells you something.', 'published', 24, 24, now() - interval '389 hours');
  insert into public.questions (author_id, title, body, category, status, created_at)
  values (v_user, 'How do you deal with parents who compare you to your siblings?', '', 'family', 'published', now() - interval '381 hours 42 minutes')
  returning id into v_q;
  insert into public.answers (question_id, author_id, body, status, seed_helpful, helpful_count, created_at) values
    (v_q, v_user, 'I finally said "that comparison really hurts" in a calm moment. They genuinely hadn''t noticed how often they did it.', 'published', 48, 48, now() - interval '379 hours'),
    (v_q, v_user, 'Change the subject every time. It sounds simple, but they eventually stopped when it never went anywhere.', 'published', 8, 8, now() - interval '376 hours'),
    (v_q, v_user, 'Remember it says more about their worries than about you.', 'published', 33, 33, now() - interval '373 hours');
  update public.questions set helped_answer_id = (select id from public.answers where question_id = v_q order by helpful_count desc limit 1) where id = v_q;
  insert into public.questions (author_id, title, body, category, status, created_at)
  values (v_user, 'Is it bad that I don''t understand how taxes work at 28?', '', 'money', 'published', now() - interval '365 hours 59 minutes')
  returning id into v_q;
  insert into public.answers (question_id, author_id, body, status, seed_helpful, helpful_count, created_at) values
    (v_q, v_user, 'Not at all. Nobody teaches this. Spend one evening with a beginner guide and you''ll be ahead of most people.', 'published', 35, 35, now() - interval '363 hours'),
    (v_q, v_user, 'Most people just use software or pay someone. Understanding the basics is enough.', 'published', 19, 19, now() - interval '360 hours'),
    (v_q, v_user, 'I learned at 31. You''re not behind, you''re asking, which is the first step.', 'published', 22, 22, now() - interval '357 hours');
  insert into public.questions (author_id, title, body, category, status, created_at)
  values (v_user, 'Is it rude to leave a party without saying goodbye?', '', 'social', 'published', now() - interval '349 hours 16 minutes')
  returning id into v_q;
  insert into public.answers (question_id, author_id, body, status, seed_helpful, helpful_count, created_at) values
    (v_q, v_user, 'The quiet exit is totally normal at bigger parties. Just thank the host by text later.', 'published', 57, 57, now() - interval '347 hours'),
    (v_q, v_user, 'At small gatherings, say bye to the host at least. At big ones nobody notices.', 'published', 24, 24, now() - interval '344 hours'),
    (v_q, v_user, 'I do the "I''m heading out" wave and leave. Nobody has ever been offended.', 'published', 45, 45, now() - interval '341 hours');
  insert into public.questions (author_id, title, body, category, status, created_at)
  values (v_user, 'How do you stop feeling self-conscious at the gym?', '', 'body', 'published', now() - interval '333 hours 33 minutes')
  returning id into v_q;
  insert into public.answers (question_id, author_id, body, status, seed_helpful, helpful_count, created_at) values
    (v_q, v_user, 'Everyone is looking at themselves in the mirror, not at you. I promise.', 'published', 27, 27, now() - interval '331 hours'),
    (v_q, v_user, 'Go at quiet times for the first few weeks and follow a simple written plan, so you''re never wandering around.', 'published', 30, 30, now() - interval '328 hours'),
    (v_q, v_user, 'Headphones and a plan. Once you know what you''re doing next, the self-consciousness fades.', 'published', 6, 6, now() - interval '325 hours');
  update public.questions set helped_answer_id = (select id from public.answers where question_id = v_q order by helpful_count desc limit 1) where id = v_q;
  insert into public.questions (author_id, title, body, category, status, created_at)
  values (v_user, 'How do you stop being the one who always texts first?', '', 'relationships', 'published', now() - interval '317 hours 50 minutes')
  returning id into v_q;
  insert into public.answers (question_id, author_id, body, status, seed_helpful, helpful_count, created_at) values
    (v_q, v_user, 'Try waiting a week. It''s painful, but you''ll learn who reaches out on their own.', 'published', 52, 52, now() - interval '315 hours'),
    (v_q, v_user, 'Some people are just bad texters but great friends in person. Look at how they act when you''re together.', 'published', 25, 25, now() - interval '312 hours'),
    (v_q, v_user, 'I stopped keeping score and only texted when I genuinely wanted to. It made me less resentful.', 'published', 27, 27, now() - interval '309 hours');
  insert into public.questions (author_id, title, body, category, status, created_at)
  values (v_user, 'Why do I procrastinate on things I actually want to do?', '', 'behavior', 'published', now() - interval '301 hours 7 minutes')
  returning id into v_q;
  insert into public.answers (question_id, author_id, body, status, seed_helpful, helpful_count, created_at) values
    (v_q, v_user, 'Often it''s fear of doing it badly. Lowering the bar ("I''ll just do ten minutes") helps a lot.', 'published', 33, 33, now() - interval '299 hours'),
    (v_q, v_user, 'Wanting something a lot makes it feel high-stakes. Make the first step embarrassingly small.', 'published', 7, 7, now() - interval '296 hours'),
    (v_q, v_user, 'It''s usually not laziness. Being kind to yourself works better than guilt.', 'published', 39, 39, now() - interval '293 hours');
  insert into public.questions (author_id, title, body, category, status, created_at)
  values (v_user, 'Is it okay to pray even if you''re not sure you believe?', '', 'religion', 'published', now() - interval '285 hours 24 minutes')
  returning id into v_q;
  insert into public.answers (question_id, author_id, body, status, seed_helpful, helpful_count, created_at) values
    (v_q, v_user, 'A lot of people do. Prayer can be about reflection and hope, not certainty.', 'published', 48, 48, now() - interval '283 hours'),
    (v_q, v_user, 'I do it sometimes. It calms me down, and I don''t think it has to mean more than that.', 'published', 35, 35, now() - interval '280 hours'),
    (v_q, v_user, 'Doubt and faith often live together. Many religious people would say questioning is part of it.', 'published', 22, 22, now() - interval '277 hours');
  update public.questions set helped_answer_id = (select id from public.answers where question_id = v_q order by helpful_count desc limit 1) where id = v_q;
  insert into public.questions (author_id, title, body, category, status, created_at)
  values (v_user, 'How do you know if you''re underpaid?', '', 'work', 'published', now() - interval '269 hours 41 minutes')
  returning id into v_q;
  insert into public.answers (question_id, author_id, body, status, seed_helpful, helpful_count, created_at) values
    (v_q, v_user, 'Look up salary ranges for your role and city on a few sites, and ask friends in the field. People share more than you''d think.', 'published', 14, 14, now() - interval '267 hours'),
    (v_q, v_user, 'If recruiters keep contacting you with higher numbers, that''s your answer.', 'published', 0, 0, now() - interval '264 hours'),
    (v_q, v_user, 'Ask a coworker you trust. Talking about pay feels awkward, but it mostly helps employees.', 'published', 38, 38, now() - interval '261 hours');
  insert into public.questions (author_id, title, body, category, status, created_at)
  values (v_user, 'Is it normal to feel relieved when family visits end?', '', 'family', 'published', now() - interval '253 hours 58 minutes')
  returning id into v_q;
  insert into public.answers (question_id, author_id, body, status, seed_helpful, helpful_count, created_at) values
    (v_q, v_user, 'Completely normal. You can love people and still find their visits exhausting.', 'published', 10, 10, now() - interval '251 hours'),
    (v_q, v_user, 'I feel guilty every time and then remember everyone feels this. Shorter visits helped.', 'published', 25, 25, now() - interval '248 hours'),
    (v_q, v_user, 'Relief doesn''t mean you don''t love them. It means you were holding yourself together the whole time.', 'published', 39, 39, now() - interval '245 hours');
  insert into public.questions (author_id, title, body, category, status, created_at)
  values (v_user, 'How do you make a phone call when you have phone anxiety?', '', 'other', 'published', now() - interval '237 hours 15 minutes')
  returning id into v_q;
  insert into public.answers (question_id, author_id, body, status, seed_helpful, helpful_count, created_at) values
    (v_q, v_user, 'Write down the first sentence word for word. Once you''ve started, the rest flows.', 'published', 31, 31, now() - interval '235 hours'),
    (v_q, v_user, 'Remind yourself the person on the other end does this all day and won''t think about you afterwards.', 'published', 31, 31, now() - interval '232 hours'),
    (v_q, v_user, 'Book online whenever possible, but make one small call a week to get used to it.', 'published', 13, 13, now() - interval '229 hours');
  update public.questions set helped_answer_id = (select id from public.answers where question_id = v_q order by helpful_count desc limit 1) where id = v_q;
  insert into public.questions (author_id, title, body, category, status, created_at)
  values (v_user, 'Is it weird to have never been in a relationship at 25?', '', 'relationships', 'published', now() - interval '221 hours 32 minutes')
  returning id into v_q;
  insert into public.answers (question_id, author_id, body, status, seed_helpful, helpful_count, created_at) values
    (v_q, v_user, 'Not at all. Plenty of people start dating later. It doesn''t mean anything is wrong with you.', 'published', 41, 41, now() - interval '219 hours'),
    (v_q, v_user, 'I had my first relationship at 27 and nobody cared about the timeline except me.', 'published', 7, 7, now() - interval '216 hours'),
    (v_q, v_user, 'Being picky or busy or shy are all normal reasons. Your timeline is yours.', 'published', 19, 19, now() - interval '213 hours');
  insert into public.questions (author_id, title, body, category, status, created_at)
  values (v_user, 'How do you stop impulse buying online?', '', 'money', 'published', now() - interval '205 hours 49 minutes')
  returning id into v_q;
  insert into public.answers (question_id, author_id, body, status, seed_helpful, helpful_count, created_at) values
    (v_q, v_user, 'Leave things in your cart for 48 hours. Most of the time you won''t want it anymore.', 'published', 22, 22, now() - interval '203 hours'),
    (v_q, v_user, 'Delete saved card details. The extra friction stops a lot of purchases.', 'published', 17, 17, now() - interval '200 hours'),
    (v_q, v_user, 'Unsubscribe from shop emails. Out of sight really does help.', 'published', 7, 7, now() - interval '197 hours');
  insert into public.questions (author_id, title, body, category, status, created_at)
  values (v_user, 'Is it normal to not have a passion?', '', 'behavior', 'published', now() - interval '189 hours 6 minutes')
  returning id into v_q;
  insert into public.answers (question_id, author_id, body, status, seed_helpful, helpful_count, created_at) values
    (v_q, v_user, 'Yes. Lots of people have interests that come and go, and that''s a perfectly good life.', 'published', 25, 25, now() - interval '187 hours'),
    (v_q, v_user, 'Passion often comes after you start doing something, not before. Try things without pressure.', 'published', 1, 1, now() - interval '184 hours'),
    (v_q, v_user, 'I don''t have one big passion and I''m happy. Being curious about many things counts.', 'published', 38, 38, now() - interval '181 hours');
  update public.questions set helped_answer_id = (select id from public.answers where question_id = v_q order by helpful_count desc limit 1) where id = v_q;
  insert into public.questions (author_id, title, body, category, status, created_at)
  values (v_user, 'Is it normal to still get acne in your thirties?', '', 'body', 'published', now() - interval '173 hours 23 minutes')
  returning id into v_q;
  insert into public.answers (question_id, author_id, body, status, seed_helpful, helpful_count, created_at) values
    (v_q, v_user, 'Very normal. Adult acne is common, especially around hormones and stress.', 'published', 45, 45, now() - interval '171 hours'),
    (v_q, v_user, 'A dermatologist changed everything for me. Don''t wait as long as I did.', 'published', 6, 6, now() - interval '168 hours'),
    (v_q, v_user, 'Same here at 34. Simple routines and patience helped more than expensive products.', 'published', 11, 11, now() - interval '165 hours');
  insert into public.questions (author_id, title, body, category, status, created_at)
  values (v_user, 'How do you make friends at a new job when you''re shy?', '', 'social', 'published', now() - interval '157 hours 40 minutes')
  returning id into v_q;
  insert into public.answers (question_id, author_id, body, status, seed_helpful, helpful_count, created_at) values
    (v_q, v_user, 'Say yes to lunch invites even when you''d rather not. A few of those go a long way.', 'published', 35, 35, now() - interval '155 hours'),
    (v_q, v_user, 'Ask people for small bits of help. It''s an easy way to start talking.', 'published', 28, 28, now() - interval '152 hours'),
    (v_q, v_user, 'Find the one other quiet person. That''s how I met my best work friend.', 'published', 17, 17, now() - interval '149 hours');
  insert into public.questions (author_id, title, body, category, status, created_at)
  values (v_user, 'Is it okay to cry at work?', '', 'work', 'published', now() - interval '141 hours 57 minutes')
  returning id into v_q;
  insert into public.answers (question_id, author_id, body, status, seed_helpful, helpful_count, created_at) values
    (v_q, v_user, 'It happens to more people than you think. Take a short break and don''t beat yourself up.', 'published', 58, 58, now() - interval '139 hours'),
    (v_q, v_user, 'I cried in a meeting once and my manager was kind about it. Most people are.', 'published', 34, 34, now() - interval '136 hours'),
    (v_q, v_user, 'It''s human. If it''s happening a lot, it might be a sign the job is too much right now.', 'published', 24, 24, now() - interval '133 hours');
  update public.questions set helped_answer_id = (select id from public.answers where question_id = v_q order by helpful_count desc limit 1) where id = v_q;
  insert into public.questions (author_id, title, body, category, status, created_at)
  values (v_user, 'How do you tell your parents you''re moving far away?', '', 'family', 'published', now() - interval '125 hours 14 minutes')
  returning id into v_q;
  insert into public.answers (question_id, author_id, body, status, seed_helpful, helpful_count, created_at) values
    (v_q, v_user, 'Tell them early and calmly, with your reasons and a plan to stay in touch.', 'published', 14, 14, now() - interval '123 hours'),
    (v_q, v_user, 'Expect a sad reaction at first and give them time. Mine came around within weeks.', 'published', 5, 5, now() - interval '120 hours'),
    (v_q, v_user, 'Plan your first visit home before you even go. It reassured my parents a lot.', 'published', 45, 45, now() - interval '117 hours');
  insert into public.questions (author_id, title, body, category, status, created_at)
  values (v_user, 'How do you get over someone you never actually dated?', '', 'relationships', 'published', now() - interval '109 hours 31 minutes')
  returning id into v_q;
  insert into public.answers (question_id, author_id, body, status, seed_helpful, helpful_count, created_at) values
    (v_q, v_user, 'Let yourself grieve it. It''s a real loss even if nothing happened.', 'published', 50, 50, now() - interval '107 hours'),
    (v_q, v_user, 'Mute them for a while. Seeing their posts keeps the hope alive.', 'published', 39, 39, now() - interval '104 hours'),
    (v_q, v_user, 'Fill the time you spent thinking about them with something for yourself. It gets easier.', 'published', 22, 22, now() - interval '101 hours');
  insert into public.questions (author_id, title, body, category, status, created_at)
  values (v_user, 'Is it weird that I enjoy eating alone at restaurants?', '', 'behavior', 'published', now() - interval '93 hours 48 minutes')
  returning id into v_q;
  insert into public.answers (question_id, author_id, body, status, seed_helpful, helpful_count, created_at) values
    (v_q, v_user, 'Not weird at all. Solo dinners are underrated.', 'published', 28, 28, now() - interval '91 hours'),
    (v_q, v_user, 'I take a book and order dessert. It''s one of my favourite things.', 'published', 41, 41, now() - interval '88 hours'),
    (v_q, v_user, 'Nobody is looking at you as much as you think. Enjoy it.', 'published', 6, 6, now() - interval '85 hours');
  update public.questions set helped_answer_id = (select id from public.answers where question_id = v_q order by helpful_count desc limit 1) where id = v_q;
  insert into public.questions (author_id, title, body, category, status, created_at)
  values (v_user, 'How do adults make time for hobbies?', '', 'other', 'published', now() - interval '77 hours 5 minutes')
  returning id into v_q;
  insert into public.answers (question_id, author_id, body, status, seed_helpful, helpful_count, created_at) values
    (v_q, v_user, 'Put it in the calendar like a meeting. Otherwise it never happens.', 'published', 14, 14, now() - interval '75 hours'),
    (v_q, v_user, 'Start with 20 minutes. Small and regular beats big and rare.', 'published', 24, 24, now() - interval '72 hours'),
    (v_q, v_user, 'I swapped one evening of scrolling for a hobby night. It felt like gaining time.', 'published', 35, 35, now() - interval '69 hours');
  insert into public.questions (author_id, title, body, category, status, created_at)
  values (v_user, 'Is it normal to feel guilty spending money on yourself?', '', 'money', 'published', now() - interval '61 hours 22 minutes')
  returning id into v_q;
  insert into public.answers (question_id, author_id, body, status, seed_helpful, helpful_count, created_at) values
    (v_q, v_user, 'Very common, especially if money was tight growing up.', 'published', 39, 39, now() - interval '59 hours'),
    (v_q, v_user, 'I give myself a small "no guilt" budget each month. It helped a lot.', 'published', 28, 28, now() - interval '56 hours'),
    (v_q, v_user, 'Spending on yourself within your means is responsible, not selfish.', 'published', 10, 10, now() - interval '53 hours');
  insert into public.questions (author_id, title, body, category, status, created_at)
  values (v_user, 'How do you date someone with different beliefs?', '', 'religion', 'published', now() - interval '45 hours 39 minutes')
  returning id into v_q;
  insert into public.answers (question_id, author_id, body, status, seed_helpful, helpful_count, created_at) values
    (v_q, v_user, 'Talk about the big things early: holidays, family expectations, kids.', 'published', 22, 22, now() - interval '43 hours'),
    (v_q, v_user, 'Respect matters more than agreement. My partner and I disagree and it works.', 'published', 40, 40, now() - interval '40 hours'),
    (v_q, v_user, 'Be honest about what you can and can''t compromise on.', 'published', 2, 2, now() - interval '37 hours');
  update public.questions set helped_answer_id = (select id from public.answers where question_id = v_q order by helpful_count desc limit 1) where id = v_q;
  insert into public.questions (author_id, title, body, category, status, created_at)
  values (v_user, 'How do you start eating healthier without strict diets?', '', 'body', 'published', now() - interval '29 hours 56 minutes')
  returning id into v_q;
  insert into public.answers (question_id, author_id, body, status, seed_helpful, helpful_count, created_at) values
    (v_q, v_user, 'Add things instead of cutting things. More vegetables, more water, more protein.', 'published', 17, 17, now() - interval '27 hours'),
    (v_q, v_user, 'Make one small change at a time and keep it for a month before adding another.', 'published', 24, 24, now() - interval '24 hours'),
    (v_q, v_user, 'Cook a few simple meals you actually enjoy. That beats any diet plan.', 'published', 31, 31, now() - interval '21 hours');
  insert into public.questions (author_id, title, body, category, status, created_at)
  values (v_user, 'Why do I feel lonely even with friends around?', '', 'social', 'published', now() - interval '13 hours 13 minutes')
  returning id into v_q;
  insert into public.answers (question_id, author_id, body, status, seed_helpful, helpful_count, created_at) values
    (v_q, v_user, 'Loneliness is often about feeling understood, not about how many people are around.', 'published', 36, 36, now() - interval '11 hours'),
    (v_q, v_user, 'Try one deeper conversation with one person. It helped me more than more plans.', 'published', 32, 32, now() - interval '8 hours'),
    (v_q, v_user, 'You''re not alone in feeling this. It''s one of the most common things people admit here.', 'published', 26, 26, now() - interval '5 hours');
  insert into public.secrets (author_id, body, status, local_day, created_at)
  values (v_user, 'I''ve never told anyone that I''m afraid of the dark at thirty.', 'published', (now() - interval '469 hours')::date, now() - interval '469 hours 0 minutes');
  insert into public.secrets (author_id, body, status, local_day, created_at)
  values (v_user, 'I pretend I''ve read books I''ve only seen the movie of.', 'published', (now() - interval '453 hours')::date, now() - interval '453 hours 29 minutes');
  insert into public.secrets (author_id, body, status, local_day, created_at)
  values (v_user, 'I still have my childhood teddy bear and sleep with it when I''m sad.', 'published', (now() - interval '437 hours')::date, now() - interval '437 hours 58 minutes');
  insert into public.secrets (author_id, body, status, local_day, created_at)
  values (v_user, 'I applied to my dream job three times and never told anyone I was rejected.', 'published', (now() - interval '421 hours')::date, now() - interval '421 hours 27 minutes');
  insert into public.secrets (author_id, body, status, local_day, created_at)
  values (v_user, 'I once cried in a supermarket because they stopped selling my late dad''s favourite biscuits.', 'published', (now() - interval '405 hours')::date, now() - interval '405 hours 56 minutes');
  insert into public.secrets (author_id, body, status, local_day, created_at)
  values (v_user, 'I eat dinner standing up in the kitchen most nights because sitting alone at a table feels lonely.', 'published', (now() - interval '389 hours')::date, now() - interval '389 hours 25 minutes');
  insert into public.secrets (author_id, body, status, local_day, created_at)
  values (v_user, 'I haven''t spoken to my brother in two years and I don''t even remember why it started.', 'published', (now() - interval '373 hours')::date, now() - interval '373 hours 54 minutes');
  insert into public.secrets (author_id, body, status, local_day, created_at)
  values (v_user, 'I write poems in my phone notes and have never shown them to anyone.', 'published', (now() - interval '357 hours')::date, now() - interval '357 hours 23 minutes');
  insert into public.secrets (author_id, body, status, local_day, created_at)
  values (v_user, 'I''m secretly proud of a song I wrote years ago, but I''m too embarrassed to play it for anyone.', 'published', (now() - interval '341 hours')::date, now() - interval '341 hours 52 minutes');
  insert into public.secrets (author_id, body, status, local_day, created_at)
  values (v_user, 'I''ve pretended to be on a phone call to avoid talking to a neighbour more times than I can count.', 'published', (now() - interval '325 hours')::date, now() - interval '325 hours 21 minutes');
  insert into public.secrets (author_id, body, status, local_day, created_at)
  values (v_user, 'I still feel guilty about something I said to a friend in school fifteen years ago.', 'published', (now() - interval '309 hours')::date, now() - interval '309 hours 50 minutes');
  insert into public.secrets (author_id, body, status, local_day, created_at)
  values (v_user, 'I listen to the same song on repeat for hours when I''m anxious.', 'published', (now() - interval '293 hours')::date, now() - interval '293 hours 19 minutes');
  insert into public.secrets (author_id, body, status, local_day, created_at)
  values (v_user, 'I sometimes go to the cinema alone just to sit somewhere dark and quiet.', 'published', (now() - interval '277 hours')::date, now() - interval '277 hours 48 minutes');
  insert into public.secrets (author_id, body, status, local_day, created_at)
  values (v_user, 'I''m scared that I''m becoming exactly like my parents in the ways I promised I wouldn''t.', 'published', (now() - interval '261 hours')::date, now() - interval '261 hours 17 minutes');
  insert into public.secrets (author_id, body, status, local_day, created_at)
  values (v_user, 'I saved a stranger''s dog from traffic once and never told anyone because it felt like bragging.', 'published', (now() - interval '245 hours')::date, now() - interval '245 hours 46 minutes');
  insert into public.secrets (author_id, body, status, local_day, created_at)
  values (v_user, 'I keep a list of every kind thing a stranger has ever done for me.', 'published', (now() - interval '229 hours')::date, now() - interval '229 hours 15 minutes');
  insert into public.secrets (author_id, body, status, local_day, created_at)
  values (v_user, 'I still don''t know how to ride a bike and I''ve hidden it my whole life.', 'published', (now() - interval '213 hours')::date, now() - interval '213 hours 44 minutes');
  insert into public.secrets (author_id, body, status, local_day, created_at)
  values (v_user, 'I miss the person I was before my last relationship.', 'published', (now() - interval '197 hours')::date, now() - interval '197 hours 13 minutes');
  insert into public.secrets (author_id, body, status, local_day, created_at)
  values (v_user, 'I sing in the car with the windows up like I''m performing to a stadium.', 'published', (now() - interval '181 hours')::date, now() - interval '181 hours 42 minutes');
  insert into public.secrets (author_id, body, status, local_day, created_at)
  values (v_user, 'I''ve started over in a new city twice and both times I told people it was for work.', 'published', (now() - interval '165 hours')::date, now() - interval '165 hours 11 minutes');
  insert into public.secrets (author_id, body, status, local_day, created_at)
  values (v_user, 'I learned to cook properly only because I wanted to impress someone who left.', 'published', (now() - interval '149 hours')::date, now() - interval '149 hours 40 minutes');
  insert into public.secrets (author_id, body, status, local_day, created_at)
  values (v_user, 'I sleep with socks on in summer and I''ll never admit it to my partner.', 'published', (now() - interval '133 hours')::date, now() - interval '133 hours 9 minutes');
  insert into public.secrets (author_id, body, status, local_day, created_at)
  values (v_user, 'I''m terrified that I''ll never feel like a real adult.', 'published', (now() - interval '117 hours')::date, now() - interval '117 hours 38 minutes');
  insert into public.secrets (author_id, body, status, local_day, created_at)
  values (v_user, 'I secretly love when it rains because it means I don''t have to make plans.', 'published', (now() - interval '101 hours')::date, now() - interval '101 hours 7 minutes');
  insert into public.secrets (author_id, body, status, local_day, created_at)
  values (v_user, 'I wrote a letter to my younger self and cried reading it back.', 'published', (now() - interval '85 hours')::date, now() - interval '85 hours 36 minutes');
  insert into public.secrets (author_id, body, status, local_day, created_at)
  values (v_user, 'I''ve been learning a language for a year so I can talk to my grandmother in her first language.', 'published', (now() - interval '69 hours')::date, now() - interval '69 hours 5 minutes');
  insert into public.secrets (author_id, body, status, local_day, created_at)
  values (v_user, 'I sometimes reread old birthday messages to remind myself people care.', 'published', (now() - interval '53 hours')::date, now() - interval '53 hours 34 minutes');
  insert into public.secrets (author_id, body, status, local_day, created_at)
  values (v_user, 'I pretend to be confident at work, then decompress in my car for ten minutes every evening.', 'published', (now() - interval '37 hours')::date, now() - interval '37 hours 3 minutes');
  insert into public.secrets (author_id, body, status, local_day, created_at)
  values (v_user, 'I gave up on a dream because I was scared of failing, and I think about it every day.', 'published', (now() - interval '21 hours')::date, now() - interval '21 hours 32 minutes');
  insert into public.secrets (author_id, body, status, local_day, created_at)
  values (v_user, 'I talk to my late grandfather out loud when I''m walking home.', 'published', (now() - interval '5 hours')::date, now() - interval '5 hours 1 minutes');

  -- Starting votes for every launch thought: 40-260 voters, 20-95% "me too".
  update public.thought_tallies tt
     set me_too = tt.me_too + v.yes,
         not_me = tt.not_me + (v.total - v.yes)
  from (
    select t.id, r.total, round(r.total * r.share)::integer as yes
    from public.thoughts t
    cross join lateral (
      select 40 + floor(random() * 221)::integer as total,
             0.2 + random() * 0.75 + (case when t.id is null then 1 else 0 end) as share
    ) r
    where t.author_id = v_user
  ) v
  where tt.thought_id = v.id;

  -- Launch content shouldn't count as real activity on the dashboard.
  delete from public.activity where user_id = v_user;
end
$seed$;
