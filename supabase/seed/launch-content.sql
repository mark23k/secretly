-- =============================================================================
-- Seed content so Secretly doesn't look empty at launch: one account with
-- 30 thoughts, 30 questions and 30 secrets, spread over the last ~3 weeks.
-- The account's password is random and never stored anywhere, so nobody can
-- sign in as it. Safe to run more than once (does nothing if it exists).
--
-- Remove everything it created with:
--   delete from auth.users where id = '5eed0000-0000-4000-8000-64d27f3e2ab9';
-- =============================================================================
do $seed$
declare
  v_user uuid := '5eed0000-0000-4000-8000-64d27f3e2ab9';
begin
  if exists (select 1 from auth.users where id = v_user) then
    raise notice 'Seed account already exists; nothing to do.';
    return;
  end if;

  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, recovery_token, email_change, email_change_token_new
  ) values (
    v_user, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
    'quiet-6uwgbo@example.com', extensions.crypt(encode(extensions.gen_random_bytes(24), 'base64'), extensions.gen_salt('bf')), now() - interval '22 days',
    '{"provider":"email","providers":["email"]}', '{"time_zone":"UTC"}',
    now() - interval '22 days', now() - interval '22 days', '', '', '', ''
  );

  insert into auth.identities (id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at)
  values (gen_random_uuid(), v_user, v_user::text, 'email',
          jsonb_build_object('sub', v_user::text, 'email', 'quiet-6uwgbo@example.com', 'email_verified', true),
          now(), now() - interval '22 days', now() - interval '22 days');

  -- Spread posts over the last 21 days, newest last in each list.
  insert into public.thoughts (author_id, body, category, status, created_at)
  select v_user, t.body, t.category, 'published',
         now() - make_interval(hours => (29 - t.n) * 16 + 3, mins => (t.n * 37) % 60)
  from (values
    ('I pretend I didn''t see messages because I don''t have the energy to reply, even to people I really love.', 'relationships'::thought_category, 0),
    ('I rehearse ordinary phone calls in my head for ten minutes before I make them.', 'social'::thought_category, 1),
    ('I feel relieved when plans get cancelled, even plans I was genuinely looking forward to.', 'feelings'::thought_category, 2),
    ('I practice arguments in the shower that will never actually happen.', 'habits'::thought_category, 3),
    ('When someone says my name in a crowd, I assume I''m in trouble before I even turn around.', 'social'::thought_category, 4),
    ('I''ve been at my job for two years and I still feel like someone is about to find out I don''t know what I''m doing.', 'work'::thought_category, 5),
    ('I reread old conversations with people I don''t talk to anymore just to feel close to them again.', 'relationships'::thought_category, 6),
    ('I walk the long way around so I don''t have to pass people I vaguely know.', 'habits'::thought_category, 7),
    ('Sometimes I miss a version of my life that never actually existed.', 'feelings'::thought_category, 8),
    ('I stand in front of the fridge with the door open, knowing exactly what''s in it, waiting for something new to appear.', 'body'::thought_category, 9),
    ('I laugh at jokes I didn''t hear because asking someone to repeat themselves feels worse.', 'social'::thought_category, 10),
    ('On the bus I imagine scenarios where something goes wrong and I''m the one who saves everyone.', 'other'::thought_category, 11),
    ('I keep a document of compliments people have given me at work and read it on bad days.', 'work'::thought_category, 12),
    ('I''m closer to some people over text than I''ll ever be with them in person.', 'relationships'::thought_category, 13),
    ('I put my phone on silent and then check it every two minutes anyway.', 'habits'::thought_category, 14),
    ('I get sad on Sunday evenings for no reason I can explain.', 'feelings'::thought_category, 15),
    ('I''ve said "you too" when a waiter told me to enjoy my meal, and I still think about it.', 'social'::thought_category, 16),
    ('I think I''m more tired from pretending to be fine than from anything I actually do.', 'body'::thought_category, 17),
    ('I name the birds and squirrels I see every day and get worried when one stops showing up.', 'other'::thought_category, 18),
    ('I''m happiest when I''m needed, and I''m not sure that''s healthy.', 'relationships'::thought_category, 19),
    ('I schedule fake "focus time" in my calendar just to have an hour where nobody can book me.', 'work'::thought_category, 20),
    ('I start new notebooks constantly and never get past the third page.', 'habits'::thought_category, 21),
    ('I feel lonely even when I''m surrounded by people who love me.', 'feelings'::thought_category, 22),
    ('I keep a mental list of things I''ll say if I ever bump into someone from school.', 'social'::thought_category, 23),
    ('I still sleep with the closet door closed, just in case.', 'other'::thought_category, 24),
    ('I check the lock on the front door, walk away, and come back to check it again.', 'body'::thought_category, 25),
    ('I''ve never told my parents I''m proud of them because it feels too awkward to say out loud.', 'relationships'::thought_category, 26),
    ('I feel guilty taking a sick day even when I''m actually sick.', 'work'::thought_category, 27),
    ('I get nostalgic for moments while they''re still happening.', 'feelings'::thought_category, 28),
    ('I replay embarrassing things I said years ago right before falling asleep.', 'habits'::thought_category, 29)
  ) as t(body, category, n);

  insert into public.questions (author_id, title, body, category, status, created_at)
  select v_user, q.title, q.body, q.category, 'published',
         now() - make_interval(hours => (29 - q.n) * 16 + 7, mins => (q.n * 23) % 60)
  from (values
    ('How do you know if someone actually likes you or is just being nice?', 'We talk almost every day, but I can never tell if it means anything to them.', 'relationships'::question_category, 0),
    ('Is it normal to have almost no savings at 30?', '', 'money'::question_category, 1),
    ('How often are you actually supposed to wash your sheets?', '', 'body'::question_category, 2),
    ('How do you make friends as an adult when everyone already has their group?', 'I moved to a new city a year ago and still eat lunch alone most days.', 'social'::question_category, 3),
    ('Is it weird that I talk to myself out loud when I''m alone?', '', 'behavior'::question_category, 4),
    ('How do you ask for a raise without sounding ungrateful?', '', 'work'::question_category, 5),
    ('How do people afford to go out every weekend? What am I missing?', '', 'money'::question_category, 6),
    ('How do you set boundaries with parents without starting a fight?', 'Every visit turns into comments about my job and who I''m dating.', 'family'::question_category, 7),
    ('How long is it normal to still think about an ex?', 'It''s been over a year and they still pop into my head most days.', 'relationships'::question_category, 8),
    ('Is it normal to feel exhausted all the time even when you sleep eight hours?', '', 'body'::question_category, 9),
    ('What do you say when someone asks "what do you do?" and you''re unemployed?', '', 'social'::question_category, 10),
    ('Is it okay to not know what you believe anymore?', 'I grew up very religious and lately I''m not sure about any of it, but I''m scared to say that to my family.', 'religion'::question_category, 11),
    ('How do I stop apologizing for everything?', '', 'behavior'::question_category, 12),
    ('How do you split the bill fairly when you earn way less than your friends?', '', 'money'::question_category, 13),
    ('Is it bad to leave a job after only six months?', '', 'work'::question_category, 14),
    ('How do you tell a friend they hurt you without losing the friendship?', '', 'relationships'::question_category, 15),
    ('How do I stop comparing my body to everyone online?', '', 'body'::question_category, 16),
    ('How do you leave a conversation politely when it goes on forever?', '', 'social'::question_category, 17),
    ('Is it normal to not feel close to your siblings?', '', 'family'::question_category, 18),
    ('Does everyone feel like an impostor, or is it just me?', '', 'behavior'::question_category, 19),
    ('How do you actually make a phone call to book an appointment without panicking?', '', 'other'::question_category, 20),
    ('What''s a realistic amount to spend on a first date?', '', 'money'::question_category, 21),
    ('Is it a red flag if my partner never wants to meet my friends?', '', 'relationships'::question_category, 22),
    ('How do you deal with a coworker who takes credit for your work?', '', 'work'::question_category, 23),
    ('Is it rude to not reply to a group chat for days?', '', 'social'::question_category, 24),
    ('How do you start going to the gym when you have no idea what you''re doing?', 'I''m scared everyone will be watching and judging.', 'body'::question_category, 25),
    ('How do you respectfully tell religious family members you don''t share their beliefs?', '', 'religion'::question_category, 26),
    ('How do you cope when your parents start getting old?', '', 'family'::question_category, 27),
    ('Is it normal to need a whole day alone after socializing?', '', 'behavior'::question_category, 28),
    ('What''s something everyone pretends to understand but actually doesn''t?', '', 'other'::question_category, 29)
  ) as q(title, body, category, n);

  insert into public.secrets (author_id, body, status, local_day, created_at)
  select v_user, s.body, 'published', (now() - make_interval(hours => (29 - s.n) * 16 + 11))::date,
         now() - make_interval(hours => (29 - s.n) * 16 + 11, mins => (s.n * 13) % 60)
  from (values
    ('I sometimes wish I could start my life over in a city where absolutely nobody knows me.', 0),
    ('I still check the profile of someone I haven''t spoken to in years, just to see if they''re okay.', 1),
    ('I pretend to be busy so people think my life is more exciting than it is.', 2),
    ('I failed my driving test four times and told everyone it was my first try when I passed.', 3),
    ('I''ve never told anyone that I didn''t actually finish my degree.', 4),
    ('I cried at a commercial last week and had to pretend I had something in my eye.', 5),
    ('I keep a voicemail from my grandmother and listen to it when things get hard.', 6),
    ('Sometimes I sit in my car in the driveway for twenty minutes before going inside, just to be alone.', 7),
    ('I''m jealous of my best friend, and I hate that I am.', 8),
    ('I''ve been learning the piano in secret for a year so I can surprise my family.', 9),
    ('I still sleep with a light on when I''m home alone.', 10),
    ('I told my partner I loved a gift they gave me. I''ve never used it once.', 11),
    ('I''m terrified that I peaked in high school.', 12),
    ('I google how to pronounce words right before I have to say them in meetings.', 13),
    ('I quit a job I loved because I was too scared to ask for help.', 14),
    ('I write letters to my future self and never open them.', 15),
    ('I once ate an entire birthday cake by myself on a bad day and never told a soul.', 16),
    ('I miss who I was before my phone was the first thing I looked at every morning.', 17),
    ('I''ve never been on a plane, and I tell people I just don''t like travelling.', 18),
    ('Sometimes I feel more at home in the library than in my own house.', 19),
    ('I forgave someone who never apologized, and it was the best thing I ever did for myself.', 20),
    ('I''m still not over a friendship that ended without any explanation.', 21),
    ('I hum while I work and only realized it when a coworker pointed it out. Now I can''t stop noticing.', 22),
    ('I think I chose my career to make my parents proud, not because I wanted it.', 23),
    ('I practice smiling in the mirror before job interviews.', 24),
    ('I''m afraid that if people knew how much I worry, they''d see me differently.', 25),
    ('I volunteer every weekend and nobody in my life knows about it.', 26),
    ('I keep every birthday card I''ve ever received in a shoebox under my bed.', 27),
    ('I''ve lied about having plans just so nobody would know I spend most weekends alone.', 28),
    ('Some nights I drive around with no destination, just to listen to music and think.', 29)
  ) as s(body, n);

  -- Seed posts shouldn't count as real activity on the dashboard.
  delete from public.activity where user_id = v_user;
end
$seed$;
