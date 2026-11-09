# Indie / Solo-Founder Revenue Landscape (US, 2025-2026) — opportunity scan for saysecretly.com

Research date: 2026-10-27. Verification labels used throughout:
- **[VERIFIED-PSP]** = revenue pulled from a payment provider (Stripe/RevenueCat) via TrustMRR
- **[LEGAL/OFFICIAL]** = court, FTC, or Wikipedia citing official settlement
- **[SELF-REPORTED]** = founder interview, tweet, or blog
- **[3RD-PARTY EST.]** = aggregator or estimate site

Scope note: about 18 tool calls. TrustMRR, the RevenueCat 2026 benchmarks, the a16z list summary, and the FTC/NGL record were covered directly. Product Hunt 2025-26 top launches, Microns, Flippa, and the primary Acquire.com report were **not** fetched (see Gaps).

## 1. What do verified-revenue databases show?

### Takeaway
Verified indie revenue follows a power law. About 2.4% of ~10k TrustMRR products clear $100K ARR, the top 1% capture 76% of 30-day revenue, and the median earner makes $169/month. The money concentrates in B2B marketing/growth tools, AI content/video generators, and a few consumer mobile apps, not simple consumer web apps. US-based products do better than other countries (7.4% have ≥$5K MRR).

### Cited Findings
**Aggregate statistics (TrustMRR dataset, Sept 2026 scrape of 10,150 self-selected products)** — [TechStartups analysis](https://techstartups.com/2026/09/28/what-percentage-of-indie-hacker-products-make-100k-in-arr/)
- 2.4% (245/10,150) have fresh verified MRR ≥ $8,333 (≥ $100K ARR). [VERIFIED-PSP, aggregated]
- 26.1% never recorded a payment; 58.4% have zero MRR; 49.1% earned something in the last 30 days.
- The median 30-day revenue among earners is $169. The top 1% (102 products) take 76.1% of all 30-day revenue.
- The 353 products with ≥$5K MRR have a median age of 18.2 months, a median of 388 active subscriptions, and a **median subscription price of $37** (vs $13 platform-wide). 35.3% of them had negative MRR growth in the last 30 days.
- By age: products under 3 months reach ≥$5K MRR only 1% of the time; products over 4 years old, 19% (survivor bias noted by the author).
- **US payment entities (n=1,916):** 57.7% earning, 7.4% at ≥$5K MRR, 10.3% at ≥$5K in 30-day revenue, median earner $331/30d. The US is the best of all countries listed.
- Categories at ≥$5K MRR: Mobile Apps 8.0%, E-commerce 6.0%, Marketing 4.9%, AI 4.2%, SaaS 3.7%, Education 3.7%, Health & Fitness 3.4%, Dev Tools 2.1%, **Productivity 0.6%, Utilities 0.5%**.
- AI vs non-AI makes no difference: 3.8% vs 3.9% reach ≥$5K MRR. "AI" alone is no longer an edge.
- Founders with 4+ products: 14.1% have one at ≥$5K MRR, vs 5.0% for single-product founders. Only 4.5% of founders with a $5K+ product have a second one.
- 40.7% of money is non-subscription (one-time, usage, etc.), and 24.5% of earners have no subscription revenue at all.

**TrustMRR platform stats page (updated Oct 27, 2026)** — [TrustMRR stats](https://trustmrr.com/stats)
- $1.94B verified revenue across 69M transactions. The US accounts for $1.3B of it.
- Revenue distribution: 67.7% at $0-1k, 17.0% at $1k-10k, 10.3% at $10k-100k, 4.0% at $100k-1M, 1.0% above $1M.
- Top categories by revenue: E-commerce, Content Creation (highest median MRR, $10,231), Marketing, Entertainment (median $2,166), Analytics.
- Correlations: revenue vs time in business r=0.47, vs domain rating r=0.43, **vs X followers only r=0.25**. 53.8% of founders have under 1K X followers.
- Payment providers: Stripe is used by 55.2% of products (median all-time revenue $265). RevenueCat is used by 15.6% ($367). Superwall is used by 0.8% but has the highest median, $4,651, which points to aggressive mobile paywalls as the top earners.

**TrustMRR top leaderboard (homepage, fetched Oct 2026)** — [TrustMRR](https://trustmrr.com) [VERIFIED-PSP]. Note: a search tool flagged a cached copy as possibly stale, but the fetched page references June-Sept 2026 events, so it appears current.
- #1 Stan (creator storefront) $3.57M MRR. GojiberryAI (B2B prospecting) $424K. Postiz (social scheduler, open source) $322K, +49% MoM. 1Lookup (validation API) $269K. Rezi (resume builder) $243K.
- Consumer entries in the top 50: **OmegleWeb** (random anonymous video/text chat with strangers) $70.9K MRR, +14% MoM. **Project A** (AI fortune-telling/astrology, 50M+ downloads) $63.6K MRR, for sale. **PropGPT** (AI sports-betting props) $93K. **Boothie** (AI photo editor, iOS since June 2026) $52K, +29%. **Nutria** (AI calorie tracker) $46K. **GoTall** (Superwall iOS app) $57K. **Speel.co** (AI UGC ad videos) $65K, claims $0 to $1M ARR in 3 months.
- The rest of the top 50 is mostly B2B growth tooling: LinkedIn outreach, AEO/"rank in ChatGPT" SEO, faceless-video generators, and social schedulers.

**Entertainment category (598 startups; top 30 shown)** — [TrustMRR Entertainment](https://trustmrr.com/category/entertainment) [VERIFIED-PSP]
- **Debatium** (couples conversation game): $13.8K MRR, $31K over 30 days, $273K total. Details are under Q4.
- **Imposter AI** (social-deduction party game): $20K MRR, $242K total, for sale.
- **Wasabi** (multiplayer AI party games): $4.9K MRR, $315K total, for sale.
- **Talefy** (AI interactive story games): $19K MRR, $966K total.
- **personalisierter-song.de** (personalized songs for occasions, a gifting product): $5.3K/30d, $198K total, one-time model, for sale.
- **Composer.AI / SongMaker.AI**: $22K MRR, $2.1M total.
- **CoupleAI** (couples app, LatAm): $2.9K MRR, $94K total, for sale.
- Project A: $9.6M total revenue.

**Social Media category (954 startups)** — [TrustMRR Social Media](https://trustmrr.com/category/social-media) [VERIFIED-PSP]
- Dominated by creator/marketing tools: Postiz, Liinks link-in-bio ($31K MRR), POST BRIDGE ($50K), Podawaa, and AI short-video generators.
- An anonymous consumer AI visual-content app shows $719K MRR (for sale).
- None of the top 30 are in dating, confessions, feedback, quizzes, or gifts.

**Marketplace multiples (TrustMRR "recently listed" / "best deals", Oct 2026)** — [TrustMRR](https://trustmrr.com) [VERIFIED-PSP revenue; asking prices only]
- Small apps list at roughly **0.5x-3.4x annual revenue**. Examples: Humanize AI ($9.5K/mo, $299K ask, 2.6x), Harmar AI ($3.6K, $150K, 3.4x), Knightvision ($34K, $250K, 0.6x), and an anonymous mobile app ($36K, $1M, 2.3x).
- Template business Flowmance is an outlier at 7.9x.

**Acquisition multiples (secondary sources only)**
- Acquire.com's Jan 2024 report put the average SaaS deal at 4.3x trailing profit (range 0.63x-34x) — [Livmo summary](https://livmo.com/blog/acquire-com-biannual-acquisition-multiples-report-feb-2023-livmo-summary/) [3RD-PARTY; older data].
- The typical 2026 small SaaS listing on Acquire.com is about $484K (sample of 600+) — [Beancount.io](https://beancount.io/it/blog/2026/07/11/bootstrapped-saas-valuation-multiples-2026-acquire-com-indie-founders-guide) [3RD-PARTY].
- Median 2025 SaaS M&A is about 4.2x ARR (SEG data) — [Acquiry](https://www.acquiry.com/saas-ma-record-volume-2025/) [3RD-PARTY; mostly larger deals].

**Other solo examples (self-reported)**
- Zigpoll (survey SaaS): about $125K MRR, solo — [Indie Hackers](https://www.indiehackers.com/post/tech/hitting-125k-mrr-as-a-solo-founder-by-doubling-down-on-the-right-segment-c4o2Tfs6mjdpip5yZhaO) [SELF-REPORTED].
- Photo AI (Pieter Levels): $105K-$132K/mo by different accounts — [Flowjam roundup](https://www.flowjam.com/blog/27-micro-saas-examples-that-actually-print-money-in-2025) [SELF-REPORTED via roundup; figures conflict].
- Starter Story's own revenue: about $1.6M ARR in 2026 per GetLatka vs about $1M/yr per its own profile; growth came mainly from SEO — [GetLatka](https://getlatka.com/companies/starter-story), [Starter Story](https://www.starterstory.com/stories/starter-story-breakdown) [3RD-PARTY / SELF-REPORTED; conflicting].
- RevenueCat Shipaton 2026 grand prize winner "Mio": about 6,000 downloads, 802 active subscriptions, about $30K revenue — [RevenueCat](https://revenuecat.com/blog/company/shipaton-2026-winners) [SELF-REPORTED by platform].

**a16z Top 100 Gen AI Consumer Apps, 6th edition (Mar 9, 2026)** — [a16z](https://a16z.com/100-gen-ai-apps-6/)
- The list now includes "AI-enhanced" incumbents (Canva, CapCut, Notion, Grammarly), and ChatGPT leads at about 900M WAU — [The Neuron summary](https://www.theneuron.ai/explainer-articles/a16z-just-ranked-the-100-most-popular-ai-apps-heres-the-full-list-and-what-it-tells-us-/).
- Takeaway: the top of consumer AI is now incumbents and frontier labs. It is not a source of solo-founder openings.

### Inferences
- A solo founder's base rate for a new product reaching $5K MRR within 6 months is about 1-4%. Running several bets (a portfolio) roughly triples the odds of one hit.
- Many of the consumer winners on TrustMRR are **mobile apps with hard paywalls** (RevenueCat/Superwall), not Stripe web apps. A Next.js + Stripe consumer web app is fighting the weaker distribution and conversion model unless it has a built-in share loop.
- Verified small-app sale prices of about 1-3x annual revenue mean a $5K MRR consumer app is worth roughly $60K-$180K. Exit value alone does not justify the build.

### Gaps
- Primary Acquire.com 2025/2026 multiples report, Microns, and Flippa listings were not fetched, so the multiples above are secondhand.
- Product Hunt top launches of 2025-2026 were not researched.
- Indie Hackers' verified-revenue product directory was not scraped directly; only the TrustMRR-based analyses were used.

## 2. Which consumer categories are winning for solo founders, and which are saturated?

### Takeaway
The consumer winners with verified revenue are AI image/photo/video generators, astrology/fortune AI, sports-betting AI, calorie/health trackers, and **social/party/couples games** (Debatium, Imposter AI, Wasabi, Talefy). Productivity and utility tools are the worst-performing categories. B2B "growth tooling" (AEO/SEO, LinkedIn outreach, social schedulers, faceless video) is lucrative but extremely crowded.

### Cited Findings
- Productivity (0.6%) and Utilities (0.5%) have the lowest share of products at ≥$5K MRR, while Mobile Apps (8.0%) and E-commerce (6.0%) have the highest — [TechStartups](https://techstartups.com/2026/09/28/what-percentage-of-indie-hacker-products-make-100k-in-arr/) [VERIFIED-PSP aggregate].
- Content Creation has the highest median MRR of any category ($10,231), and Entertainment's median is $2,166 with 19% 30-day growth — [TrustMRR stats](https://trustmrr.com/stats).
- Entertainment has 598 listed startups and Social Media 954. The top Social Media slots are almost all creator/marketing tooling — [TrustMRR Entertainment](https://trustmrr.com/category/entertainment), [Social Media](https://trustmrr.com/category/social-media).
- Relationship/couples games with verified revenue: **Debatium** at $13.8K MRR and **CoupleAI** at $2.9K MRR. Both are mobile — [TrustMRR](https://trustmrr.com/startup/debatium).
- Party/social games: **Imposter AI** $20K MRR, **Wasabi** $4.9K MRR, **Talefy** $19K MRR — [TrustMRR Entertainment](https://trustmrr.com/category/entertainment).
- Gifting/occasion: **personalisierter-song.de** (personalized occasion songs) has $198K total, one-time payments, and is for sale. **SongMaker.AI** has $2.1M total — [TrustMRR Entertainment](https://trustmrr.com/category/entertainment).
- Anonymous stranger chat: **OmegleWeb** is at $70.9K MRR with +14% MoM growth — [TrustMRR](https://trustmrr.com).
- AI apps earn a 41% higher year-1 LTV ($30.16 vs $21.37), but AI monthly plans retain 36% worse — [RevenueCat 2026 benchmarks](https://www.revenuecat.com/blog/growth/subscription-app-trends-benchmarks-2026).
- Subscription apps are polarizing: the top quartile grew MRR 80%+ YoY while the bottom quartile shrank more than 33% — [RevenueCat](https://www.revenuecat.com/blog/growth/subscription-app-trends-benchmarks-2026).

### Inferences
- **Saturated:** AI headshot/photo editors, faceless-video/UGC generators, AEO/"rank in ChatGPT" SEO tools, social schedulers, LinkedIn automation, resume builders, generic AI chat wrappers, and NGL-clone anonymous Q&A link sites (many free clones advertise "no hint paywall"; see Q4).
- **Less crowded consumer niches with verified traction:** couples/relationship conversation games, small-group party/social-deduction games, and occasion/gift personalization. These fit a "say secretly" brand better than most B2B categories do.
- I found no verified solo examples of "Wrapped"-style or personality-quiz viral sites with sustained revenue. Such sites appear to monetize poorly beyond spikes; this is unconfirmed.

### Gaps
- There is no TrustMRR breakdown for dating, quiz, gifting, or journaling categories specifically. I could only view the top 30 per category.
- No verified data was found on AI companion or journaling apps from solo founders.

## 3. What growth channels worked?

### Takeaway
Verified data says audience size matters less than people assume (revenue vs X followers r=0.25). Domain authority/SEO (r=0.43) and time in market (r=0.47) correlate more. Consumer social apps grew through link-sharing loops (NGL via Instagram/WhatsApp), and mobile winners through TikTok/UGC plus hard paywalls. Product Hunt is not evidenced as a driver.

### Cited Findings
- TrustMRR correlations: revenue vs X followers r=0.25 (n=6,063), vs domain rating r=0.43, vs time in business r=0.47. Revenue outpaced follower growth in 80% of cases — [TrustMRR stats](https://trustmrr.com/stats).
- NGL's growth in India, Brazil, and Saudi Arabia was partly driven by users sharing NGL links on WhatsApp. The core loop is "post your link to your story, friends send anonymous messages" — [Wikipedia: NGL](https://en.wikipedia.org/wiki/NGL_(app)).
- Starter Story: a majority of visitors come from SEO, and viral case studies created a supply loop — [Starter Story search summary](https://www.starterstory.com/stories/starter-story-breakdown) [SELF-REPORTED].
- Shipaton 2026 "Funnel Vision" winner In Your Own Words uses a **web quiz before app download**, with a web purchase unlocking in-app content — [RevenueCat Shipaton 2026](https://revenuecat.com/blog/company/shipaton-2026-winners).
- Counterexample: a 15-year-old's screen-time app got 2.3M TikTok views but only about $700 in revenue — [Social Growth Engineers](https://www.socialgrowthengineers.com/15-year-old-solo-founder-hits-2-3m-views-for-his-screen-time-app) [SELF-REPORTED]. Virality without a paywall moment does not monetize.
- Reddit/AEO marketing is itself a product category ("Reddit Agency" $35K MRR; "Launch Club" $32K MRR), which shows Reddit-for-AI-search is a channel founders currently pay for — [TrustMRR Social Media](https://trustmrr.com/category/social-media).

### Inferences
- A share-loop product, where each user's link recruits recipients (anonymous messages, group games, Secret Santa-style draws, surprise collection), is the only channel a solo founder gets for free. SEO compounds but is slow, and the TrustMRR data favors older domains.
- A web-first quiz or experience funneling to a paywall is a validated 2026 pattern and fits Next.js + Stripe.

### Gaps
- No verified per-channel attribution data across products. TikTok/UGC effectiveness evidence is anecdotal.
- Product Hunt's impact on 2025-26 launches was not researched.

## 4. Products in or adjacent to secrets / anonymity / honest feedback / surprise, with revenue

### Takeaway
The category has proven, large-scale consumer demand. NGL reportedly approached 300M users, and Sendit monetized $9.99/week "reveal" memberships. But the dominant monetization pattern, paying to unmask senders, drew FTC enforcement in 2024 and 2025. Verified indie revenue nearby exists in couples conversation games (Debatium, $13.8K MRR) and anonymous stranger chat (OmegleWeb, $70.9K MRR).

### Cited Findings
- **NGL** launched Nov 2021 (Raj Vir, João Figueiredo, Venice Beach). Its paid "NGL Pro" offered hints about sender identity. A July 2024 FTC + LA DA settlement **banned users under 18 and imposed a $5M payment**. Mode Mobile acquired it in **Dec 2025**. A press release cited a "300 million user mark" (dead link, unverified) — [Wikipedia: NGL](https://en.wikipedia.org/wiki/NGL_(app)) [LEGAL/OFFICIAL for FTC facts].
- One aggregator puts NGL's revenue at about $2.4M by July 2022 from hints — [Accio](https://www.accio.com/business/ngl_trend) [3RD-PARTY EST., older data, weak].
- **Sendit:** in a Sept 2025 FTC complaint, the FTC alleged it illegally collected children's data, sent fake anonymous messages, and sold a **$9.99 "Diamond Membership" for reveals** without making clear it was a recurring weekly charge — [TechCrunch](https://techcrunch.com/2025/09/30/anonymous-question-app-sendit-deceived-children-and-illegally-collected-their-data-ftc-alleges/) [LEGAL/OFFICIAL via press].
- **Tellonym:** German, launched 2016, updates have slowed. No revenue data — [Unstore](https://unstore.io/discover/best-ngl-alternatives/) [3RD-PARTY].
- A crowded field of free NGL clones markets itself on having no hint paywall (tellmeanything.link, plsconfess.com) — [tellmeanything.link](https://tellmeanything.link/ngl-alternative.html), [plsconfess](https://plsconfess.com/blog/best-ngl-alternatives).
- **OmegleWeb** (anonymous random video/text chat): $70,856 MRR, +14% MoM, $382K total — [TrustMRR](https://trustmrr.com) [VERIFIED-PSP].
- **Debatium** (France, solo founder "Killian", 183 X followers): $13,784 MRR from 1,959 subscriptions, $31.4K over 30 days, $273K total, tracked since Dec 2025. Free tier plus **Premium at $8.99/week**. iOS only, 4.6 stars from 230 ratings, claims about 1M B2C couples users, no ads — [TrustMRR Debatium](https://trustmrr.com/startup/debatium) [VERIFIED-PSP via RevenueCat].
- **Imposter AI** (social-deduction "who's the secret imposter" party game): $20K MRR, $242K total — [TrustMRR Entertainment](https://trustmrr.com/category/entertainment) [VERIFIED-PSP].
- Historical precedent: WotWentWrong (2012) offered anonymous post-date feedback — [Wikipedia](https://en.wikipedia.org/wiki/WotWentWrong). Revenue unknown, and the product is defunct.

### Inferences
- Demand for "say it anonymously" is proven, but the business model that made money (teen audience plus paid unmasking) is now legally toxic in the US. A "say secretly" product must be **18+, never sell sender reveals, and never fake messages**.
- Defensible adjacent angles with evidence of willingness to pay:
  1. Couples/friends "honest questions" games, following Debatium's model
  2. Group surprise/secret-gift coordination, a gifting/occasion variant
  3. Anonymous team or 360 feedback, a B2B variant (no revenue data found)
- The domain fits these angles naturally.

### Gaps
- No verified revenue was found for Secret Santa generators, anonymous workplace-feedback micro-SaaS, confession sites, or anonymous dating-feedback tools.
- No 2025 revenue for NGL, Sendit, or Tellonym. Sensor Tower or Appfigures data was not accessed.

## 5. Which price points and models convert best for consumer web apps?

### Takeaway
For consumer subscriptions, hard paywalls beat freemium by about 5x on conversion and about 8x on revenue per install. Weekly pricing ($8.99-$9.99/week) is common among the consumer winners. Successful indie products charge more than average (median $37/mo vs $13). One-time and credit-pack payments make up about 40% of indie revenue and suit novelty/occasion products.

### Cited Findings
- **Paywall type (Day-35 trial-to-paid):** hard paywall 10.7% median vs freemium 2.1%. Revenue per install at day 60 is $3.09 vs $0.38. Year-1 retention is similar (27% vs 28%) — [RevenueCat 2026](https://www.revenuecat.com/blog/growth/subscription-app-trends-benchmarks-2026) [vendor data, 115K+ apps, mobile].
- **Trial length:** 17-32 day trials convert at 42.5% vs 25.5% for trials under 4 days. 55.4% of 3-day-trial cancellations happen on Day 0 — [RevenueCat 2026](https://www.revenuecat.com/blog/growth/subscription-app-trends-benchmarks-2026).
- About **72% of annual subscribers cancelled in year 1 in 2026**, up from about 56% in 2025 — [RevenueCat 2026](https://www.revenuecat.com/blog/growth/subscription-app-trends-benchmarks-2026).
- North America's median conversion is 2.6%, and the 90th percentile is 10.4% — [ppc.land on RevenueCat](https://ppc.land/ai-apps-earn-41-more-per-user-but-churn-30-faster-revenuecat-finds/) [3RD-PARTY summary].
- Products at ≥$5K MRR have a median subscription price of $37 vs $13 platform-wide. 40.7% of verified money is non-subscription, and 24.5% of earners have no subscriptions — [TechStartups](https://techstartups.com/2026/09/28/what-percentage-of-indie-hacker-products-make-100k-in-arr/).
- Weekly pricing examples among consumer winners: Debatium $8.99/week [VERIFIED-PSP]; Sendit $9.99/week [FTC complaint] — [TrustMRR](https://trustmrr.com/startup/debatium), [TechCrunch](https://techcrunch.com/2025/09/30/anonymous-question-app-sendit-deceived-children-and-illegally-collected-their-data-ftc-alleges/).
- One-time consumer purchases: unnamed B2C solo apps at about $40 one-time are reported at $100K+/mo [SELF-REPORTED, unnamed]. RankInPublic earns mostly one-time revenue at $11-17K/mo — [Indie Hackers](https://www.indiehackers.com/post/tech/stuck-at-300-mo-until-revenue-skyrocketed-to-17k-mo-in-a-month-uMOSolSKjXGX74a0lVGQ) [SELF-REPORTED].
- Occasion-based one-time model: personalisierter-song.de at $198K total — [TrustMRR](https://trustmrr.com/category/entertainment) [VERIFIED-PSP].
- On TrustMRR, Superwall (aggressive mobile paywall tooling) users have the highest median all-time revenue ($4,651) vs Stripe ($265) — [TrustMRR stats](https://trustmrr.com/stats).

### Inferences
- For an episodic "say secretly" use (a birthday, a group surprise, a one-off honest-feedback round), **per-event one-time pricing ($5-$29) is likely to convert better** than a subscription. Recurring relationship rituals (couples questions) fit weekly or monthly subscriptions.
- Weekly recurring charges for reveal-style features carry FTC risk (Sendit). Clear disclosure is mandatory.
- The web (Stripe) route avoids app-store fees, but the evidence suggests mobile paywall apps convert better. A web-quiz-to-paywall funnel is a reasonable hybrid.

### Gaps
- No primary data comparing one-time vs subscription conversion for **web** (non-app-store) consumer products.
- The full RevenueCat PDF (weekly vs annual pricing share, category medians for Social/Lifestyle) was not accessed.
- No verified data on per-event pricing for group/occasion tools (e.g., Elfster, DrawNames).
