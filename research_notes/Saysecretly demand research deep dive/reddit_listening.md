# Reddit social listening: what US Reddit users ask for, complain about and wish existed (primary evidence for saysecretly.com)

**How this was collected, and its limits (read first).**
- Collected 2026-10-27. Reddit's JSON endpoints (`www.reddit.com/...json`) returned **HTTP 403**. `old.reddit.com` JSON returned a **302** redirect. `api.pullpush.io` returned **429** with the message "This website does not provide free scraping resources for agents". The Arctic Shift archive API returned **500** on every query. WebFetch reported that it "is unable to fetch from www.reddit.com". WebSearch with Reddit-focused queries returned vendor pages, not threads.
- The only working route was Reddit's public **Atom/RSS feeds** (`/r/<sub>/search.rss?q=...&restrict_sr=1&t=year` and `/r/<sub>/top/.rss?t=year`), fetched with an honest descriptive User-Agent. They were rate-limited to about **1 request per minute** (`x-ratelimit-remaining: 0`, HTTP 429). Before the coordinator asked me to wrap up, I completed **18 of the ~50 planned feed queries** and **none of the planned comment-thread fetches**.
- **RSS feeds carry no upvote scores and no comment counts.** No score or comment number appears in these notes, because I could not verify any. The one exception is a rough popularity signal: r/SomebodyMakeThis "top of past year" is sorted by score, so its rank order is real even though the scores themselves are not shown.
- I did not read comments. Everything below comes from **original posts only** (title plus body text), dated Oct 2025 to Oct 2026 unless labelled otherwise.
- Sampled feeds and post counts: r/SomebodyMakeThis (top/year 100; searches for anonymous 15, secret 12, feedback 86, gift 9, surprise 12, confession 2, "message later" 4), r/AppIdeas (anonymous 40, secret 11, gift 13, "wish existed" 48), r/Lightbulb (anonymous 12), r/startups ("wish existed" 17), r/Entrepreneur ("tool you wish existed" 12), r/smallbusiness ("wish there was an app" 4), r/confessions ("throwaway" 100). In total, about 450 post entries were read at title and snippet level.
- **Not collected (gaps):** r/offmychest, r/TrueOffMyChest, r/relationship_advice, r/AmItheAsshole, every workplace sub (r/humanresources, r/AskHR, r/managers, r/restaurantowners, r/KitchenConfidential, r/sysadmin), every gifting/occasion sub (r/secretsanta, r/Gifts, r/weddingplanning, r/remotework), r/SaaS, and r/Lightbulb "secret". I hold no primary Reddit evidence for those communities.

## Q1. What do people in idea-request subs (r/SomebodyMakeThis, r/AppIdeas, r/Lightbulb, r/startups, r/Entrepreneur, r/smallbusiness) repeatedly ask for in 2025-2026, especially around anonymity, secrets, surprises, honest feedback, confessions, reveal-later messages and group gifts?

### Takeaway
Anonymity-themed posts recur often, but most are **builders pitching their own app and asking for validation** ("would you use…?"). Posts from people who simply say they want something are much rarer. In the sample, the most frequent anonymity concept was **"anonymous venting or emotional matching with no likes, no audience and nothing permanent"** (about 11 distinct posts). A cluster that comes closer to what saysecretly could do is **"say something to a specific person you can't say directly"**: anonymous reels to a crush, anonymous notes to a car owner, a mutual-reveal app for couples, and a "random friend" pairing. Next to it is **"reveal later / unlock at a set moment"**: trip photos that unlock together, letters to descendants, staged reveal pages for proposals and confessions. Group-gift and Secret Santa requests barely appeared in idea subs. Gifting posts there are mostly about remembering gift ideas and birthdays.

### Cited Findings

**Approximate counts in the sample.** Each post was hand-tagged once. Cross-posts by the same author count once. Because no scores were available, these are counts of posts, not measures of demand.

| Recurring need (Oct 2025 to Oct 2026) | Distinct posts in sample | Requesters vs builders |
|---|---|---|
| Anonymous venting/mood chat; no likes, no audience, ephemeral | ~11 | mostly builders |
| Ephemeral or anti-metric social space (posts vanish, no followers) | ~5 | mixed |
| Anonymous message to a specific person, or saying the unsayable to someone you know | 4 | mostly builders |
| Reveal-later / time-locked / staged-reveal messages | 3 (+1 scheduled-gift) | 2 requesters, 1 builder |
| Anonymous honest feedback (on outfits, workplaces, landlords) | 4 | mixed |
| Anonymous workplace venting or reviews | 2 | builders or idea-havers |
| Gift memory, birthday reminders, scheduling gifts | 4 (+2 cross-posts) | builders |
| Group money pot with anonymous voting | 1 | idea-haver |
| Secret Santa / group cards / collecting money for group gifts | 0 found in idea subs | n/a |

**1. Anonymous venting with no audience and no judgment (most frequent anonymity theme)**
- "Sometimes you just want to say things out loud — opinions, complaints, stress, secrets, random thoughts — almost like a private 'confession', but you don't actually want a forum, debate, or anyone replying/judging you." The post proposes "Fully anonymous, no login… When you close/delete the session: raw chat is gone", plus a public page showing only aggregated themes. (2026-02-05) — [r/SomebodyMakeThis 1qwzewa](https://www.reddit.com/r/SomebodyMakeThis/comments/1qwzewa/idea_for_appweb_free_chat_with_ai_a_public_page/)
- "an anonymous venting/journaling platform designed to let people share problems or emotions without any fear of judgment or unwanted advice… No accounts, no usernames… No likes or ratings… Controlled feedback: … 'no comments', 'support only', 'advice okay', 'jokes welcome'" (2026-01-27; the same author posted it twice) — [r/AppIdeas 1qod7ke](https://www.reddit.com/r/AppIdeas/comments/1qod7ke/validation_of_an_idea_for_a_mobile_app/)
- "some people are not able to vent out their anger or tell or say someething in public" (2026-02-10) — [r/AppIdeas 1r0xlt0](https://www.reddit.com/r/AppIdeas/comments/1r0xlt0/anonymous_chatting_application/)
- "I want an app where I tap 'Anxious' and I get matched anonymously with someone else who is 'Anxious.' No profiles. No feed." (2026-01-02; also posted to r/Lightbulb [1q23fvr](https://www.reddit.com/r/Lightbulb/comments/1q23fvr/an_app_that_matches_you_with_strangers_based_on/)) — [r/SomebodyMakeThis 1q23r02](https://www.reddit.com/r/SomebodyMakeThis/comments/1q23r02/smt_a_reverse_tinder_where_you_match_based_on/)
- Other posts in this cluster: a "social mood tracker + anonymous mood-based chat" that "resets every day" (2026-01-28, cross-posted to three subs: [r/SomebodyMakeThis 1qp9ukv](https://www.reddit.com/r/SomebodyMakeThis/comments/1qp9ukv/is_there_demand_for_a_social_mood_tracker_friends/), [r/Lightbulb 1qp9wdu](https://www.reddit.com/r/Lightbulb/comments/1qp9wdu/is_there_demand_for_a_social_mood_tracker_friends/), [r/AppIdeas 1qp9qmu](https://www.reddit.com/r/AppIdeas/comments/1qp9qmu/)); "a simple, anonymous" app for "the unspoken weight we carry" (2025-12-19, [r/AppIdeas 1pqrg7m](https://www.reddit.com/r/AppIdeas/comments/1pqrg7m/)); "a calm anonymous app where people connect through emotions first" (2026-05-08, [r/AppIdeas 1t72oge](https://www.reddit.com/r/AppIdeas/comments/1t72oge/)); an "audio-based social media platform built around anonymous voices, personal stories" (2026-10-09, [r/AppIdeas 1x19pdd](https://www.reddit.com/r/AppIdeas/comments/1x19pdd/today_thoughts_about_app_idea/)); a text-only anonymous mood chat called "Moodie" (2025-11-02, [r/AppIdeas 1omujoa](https://www.reddit.com/r/AppIdeas/comments/1omujoa/)).

**2. Ephemeral spaces with no permanent record**
- "a platform that only opens at night… optional anonymity And then at sunrise, everything disappears. Conversations aren't saved… Less social media, more 'you're not the only one here'. Feels like something that should already exist." (2026-05-01; listed in r/SomebodyMakeThis top-of-year, rank ~12 of 100) — [r/SomebodyMakeThis 1t0hy12](https://www.reddit.com/r/SomebodyMakeThis/comments/1t0hy12/a_digital_space_that_only_exists_at_night/)
- "Every post disappears in 48 hours. No permanent record. · No follower counts, no like counts" (2026-03-31; top-of-year rank ~46) — [r/SomebodyMakeThis 1s9376j](https://www.reddit.com/r/SomebodyMakeThis/comments/1s9376j/if_you_could_create_a_social_network_without/). The same builder posted again with "ephemeral posts, no likes/followers, topic‑based tribes, anonymous option" (2026-04-12) — [1sjn530](https://www.reddit.com/r/SomebodyMakeThis/comments/1sjn530/whats_the_most_unique_feature_youve_ever_wanted/)
- "You show up as an anonymous avatar… when you leave there's no record you were there. Nothing accumulates" (2026-10-07; the builder asks specifically about the "cold-start problem") — [r/AppIdeas 1x010xe](https://www.reddit.com/r/AppIdeas/comments/1x010xe/anonymous_checkin_app_for_talking_to_people/)

**3. Saying something to a specific person you know without your name on it (closest to saysecretly)**
- "people often save reels/shorts instead of sending them directly because the sender name reveals too much. Examples: a crush-related reel, a friendship reel that feels too direct, a 'this reminds me of you' reel… Would this be useful, creepy, unnecessary, or likely to be misused? What safeguards would make it acceptable?" (2026-04-14, builder) — [r/SomebodyMakeThis 1slhjdh](https://www.reddit.com/r/SomebodyMakeThis/comments/1slhjdh/i_built_a_way_to_anonymously_share_reelsshorts/)
- "both partners privately answer a few questions about things they want… Neither sees the other's answers. If the app finds a genuine match, it reveals it to both people… discovering something you both felt but hadn't necessarily said out loud." (2026-08-08) — [r/AppIdeas 1vinurw](https://www.reddit.com/r/AppIdeas/comments/1vinurw/would_you_use_an_app_that_reveals_things_you_and/)
- "dm's typically feel like there is implied intent on why you chose that specific person… The recipient isn't aware that they are in a group and are only told 'you are paired with one of your friends'." (2026-01-02) — [r/AppIdeas 1q1tmlc](https://www.reddit.com/r/AppIdeas/comments/1q1tmlc/group_chat_anonymity/)
- "a way to anonymously message a car's owner by scanning a QR code on the window… It could ultimately be a playground for creeps" (2026-06-08; the author names the abuse risk) — [r/AppIdeas 1u0obj8](https://www.reddit.com/r/AppIdeas/comments/1u0obj8/it_could_be_silly_it_could_be_just_for_me_it/)
- Related request for a non-anonymous version: an "Anti-Calendar" where "I don't want my friends seeing my work schedule… constantly have to make up excuses to decline invitations" (2026-07-06, top-of-year rank ~58). The pain here is social awkwardness, solved through privacy rather than anonymity. — [r/SomebodyMakeThis 1uowlfm](https://www.reddit.com/r/SomebodyMakeThis/comments/1uowlfm/somebody_make_this_an_anticalendar_for_friends/)

**4. Reveal later, time-locked or staged reveal**
- "the whole group just adds photos quietly during the trip, and then on one specific day it all unlocks for everyone at once, instead of dribbling in over weeks." (2026-09-06, requester, not a builder; top-of-year rank ~65) — [r/SomebodyMakeThis 1w8xbnm](https://www.reddit.com/r/SomebodyMakeThis/comments/1w8xbnm/somebody_make_an_app_where_a_friend_groups_trip/)
- "A letter. My voice. The messy, real parts of who I am. Something that gets delivered 50 years from now… I'm not technical… Would anyone else use this? How would you even make sure it lasts that long?" (2026-03-30, requester; top-of-year rank ~13 of 100) — [r/SomebodyMakeThis 1s7ltpz](https://www.reddit.com/r/SomebodyMakeThis/comments/1s7ltpz/a_way_to_leave_letters_voice_or_video_recordings/)
- "you create an interactive 'reveal journey'… The person has to complete stages before unlocking the final message… Use cases: marriage proposals, birthday surprises, wedding/trip reveals, confessions, reunion invites" (2026-05-24, builder of revealmy.love) — [r/SomebodyMakeThis 1tmfapp](https://www.reddit.com/r/SomebodyMakeThis/comments/1tmfapp/a_website_that_turns_proposalssurprisesmessages/)
- A scheduled-gift variant: "reminds you days or weeks ahead of important birthdays and eventually lets you schedule gifts in advance" (2026-08-07, builder) — [r/AppIdeas 1vhn0rj](https://www.reddit.com/r/AppIdeas/comments/1vhn0rj/would_you_actually_use_an_app_like_this_or_am_i/)

**5. Anonymous honest feedback**
- "It's anonymous, so you get honest reactions instead of your friends just saying 'looks good' to avoid being mean. Posts disappear after a short window" (2026-08-06, outfit check before going out) — [r/AppIdeas 1vgrxs2](https://www.reddit.com/r/AppIdeas/comments/1vgrxs2/outfit_app/)
- "public anonymous reviews of certain departments, managers etc that you could see before you get a job. Its kinda like rate my professor." (2026-05-29) — [r/AppIdeas 1trjsku](https://www.reddit.com/r/AppIdeas/comments/1trjsku/anonymous_company_department_reviews/)
- "put up a QR code at work… pick a name and anonymously complain and shame management… basically Reddit but more anonymous and limited to people you work with." (2026-08-27) — [r/AppIdeas 1w08xe9](https://www.reddit.com/r/AppIdeas/comments/1w08xe9/app_where_you_can_create_anonymous_forums_for/)
- A counter-signal on anonymity: landlord/tenant reviews "exist, but they are fragmented, unverifiable, or anonymous to the point of being useless. This platform is built around mutual accountability" (2026-01-05; top-of-year rank ~6 of 100) — [r/SomebodyMakeThis 1q4flcv](https://www.reddit.com/r/SomebodyMakeThis/comments/1q4flcv/app_idea_linkedin_but_for_landlords_and_tenants/)

**6. Gifting and group money (weak signal in idea subs)**
- "I keep seeing/screenshotting things that'd be perfect gifts… but then completely forgetting by the time their birthday actually comes around" (2026-08-19, cross-posted) — [r/SomebodyMakeThis 1vshwtc](https://www.reddit.com/r/SomebodyMakeThis/comments/1vshwtc/would_you_use_an_app_that_autosaves_gift_ideas/), [r/AppIdeas 1vshy2p](https://www.reddit.com/r/AppIdeas/comments/1vshy2p/would_you_use_an_app_that_autosaves_gift_ideas/)
- "I keep forgetting important people's birthdays and realized there's no app for tracking the relationships that actually matter" (2026-07-12) — [r/AppIdeas 1uu7xat](https://www.reddit.com/r/AppIdeas/comments/1uu7xat/i_keep_forgetting_important_peoples_birthdays_and/)
- "Basically like collectiv or other group money pot apps, but pot members can make requests… and other members of the pot vote anonymously whether or not to fulfill request" (2026-01-09) — [r/AppIdeas 1q80571](https://www.reddit.com/r/AppIdeas/comments/1q80571/digital_take_a_penny_leave_a_penny_but_with/)
- "A website where people can give strangers birthday gifts" ("UPDATE: I made this!"). The post was prompted by a video of a man "that called the police to wish him a happy birthday." (2025-12-27; top-of-year rank ~16 of 100) — [r/SomebodyMakeThis 1pwpng6](https://www.reddit.com/r/SomebodyMakeThis/comments/1pwpng6/a_website_where_people_can_give_strangers/)

**7. Recurring needs unrelated to anonymity (r/SomebodyMakeThis top of past year, by rank)**
- The top-ranked items include: an app for adult kids to manage elderly parents' passwords (rank 3, 2026-08-08, [1vit5w3](https://www.reddit.com/r/SomebodyMakeThis/comments/1vit5w3/)); a corporate-ownership transparency app (rank 4, [1txx70x](https://www.reddit.com/r/SomebodyMakeThis/comments/1txx70x/)); an event-date-finding app (rank 7, [1rptkx7](https://www.reddit.com/r/SomebodyMakeThis/comments/1rptkx7/)); an ADHD brain-dump organizer (rank 9, [1ph7zem](https://www.reddit.com/r/SomebodyMakeThis/comments/1ph7zem/)); paying someone to waste scammers' time (rank 10, [1q4g9j6](https://www.reddit.com/r/SomebodyMakeThis/comments/1q4g9j6/)); a "Just The Recipe" app (rank 15, [1wsky2u](https://www.reddit.com/r/SomebodyMakeThis/comments/1wsky2u/)); a renter's timestamped move-in proof vault (rank 18, [1r59vfg](https://www.reddit.com/r/SomebodyMakeThis/comments/1r59vfg/)); a streaming "No Spoilers" mode (rank 25, [1w6cm4h](https://www.reddit.com/r/SomebodyMakeThis/comments/1w6cm4h/)). Recurring themes: digital-legacy and family admin, protection against scams and bots, and anti-clutter simplicity.
- Typical "wish existed" prompts in r/Entrepreneur and r/startups ask for business-ops tools: "What's the one tool you wish existed for your business?… tracking things, staying organized, managing info" (2025-11-23) — [r/Entrepreneur 1p4dcse](https://www.reddit.com/r/Entrepreneur/comments/1p4dcse/whats_the_one_tool_you_wish_existed_for_your/). One social-platform prompt lists "privacy… mental health" among the wished-for areas (2026-04-30) — [r/startups 1sztw5v](https://www.reddit.com/r/startups/comments/1sztw5v/what_are_some_features_you_wish_existed_in_social/). I found no anonymity requests in the r/startups, r/Entrepreneur or r/smallbusiness samples (4-17 posts each).

### Inferences
- **Supply exceeds visible demand for anonymous venting.** At least 11 builders pitched near-identical "anonymous, no likes, ephemeral vent/mood" apps within 12 months, while confessions subs already serve that job for free (see Q2). The founder's failed confessions site fits this pattern. A new entrant in that category faces a crowded field and a cold-start problem, which one builder raises explicitly ([1x010xe](https://www.reddit.com/r/AppIdeas/comments/1x010xe/anonymous_checkin_app_for_talking_to_people/)).
- **The less crowded white space is anonymity or delay aimed at a known recipient.** Examples are the crush reel, the couples mutual reveal, "paired with one of your friends", group photos that unlock together, and letters delivered decades later. Here the value is the social effect on a specific person, not the size of an audience. Two of these were unprompted requests and two ranked in the top 15% of r/SomebodyMakeThis for the year (1s7ltpz, 1t0hy12). Abuse and creepiness are the main objection, and posters raise it themselves (1slhjdh, 1u0obj8). Safeguards would need to be designed in from day one.
- Idea subs show almost no Secret Santa or group-card pain. That evidence would have to come from the gifting and workplace subs I could not collect.

### Gaps
- No upvote scores, comment counts or comments for any thread, so I cannot say which ideas readers endorsed or rejected. "Top-of-year rank" is the only popularity proxy, and it covers only r/SomebodyMakeThis.
- Not collected: r/SaaS; r/Lightbulb "secret"; "surprise", "honest feedback" and "group gift" searches in r/AppIdeas; and older (pre-Oct 2025) top-of-all-time threads.

## Q2. What do posters in confession and advice subs (r/confessions, r/offmychest, r/TrueOffMyChest, r/relationship_advice, r/AmItheAsshole) say about wanting anonymity, throwaway accounts, fear of being recognized and wanting honest outside opinions? Any explicit "I wish there was a place/app to…" statements?

### Takeaway
Only r/confessions was sampled (100 posts matching "throwaway", 2025-10-30 to 2026-10-27). Throwaway accounts are close to universal there: 94 of the 100 posts mention one in the body. When posters give a reason, the commonest is that **specific people in their life know their main account** (partner, family, friends, coworkers), followed by fear of being traced or identified. People are not hiding from strangers. They are hiding from the few people who could connect the post to them. Many posts also explicitly ask outsiders for a verdict ("Is this normal?", "What would you have done?", "Did my boyfriend assault me?"). No "I wish there was an app" statement turned up in this sample.

### Cited Findings
- **Rough reason counts** among the 100 r/confessions throwaway posts, from a regex over the first 600 characters (categories overlap, so treat as approximate): "for obvious reasons" 26; partner/family/friends know or check the main account 20; could be recognized or traced 19; embarrassment, judgment or paranoia 13. Throwaway mentioned in the body: 94 of 100. — sample feed: [r/confessions search "throwaway", past year](https://www.reddit.com/r/confessions/search?q=throwaway&restrict_sr=1&t=year)
- **The people they know are the threat:**
  - "Throwaway account as family know my main profile." (2026-06-27) — [1uhfxgp](https://www.reddit.com/r/confessions/comments/1uhfxgp/i_had_sex_with_my_wifes_sister/)
  - "Throwaway because boyfriend knows my reddit." (2026-06-19) — [1uabe6q](https://www.reddit.com/r/confessions/comments/1uabe6q/i_hate_my_boyfriends_cat/)
  - "Using a throwaway for obvious reasons because he checks my main sometimes." (2026-08-04) — [1vfgu8y](https://www.reddit.com/r/confessions/comments/1vfgu8y/i_thought_i_was_losing_my_mind_but_im_finally/)
  - "this is a throwaway account since my friends know about my main" (2026-09-09) — [1wbhh91](https://www.reddit.com/r/confessions/comments/1wbhh91/i_almost_commited_suicide_today/)
  - "Throwaway because coworkers could find this." (2026-10-01) — [1wuw277](https://www.reddit.com/r/confessions/comments/1wuw277/19_years_old_7_months_pregnant_and_the_dad_is_my/)
  - "This is a throwaway account, because I am not sure my husband knows my main, but I kind of think he might." (2026-10-20) — [1xb3d4p](https://www.reddit.com/r/confessions/comments/1xb3d4p/i_have_been_lying_to_myself/)
  - "Throwaway for obvious reasons because if my husband ever finds this, our marriage is over." (2026-10-27) — [1xgsib1](https://www.reddit.com/r/confessions/comments/1xgsib1/i_killed_my_husbands_centuryold_family_sourdough/)
- **Fear of being traced or recognized:**
  - "Throwaway acct, my username is too specific on my main." (2026-08-12, title "Have no one to tell, found this sub") — [1vmhian](https://www.reddit.com/r/confessions/comments/1vmhian/have_no_one_to_tell_found_this_sub/)
  - "throwaway because i don't want this tracing back to my main on the off chance someone involved in this story finds this post!" (2026-08-30) — [1w23c2c](https://www.reddit.com/r/confessions/comments/1w23c2c/i_smoked_all_of_my_college_roomates_weed/)
  - "Throwaway because I'm pretty identifiable on my main." (2026-07-14) — [1uwbqbv](https://www.reddit.com/r/confessions/comments/1uwbqbv/im_rallying_my_neighbors_together_to_get_one/)
  - "this is a throwaway for obvious reasons, with details slightly changed for more anonymity." (2026-09-07) — [1wa36xn](https://www.reddit.com/r/confessions/comments/1wa36xn/i_loathe_my_ex_sils_kids_and_really_hope_that/)
  - "I want to keep my digital footprint as self-contained as possible" (2026-10-07) — [1wzslb1](https://www.reddit.com/r/confessions/comments/1wzslb1/i_am_about_to_turn_25_on_the_11th_and_the/)
- **Being found anyway (anonymity failure):** a post titled "Someone found my confession about my fat fetish and I think they're us[ing it]…": "I posted here a few days ago on another throwaway account… an interaction I've had since then has honestly left me feeling pretty shitty." (2026-10-26) — [1xfpg5e](https://www.reddit.com/r/confessions/comments/1xfpg5e/someone_found_my_confession_about_my_fat_fetish/)
- **Nobody offline to tell, or "say it somewhere":**
  - "(Yes, this is a selfish thought I know I can never voice in real life, hence the throwaway." (2025-10-30) — [1ok626g](https://www.reddit.com/r/confessions/comments/1ok626g/i_wish_that_men_could_be_pregnant_instead_of_women/)
  - "this happened this morning and I needed to share it somewhere… throwaway account of course." (2026-07-26) — [1v6st2p](https://www.reddit.com/r/confessions/comments/1v6st2p/ruined_my_new_leggings/)
  - "face to face talking is out of the question" (2026-07-24) — [1v5rf07](https://www.reddit.com/r/confessions/comments/1v5rf07/my_ai_chatbot_addiction_is_ruining_my_life/)
  - "My therapist told me to make a throwaway account for this confession so I did." (2026-09-18) — [1wjgdde](https://www.reddit.com/r/confessions/comments/1wjgdde/i_hate_being_a_pedo/)
- **Wanting an outside verdict:**
  - "Was what my ex did to me actually rape or am I overreacting" (2026-08-24) — [1vwwmdb](https://www.reddit.com/r/confessions/comments/1vwwmdb/was_what_my_ex_did_to_me_actually_rape_or_am_i/)
  - "What would you have done in my situation?… I've made a decision to make an anonymous tip" (2026-10-04) — [1wxnrh2](https://www.reddit.com/r/confessions/comments/1wxnrh2/what_would_you_have_done_in_my_situation/)
  - "Is this normal? This is literally the only other person I have told" (2026-07-09) — [1urey4c](https://www.reddit.com/r/confessions/comments/1urey4c/is_this_normal_this_is_literally_the_only_other/)
  - "Did my boyfriend (22M) assault me (20F)?… Throwaway account because I'm nervous." (2026-10-06) — [1wz478k](https://www.reddit.com/r/confessions/comments/1wz478k/did_my_boyfriend_22m_assault_me_20f/)
- **Anonymity used against someone (misuse signal):**
  - "i created a throwaway encrypted email, compiled unedited screenshots… and sent everything straight to his wife." (2026-09-29, title "I was the one who anonymously sent my best friend's wife proof of his…") — [1wt7emy](https://www.reddit.com/r/confessions/comments/1wt7emy/i_was_the_one_who_anonymously_sent_my_best/)
  - A post about anonymously making a local harasser paranoid by leaving items on his car and in his mailbox (2026-07-26) — [1v6ylrj](https://www.reddit.com/r/confessions/comments/1v6ylrj/sending_a_local_bully_subtle_reallife_signals_to/)
- **Content warning for product design:** a large share of the sample involves sexual abuse, self-harm or suicide, crime, and paedophilic attraction (for example [1xb62ce](https://www.reddit.com/r/confessions/comments/1xb62ce/i_sexually_assaulted_a_younger_child_when_i_was_a/), [1wbhh91](https://www.reddit.com/r/confessions/comments/1wbhh91/i_almost_commited_suicide_today/), [1uc32u4](https://www.reddit.com/r/confessions/comments/1uc32u4/i_think_i_killed_someone_and_i_have_never_been/)).

### Inferences
- Users already get confession-style anonymity for free on Reddit with a throwaway. What they guard against is **being linked by people they know**. A product that differentiates on anonymity has to beat "make a throwaway in 30 seconds". It also faces heavy moderation and safety load: crisis, abuse and illegal-content disclosures are routine in this genre, which is a likely cost driver behind failed confession sites.
- Two concrete anonymity-to-a-known-person behaviours appear: anonymously tipping off a friend's wife, and leaving anonymous signals for a harasser. Both suggest real demand for "tell a specific person something without your name". Both are also adversarial uses that a product would have to handle.

### Gaps
- r/offmychest, r/TrueOffMyChest, r/relationship_advice and r/AmItheAsshole were **not collected** (rate limit, then the wrap-up request). I have no primary quotes from them about anonymity, recognition fear or wanting outside opinions.
- I found no explicit "I wish there was an app/place to…" statements in the r/confessions sample. A targeted search ("wish there was") was planned but not run.
- No comment data, so I cannot report how commenters respond, for example whether they challenge or praise anonymity.

## Q3. What do workplace subs (r/humanresources, r/AskHR, r/managers, r/restaurantowners, r/KitchenConfidential, r/sysadmin) say about anonymous feedback and reporting tools (trust, retaliation fears, tools used, prices, complaints)?

### Takeaway
**Not collected.** All workplace-sub queries were queued but blocked by Reddit's rate limit before the wrap-up request. The only workplace-anonymity evidence I hold comes from idea subs.

### Cited Findings
- An idea for anonymous workplace forums reached through a QR code: "anonymously complain and shame management… limited to people you work with" (2026-08-27) — [r/AppIdeas 1w08xe9](https://www.reddit.com/r/AppIdeas/comments/1w08xe9/app_where_you_can_create_anonymous_forums_for/)
- An idea for anonymous reviews of departments and managers "like rate my professor". The poster notes that people are already "on blind, classroom [sic], and reddit" (2026-05-29) — [r/AppIdeas 1trjsku](https://www.reddit.com/r/AppIdeas/comments/1trjsku/anonymous_company_department_reviews/)
- An r/confessions poster used a throwaway "because coworkers could find this" (2026-10-01) — [1wuw277](https://www.reddit.com/r/confessions/comments/1wuw277/19_years_old_7_months_pregnant_and_the_dad_is_my/)

### Inferences
- None I can support from primary workplace-sub evidence.

### Gaps
- No primary Reddit evidence on trust in HR hotlines or survey tools, retaliation fears, named tools (such as EthicsPoint, Culture Amp, Officevibe, AllVoices), prices or complaints from r/humanresources, r/AskHR, r/managers, r/restaurantowners, r/KitchenConfidential or r/sysadmin. WebSearch for "reddit AskHR anonymous hotline" returned only vendor and news pages, not threads. I did not use those here because they are not primary Reddit evidence.

## Q4. What pain points do gifting and occasion subs (r/secretsanta, r/Gifts, r/weddingplanning, r/remotework, r/AskHR) raise about Secret Santa organizers, group cards (Kudoboard etc.), surprise coordination and collecting money for group gifts?

### Takeaway
**Not collected** from the target subs (rate-limited). The idea subs give only weak, adjacent signals: forgetting gift ideas and birthdays, scheduling gifts in advance, a staged-reveal page for proposals and surprises, and a group money pot.

### Cited Findings
- Scheduled gifts: "eventually lets you schedule gifts in advance (flowers, gift cards…" (2026-08-07) — [r/AppIdeas 1vhn0rj](https://www.reddit.com/r/AppIdeas/comments/1vhn0rj/would_you_actually_use_an_app_like_this_or_am_i/)
- Surprise or proposal reveal pages: "birthday surprises • wedding/trip reveals • confessions" (2026-05-24) — [r/SomebodyMakeThis 1tmfapp](https://www.reddit.com/r/SomebodyMakeThis/comments/1tmfapp/a_website_that_turns_proposalssurprisesmessages/)
- Group money pot with anonymous voting, which names Collectiv as an existing tool (2026-01-09) — [r/AppIdeas 1q80571](https://www.reddit.com/r/AppIdeas/comments/1q80571/digital_take_a_penny_leave_a_penny_but_with/)
- Group trip photos that unlock together, a group "surprise reveal" pattern (2026-09-06) — [r/SomebodyMakeThis 1w8xbnm](https://www.reddit.com/r/SomebodyMakeThis/comments/1w8xbnm/somebody_make_an_app_where_a_friend_groups_trip/)
- A food-delivery gift registry concept (2026-05-18) — [r/AppIdeas 1tgzhr0](https://www.reddit.com/r/AppIdeas/comments/1tgzhr0/gift_registry_app_for_the_food_delivery_services/)

### Inferences
- Within idea subs, "group gift / Secret Santa / group card" is not a frequently voiced pain: none of the ~300 idea-sub posts sampled raised it. That does not mean the pain is absent in the occasion subs. It was simply not measured.

### Gaps
- No primary evidence from r/secretsanta, r/Gifts, r/weddingplanning or r/remotework, or from r/AskHR and r/humanresources on group gifts. In particular I have nothing on Secret Santa organizer pain (Elfster, DrawNames and so on), Kudoboard/Thankbox pricing complaints, or awkwardness around collecting money for coworker gifts. WebSearch returned only vendor and review pages (Capterra, Fishbowl, Team Blind), which are outside this track's primary-Reddit scope.
- Suggested follow-up if time allows: query r/secretsanta, r/AskHR ("collecting money", "group gift"), r/humanresources ("kudoboard", "secret santa") and r/weddingplanning ("surprise") through the RSS route at about 1 request per minute. That is roughly 15-20 minutes of wall time, plus the thread-comment fetches needed to get counts.
