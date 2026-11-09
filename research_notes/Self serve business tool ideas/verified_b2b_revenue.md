# Verified-revenue self-serve B2B products from solo founders and tiny teams ($2K-$50K MRR, 2025-2026)

Research date: 2026-10-28. All TrustMRR figures were read from live pages on 2026-10-28; each page said "last updated Oct 28, 2026".

**Verification labels used below**
- **[PV]**: payment-provider verified. TrustMRR reads revenue through a read-only Stripe or Paddle API key.
- **[SR]**: self-reported by the founder or a third party (blog post, interview, Indie Hackers post).
- **[PV, SR context]**: the money figure is PV, but founder-written fields on the same page are SR. These fields include descriptions, team size, channels, and churn claims.

**Access notes for the report writer**
- trustmrr.com could be fetched. Its category pages show only the first 30 entries of each category; the rest sit behind a "Load More" button I did not go past.
- The TrustMRR API requires a bearer key (`tmrr_...`), so it was not used ([docs](https://trustmrr.com/docs/api/get-startup)).
- indiehackers.com returned HTTP 403 to WebFetch. Its content is cited only from search-result snippets.
- starterstory.com and bigideasdb.com failed with "self signed certificate in certificate chain", which points to TLS interception on this network. I did not bypass it.
- Medium returned 403.
- Acquire.com listings require a login and were not accessed. Microns was covered only through its public newsletter.

**Caveats for every TrustMRR figure**
- "Founded" is founder-entered.
- "All-time revenue" covers whatever Stripe/Paddle history is connected, so it can predate the product's current form. For example, Karma shows "Founded Jan 2024" but $742K all-time.
- TrustMRR does not show customer geography. "Country" is the founder's country, not where customers are. Most examples here have non-US founders; the products sell globally in English, but US share is unknown.

---

## Q1. Dataset: concrete B2B products with MRR, price, age, founders, and channel

### Takeaway
I found more than 30 B2B products with payment-verified MRR between $2K and $50K. The strongest self-serve examples share three traits:
- They solve a narrow technical or operational job.
- They offer a free tier or trial.
- They are found through SEO, docs, or a marketplace rather than outbound.

Examples: a contact-form API, a QuickBooks Desktop API, a self-hosted email API, Looker Studio templates, a booking tool for home services, and async video interviews.

The per-product acquisition channel is the weakest field. TrustMRR shows a channel list for only some startups, and those lists are self-entered. Very few founders explicitly state "no sales calls."

### Cited Findings

#### Developer and API tools (strongest self-serve evidence)

**Web3Forms** [PV, SR context]
- Contact-form API for static and modern websites.
- MRR **$43,387**; 3,149 active subscriptions (about $13.8 per subscription); $346K all-time.
- Founded Dec 2020; solo founder Surjith S M (India); bootstrapped; payments through Paddle.
- Free plan of 250 submissions/month, with paid plans above it.
- Source: [TrustMRR](https://trustmrr.com/startup/web3forms)
- Channel [SR]: early traction came from Twitter, then the founder focused on SEO ([founder interview](https://pau1.substack.com/p/web3forms-interview-with-developer)). Starter Story says it "primarily focused on SEO" with templates and free resources ([Starter Story](https://www.starterstory.com/web3forms-breakdown)). Starter Story's headline describes a slow start: "20 paying customers in 20 months".
- Paid price is $8-$12/month depending on the source ([splitforms](https://splitforms.com/web3forms-pricing)).

**Conductor** (conductor.is) [PV, SR context]
- QuickBooks Desktop/Enterprise API for B2B developers.
- MRR **$44,887**; 299 subscriptions; $503K all-time.
- Founded Jul 2022; founder Danny Nemer (US).
- Pricing: $49 per company file per month; Enterprise custom.
- Founder claims [SR]: "virtually no churn", 7% month-over-month growth, $350K ARR. Enterprise customers reportedly include Ramp.
- Listed for sale.
- Source: [TrustMRR](https://trustmrr.com/startup/conductor)
- Channel: not stated on the page. A search snippet said TrustMRR lists "outbound sales", but that snippet mixed in another startup's data and is unreliable. The company's blog targets search queries like "QuickBooks Desktop REST API" ([Conductor blog](https://conductor.is/blog/quickbooks-desktop-rest-api)).

**EmailEngine** [PV, SR context]
- Self-hosted email API covering IMAP, SMTP, Gmail, and Microsoft Graph.
- MRR **$19,444**; 238 subscriptions; $615K all-time.
- Price $1,450/year with a 14-day trial.
- Founded May 2020; **solo founder** Andris Reinman (Estonia); bootstrapped.
- **Acquisition channel listed: SEO.**
- Source: [TrustMRR](https://trustmrr.com/startup/emailengine)

**Capgo** [PV]
- Live updates and release observability for Capacitor mobile apps.
- MRR **$33,103**; 1,200 subscriptions (about $28 each).
- Founded Nov 2021; team of 2-5; Estonia.
- 14-day free trial with no credit card required.
- Source: [TrustMRR](https://trustmrr.com/startup/capgo)

**Image-Charts** [PV]
- Chart-image API for use in emails, PDFs, and chatbots.
- MRR **$6,255**; 50 subscriptions; $543K all-time.
- Free tier; Business $89/month and Enterprise $224/month, both billed yearly.
- Founded Jan 2017 (older product, still earning); solo founder F-G Ribreau (France); bootstrapped.
- Source: [TrustMRR](https://trustmrr.com/startup/image-charts)

**Developer Tools category page, MRR only** [PV] ([TrustMRR dev tools](https://trustmrr.com/category/developer-tools))

| Product | MRR | What it does / notes |
|---|---|---|
| Apiframe | $36K | One API for many AI models |
| AutoContent API | $17K | Content-generation API; for sale |
| Brevilabs | $18K | Personal-context tools for AI agents |
| Screenshot to Code | $4.5K | Screenshot-to-code converter; for sale |
| Solvent Global | $5.5K | Part of revenue is billed through Whop and not counted |

#### Local service businesses and SMB operations

**ConvertLabs** [PV]
- Booking, payments, websites, and marketing for **home-service businesses**.
- MRR **$28,776**; 474 subscriptions; $2.24M all-time.
- Pricing: **$67 / $197 / $397 per month**.
- Founded Apr 2018 (older); founder Rohan Gilkes (US).
- Channel: not listed.
- Source: [TrustMRR](https://trustmrr.com/startup/convertlabs)

**Calendesk** [PV]
- Booking, payments, and client management for therapists, lawyers, coaches, dietitians, tutors, and fitness and beauty professionals.
- MRR **$20,627**; 369 subscriptions; $1.15M all-time.
- Pricing: $79-$147 per month.
- Founded May 2020; Maciej Cupial (Poland).
- Source: [TrustMRR](https://trustmrr.com/startup/calendesk)

**Marky** [PV, SR context]
- Social media management.
- MRR **$22,067**; 476 subscriptions.
- Founded Jul 2023; US; two people credited as founder.
- **Channels listed: Facebook, Meta Ads, word of mouth, influencers**, so this is paid plus organic, not purely organic.
- Audience conflict: the profile names local service businesses, but the category listing describes "self-publishing authors".
- Listed for sale on the category page.
- Sources: [TrustMRR](https://trustmrr.com/startup/marky); [TrustMRR marketing category](https://trustmrr.com/category/marketing)

**Plutio (Super Work AI)** [PV]
- All-in-one tool to run a freelancer or small business.
- MRR **$20K**; for sale.
- Source: [TrustMRR SaaS category](https://trustmrr.com/category/saas)

#### E-commerce merchants

**Pushouse** [PV, SR context]
- WhatsApp automation and support for e-commerce.
- MRR **$26,254**; 254 subscriptions.
- Founded Jan 2026, so it reached about $26K MRR in under 10 months.
- **Counter-example:** its channels include Meta, Google, and YouTube ads, **cold calling, cold email**, events, and partnerships. This is not self-serve-only.
- Source: [TrustMRR](https://trustmrr.com/startup/pushouse)

**CartBoss** [PV]
- Pay-as-you-go SMS cart recovery.
- **$28K in 30-day revenue, $0 MRR** (usage-based, not subscription); $1.8M all-time.
- Source: [TrustMRR e-commerce](https://trustmrr.com/category/ecommerce)

**Low Content AI** [PV]
- AI tool that creates low-content books for Amazon KDP sellers.
- MRR $14K; for sale.
- Source: [TrustMRR e-commerce](https://trustmrr.com/category/ecommerce)

**Zigpoll** [SR, not on TrustMRR; above the target band]
- Customer surveys for Shopify stores.
- Founder Jason Zigelbaum: "I run the company solo: no cofounder, no funding, no sales team."
- About $1.03M ARR at the start of 2026, about $125K MRR by June 2026.
- Took about 2 years to get traction, then doubled every year.
- **The Shopify App Store brings about one third of new signups.** The founder calls "Shopify app first" his most important distribution decision.
- Source: [Indie Hackers, via search snippet; the page returned 403](https://www.indiehackers.com/post/c4o2Tfs6mjdpip5yZhaO)

**Microns Shopify app listings** [SR, marketplace showcase]

| App | Revenue | Customers | Asking price |
|---|---|---|---|
| Order-management app | $1,620 MRR | 151 | $5,000 |
| Security app | about $1,900 ARR | 14 | $5,500 |
| Digital-downloads app | $4,320 ARR | 175 | $3,000 |

These show that the typical small Shopify app sits far below $2K MRR.

Sources: [Microns June](https://newsletter.microns.io/p/microns-in-june-9-startups-sold-worth); [Microns 2025 review](https://newsletter.microns.io/p/2025-year-in-review); [Microns trend](https://newsletter.microns.io/p/new-trend-for-micro-startup-acquisitions-1277514)

#### Agencies, marketers, and analysts

**Data Bloo** [PV]
- Looker Studio report templates and connectors for marketers, agencies, e-commerce, and SMBs.
- MRR **$6,541**; 238 subscriptions; $661K all-time; about 4,000 users.
- Founded Oct 2021; Giannis Stratakis (Greece); founder has only 70 X followers, so this is not audience-driven.
- Also sells one-time unlimited-access purchases.
- Source: [TrustMRR](https://trustmrr.com/startup/data-bloo)

**Simple Analytics** [PV]
- Privacy-first, consent-proof web analytics for analysts, agencies, enterprises, and white-label partners.
- MRR **$37,998**; 1,254 subscriptions (about $30 each); free tier.
- Founded Aug 2018 (older); Netherlands.
- Source: [TrustMRR](https://trustmrr.com/startup/simple-analytics)

**SEOBOT** [PV]
- AI SEO agent.
- MRR **$33,304**; 487 subscriptions; $49/month.
- Founded Sep 2023; John Rush (Türkiye), who has **116.6K X followers**. This is audience-driven distribution, not a replicable baseline.
- Source: [TrustMRR](https://trustmrr.com/startup/seobot)

**Agency and white-label chatbot tools** [PV] ([TrustMRR customer support](https://trustmrr.com/category/customer-support))

| Product | MRR | What it does |
|---|---|---|
| ChatDash | $19K | White-label AI assistant dashboard for agencies |
| anon-2 | $5.5K | Tool for agencies selling chatbots to local businesses |
| DM Champ | $14K | White-label AI sales agent |

**Connor Cedro SEO** [PV, SR context]
- MRR $5,763 from **9 subscriptions**, which are month-to-month retainers.
- One-person, bootstrapped; tags "seo" and "word-of-mouth".
- This is a service sold as a subscription, not software.
- Source: [TrustMRR](https://trustmrr.com/startup/connor-cedro-seo-ai-writing-tool)

#### HR, office, and internal teams

**Hirevire** [PV, SR context]
- Async one-way video interviews that replace first-round phone screens.
- MRR **$13,289**; 157 subscriptions.
- Pricing: **$49 / $149 / $249 per month**.
- Founded Dec 2021; team of 2-5 (India); bootstrapped.
- Source: [TrustMRR](https://trustmrr.com/startup/hirevire)

**Karma** [PV]
- Employee recognition bot for Slack and Microsoft Teams.
- MRR **$6,159**; 263 subscriptions; **$3 per user per month**; about 14K users.
- New Zealand.
- "Founded Jan 2024" conflicts with $742K all-time revenue, so the product is likely older.
- Source: [TrustMRR](https://trustmrr.com/startup/karma)

**Guidejar** [PV]
- Interactive product demos, how-to guides, and SOP documentation.
- MRR **$4,905**; 211 subscriptions; free plan of 5 guides; about 10K users.
- Founded Jul 2023; India.
- Source: [TrustMRR](https://trustmrr.com/startup/guidejar)

**Textwork** [PV]
- After-hours SMS applicant screening for volume hiring.
- MRR $2,919 from **only 2 subscriptions**, despite a "Try it for $99/mo" plan.
- Founded 2018; US.
- Likely sales-assisted, high-ACV accounts, so this is not a self-serve example.
- Source: [TrustMRR](https://trustmrr.com/startup/textwork)

#### Other B2B or creator-business tools (MRR only) [PV]

| Product | MRR | What it does / notes | Source |
|---|---|---|---|
| Chat Data | $18K | AI agents trained on business documents | [customer support](https://trustmrr.com/category/customer-support) |
| Czat.ai | $7.6K | Custom GPT chatbots | [customer support](https://trustmrr.com/category/customer-support) |
| Chatwith | $3.6K | Chatbot trained on a website | [customer support](https://trustmrr.com/category/customer-support) |
| Fidelatoo | $6.9K | Loyalty program | [customer support](https://trustmrr.com/category/customer-support) |
| ADELANTE | $17K | AI support agents | [customer support](https://trustmrr.com/category/customer-support) |
| MagicSlides.app | $10K | Google Slides add-on that generates slides with AI; for sale | [productivity](https://trustmrr.com/category/productivity) |
| Taja AI | $14K | Repurposes long videos into social clips for small businesses | [productivity](https://trustmrr.com/category/productivity) |
| Angel Match | $27K | Investor database | [productivity](https://trustmrr.com/category/productivity) |
| ColdSire | $15K | Pre-configured mailboxes for cold-email agencies; for sale | [productivity](https://trustmrr.com/category/productivity) |
| Liinks | $31K | Link-in-bio for creators-as-businesses | [productivity](https://trustmrr.com/category/productivity) |

#### Older or self-reported reference cases [SR]

| Product | Revenue and timing | Channel | Source |
|---|---|---|---|
| Instatus | Solo founder; about $10K MRR, 350+ paying customers, growing about $500/month | Tagged "word of mouth" | [Starter Story](https://www.starterstory.com/stories/instatus) |
| Bannerbear | About 3 years to $15K MRR | Not stated | [Indie Hackers AMA](https://www.indiehackers.com/post/i-bootstrapped-my-saas-to-15-000-mrr-over-3-years-ama-2a81b59993) |
| Subscribr | $10K MRR within 100 days of an April 2024 launch; about $1M/year about 18 months in | Not stated | [Indie Hackers](https://www.indiehackers.com/post/tech/leaving-a-funded-startup-and-bootstrapping-to-1m-yr-in-18-months-kPBpdxsTeQitOWOOVs2g) |
| Unnamed B2B SaaS (@pbteja1998) | $13K MRR, 50K visitors, zero ad spend | "Engineering as marketing": free mini-tools ranked on Google | [Starter Story on X](https://x.com/starter_story/status/2022093673568330155?lang=en) |
| Spencer Patterson's paywall SaaS | Solo; about $125-142K MRR; sold for $3.5M | Used **outbound** DMs, affiliates, and contests | [Starter Story](https://www.starterstory.com/stories/spencer-patterson) |

All Indie Hackers figures above come from search snippets because the pages returned 403.

### Inferences
- Among verified self-serve examples, the products with high subscription counts and low prices share a pattern. They are a developer primitive with a generous free tier, found through docs and SEO. Web3Forms has about 3,100 subscriptions at about $14; Simple Analytics has 1,254 at about $30; Capgo has 1,200 at about $28. Lifetime revenue climbs slowly; Web3Forms took roughly 5 years to reach $43K MRR.
- A second pattern is fewer customers at a higher price: about $100-$1,500 per account per year, sold to a narrow professional user. Examples are EmailEngine, Conductor, ConvertLabs, Calendesk, and Hirevire. They reach $13K-$45K MRR with only 150-500 subscriptions.
- Many $20K+ MRR products are 3-8 years old: Image-Charts (2017), ConvertLabs (2018), Simple Analytics (2018), EmailEngine (2020), Calendesk (2020), Web3Forms (2020). Durable self-serve B2B income usually takes years, not months. The fast exceptions (Pushouse in under 10 months, SEOBOT, Subscribr) relied on paid ads, outbound, or a large existing audience.

### Gaps
- I found almost no TrustMRR examples where the founder explicitly says "no sales calls". The structured channels field was listed only for EmailEngine (SEO), Marky (paid social plus word of mouth), Pushouse (outbound plus ads), and Connor Cedro (SEO plus word of mouth). Zigpoll is the clearest "no sales team" statement, but it is self-reported and above the band.
- Founder count is missing for most entries. TrustMRR "team size" was shown only for Hirevire and Capgo (2-5 each).
- I could not pull a full filtered dataset (B2B, solo, by channel) because the API needs a key. Category pages also show only the top 30 by total revenue, which biases the sample toward older, larger products.
- Acquire.com listings were not accessible because they require a login.
- Customer geography, including US share, is not available on TrustMRR.

---

## Q2. Patterns: which customer types pay most reliably through self-serve? Typical churn and price points

### Takeaway
The verified dataset points to four groups that pay steadily without sales calls:
- **Developers**, who buy APIs and infrastructure.
- **Local and appointment-based service businesses**, who buy booking and payment tools at $67-$197/month.
- **Agencies and marketers**, who buy templates, white-label tools, and reporting.
- **Shopify merchants**, reached through the App Store.

Recruiting and HR is thin on the B2B side; most "recruiting" revenue on TrustMRR comes from job seekers, which is B2C.

SMB self-serve monthly churn is commonly cited at 3-7%, and 5-7% for plans under $25. Both figures come from aggregators, not primary data.

### Cited Findings

**Price points actually observed [PV]:**

| Product | Price |
|---|---|
| Karma | $3 per user per month |
| Web3Forms | $8-$12/month (about $14 average per subscription) |
| Conductor | $49 per company file |
| SEOBOT | $49 |
| Hirevire | $49 / $149 / $249 |
| ConvertLabs | $67 / $197 / $397 |
| Calendesk | $79-$147 |
| Image-Charts | $89-$224/month, billed annually |
| EmailEngine | $1,450/year |

Sources: [Karma](https://trustmrr.com/startup/karma), [Web3Forms](https://trustmrr.com/startup/web3forms), [Conductor](https://trustmrr.com/startup/conductor), [SEOBOT](https://trustmrr.com/startup/seobot), [Hirevire](https://trustmrr.com/startup/hirevire), [ConvertLabs](https://trustmrr.com/startup/convertlabs), [Calendesk](https://trustmrr.com/startup/calendesk), [Image-Charts](https://trustmrr.com/startup/image-charts), [EmailEngine](https://trustmrr.com/startup/emailengine)

**Developers.** Of the first 30 Developer Tools entries, 11 B2B dev products sit between $4K and $45K MRR, and many have free tiers or trials ([TrustMRR dev tools](https://trustmrr.com/category/developer-tools)).

**Recruiting and HR.** The Recruiting & HR category has only 260 verified startups ([TrustMRR recruiting](https://trustmrr.com/category/recruiting)).
- Most of the top 20 sell to job seekers: resume builders, job boards, application tools.
- The clear B2B hiring tool is Hirevire at $13K.
- B2B tools for small employers are tiny: Groove Hiring (applicant management for local service companies) at $29 MRR, and JuggleHire at $600 MRR.

**Category sizes** (verified startups per category, read from page counters on 2026-10-28):

| Category | Verified startups | Source |
|---|---|---|
| SaaS | 4,640 | [SaaS](https://trustmrr.com/category/saas) |
| Productivity | 3,439 | [Productivity](https://trustmrr.com/category/productivity) |
| Marketing | 1,818 | [Marketing](https://trustmrr.com/category/marketing) |
| Developer Tools | 1,624 | [Dev tools](https://trustmrr.com/category/developer-tools) |
| Social Media | 958 | [Social media](https://trustmrr.com/category/social-media) |
| Customer Support | 366 | [Customer support](https://trustmrr.com/category/customer-support) |
| Recruiting | 260 | [Recruiting](https://trustmrr.com/category/recruiting) |

**Shopify App Store economics** [SR / estimates]
- Developers pay no revenue share on their first $1M in lifetime revenue, and 15% above that ([Liquid Weekly](https://liquidweekly.com/blogs/newsletter/issue-182-indie-dev-building-shopify-apps-since-2021-including-a-successful-exit-and-6-figure-mrr)).
- One blog estimates the median listed app earns under $1K/month ([Week One Labs](https://weekonelabs.com/blog/shopify-app-revenue-benchmarks-2026)).
- Another describes a typical path: 3-6 months under $500 MRR, then $1K-$3K MRR within the first year, and a "solid middle" of $2K-$20K MRR ([Adsx](https://adsx.com/blog/how-much-shopify-app-developers-make)).
- Both are estimates, not disclosed revenue.

**Churn benchmarks** [aggregator, weak]
- SMB SaaS monthly churn is about 3-7% (30-58% a year) ([UserJot](https://userjot.com/blog/saas-churn-rate-benchmarks); [Vena](https://venasolutions.com/blog/saas-churn-rate)).
- SMB SaaS priced under $25/month sees about 5-7% monthly churn ([Sender.net](https://www.sender.net/marketing-glossary/churn-rate/statistics/)).
- Self-serve/PLG median annual gross revenue churn is 12-16%, a ProfitWell/Paddle figure cited second-hand ([GTM8020](https://www.gtm8020.com/blog/saas-churn-rate-statistics)).
- Monthly contracts churn 3-5x more than annual ones, attributed to Recurly 2025 ([Visionary Marketing](https://visionary-marketing.co.uk/blog/saas-churn-benchmarks-2026)).
- The only product-level churn statement found is Conductor's "virtually no churn" [SR] ([TrustMRR](https://trustmrr.com/startup/conductor)).

### Inferences
- **Most reliable payers:**
  - Developers and technical teams who embed an API, which carries high switching cost.
  - Appointment-based professionals and home-service businesses who run bookings and payments through the tool.
- **Agencies are a good repeat buyer for white-label tools.** ChatDash, anon-2, and DM Champ sit at $5K-$19K MRR. Tools sold to cold-email agencies (ColdSire) exist but sit inside the crowded outbound ecosystem.
- **Embedded workflow tools likely churn less.** Products wired into payments, QuickBooks, email infrastructure, or a website form probably churn below the 3-7% SMB benchmark. Light content and AI-wrapper tools under $25 likely sit at or above 5-7%. This is an inference, not measured.
- **Small-employer HR looks under-served or hard to monetize self-serve.** Only Hirevire shows meaningful verified B2B revenue in the visible part of the category.

### Gaps
- No product-level verified churn data. TrustMRR shows churn only through its API.
- No primary dataset ranking customer types by retention for sub-$50 self-serve plans.

---

## Q3. Which B2B niches are overcrowded in 2026?

### Takeaway
The crowded categories are:
- Generic AI writing and "humanizers"
- Social media schedulers, especially LinkedIn tools
- AI SEO / AEO (getting brands cited by AI search engines)
- Cold-outreach and lead-generation automation
- Generic "chat with your docs/website" chatbots

TrustMRR shows a few leaders earning a lot in each, which hides a long tail of small entrants. Commentators recommend vertical or workflow-embedded angles instead.

### Cited Findings

**Social and LinkedIn tools** [PV]

| Product | MRR | What it does |
|---|---|---|
| Postiz | $325K | AI social scheduler |
| Podawaa | $63K | LinkedIn publishing and scheduling |
| POST BRIDGE | $50K | Multi-platform content posting |
| Supergrow | $79K | — |
| PROSP | $128K | LinkedIn outreach automation |
| WaLead AI | $25K | LinkedIn outreach |

The Social Media category alone has 958 verified startups. Sources: [TrustMRR home](https://trustmrr.com/), [Social media](https://trustmrr.com/category/social-media), [Customer support](https://trustmrr.com/category/customer-support)

**AI SEO / AEO** [PV] ([TrustMRR home](https://trustmrr.com/); [Marketing](https://trustmrr.com/category/marketing); [Social media](https://trustmrr.com/category/social-media))
- AEO Engine: $179K (an agency)
- RankAI: $57K
- Rank Prompt: $46K
- SEOBOT: $33K
- Indexsy: $51K
- Launch Club (Reddit for AI search): $32K
- A "Reddit Agency" to get AI chatbots to recommend brands: $35K
- Many of these are agencies or audience-led founders rather than pure self-serve software.

**AI humanizers and writing** [PV]: Lunchbreak $32K; AE-intelligence (humanizer) $28K ([TrustMRR productivity](https://trustmrr.com/category/productivity)).

**Commentary on saturation** [SR / blogs]
- Generic AI writing tools compete with "ChatGPT, Jasper, Copy.ai and 50+ others" ([buildmvpfast](https://www.buildmvpfast.com/blog/ai-built-micro-saas-vs-traditional-saas-2026)).
- Social schedulers: Buffer, Later, and native tools dominate, and "niche entrants struggle past $3K MRR without significant distribution" ([nxcode](https://www.nxcode.io/resources/news/micro-saas-ideas-2026)).
- "Generic AI wrappers are largely dead" ([startupa.ge](https://startupa.ge/blog/micro-saas-ideas-2026)).
- One source calls AI social tools the most crowded high-earning TrustMRR category, citing Postiz ([superframeworks](https://superframeworks.com/articles/best-micro-saas-ideas-solopreneurs)).
- These are idea-list and content-marketing blogs; treat them as opinion.

### Inferences
- **High leader revenue in these categories is not a sign of openness.** Leaders like Postiz (open-source), SEOBOT (116K-follower founder), and PROSP rely on audience, open source, or outbound. A new solo self-serve entrant would face both incumbents and dozens of clones.
- **Relatively open, judging by fewer visible verified competitors:**
  - Unglamorous integration APIs (QuickBooks Desktop, email infrastructure)
  - Vertical booking and operations tools for specific trades
  - Reporting templates for agencies
  - HR tools for small and frontline employers

  This is a supply signal, not proof of demand.

### Gaps
- No quantitative per-niche count. Category pages show totals, not sub-niches, and the API filter was unavailable.

---

## Q4. Hardest part and time to first $1K MRR

### Takeaway
Founders and commentators overwhelmingly name distribution, not building, as the hardest part. Time-to-$1K MRR estimates range from 3-4 months for fast, validated launches to a 12-18 month median. Many verified self-serve B2B examples took years to reach $10K+.

### Cited Findings

**Slow ramps** [SR]
- Web3Forms: about "20 paying customers in 20 months" in its early phase ([Starter Story](https://www.starterstory.com/web3forms-breakdown)). It is now at $43K MRR [PV], roughly 6 years after founding.
- Zigpoll: about 2 years to traction, then doubling every year ([Indie Hackers snippet](https://www.indiehackers.com/post/c4o2Tfs6mjdpip5yZhaO)).
- Bannerbear: about 3 years to $15K MRR ([Indie Hackers snippet](https://www.indiehackers.com/post/i-bootstrapped-my-saas-to-15-000-mrr-over-3-years-ama-2a81b59993)).

**Fast outlier** [SR]: Subscribr reached $10K MRR within about 100 days, from a founder with prior startup experience ([Indie Hackers snippet](https://www.indiehackers.com/post/tech/leaving-a-funded-startup-and-bootstrapping-to-1m-yr-in-18-months-kPBpdxsTeQitOWOOVs2g)).

**Time-to-$1K estimates conflict** [SR / blogs] ([Vikas Malpani](https://vikasmalpani.com/zero-to-10k-mrr-playbook-solo-founders/); [maketocreate](https://maketocreate.com/from-0-to-1k-mrr-the-complete-playbook-for-solo-founders/); [earlycustomers](https://earlycustomers.com/resources/founder-playbook/))
- "3-4 months" for validated solo founders
- "$200-$1K in months 3-6"
- "Median 12-18 months" across 1,000+ micro-SaaS products, with unclear methodology

**Shopify apps** [estimate]: 3-6 months under $500 MRR while reviews accumulate, then $1K-$3K MRR within the first year ([Adsx](https://adsx.com/blog/how-much-shopify-app-developers-make)).

**Hardest part** [SR / blogs]
- Founders report distribution as much harder than building. Plateaus after $1K are "almost always a channel problem, not a product problem" ([Indie Hackers $0-$1K post, via snippet](https://www.indiehackers.com/post/went-from-0-to-1k-mrr-if-i-started-my-saas-over-here-s-exactly-what-i-d-do-443pAE1nkUlLhlnvWiR1); [maketocreate](https://maketocreate.com/from-0-to-1k-mrr-the-complete-playbook-for-solo-founders/)).
- SEO tactic: "a general solution page won't work" without SEO and about 2 months of persistence ([Indie Hackers snippet](https://www.indiehackers.com/post/how-i-made-10k-mrr-in-3-months-for-my-last-ai-saas-solo-eeadd1c071)).

**Odds** [SR, unclear methodology; the page itself failed with a TLS error, so this is from a search snippet] ([stealwhatworks](https://stealwhatworks.com/blogs/news/indie-hackers-over-10k-per-month))
- About 1 in 30 serious indie hackers reach $10K MRR, or 1 in 16 among products already earning revenue.
- 36% of documented winners took more than 2 years.

### Inferences
- **For a no-outreach B2B product, plan on 6-18 months to $1K MRR** and multiple years to $10K+, unless the founder already has an audience or uses paid ads.
- **Built-in discovery shortens the slow early phase.** Marketplace channels (Shopify App Store, Slack/Teams directories, Google Workspace add-ons) and developer-docs SEO appear to help the most, but this is not quantified.

### Gaps
- No primary, verified dataset on time-to-$1K. TrustMRR shows current MRR and founding date but no public revenue history.
- I could not read the full founder interviews on Starter Story or Indie Hackers. Starter Story failed with a TLS error and Indie Hackers returned 403, so "hardest part" quotes for specific B2B products were not collected.
