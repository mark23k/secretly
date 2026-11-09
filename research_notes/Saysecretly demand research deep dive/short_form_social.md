# Short-form social trends (TikTok, Instagram, YouTube Shorts, X) around secrets, confessions, anonymity and honest feedback, US 2025-2026

Method note (read first). Access to the platforms themselves was mostly blocked, so very few numbers in these notes are primary platform data:
- **TikTok Creative Center** (ads.tiktok.com/business/creativecenter/.../hashtag/pc/en) via WebFetch returned only the navigation shell (a JS app that needs login). It gave no hashtag data and no region filter.
- **TikTok tag pages** (www.tiktok.com/tag/confession, anonymousconfessions, secrets, ngl, redditstories, storytime, unpopularopinion) fetched with curl returned HTTP 200 and about 390KB each. The server-rendered HTML had no video or view counts, only a generic "TikTok - Make Your Day" shell.
- **TikTok AMP and discover pages** via WebFetch also returned only the shell.
- **TikTok oEmbed** for a tag returns embed HTML with no stats.
- **Second curl attempt.** I tried the AMP tag pages with a crawler user-agent. The sandbox's permission system denied this as bot-check circumvention, and I did not retry.
- **Where the numbers come from instead:** Google/Bing search snippets of TikTok pages (marked "via search snippet"), Social Blade (via snippet), Wikipedia, news (TechCrunch, NBC, Forbes via secondary reporting, AdExchanger) and Appfigures.
- **Not covered:** I did not get to X or Instagram directly. Those gaps are noted below.

## 1. Which hashtags and formats are big right now, and are they rising?

### Takeaway
The large, durable tags are broad story tags (#confession, #confessions, #storytime, #redditstories). Their totals are huge but cumulative, and many posts only use them as filler tags. Tags that are specifically anonymous are much smaller (#anonymousconfessions is about 5K posts). Around 2025, the format that drives engagement is a **creator reading or reacting to submitted anonymous confessions** ("reading anonymous confessions you sent me", Google Form confession reads, GRWM plus confession). An anonymous *archive* alone does not draw that engagement. I could not verify from platform data whether any of these tags is growing.

### Cited Findings
- **#confession on TikTok:** about 3.7B views on the tag page (via search snippet). This is a cumulative all-time count, and the top videos under it are largely unrelated clips that just carry the tag. — [TikTok #confession tag (amp)](https://www.tiktok.com/amp/tag/confession?lang=en)
- **Third-party tracker figures (stale):**
  - #confession: about 116.8K posts and 2B views
  - #confessions: about 195K posts and 4.3B views
  - The page is roughly 3 years old and conflicts with TikTok's own 3.7B figure. — [tiktokhashtags.com #confession](https://tiktokhashtags.com/hashtag/confession/); [#confessions](https://tiktokhashtags.com/hashtag/confessions/)
- **#anonymousconfessions** is far smaller: about 5.2K TikTok posts, averaging about 22,387 views per post (third-party estimate). A sample Nov 2025 video under it had 9,544 likes and 416 comments. — [hashtag tracker via search](https://displaypurposes.com/hashtags/hashtag/confession); [TikTok video, Nov 2025](https://www.tiktok.com/@__ohitsrobinm__/video/7570748582618270990)
- **"Confess your love"** couple-confession format: one video had 475.4K likes and 8,179 comments (via search snippet of the discover page). — [TikTok discover: Confession TikTok Trend](https://www.tiktok.com/discover/confession-tiktok-trend)
- **TikTok auto-generated discover clusters** exist for the "reading submitted confessions" format: "Reading Anonymous Confessions You Sent Me", "Send Anonymous Confessions", "googleformconfess", "How to Make Google Form for Confession", "Google Docs Confession", "Anonymous Confession Letter". These pages show that viewers search for both the format and the tooling. — [discover: reading-anonymous-confessions-you-sent-me](https://www.tiktok.com/discover/reading-anonymous-confessions-you-sent-me); [googleformconfess](https://www.tiktok.com/discover/googleformconfess?lang=en); [how-to-make-google-form-for-confession](https://www.tiktok.com/discover/how-to-make-google-form-for-confession); [google-docs-confession](https://www.tiktok.com/discover/google-docs-confession?lang=en)
- **"Best Anonymous Confessions"** discover page: one video shown had 664.1K likes. A "Part one of anonymous confessions" post asks viewers to submit via a link in bio. — [discover: best-anonymous-confessions](https://www.tiktok.com/discover/best-anonymous-confessions)
- **Reddit-story narration** over Minecraft-parkour or gameplay split screen is still a standard TikTok/Shorts format. It is tagged #redditstories, #redditreadings and #minecraftparkour, recurring accounts include ScalingStories, Cryptic and RedditReadingz, and open-source generators exist to auto-produce it. — [TikTok discover: reddit-minecraft-parkour-stories](https://www.tiktok.com/discover/reddit-minecraft-parkour-stories); [GitHub Reddit-TikTok-Video-Maker](https://github.com/Jalen-Stephens/Reddit-TickTok-Video-Maker)
- **Reddit-story economics (anecdotal, self-reported case study, 2026):** a faceless Reddit-story YouTube channel got about 1.2M total views in months 3-6, its best video got about 250K, and RPM was about $4-6. The author calls most channels in the niche "low-effort". — [vidmachine.ai case study](https://vidmachine.ai/blog/reddit-faceless-ai-channel-case-study)
- **Jan 2025:** around the US TikTok ban, creators made a wave of "confessing secrets before the app went dark" videos (a one-off moment). — [CBC Kids News](https://www.cbc.ca/kidsnews/post/watch-tiktok-creators-confessed-secrets-before-the-app-went-dark)
- **PostSecret on TikTok:** the tag page mostly shows small accounts with low engagement. I found no 2026 revival. — [TikTok discover: postsecret](https://www.tiktok.com/discover/postsecret?lang=en)

### Inferences
- The engagement unit is a **personality reading or reacting to anonymous submissions on camera**, or narrating them over gameplay. The anonymous text itself is raw material, not the product. The founder's earlier site was a destination archive, which is the part of this value chain that does not travel on short-form.
- Anonymous-specific tags are tiny next to #storytime and #confession. "Anonymous" is a means (it makes people willing to submit), not what viewers search for.
- Reddit-story channels are commoditized and AI-generated, and their supply depends on Reddit. **Fresh, exclusive submissions** are a differentiator a creator can't get by scraping Reddit.

### Gaps
- No primary TikTok Creative Center rank or growth data for any of these tags, because the page needs JS and login.
- No current post or view counts from the platform for #secrets, #ngl, #storytime, #redditstories, #unpopularopinion, #amitheonlyone or "tell me without telling me". Tag pages were blocked.
- Instagram hashtag counts: not checked; Instagram blocks unauthenticated access.
- X: no trend data found. X does not expose historical trend volumes publicly, and no news coverage with numbers surfaced.

## 2. Which accounts or creators built big followings from anonymous submissions, and how do they collect them?

### Takeaway
The biggest scale is in Reddit-story reading. The Two Hot Takes podcast has about 995K YouTube subscribers and about 229M views. These creators take their material from Reddit, or ask for emailed or form submissions. Smaller TikTok confession readers mostly collect through **Google Forms linked in bio**, plus NGL links and DMs. That is a clear tooling gap: creators use general survey software as an anonymous inbox.

### Cited Findings
- **Two Hot Takes** (Morgan Absher's Reddit-story reaction podcast; dating, relationship and AITA stories). Social Blade:
  - about 995K YouTube subscribers and about 229M total views, data through mid-Oct 2026
  - typically about 1K-3K new subscribers per day; channel created Nov 2020
  - Subscriber figures come from the YouTube API via Social Blade, so they are close to primary. — [Social Blade: Two Hot Takes](https://socialblade.com/youtube/channel/UCvUW0xT38Ho7qyUmBgBZXQA); [YouTube @TwoHotTakes](https://www.youtube.com/@TwoHotTakes/videos)
- **Generic "reddit stories" channel (@redditstories3243):** 1,012 videos but only about 2.91K subscribers and about 1.15M views, flat growth (late 2025). This illustrates how saturated low-effort reposting is. — [Social Blade: reddit stories](https://socialblade.com/youtube/handle/redditstories3243)
- **Collection methods:**
  - TikTok: one account ("Confessions by iatetoesforbreakfast") runs a Google Form and posts reads; one of its videos showed 773K likes and 43.3K comments. Other accounts post "Form is in bio!" and thank people for submissions. Many similar Google-Form confession accounts are tiny, for example 381 followers and 46 videos. (All via search snippets of TikTok pages.) — [discover: googleformconfess](https://www.tiktok.com/discover/googleformconfess?lang=en); [discover: send-anonymous-confessions](https://www.tiktok.com/discover/send-anonymous-confessions)
  - Campus and community confession pages have long collected submissions through online forms such as Google Forms and SurveyMonkey, with admins choosing what to post. — [Wikipedia: Confessions page](https://en.wikipedia.org/wiki/Confessions_page)
  - "Are We Dating the Same Guy" (AWDTSG) Facebook groups: anonymous posting goes through moderators. NYC alone had 82K+ members in early 2023, the network is 200+ private city groups, and an early-2025 piece reports "millions of highly engaged members". — [The Free Press](https://www.thefp.com/p/he-just-doesnt-want-to-murder-you); [Seven Days VT](https://www.sevendaysvt.com/?p=137707); [Pirate Wires, 2025](https://www.piratewires.com/p/are-we-dating-the-same-guy)
  - Instagram users rely on NGL/Sendit links in a Story link sticker, or in their bio. — [Wikipedia: NGL](https://en.wikipedia.org/wiki/NGL_(app)); [askbox.buzz guide](https://www.askbox.buzz/blog/how-to-get-anonymous-questions-on-instagram)

### Inferences
- **The tooling need:** a creator-grade anonymous submission inbox. It would combine a link-in-bio form, moderation and triage of a high-volume queue, and one-tap render to a vertical "card" or teleprompter overlay for reading on camera. Optional pieces: consent and permission-to-feature, removing PII, and a reply or follow-up channel to the anonymous sender. Today's stack is Google Forms plus screenshots, or NGL, which is built for personal Q&A rather than creator curation.
- Big creators build an audience on *their personality*. Submissions are fuel, so a tool sells better to creators than a destination site sells to confessors.

### Gaps
- Follower counts for the leading TikTok confession-reading accounts could not be retrieved (TikTok profile pages blocked).
- Social Blade data for rSlash, Mr. Reddit and similar top Reddit-narration channels did not surface in search.
- No data on campus Instagram confession pages in 2025-2026.

## 3. Which apps or websites went viral in this theme in 2025-2026, and what was the hook?

### Takeaway
Every anonymous-app breakout in 2025 had a **social or safety stake attached to real people**. Tea (women anonymously "spilling tea" on men they date) hit No. 1 in the US App Store in July 2025 with 1M+ signups in a week. Its male mirror app TeaOnHer reached the top 3 in Aug 2025. Fizz (anonymous campus feed) is at 620-700+ campuses. Pure anonymous Q&A apps (NGL, Sendit) are mature and under FTC action. Apple removed Tea and TeaOnHer in Oct 2025 over moderation and privacy, so trust and safety is the main risk.

### Cited Findings
- **Tea** (founded 2023):
  - Hit **No. 1 free app** in the US App Store in July 2025. The company said on social media it had **900K+ new signups in a few days**, and Forbes, as relayed by secondary sources, reported **1M+ signups in the week before Jul 24, 2025**.
  - Appfigures estimates **6.1M lifetime iOS downloads** by Oct 2025 and still ranked it #7 in the US App Store in its Oct 17 2025 report.
  - It needed a waitlist because of demand (a student paper also claims 4M users; less reliable). — [NBC News](https://www.nbcnews.com/tech/tech-news/women-are-anonymously-spilling-tea-men-cities-viral-app-rcna220681); [Appfigures, Oct 2025](https://appfigures.com/resources/insights/20251017/2-the-spilling-continues-tea-crosses-6m-downloads); [Bupipedream](https://www.bupipedream.com/?p=175406)
  - Breached Jul 25, 2025: about 72K images, including 13K selfies and IDs, plus 1.1M private messages exposed. 10 class actions had been filed by Aug 7, 2025.
  - **Apple removed Tea and TeaOnHer around Oct 21-22, 2025** ("content moderation and user privacy"). Tea remains on Google Play. — [TechCrunch](https://techcrunch.com/2025/07/26/dating-safety-app-tea-breached-exposing-72000-user-images); [Wikipedia: Tea](https://en.wikipedia.org/wiki/Tea_(app)); [AOL/BI on Apple removals](https://www.aol.com/news/apple-cracking-down-those-viral-003537942.html)
- **TeaOnHer** (launched Aug 2025; men post anonymously about women):
  - Peak chart rank is reported inconsistently: No. 1 (local TV), No. 3 overall free behind Tea and ChatGPT (Business Insider), No. 2 in Lifestyle (TechCrunch).
  - Data-exposure flaw; a House Oversight investigation followed. — [Wikipedia: TeaOnHer](https://en.wikipedia.org/wiki/TeaOnHer); [KLFY](https://www.klfy.com/local/teaonher-app-goes-viral-lets-men-post-anonymously-about-women/amp/)
- **Fizz** (anonymous, campus-gated feed):
  - Campus count is reported differently by date: 620+ US campuses (TechCrunch, Sep 2025), 700+ (AdExchanger, Dec 2025), 240+ colleges and 60 high schools (Colby student paper, Oct 2025).
  - User base doubled from fall 2024 to 2025 and is about 5x its 2023 Series B size; the company gave no absolute number.
  - Expanded into Gopuff grocery delivery (Sep 2025). Colleges debated bans (Dec 2025). — [TechCrunch](https://techcrunch.com/2025/09/03/college-social-app-fizz-expands-into-grocery-delivery); [AdExchanger](https://www.adexchanger.com/marketers/new-social-media-platform-fizz-gives-brands-a-crash-course-in-marketing-to-college-students/); [Forbes, Apr 2025](https://www.forbes.com/sites/ianshepherd/2025/04/18/gen-zs-underground-social-network-just-went-national-and-its-blowing-up/); [FIRE](https://www.fire.org/news/trouble-banning-fizz)
- **NGL** (launched Nov 2021):
  - Most-downloaded US App Store app by June 2022.
  - FTC settlement Jul 2024: $5M and a ban on users under 18. The FTC said NGL generated 1,000+ fake messages to look like they came from real people.
  - Acquired by Mode Mobile in Dec 2025. Users post an NGL link to IG Stories or bio. — [Wikipedia: NGL](https://en.wikipedia.org/wiki/NGL_(app)); [FTC](https://www.ftc.gov/node/85821)
- **Sendit** (anonymous Q&A via Instagram, TikTok and Snapchat integrations):
  - The FTC sued in Sep 2025 (COPPA violations, fake messages, a $9.99/week "Diamond" subscription not clearly disclosed); the case was referred to DOJ.
  - 5M+ Google Play downloads; the company claims about 25M users; 116K self-declared under-13 registrants in 2022. — [TechCrunch, Sep 30 2025](https://techcrunch.com/2025/09/30/anonymous-question-app-sendit-deceived-children-and-illegally-collected-their-data-ftc-alleges/); [Malwarebytes, Oct 2025](https://www.malwarebytes.com/blog/news/2025/10/sendit-app-tricked-kids-harvested-their-data-and-faked-messages-ftc-claims)
- **Gas** (2022, anonymous compliment polls; paid "God mode" reveals who voted):
  - Reached No. 1 in the App Store in Oct 2022.
  - Founder claims (via a TikTok post): $4M in sales, 1B poll answers, and 1 in 3 US teens downloaded it. Older than the 2025-2026 window. — [Wikipedia: Gas](https://en.wikipedia.org/wiki/Gas_(app)); [TikTok @brendangahan](https://www.tiktok.com/@brendangahan/video/7167824792551312686)
- **Newer small entrants:** Anonymy pitches "anonymous messages, questions, and honest feedback from friends, followers, and anyone with their link". I found no evidence of traction. — [App Store: Anonymy](https://apps.apple.com/us/app/anonymy/id6757397478)

### Inferences
- **What went viral:** anonymity *about* or *to* a specific social graph (your dates, your campus, your followers), plus curiosity or safety stakes. Generic "confess to strangers" did not.
- **Monetization pattern:** charging to reveal or hint at who sent something (NGL, Sendit, Gas) works, but it is exactly what the FTC targeted, so it carries regulatory risk.
- **Trust and safety is decisive.** Tea and TeaOnHer were killed on iOS within about 3 months of virality, and NGL and Sendit faced the FTC. A newcomer that is credibly safe, with no fake messages, no dark-pattern reveals, real moderation and minimal data retention, has a positioning angle.

### Gaps
- No verified 2026 viral anonymous app found. Searches surfaced only listicles.
- No current NGL user numbers. A "300M users" figure on Wikipedia cites a dead link.
- I did not find where the Tea virality started (which TikTok creators, view counts).

## 4. Native platform features (Instagram Notes, Questions sticker, Close Friends; TikTok) and the gaps creators work around

### Takeaway
Instagram's Questions sticker is **not anonymous**: responders' usernames are shown. Instagram has said it had no plans for an anonymous version. That gap is the whole reason NGL, Sendit and askbox-type link tools exist (link sticker or bio link). Notes is a big teen surface but not anonymous.

### Cited Findings
- **Questions sticker:** responses arrive with the responder's username and avatar. Instagram's spokesperson said an anonymous questions sticker "was not a feature" and there were no plans to test one (older coverage, circa 2020-2021). — [Fast Company](https://www.fastcompany.com/90520274/no-instagram-has-not-launched-an-anonymous-questions-sticker); [Daily Dot](https://www.dailydot.com/news/instagram-stories-questions-anonymous/)
- **Third-party workarounds:** guides direct users to NGL, Sendit or askbox links pasted into a Story link sticker. — [askbox.buzz](https://www.askbox.buzz/blog/how-to-get-anonymous-questions-on-instagram); [lock.pub](https://lock.pub/en/blog/anonymous-question-box-instagram)
- **Instagram Notes:**
  - Teens were at one point posting 10x more Notes than non-teens.
  - Instagram tested making Notes visible to all followers, not just mutuals. Notes Prompts and @mentions were reported (aggregator).
  - Sep 2026: verified US high-school students in the School Partnership Program get school-related Notes features. — [Social Media Today](https://www.socialmediatoday.com/news/instagram-looks-to-grow-notes-engagement/816910/); [Meta newsroom, Sep 2026](https://about.fb.com/news/2026/09/expanding-instagram-school-partnership-program-help-teens-stay-informed/); [SwipeInsight](https://web.swipeinsight.app/posts/instagram-updates-notes-with-prompts-mentions-and-likes-to-boost-teen-engagement)
- **Instagram Teen Accounts** got PG-13-style restrictions in Oct 2025 (messaging and privacy limits). — [TODAY](https://www.today.com/parents/teens/instagram-announces-new-teen-account-feature-today-interview-exclusive-rcna236861)

### Inferences
- The durable gap is "**anonymous inbound to me from my followers**" on Instagram and TikTok. Neither platform offers it natively, and the incumbent tools are tainted by FTC findings. A link-in-bio inbox aimed at adults and creators (18+, given NGL's under-18 ban and Sendit's COPPA case) fits the gap.
- Teen restrictions keep tightening, so an under-18 audience is legally hazardous. Targeting 18+ creators and adults is safer.

### Gaps
- TikTok native features (Q&A in profile, comment-to-video replies) and whether either is anonymous: not researched due to call budget. As far as I know neither is anonymous, but that is unverified here.
- Close Friends as a "secrets" channel: no data found.

## 5. What do commenters ask for ("I need an app that...")?

### Takeaway
I could not collect primary commenter quotes because TikTok, Instagram and X comments are not accessible without login. The indirect demand signal is TikTok's auto-generated search-topic pages, which reflect viewer searches.

### Cited Findings
- TikTok has topic pages for these searches: "How to Make Google Form for Confession", "How to Make A Anonymous Confession on Google Docs", "App to Send Anonymous Texts", "Best Anonymous Apps", "Best Apps to Chat Anonymous". — [how-to-make-google-form-for-confession](https://www.tiktok.com/discover/how-to-make-google-form-for-confession); [how-to-make-a-anonymous-confession-on-google-docs](https://www.tiktok.com/discover/how-to-make-a-anonymous-confession-on-google-docs); [app-to-send-anonymous-texts](https://www.tiktok.com/discover/app-to-send-anonymous-texts); [best-anonymous-apps](https://www.tiktok.com/discover/best-anonymous-apps)
- One confession-reading video's comment volume (43.3K comments on a 773K-like video) shows the audience engages heavily in the comments. — [discover: googleformconfess](https://www.tiktok.com/discover/googleformconfess?lang=en)

### Inferences
- People are searching for how to *set up* an anonymous confession intake. That is a beginner creator's need: "I want to start a confession account". It points to a zero-setup "start your own anonymous confession / question page" product, with a shareable link and a ready-to-post card output.

### Gaps
- No verbatim "I need an app that..." comments were collected. Logged-in browsing or a manual scan of TikTok and Instagram comments would be needed.
- No X (Twitter) evidence was gathered on "unpopular opinion", "things you can't say out loud" or anonymous-confession accounts.
