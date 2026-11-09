# What users of anonymity, confession, feedback and "secret" apps say in US App Store / Google Play reviews (primary evidence, retrieved 2026-10-27)

**Method (applies to all sections).** Ratings, rating counts and last-update dates come from Apple's iTunes Lookup API (`https://itunes.apple.com/lookup?id=<ID>&country=us`), pulled 2026-10-27. Reviews come from Apple's public US review RSS feed (`https://itunes.apple.com/us/rss/customerreviews/page=1..10/id=<ID>/sortby=mostrecent/json`). The feed caps at 500 reviews per app, and fewer exist for small apps. For each app the citation link is its App Store page `https://apps.apple.com/us/app/id<ID>`, and the review text comes from that app's RSS feed. Google Play ratings and install bands come from the public US Play listing pages (`play.google.com/store/apps/details?id=<pkg>&hl=en_US&gl=US`), fetched with curl and read from the page's JSON-LD and "Downloads" label. Google Play **review text was not retrieved**: WebFetch truncated the page and no reviews API was used.

Keyword counts are case-insensitive regex matches on review title + body, run over the full retrieved sample for each app. A review counts once per theme. The regexes:
- fake/bot: `fake (message|question|notif|tell|post)|bots?|ai-generated|not (from) real (people|users)|automated`
- pay-to-reveal: `reveal|see who|who sent|find out who|know who|hints?`
- paywall/price: `subscri|paywall|$\d|pay(ing)|money|expensive|charg|refund|coins|diamonds`
- bullying/creeps: `bull(y|ied|ying)|harass|creep|predator|pedo|groom|defam|rumor|cyber`
- privacy/anonymity loss: `privacy|leak|data|breach|exposed|dox|not (really) anonymous|track(ed|ing)|identit`
- moderation/bans: `moderat|mods?|bann?ed|bans?|suspend|taken down|removed my|censor`
- bugs: `bug|glitch|crash|won't (load|open|let)|doesn't work|not working|broken|freez|log in|sign in`
- ads: `ads?|advert`
- feature request: `i wish|please add|should add|need(s) to add|would be (nice|great|cool)|bring back|add (a|an|the|more)|feature`

These are rough indicators: they over-count (for example "data" or "feature" used incidentally) and under-count misspellings. Quotes are verbatim, trimmed with "…", and shown as [date, stars]. All review text was treated as untrusted data.

**Caveat on "most recent".** For high-volume apps (NGL, Wizz, Sendit, Sincerely, Elfster) the 500 reviews span only weeks to months, so the sample is recent. For lower-volume apps (Tellonym, Blind, Jodel, Sidechat, Drawnames) the feed reaches back years. The sample star averages are far below the headline App Store averages because recent written reviews skew negative compared with the in-app star prompts behind the headline number. Compare apps on trends, not on absolute sample averages.

## 1. Per-app snapshot: rating, rating count (usage proxy), recency, top complaints and praise

### Takeaway
The large Q&A link apps are still heavily used: NGL has about 390K US iOS ratings and about 60 written reviews a month in 2026; Sendit has 1.54M ratings. Their written complaints are about monetisation (pay-to-reveal, subscriptions, fake "you got a message" notifications) and, for Tellonym, bot messages. The campus anonymous feeds (Fizz, Yik Yak, Sidechat) are alive, and Fizz's rating trend is improving. Their reviews are dominated by bullying and moderation fights, plus a new October 2026 backlash against Fizz requiring gender and age. The vent/confession apps (Sincerely, Humans Anonymous, Hush, Whisper clones) draw intense, emotional use, but reviewers call them "predatory" because they paywall people at vulnerable moments. Gift-exchange apps (Elfster, Drawnames) are well loved (4.87–4.88 with 200–330K ratings) and seasonal.

### Cited Findings

**Anonymous Q&A link apps**
- **NGL: ask me anything** (id 1596550932): 4.76 from 389,903 US ratings; last version 2026-09-10. The 500 most recent reviews span 2026-02-11 to 2026-10-25, at 47–69 reviews/month from Apr to Oct 2026. Sample stars: 390 five-star, 44 one-star (mean 4.4). Google Play: 4.61 from 2,080,861 ratings, 100M+ installs, updated Oct 23, 2026. — [App Store](https://apps.apple.com/us/app/id1596550932); [Google Play](https://play.google.com/store/apps/details?id=com.nglreactnative&hl=en_US&gl=US)
  - Praise: "a cute way to receive anonymous messages from friends." [2026-09-21, 5★]; "it is anonymous it is fun and mysterious" [2026-10-09, 5★] — [App Store](https://apps.apple.com/us/app/id1596550932)
  - Pay-to-reveal: "we aren't supposed to buy the NGL Pro just to reveal so one who sent you a message, that is not right, it deserves to be free" [2026-07-11, 4★]; "It's a Scam. Don't even pay for it because it doesn't tell you much who sent what." [2026-07-14, 2★]; "its telling me names of people who i don't even follow i wasted 8 bucks on nothing" [2026-07-27, 1★] — [App Store](https://apps.apple.com/us/app/id1596550932)
  - Fake messages and notifications: "i created another account link and didn't share to anyone… However, they send me many fake messages. I don't trust this app anymore" [2026-06-20, 1★]; "the app forces you to receive fake messages that you can't get rid off" [2026-06-16, 4★]; "I'm SICK of seeing someone left you a message and then I go and there's nothing…. Stop sending fake notifications!!!!!" [2026-04-30, 1★] — [App Store](https://apps.apple.com/us/app/id1596550932)
  - Even fans accept the bots: "even bots give questions so u don't get bored but i wish i could see who it is for free" [2026-08-20, 5★] — [App Store](https://apps.apple.com/us/app/id1596550932)
  - Counts (n=500): fake/bot 7 (1%), pay-to-reveal 11 (2%), bugs 12 (2%), notifications 8 (2%). Mostly short positive reviews from young users. — [App Store](https://apps.apple.com/us/app/id1596550932)
- **sendit – get it now** (id 1439623630): 4.77 from 1,541,424 US ratings; last version 2026-07-08. The 500 most recent reviews span 2025-05-08 to 2026-09-18. Velocity is falling: 10–14/month in Apr–Jul 2026, then 8 in Aug and 4 in Sep. Sample mean fell from 3.5 (2025) to 3.2 (2026). Google Play (com.fullsenders.sendit): 4.69 from 655,542 ratings, 10M+ installs. — [App Store](https://apps.apple.com/us/app/id1439623630); [Google Play](https://play.google.com/store/apps/details?id=com.fullsenders.sendit&hl=en_US&gl=US)
  - "$29 to reveal one person is insane why would you guys take the feature away to where you can just watch an ad to reveal someone." [2026-05-28, 1★]; "I am not spending 20 dollars just to see who has sent me a sendit." [2026-06-21, 1★]; "charge 8 dollars for a subscription that allows you to turn on dark mode?" [2026-01-22, 1★] — [App Store](https://apps.apple.com/us/app/id1439623630)
  - Bots: "sendit will constantly send you the same pre-made responses and you wont know any better." [2026-01-06, 1★]; "Hidden identities behind paywalls: Users see messages like 'a girl from here asked a question' with no name" [2025-11-30, 1★] — [App Store](https://apps.apple.com/us/app/id1439623630)
  - Snapchat-integration breakage drives 2026 complaints: "Gone down hill since Snapchat can't be directly connected to it now." [2026-05-28, 1★]; "now you literally have to copy a link and post it from your camera roll" [2026-04-07, 1★] — [App Store](https://apps.apple.com/us/app/id1439623630)
  - Counts (n=500): pay-to-reveal 26 (5%), paywall/price 32 (6%), bugs/login 48 (10%), feature requests 33 (7%). — [App Store](https://apps.apple.com/us/app/id1439623630)
- **linkit Q&A – by sendit** (id 1630555603): 4.54 from 13,592 ratings, but the last version is 2024-07-29 and the latest review is 2025-08-29, so it is effectively **dead**. Google Play (com.iconichearts.senditig): 4.60 / 5,507 ratings, 100K+ installs, last updated Jul 25, 2024. Counts: fake/bot 17/227 (7%), pay-to-reveal 27/227 (12%). — [App Store](https://apps.apple.com/us/app/id1630555603); [Google Play](https://play.google.com/store/apps/details?id=com.iconichearts.senditig&hl=en_US&gl=US)
- **tellonym** (id 1265133033): 4.47 from 144,853 US ratings; last version 2026-10-23. Low US review velocity (3–10/month in 2026) and many Arabic-language reviews. Sample mean: 3.5 (2023) → 2.3 (2024) → 2.2 (2025) → 2.7 (2026). Google Play (de.tellonym.app): 4.27 / 358,831 ratings, 10M+ installs. — [App Store](https://apps.apple.com/us/app/id1265133033); [Google Play](https://play.google.com/store/apps/details?id=de.tellonym.app&hl=en_US&gl=US)
  - **Bots are the #1 complaint: 86/500 (17%) match fake/bot**, the highest of any app sampled. "Literally every one of these were ai generated slop made to make it seem like you're getting more questions" [2026-08-08, 1★]; "Why are you spamming us with AI tells?" [2026-09-20, 2★]; "I've done the 'block sender' but it does nothing since the messages are coming directly from the app." [2026-05-30, 3★]; "It used to be good back in 2019 you'd get questions and answers from real people now it's just full of bots." [2026-03-10, 1★] — [App Store](https://apps.apple.com/us/app/id1265133033)
  - Bullying and support: "Virtually no support for harassment and bullying. Allows 'drama' accounts that bully people by Instagram username." [2026-09-14, 1★]; "minors and others were bullied on this app harassed anonymously but when we report nothing happened" [2026-03-17, 1★] — [App Store](https://apps.apple.com/us/app/id1265133033)
  - Long-term love: "Since high school I've had the link in my bio and I get random questions… for a decade." [2026-07-06, 4★] — [App Store](https://apps.apple.com/us/app/id1265133033)
- **AQA – anonymous q&a** (id 1631976267): 4.60 / 3,761 ratings, only 9 written reviews, latest 2026-04-13. **Scret: Anonymous Questions** (id 1635045720): 4.56 / 1,430 ratings, 132 reviews, latest 2026-09-16, almost all short 5★ reviews. Both are small. — [AQA](https://apps.apple.com/us/app/id1631976267); [Scret](https://apps.apple.com/us/app/id1635045720)
- **Sarahah**: the original app was not found in the US App Store. A search returns only "Saraha: Anonymous Messages" (id 6760998595, TAFROLOGYA LTD; 3.42 from 24 ratings; 0 retrievable reviews). — [App Store](https://apps.apple.com/us/app/id6760998595)
- **Lipsi**: no US App Store listing was found under "Lipsi" or "lipsi anonymous". Searches return Sendit, Tellonym, Yubo and others. It is treated as delisted or unavailable in the US. — [iTunes Search API](https://itunes.apple.com/search?term=lipsi&entity=software&country=us)

**Campus and local anonymous feeds**
- **Fizz** (id 1548207780): 4.69 / 23,812 US ratings; last version 2026-10-19. Review velocity is rising: 4–15/month in Apr–Aug 2026, then 31 in Sep and 24 in Oct. Sample mean is improving: 2.0 (2023) → 2.1 (2024) → 2.6 (2025) → 3.0 (2026). No US Google Play listing was found by search. — [App Store](https://apps.apple.com/us/app/id1548207780)
  - Praise: "Fizz has been an awesome resource for me throughout my college career… I actually met one of my current roommates and closest friends using Fizz" [2026-10-24, 5★]; "Legitimately haven't gone a day without opening it" [2026-10-23, 5★] — [App Store](https://apps.apple.com/us/app/id1548207780)
  - **Anonymity-erosion backlash (Oct 2026)**: "Each update seems to bring in less and less anonymity. This time, the update requires everyone to put in gender and birthday which is displayed on your profile." [2026-10-23, 1★]; "fizz was an app that ran on anonymity… now it has non-optional age and gender markers for data harvesting" [2026-10-22, 1★] — [App Store](https://apps.apple.com/us/app/id1548207780)
  - Bullying and fake posts: "this app has done nothing good for my school, but cause hate speech, defamation and cyberbullying" [2026-10-16, 1★]; "they make fake posts from other schools pretending to be from your school" [2026-10-19, 1★] — [App Store](https://apps.apple.com/us/app/id1548207780)
  - Counts (n=387): bullying/creeps 65 (17%), moderation/bans 74 (19%). — [App Store](https://apps.apple.com/us/app/id1548207780)
- **Yik Yak** (id 1573043816): 3.92 / 51,596 US ratings; last version 2026-10-27. 500 reviews span 2024-09 to 2026-10. Sample mean 1.6 (2024) → 1.9 (2025) → 3.0 (2026), lifted by an **August 2026 burst of 78 reviews, 72 of them 5★**. That is consistent with back-to-school or a review prompt; the cause is unverified. Google Play (com.flowerave.yikyak) shows only a 10K+ install band and no public rating. — [App Store](https://apps.apple.com/us/app/id1573043816); [Google Play](https://play.google.com/store/apps/details?id=com.flowerave.yikyak&hl=en_US&gl=US)
  - Moderation is the dominant complaint: **126/500 (25%)**. "Im starting to get tired of being banned for just existing as a woman but men can sexually harass and tell women horrible things with no repercussions." [2026-10-14, 1★]; "I needed up getting banned for warning the women on the app of a rapist who spikes drinks at parties." [2026-09-29, 1★]; "there is never a reason given as to why; you're only told that it violated a rule" [2026-03-27, 1★] — [App Store](https://apps.apple.com/us/app/id1573043816)
  - Privacy: "Accounts are assigned unique user ids and can be tracked via API calls to the servers. You are not anonymous." [2026-07-13, 1★]. Ads are 81/500 (16%). — [App Store](https://apps.apple.com/us/app/id1573043816)
  - Praise: "Actually makes my school feel like a community where we have the same inside jokes" [2026-09-21, 5★] — [App Store](https://apps.apple.com/us/app/id1573043816)
- **Sidechat** (id 1591988276): 4.56 / 5,108 ratings. Only 200 reviews retrievable; 108 are from 2023 versus 7 in 2026, so written engagement is **low and declining**. "Sidechat is only anonymous to other users, not to the company. They have your phone number, your email address, and your identity, and their workers read what you write." [2026-10-21, 1★]; "Bans are always issued so quickly, but there is no appeal process." [2026-10-21, 2★]; "Fizz is where it's at" [2026-04-30, 1★] — [App Store](https://apps.apple.com/us/app/id1591988276)
- **Jodel** (id 789870026): 4.38 / 121,154 ratings (mostly a European user base); sample mean declining from 3.4 (2023) to 2.6 (2026). Moderation/bans 76/500 (15%). Google Play: 3.96 / 154,780, 5M+ installs. — [App Store](https://apps.apple.com/us/app/id789870026); [Google Play](https://play.google.com/store/apps/details?id=com.tellm.android.app&hl=en_US&gl=US)

**Anonymous friend-finding**
- **Wizz** (id 1452906710): 4.19 / 304,071 US ratings; last version 2026-10-26. **500 reviews in 6 weeks** (2026-09-14 to 10-26), the highest velocity sampled. October 2026 stars: 126 one-star vs 78 five-star, an update backlash. Google Play (info.wizzapp): **3.08** / 61,751, 5M+ installs. — [App Store](https://apps.apple.com/us/app/id1452906710); [Google Play](https://play.google.com/store/apps/details?id=info.wizzapp&hl=en_US&gl=US)
  - "secret chats now cost coins, and the option to watch ads to earn them has been removed." [2026-10-24, 2★]; "the face scan said I was 15 and permanently banned me" [2026-10-18, 5★]; "bring back STORYS AND VoiceRooms like last year THAT WAS PEAK WIZZ" [2026-10-23, 1★] — [App Store](https://apps.apple.com/us/app/id1452906710)
  - Counts (n=500): moderation/bans 102 (20%), paywall/price 58 (12%). — [App Store](https://apps.apple.com/us/app/id1452906710)

**Vent and confession apps (closest to a "secrets" site)**
- **Sincerely: Vent & Confess** (MWM, id 6443709181): 4.66 / 35,936 US ratings; last version 2026-10-13. 500 reviews span 2025-11-07 to 2026-10-25 (19–60/month). Sample mean fell from 3.3 (late 2025) to 2.7 (2026). Google Play (com.sincerelyapp.sincerely): 4.25 / 1,818, 100K+ installs. — [App Store](https://apps.apple.com/us/app/id6443709181); [Google Play](https://play.google.com/store/apps/details?id=com.sincerelyapp.sincerely&hl=en_US&gl=US)
  - **Paywall/price: 206/500 (41%); ads 93/500 (19%).** "They'll let you type a whole paragraph to vent and then tell you, you have to pay for it AFTER you type all that!" [2026-10-10, 1★]; "Wrote a whole paragraph, tried to send it out, then was hit with 'free trial!' Don't prey on vulnerable people like this." [2026-10-13, 1★]; "trying to keep charging them $7.99/wk should be criminal." [2026-10-16, 1★]; "You use to be able to read the first 3 letters for free… Now, you can only read one" [2026-10-09, 2★] — [App Store](https://apps.apple.com/us/app/id6443709181)
  - Praise for the core loop: "If an app was a verbal hug… Just the act of helping someone out even when you yourself are feeling low is so lovely." [2026-10-19, 5★]; "Sometimes it's nice to have an outsiders point of view or advice versus talking to a family or friends" [2026-10-04, 5★]; "The core idea behind Sincerely is genuinely good… That is exactly why the pricing [is exploitative]" [2026-09-19, 1★] — [App Store](https://apps.apple.com/us/app/id6443709181)
- **Humans Anonymous** (id 1616020892): 4.46 / 4,026; last version 2024-12-12, so **abandoned**. Sample mean 4.0 (2023) → 2.0 (2024) → 1.7 (2025) → 1.8 (2026). Paywall/price 202/500 (40%). "The owner Nate changed the monthly fee… from $2 a year to THIRTY DOLLARS A YEAR then completely abandoned the app" [2026-07-29, 1★]; "I am a minor girl who wanted to share her feelings but can't anymore because I don't have the money." [2026-07-09, 1★]; "This app needs to add a function where minors only get to talk to minors" [2025-09-27, 1★] — [App Store](https://apps.apple.com/us/app/id1616020892)
- **Hush – Express Freely** (id 1672847314): 2.47 / 613; bugs 128/420 (30%), ads 66 (16%). A cluster of generic 5★ reviews in Oct 2026 ("Pleasant Experience", "Helpful translation feature") look solicited, and one reviewer alleges this directly: "These fake positive reviews are so obvious. This app is run by pedos and creeps" [2026-10-14, 1★]. Google Play (ac.hush.app): 3.33 / 2,108, 100K+ installs. — [App Store](https://apps.apple.com/us/app/id1672847314); [Google Play](https://play.google.com/store/apps/details?id=ac.hush.app&hl=en_US&gl=US)
- **Whisper**: the original Whisper app was not found in the US App Store. Clone "Whisper Secrets" (id 6742770145): **1.98** / 40 ratings, with 69 of 92 reviews at 1★ and moderation/bans at 38/92 (41%). Reviewers describe it as "meant to be like the old app that was removed from the Apple Store called 'Whisper'. Whisper attracted a lot of p*dophiles, groomers…" [2025-09-04, 1★]; "the devs can see your personal information and there are reports of the devs using that against users" [2026-08-19, 1★]; "3/4 messages are [spam]… They're all 'hi how are you' when your post was about losing your job" [2026-09-15, 1★]. Google Play: 1.89 / 399, 50K+ installs. Google Play also lists "Whisper Social" (com.whisper.social): 3.94 / 480, 10K+ installs. — [App Store](https://apps.apple.com/us/app/id6742770145); [Google Play](https://play.google.com/store/apps/details?id=org.kodiakgaming.whispersecrets&hl=en_US&gl=US); [Google Play Whisper Social](https://play.google.com/store/apps/details?id=com.whisper.social&hl=en_US&gl=US)

**Dating "tea" apps**
- **Tea Dating Advice and TeaOnHer were removed from the US App Store** in Oct 2025. Apple cited Guidelines 1.2 (UGC reporting and blocking), 5.1.2 (data consent) and 5.6 (excessive complaints and negative reviews), after a 2025 breach exposed about 72,000 images including selfies and photo IDs. iOS reviews are therefore unretrievable. — [TechCrunch](https://techcrunch.com/2025/10/22/apple-confirms-it-pulled-controversial-dating-apps-tea-and-teaonher-from-the-app-store); [9to5Mac](https://9to5mac.com/2025/10/22/apple-removes-controversial-dating-apps-from-app-store-months-after-major-data-leak/)
- Tea is still on Google Play (com.tea.tea): **4.39 from 30,607 ratings, 1M+ installs, updated Oct 27, 2026**, so it is still actively maintained on Android. — [Google Play](https://play.google.com/store/apps/details?id=com.tea.tea&hl=en_US&gl=US)
- Rival "Tea For Men" (com.jose.teaformen.teaapp): 3.46 / 400, 10K+ installs, last updated Dec 14, 2025. — [Google Play](https://play.google.com/store/apps/details?id=com.jose.teaformen.teaapp&hl=en_US&gl=US)

**Workplace anonymity**
- **Blind: Anonymous Work Network** (id 737534965): 4.56 / 13,522 US ratings, but recent written reviews are harsh: sample mean 1.3–1.6 every year from 2023 to 2026, and only 29 reviews in 2026. Bugs 87/500 (17%), ads 71 (14%). Google Play: 4.32 / 42,613, 5M+ installs. — [App Store](https://apps.apple.com/us/app/id737534965); [Google Play](https://play.google.com/store/apps/details?id=com.teamblind.blind&hl=en_US&gl=US)
- **AllVoices**: no AllVoices anonymous-reporting app was found on the US App Store or Google Play. Searches return unrelated "All Voices" apps. 15Five (4.65 / 6,612) and Quantum Workplace appear, but they are HR suites, not anonymous-feedback-first. — [iTunes Search API](https://itunes.apple.com/search?term=anonymous+feedback+workplace&entity=software&country=us)

**Gift exchange and group celebration ("secret" in a positive frame)**
- **Elfster** (id 751594890): 4.87 / 331,770 US ratings; last version 2026-10-21. 300 reviews span 2025-11-28 to 2026-10-25, with 240 of them in the 2025 holiday season. Sample mean 3.8 (2025 season) and 4.3 (2026). Google Play (com.elfster.elfdroid): 4.81 / 33,953, 1M+ installs. — [App Store](https://apps.apple.com/us/app/id751594890); [Google Play](https://play.google.com/store/apps/details?id=com.elfster.elfdroid&hl=en_US&gl=US)
  - "This app is a game changer. My family uses it to give birthday gifts and Secret Santa." [2026-10-21, 5★]; "I like that they cannot see that I'm the one they purchased it, but others can see that that item was already purchased." [2025-08-03, 5★] — [App Store](https://apps.apple.com/us/app/id751594890)
  - **A broken secret message**: "From sending a 'secret' note (hint, it said my name then anonymous) to various auth issues" [2025-12-13, 3★]; "The in-process message is hidden behind the keyboard" [2025-12-08, 2★] — [App Store](https://apps.apple.com/us/app/id751594890)
  - Requests: "add ideas without a specific link and just a description" [2026-10-25, 1★]; "I wish this app allowed each person to draw more than one name." [2026-06-05, 1★] — [App Store](https://apps.apple.com/us/app/id751594890)
- **drawnames** (id 932002377): 4.88 / 205,065 US ratings; last version 2026-10-23. Seasonal pattern: 0–1 reviews/month in summer 2026, then 10 in Sep and 16 in Oct. Sample mean 4.1–4.2 in 2023–25. Google Play (com.meetrixonline.drawnames): 4.82 / 168,308, 1M+ installs. — [App Store](https://apps.apple.com/us/app/id932002377); [Google Play](https://play.google.com/store/apps/details?id=com.meetrixonline.drawnames&hl=en_US&gl=US)
  - **Anonymous Q&A between giver and recipient is wanted, but it is one-way**: "i like the feature where you can ask someone a question anonymously, but it won't let them answer or reply at all." [2025-12-08, 5★]; "Ok app - need a way to answer questions… As it stands there is no way to answer a question." [2025-12-07, 3★] — [App Store](https://apps.apple.com/us/app/id932002377)
  - "this makes everything easy, fun, and anonymous." [2026-10-16, 5★]; "every person in the exchange has to download the app and login. It's very inconvenient when you're including kids or older folks" [2026-10-05, 2★] — [App Store](https://apps.apple.com/us/app/id932002377)
- **Kudoboard, GroupGreeting, Tribute (tribute.co)**: no US App Store or Google Play app was found for any of the three. Search results returned unrelated apps; "Tribute Video Direct" is a funeral-industry product by Tribute Technology. They appear to be web-only, so they have no store reviews. — [iTunes Search API](https://itunes.apple.com/search?term=Kudoboard&entity=software&country=us)
- **Memento: Group Videos & Albums** (Punchbowl, id 1579704961), the closest group-video app found: 4.81 / 995, but recent reviews are mostly billing complaints. "they have charged me $89 each year against my will" [2026-06-11, 1★]; "many people tell me they recorded a video, uploaded but did not receive confirmation" [2025-10-13, 1★]; "always such a huge success!" [2026-02-22, 5★] — [App Store](https://apps.apple.com/us/app/id1579704961)

**Time-capsule letters**
- **FutureMe** (id 1607047236): **2.74 / 136**; sample mean **1.1 in both 2025 and 2026** after 3.5–4.0 earlier. Paywall/price 40/78 (51%). "I wrote like a 600 word letter, went to send it, and it said I have to pay to send it." [2026-09-06, 1★]; "It runs like a web app now… There are ads ev[erywhere]" [2026-07-13, 1★]; "It says 'Digital Fun' and wants me to make an account and pay $40 a month." [2026-06-14, 1★]; "I have been using FutureMe since mid 2018… you could write unlimited FREE letters" [2026-04-26, 1★] — [App Store](https://apps.apple.com/us/app/id1607047236)
- **HiFutureSelf** (id 384927725): 4.80 / 554. Users mainly treat it as a reminder tool, not an emotional letter: "the absolute, hands down app for anyone struggling with executive function, adhd" [2026-07-02, 5★]. — [App Store](https://apps.apple.com/us/app/id384927725)

### Inferences
- The products with the largest usage (NGL, Sendit, Tellonym) are entertainment Q&A for teens and young adults, monetised by selling sender identity. Their user base tolerates this, but a sizeable minority calls it a scam.
- Every "safe anonymous venting" app sampled (Sincerely, Humans Anonymous, Hush, Whisper clones) shows the same arc: a loved core loop, then paywalls or ads at the emotional moment, then 1★ reviews calling it "predatory". Humans Anonymous and FutureMe show that arc ending in abandonment.

### Gaps
- Google Play review text could not be retrieved (WebFetch truncated; no Play reviews API used). Only Play aggregate rating and install band are reported.
- Fizz and Sidechat Google Play listings were not found by search; they may be iOS-only or use packages not surfaced.
- Original Whisper, Lipsi and Sarahah could not be confirmed as delisted from an Apple primary source; that they are absent from search is the evidence.
- No App Store data exists for Tea or TeaOnHer after removal. "TeaOnHer and Him – Overheard" (mentioned in coverage) was not found by iTunes search.

## 2. Recurring feature requests

### Takeaway
The recurring asks are:
- reveal or hint at the sender cheaply, or free via ads
- turn off bot or fake messages
- two-way anonymous replies
- bring back simpler or older versions
- appeals and transparent moderation
- a free tier that lets people finish what they wrote
- search and edit
- age-segregated safety

### Cited Findings
- Free or ad-based reveal: "I wish it was free to see who you can reveal or watch an add to see" [Sendit, 2026-02-10, 5★] — [App Store](https://apps.apple.com/us/app/id1439623630); "i wish i could see who it is for free" [NGL, 2026-08-20, 5★] — [App Store](https://apps.apple.com/us/app/id1596550932)
- Bot opt-out: "Add an option to turn it off please." [Tellonym, 2026-05-30, 3★] — [App Store](https://apps.apple.com/us/app/id1265133033)
- Two-way anonymous Q&A: "need a way to answer questions" [Drawnames, 2025-12-07, 3★] — [App Store](https://apps.apple.com/us/app/id932002377)
- Search: "PLEASE ADD A SEARCH FUNCTION… no real way to go back or search up specific messages" [Tellonym, 2026-09-29, 2★] — [App Store](https://apps.apple.com/us/app/id1265133033)
- Username change: "Why can't I change my link username?" [NGL, 2026-08-17, 2★]. Prompt variety: "the shuffle questions are repetitive!" [NGL, 2026-07-07, 2★]; "wish they would bring [daily questions] back" [NGL, 2026-08-12, 5★] — [App Store](https://apps.apple.com/us/app/id1596550932)
- Edit button: "we need an edit button, specifically for comments" [Yik Yak, 2026-10-02, 5★] — [App Store](https://apps.apple.com/us/app/id1573043816)
- Appeals: "Bans are always issued so quickly, but there is no appeal process." [Sidechat, 2026-10-21, 2★] — [App Store](https://apps.apple.com/us/app/id1591988276)
- Minor safety: "minors only get to talk to minors and adults get to talk to adults" [Humans Anonymous, 2025-09-27, 1★] — [App Store](https://apps.apple.com/us/app/id1616020892)
- Free basic use: "we should at-least be able to send one letter a day for free" [FutureMe, 2026-08-15, 1★] — [App Store](https://apps.apple.com/us/app/id1607047236)
- Multilingual letters: "accept letters in multiple languages for bilingual people" [Sincerely, 2026-09-25, 5★] — [App Store](https://apps.apple.com/us/app/id6443709181)
- Gift apps: free-text wishes without links [Elfster, 2026-10-25, 1★; Drawnames "You can no longer just type to add things", 2025-12-14, 1★]; drawing multiple names [Elfster, 2026-06-05]; no forced download for every participant [Drawnames, 2026-10-05, 2★] — [Elfster](https://apps.apple.com/us/app/id751594890); [Drawnames](https://apps.apple.com/us/app/id932002377)
- Wizz "bring back" demands for older features: stories, voice rooms, name search, double-texting [2026-10-13 to 10-23] — [App Store](https://apps.apple.com/us/app/id1452906710)
- Feature-request regex hit rate was 2–10% across apps: Sidechat 10%, Humans Anonymous 9%, Elfster 9%, Sincerely 8%, Sendit 7%, NGL 2%. — computed from the RSS samples above

### Inferences
- "Bring back the old/simple version" is a strong pattern: Sendit, Wizz, FutureMe, Sincerely and Drawnames all have it. Users punish feature churn and new monetisation layers more than missing features.
- Two-way anonymous conversation inside a known group is directly requested in Drawnames and implied by Elfster's broken "secret note". Gift apps do not serve it well.

### Gaps
- No quantitative ranking of requests across Google Play text, since it was not retrieved.

## 3. Specific complaint categories: fake messages, pay-to-reveal, bullying/creeps, privacy, moderation, bugs, pricing

### Takeaway
Each complaint type clusters by app category:
- Fake or bot messages: Tellonym (17%), linkit (7%).
- Pay-to-reveal: linkit (12%), Sendit (5%).
- Paywall or price: venting and letter apps (FutureMe 51%, Sincerely 41%, Humans Anonymous 40%).
- Bullying and creeps: campus feeds (Fizz 17%, Yik Yak 11%) and Whisper clones (16%).
- Moderation and bans: Whisper Secrets 41%, Yik Yak 25%, Wizz 20%, Fizz 19%.
- Bugs: Hush (30%) and Blind (17%).

### Cited Findings
Keyword-count table, US App Store, most-recent reviews as retrieved 2026-10-27, with regexes as in the Method note. Source: Apple RSS feeds for each app ID listed in Section 1.

| App (n) | fake/bot | pay-to-reveal | paywall/price | bullying/creeps | privacy/anon-loss | moderation/bans | bugs | ads |
|---|---|---|---|---|---|---|---|---|
| NGL (500) | 1% | 2% | 2% | 0% | 0% | 0% | 2% | 0% |
| Sendit (500) | 1% | 5% | 6% | 1% | 1% | 0% | 10% | 2% |
| Tellonym (500) | **17%** | 4% | 4% | 6% | 1% | 1% | 9% | 1% |
| linkit (227) | 7% | **12%** | 1% | 1% | 0% | 0% | 8% | 2% |
| Fizz (387) | 4% | 1% | 1% | **17%** | 4% | 19% | 7% | 1% |
| Sidechat (200) | 1% | 0% | 2% | 3% | 4% | 11% | 6% | 2% |
| Yik Yak (500) | 1% | 1% | 3% | 11% | 4% | **25%** | 9% | 16% |
| Wizz (500) | 2% | 1% | 12% | 0% | 0% | 20% | 9% | 4% |
| Sincerely (500) | 1% | 1% | **41%** | 3% | 1% | 1% | 7% | 19% |
| Humans Anon (500) | 1% | 1% | 40% | 2% | 1% | 12% | 5% | 3% |
| Hush (420) | 3% | 0% | 3% | 8% | 2% | 15% | **30%** | 16% |
| Whisper Secrets (92) | 4% | 0% | 0% | 16% | 1% | **41%** | 12% | 9% |
| Blind (500) | 0% | 0% | 4% | 4% | 5% | 10% | 17% | 14% |
| Elfster (300) | 0% | 2% | 1% | 2% | 0% | 0% | 10% | 1% |
| Drawnames (500) | 0% | 0% | 2% | 0% | 1% | 0% | 6% | 1% |
| FutureMe (78) | 0% | 1% | **51%** | 0% | 1% | 0% | 9% | 14% |

- Fake notifications are a distinct complaint from fake messages, e.g. NGL: "constant notifications that you have a message and there's no message" [2026-09-05, 1★]; Wizz: "stop it with the 'you got a message' notifications because no i didnt" [2026-10-15, 3★]. — [NGL](https://apps.apple.com/us/app/id1596550932); [Wizz](https://apps.apple.com/us/app/id1452906710)
- Privacy and anonymity-to-the-company: Sidechat [2026-10-21, 1★], Yik Yak [2026-07-13, 1★], Whisper Secrets [2026-08-19, 1★] and Fizz's mandatory gender and age [Oct 2026] all appear in Section 1. The Tea breach led to App Store removal. — [Sidechat](https://apps.apple.com/us/app/id1591988276); [Yik Yak](https://apps.apple.com/us/app/id1573043816); [TechCrunch](https://techcrunch.com/2025/10/22/apple-confirms-it-pulled-controversial-dating-apps-tea-and-teaonher-from-the-app-store)
- Billing after cancel and dark patterns: Sincerely ("promises theyll remind you about your free trial ending but they don't even try warning you" [2026-10-18, 1★]); Memento ("charged me $89 each year against my will" [2026-06-11, 1★]); Sendit ("the money continued to be taken from the card" [2026-07-22, 2★]). — [Sincerely](https://apps.apple.com/us/app/id6443709181); [Memento](https://apps.apple.com/us/app/id1579704961); [Sendit](https://apps.apple.com/us/app/id1439623630)
- Inconsistent moderation is the dominant moderation complaint (rather than too much or too little moderation in general): "People can post fight videos and nudes, but I've been muted for calling a public figure a deadbeat Dad?" [Fizz, 2026-09-10, 2★]; "Someone was talking about bring harassed… and yikyak took it down." [Yik Yak, 2026-04-30, 1★]. — [Fizz](https://apps.apple.com/us/app/id1548207780); [Yik Yak](https://apps.apple.com/us/app/id1573043816)

### Inferences
- Bullying is a near-zero complaint in NGL and Sendit written reviews, where the recipient opts in by sharing a link to friends, but a top complaint in open campus feeds (Fizz, Yik Yak) and stranger-venting apps. Recipient-controlled, inbox-style anonymity draws far fewer harm complaints than broadcast anonymity, at least from people who write reviews.
- Monetising the reveal of identity is tolerated in teen Q&A but resented. Monetising the act of expression (venting, letters) produces the strongest moral anger ("criminal", "predatory").

### Gaps
- The regexes are coarse. For example "pay-to-reveal" includes "hints", and "privacy" includes "data". No manual labelling was done beyond reading samples.
- The review samples reflect people motivated to write reviews and are not representative of all users.

## 4. Which apps show strong recent positive engagement in 2025–2026 vs. dying ones

### Takeaway
- **Alive and positive:** NGL, Elfster, Drawnames (seasonal), and Fizz, whose trend is improving though bullying is still contested.
- **Alive but angry:** Wizz, Sincerely and Yik Yak.
- **Declining or dying:** Sendit (falling review velocity), Sidechat, Tellonym (bot-ridden), linkit, Humans Anonymous, FutureMe, and the Whisper clones.
- **Removed:** Tea and TeaOnHer (iOS) and the original Whisper.

### Cited Findings
- NGL: about 47–69 reviews/month through Oct 2026, a 4.4 sample mean, 78% five-star, and the app updated Sep 2026. On Play: 100M+ installs, 2.08M ratings, updated Oct 23, 2026. — [App Store](https://apps.apple.com/us/app/id1596550932); [Google Play](https://play.google.com/store/apps/details?id=com.nglreactnative&hl=en_US&gl=US)
- Fizz: Sep–Oct 2026 review volume is 2–6x the spring level, and the sample mean rose from 2.0 (2023) to 3.0 (2026). — [App Store](https://apps.apple.com/us/app/id1548207780)
- Wizz: 500 reviews in 6 weeks with 1★ outnumbering 5★, and Play rating 3.08. Heavy usage plus backlash. — [App Store](https://apps.apple.com/us/app/id1452906710); [Google Play](https://play.google.com/store/apps/details?id=info.wizzapp&hl=en_US&gl=US)
- Sincerely: 19–60 reviews/month in 2026, with the sample mean down from 3.3 to 2.7. — [App Store](https://apps.apple.com/us/app/id6443709181)
- Sendit: monthly reviews fell from 14 (Jun 2026) to 4 (Sep 2026) despite 1.54M lifetime ratings. — [App Store](https://apps.apple.com/us/app/id1439623630)
- Dying apps:
  - Humans Anonymous: last update Dec 2024, mean 1.7–1.8 in 2025–26 — [App Store](https://apps.apple.com/us/app/id1616020892)
  - linkit: last update Jul 2024, last review Aug 2025 — [App Store](https://apps.apple.com/us/app/id1630555603)
  - FutureMe: 2025–26 mean 1.1 — [App Store](https://apps.apple.com/us/app/id1607047236)
  - Sidechat: 7 reviews in 2026 — [App Store](https://apps.apple.com/us/app/id1591988276)
- Seasonal: Drawnames had 0–1 reviews/month in summer 2026 and 10–16 in Sep–Oct; Elfster had 240 of 300 reviews in Nov–Dec 2025. — [Drawnames](https://apps.apple.com/us/app/id932002377); [Elfster](https://apps.apple.com/us/app/id751594890)
- New 2025–2026 entrants found by search are all tiny:
  - Veil: Anonymous Confessions (id 6784805823): 4.55 / 11 ratings
  - Ventry (id 6760973748): 0 ratings
  - Confess2Me (id 6752618101): 0 ratings
  - Murmur: Anonymous Polls (id 6786405987): 0 ratings
  - u up? – anonymous chats (id 6788164707): 4.59 / 17 ratings
  - Unsaid – Letters to Strangers (id 6761376163): 4.0 / 2 ratings

  — [iTunes Search API](https://itunes.apple.com/search?term=anonymous+confession&entity=software&country=us)

### Inferences
- No 2025–2026 viral anonymous app surfaced in US App Store search data. The last breakouts were Tea (2025), then removed, and older ones (NGL 2022, Gas 2022). The category's incumbents remain NGL and Sendit.
- A confession or secrets product launched as a standalone stranger feed lands in the dying cluster (Whisper clones, Hush, Humans Anonymous). The engaged clusters are friend-graph Q&A (NGL), campus-bounded feeds (Fizz, Yik Yak) and occasion-bounded groups (Elfster, Drawnames).

### Gaps
- No download or DAU data. Rating counts and review velocity are proxies only.
- Yik Yak's Aug 2026 5★ spike (72 of 78) may reflect review solicitation; the cause is unverified.
- No App Store chart data was retrieved, and web search for "viral anonymous app 2026" returned only 2017–2022 articles.

## 5. Cross-app patterns: what unmet need keeps appearing?

### Takeaway
Users repeatedly want anonymous honesty from people who matter to them, with:
- real messages, not bots
- a fair, non-predatory way to learn or hint who said it
- the ability to reply anonymously
- safety from creeps
- no paywall at the moment of vulnerability

No app sampled delivers that combination. Gift-exchange apps show strong, positive demand for "secret" mechanics within a bounded group of known people (family or coworkers). Their anonymous messaging is weak: one-way in Drawnames, and leaking the sender's name in Elfster.

### Cited Findings
- Real people, not bots: Tellonym ("What's the point of this app if it's not real?" [2026-03-18, 1★]); NGL ("I don't trust this app anymore" [2026-06-20, 1★]); Whisper Secrets ("3/4 messages are [spam]" [2026-09-15]). — [Tellonym](https://apps.apple.com/us/app/id1265133033); [NGL](https://apps.apple.com/us/app/id1596550932); [Whisper Secrets](https://apps.apple.com/us/app/id6742770145)
- Curiosity about the sender is the core hook, and the monetised reveal is resented: NGL [2026-07-11, 4★]; Sendit [2026-05-28, 1★]. — [NGL](https://apps.apple.com/us/app/id1596550932); [Sendit](https://apps.apple.com/us/app/id1439623630)
- Wanting to be heard and to help others: Sincerely ("so few people willing to listen and empathize" [2026-09-28, 5★]); Humans Anonymous ("I'm just a fellow Human who is lonely and I need someone to talk to." [2026-04-30, 5★]). — [Sincerely](https://apps.apple.com/us/app/id6443709181); [Humans Anonymous](https://apps.apple.com/us/app/id1616020892)
- Anonymity toward the company, not just toward peers: Sidechat [2026-10-21]; Fizz gender and age requirement [Oct 2026]. — [Sidechat](https://apps.apple.com/us/app/id1591988276); [Fizz](https://apps.apple.com/us/app/id1548207780)
- Secret mechanics in a known group, with anonymous Q&A between giver and recipient: Drawnames [2025-12-07, 2025-12-08]; Elfster's "secret" note leaking the sender [2025-12-13]. — [Drawnames](https://apps.apple.com/us/app/id932002377); [Elfster](https://apps.apple.com/us/app/id751594890)
- Low-friction participation ("Every person in the exchange has to download the app and login… inconvenient when you're including kids or older folks" [Drawnames, 2026-10-05, 2★]; Memento "you have to allow paste or it won't take you to the group video" [2025-10-17, 1★]). — [Drawnames](https://apps.apple.com/us/app/id932002377); [Memento](https://apps.apple.com/us/app/id1579704961)

### Inferences
- A web-first (no app download) product for anonymous messages inside a bounded, known group is the gap the reviews point to most consistently. Examples are a Secret Santa thread, a team kudos or feedback round, or friends' honest notes. To fit what reviewers ask for, it would guarantee real messages, offer two-way anonymous replies and set a clear reveal rule, and it would avoid paywalling the act of writing. This matches praise for Drawnames and Elfster and the friction complaints about app downloads.
- Stranger-confession feeds attract the worst reviews in the dataset: predators, moderation fights and predatory pricing. This is consistent with the founder's earlier confessions-site failure.
- Fake engagement (bots, phantom notifications) is a short-term retention trick, and it visibly destroys trust in Tellonym's and NGL's reviews. Honest "no fake messages" positioning would be differentiating.

### Gaps
- No direct review evidence was found for Kudoboard, GroupGreeting, Tribute or AllVoices because they have no store apps (web-only). Workplace anonymous-feedback demand could not be assessed from store reviews beyond Blind.
- Raw data: review JSON per app is saved at /private/tmp/claude-501/-Users-moshekaplan-secretly/3960721d-ca1c-4ae9-8a78-0b3184a404e7/scratchpad/data/reviews/ and the scripts at /private/tmp/claude-501/-Users-moshekaplan-secretly/3960721d-ca1c-4ae9-8a78-0b3184a404e7/scratchpad/scripts/. The scratchpad is temporary and should not be relied on long-term.
