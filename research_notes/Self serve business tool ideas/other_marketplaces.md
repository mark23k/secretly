# Non-Shopify Business-Software Marketplaces for a Solo, No-Outreach Founder

Research date: 2026-10-28. Method notes: WebSearch for terms/examples; listing data pulled with plain `curl` (default UA, no bot evasion) from workspace.google.com/marketplace (20 search queries, ~1,270 listings parsed, 10 detail pages with embedded reviews) and the WordPress.org plugins API (12 queries). WebFetch was blocked for workspace.google.com and chromewebstore.google.com ("unable to verify domain"); plain curl worked. Chrome Web Store search pages return ratings but not user counts in the static HTML. Slack, Atlassian, Wix, HubSpot, monday, Notion, Airtable, Squarespace listing pages were NOT scraped (budget). Raw data: /private/tmp/claude-501/-Users-moshekaplan-secretly/3960721d-ca1c-4ae9-8a78-0b3184a404e7/scratchpad/ws_all.txt (Workspace listings: query, rating, users, name, dev) and .../scratchpad/wp/*.json.

## 1. Per-marketplace: size, discovery, fees, billing, approval, Next.js + Supabase fit

### Takeaway
Fees are low almost everywhere except Wix (20% after year 1) and Atlassian Connect; the real gates are (a) Google's restricted-scope CASA assessment ($3K-15K+/yr) for Gmail/Drive-reading add-ons, (b) Slack's 2025 rate-limit squeeze that effectively forces Marketplace approval, and (c) Microsoft's heavy technical bar for transactable Teams offers. Google Workspace Marketplace shows the clearest visible demand (public user counts) with many weak incumbents.

### Cited Findings
**Google Workspace Marketplace**
- Listings show install counts publicly (e.g., "Yet Another Mail Merge" 16M+ users, 4.7; "Mailmeteor" 7M+, 4.9; "TimeSheet" by myhours.com 586K+, 4.0) and Google labels "Google doesn't verify reviews or ratings"; apps passing CASA get a "This app passed an independent security assessment" badge on search results — scraped from [Workspace Marketplace search](https://workspace.google.com/marketplace/search/email%20tracker) on 2026-10-28.
- Marketplace search returns long tails of tiny new entrants alongside incumbents (e.g., "SheetsSync for QuickBooks" by Mike Haye 221 users; "QuickBooks Bulk Importer" 60 users; "Calendar Timesheet" 0 users) — i.e., new apps do appear in keyword search — [Workspace search "quickbooks"](https://workspace.google.com/marketplace/search/quickbooks), [Workspace search "timesheet"](https://workspace.google.com/marketplace/search/timesheet).
- Google takes no cut and has no built-in billing (developers use Stripe etc.) — not directly verified in this session; indie examples (BudgetSheet, Notion2Sheets) bill via their own Stripe — [Vance Lucas](https://vancelucas.com/blog/how-i-built-a-google-sheets-extension-making-1-6k-mrr/), [FounderClub Notion2Sheets](https://www.founderclub.com/notion2sheets/).
- Restricted Gmail/Drive scopes require a CASA Tier 2 assessment by a Google-approved assessor, separate from OAuth verification, revalidated every 12 months; adding restricted scopes can trigger a new review — [Nango docs](https://nango.dev/docs/api-integrations/google-shared/google-security-review), [James Cui](https://jamescui.substack.com/p/crack-googles-casa-review).
- CASA cost estimates conflict: "4 to 12 weeks, $3,000 to $15,000 in audit fees" plus $3K-8K remediation ([Cadence](https://cadence.withremote.ai/blog/cost-to-build-google-workspace-addon)) vs. "$15,000 to $75,000" from a vendor selling a shared-OAuth alternative ([Truto](https://www.truto.one/google/), commercially biased). An anecdote says Tier 2 assessment wasn't billed ([freeCodeCamp](https://www.freecodecamp.org/news/tier-casa-security-assessment/)) — unconfirmed.
- Editor add-ons (Sheets/Docs) have no announced deprecation date but run only on desktop, not Android/iOS — [CloudInsight 2026](https://cloudinsight.cc/en/blog/google-workspace-marketplace).
- Platform risk example: a July 15, 2025 Google OAuth/outage knocked Sheets2GCal (8M+ users) offline for ~2 weeks; developer reply 2025-07-16: "a glitch with Google's OAuth verification system that is preventing all our users from opening the add-on today" — [Sheets2GCal listing](https://workspace.google.com/marketplace/app/sheets2gcal/137564231775).
- Apps Script "Rhino runtime" deprecation broke unmaintained add-ons in mid-2026 (Email Studio reviews 2026-06-08/06-12: "Execution failed. The Rhino runtime is deprecated") — [Email Studio listing](https://workspace.google.com/marketplace/app/email_studio_for_gmail/60106804857).

**Chrome Web Store**
- Manifest V2 extensions disabled for Chrome 138 users July 2025; remaining MV2 listings removed Aug 31, 2026; Chrome 139 removed the enterprise MV2 override — [Chrome for Developers](https://developer.chrome.com/docs/extensions/develop/migrate/mv2-deprecation-timeline), [gHacks 2026-09-01](https://www.ghacks.net/2026/09/01/manifest-v2-is-dead-as-chrome-web-store-permanently-purges-legacy-extensions/).
- Third-party (unofficial) count: ~44,158 MV2 listings (~92.3M users) deleted Oct 9-10, 2025; store fell from ~176,593 to ~131,703 listings — [exstats](https://exstats.com/blog/mv2-purge-in-numbers) (unverified; conflicts on dates with other reports).
- Search results surface "Featured" badges heavily; e.g., 8 of 10 results for "email tracker" were Featured — [CWS search](https://chromewebstore.google.com/search/email%20tracker) (curl 2026-10-28).
- Monetization reality: one founder quoted "500,000 users... My MRR is $2,400" — [NicheCheck](https://nichecheck.com/blog/chrome-extension-vs-saas) (anonymous, low reliability).
- No built-in payments (Chrome Web Store Payments was deprecated years ago — not re-verified this session).

**Slack Marketplace**
- ~2,600 apps per Slack ([slack.com/integrations](https://slack.com/integrations)); aggregator counted 2,886 listings as of 2025-10-25 ([appmarketplace.com](https://appmarketplace.com/marketplaces/slack-app-directory/)). Slack has not published user counts since 2019 ([usecarly](https://www.usecarly.com/blog/slack-statistics/)).
- From May 29, 2025, commercially distributed apps NOT approved for the Slack Marketplace have `conversations.history`/`conversations.replies` cut to 1 request/minute, 15 messages per request; Marketplace apps unaffected; existing installs' enforcement date moved (Sept 2, 2025 → later FAQ says March 3, 2026). Slack says the Marketplace is "the only appropriate channel for commercially distributing apps" — [Slack changelog](https://docs.slack.dev/changelog/2025/05/29/rate-limit-changes-for-non-marketplace-apps), [Slack FAQ](https://api.slack.com/changelog/2025-05-terms-rate-limit-update-and-faq).
- Revenue share / billing: not found (Slack has historically taken no cut; developer bills directly) — gap.

**Microsoft Teams / AppSource (Microsoft Marketplace)**
- 3% standard store service fee on transact offers; private-offer renewals 1.5% — [Microsoft Learn](https://learn.microsoft.com/en-us/partner-center/marketplace-offers/marketplace-commercial-transaction-capabilities-and-considerations), [Clazar](https://clazar.io/blog/microsoft-marketplace-fees).
- Transactable SaaS offers must be multitenant, use Microsoft Entra ID sign-in, and integrate SaaS Fulfillment APIs; Teams-linked offers must be public and transactable — [Microsoft Learn: plan SaaS offer](https://learn.microsoft.com/en-us/partner-center/marketplace-offers/plan-saas-offer), [Teams monetization guide (2022, dated)](https://res.public.onecdn.static.microsoft/s01-prod/app-development-resources/best-practices-guide-app-monetization.pdf?v=%7B1%2Fstring%7D).

**Atlassian Marketplace**
- $6B lifetime Marketplace sales — [Atlassian developer](https://developer.atlassian.com/platform/marketplace/introduction-to-marketplace/).
- From Jan 1, 2026: 0% revenue share on Forge earnings up to $1M lifetime (aggregated across a partner's Forge apps). Standard Forge rate 15%→16% Apr 1, 2026 →17% Oct 1, 2026; Connect 20%→25% on same dates — [Atlassian pricing/billing](https://developer.atlassian.com/platform/marketplace/pricing-payment-and-billing/), [extended timelines](https://www.atlassian.com/blog/development/extended-timelines-for-marketplace-revenue-share-changes). Forge remotes can qualify for Forge rate if no Connect modules, OAuth, Forge UI — same source. Atlassian handles billing (Marketplace-billed licenses).
- Connect end-of-support "Q4 2026" per third party — [Isogun Labs](https://isogunlabs.com/blog/atlassian-marketplace-2026/) (not verified with Atlassian).

**Wix App Market**
- 100% of revenue in first year, then 80%; calculated after 2.5% transaction fee and sales tax; Wix bills — [Wix dev docs](https://dev.wix.com/docs/build-apps/launch-your-app/pricing-and-billing/about-monetizing-your-app). (2012 TechCrunch 70/30 is outdated.)

**HubSpot App Marketplace**
- "No charge to list or certify apps... nor a fee for installs"; no revenue sharing; developer handles billing — [HubSpot partner PDF](https://www.hubspot.com/hubfs/app-partner-enablement/how-to-become-a-hubspot-app-partner.pdf), [HubSpot listing requirements](https://developers.hubspot.com/docs/apps/developer-platform/list-apps/listing-your-app/app-marketplace-listing-requirements).

**monday.com**
- Revenue share starts only after $200K lifetime app revenue, then 85/15; monday billing — [monday community](https://community.monday.com/t/marketplace-revenue-sharing-program/90172), [monday dev docs](https://developer.monday.com/apps/docs/subscriptions-payments-and-billing).

**WordPress.org (freemium)**
- Free listing; premium sold off-platform; Freemius (common MoR/licensing) takes ~7-27% depending on plan — [Gatilab](https://gatilab.com/building-selling-wordpress-plugins/), [Freemius](https://freemius.com/blog/best-merchant-of-record-software-developers/).
- WordPress.org API shows active installs; e.g., "woocommerce-pdf-invoices-packing-slips" 300K installs, 100/100 rating (1,865 ratings), updated 2026-10-22; "latepoint" 100K, 98; "wp-reviews-plugin-for-google" 1M, 98 — [WordPress.org API](https://api.wordpress.org/plugins/info/1.2/?action=query_plugins&request[search]=invoice) (pulled 2026-10-28).

**Zapier**
- No fee to join partner programs; integration partners must meet publishing standards — [Zapier partners](https://zapier.com/l/partners) (page ~636 days old). Zapier is a distribution channel for an existing SaaS, not a billing marketplace.

### Inferences
- Next.js + Supabase backend fit (general platform knowledge, not re-verified this session): Workspace add-ons can be Apps Script-only or "alternate runtime" HTTP endpoints (a Next.js API route works); Chrome extensions call any backend; Slack/Teams/HubSpot/Zapier/Wix/monday all use OAuth + webhooks to your server; Atlassian's 0% deal pushes toward Forge (Atlassian-hosted) — a Next.js backend would need Forge remotes to qualify; WordPress plugins run PHP inside the customer site, so a Next.js app only fits as a SaaS the plugin connects to.
- The Slack rate-limit change raises the bar for unlisted Slack apps that read message history; approval into the Marketplace is now practically required for anything that reads channel history.
- For a solo founder, the Workspace Marketplace's sweet spot is add-ons that avoid restricted scopes (Sheets/Calendar/Forms rather than reading Gmail/Drive contents), which avoids the annual CASA cost.

### Gaps
- Official Chrome Web Store total users/extension counts; Google Workspace paying-customer count; Zapier current app count; Slack revenue-share terms (none found).
- Squarespace Extensions, Notion integration gallery, Airtable Marketplace: no fee/size data gathered.
- Google Workspace Marketplace review time and exact OAuth verification timelines from Google docs (not fetched).

## 2. Solo-founder revenue examples per channel

### Takeaway
Credible (self-reported) examples cluster in Chrome extensions and Google Workspace add-ons, typically $1K-10K MRR, with the marketplace itself as the main acquisition channel; I found no verifiable solo-founder figures for Atlassian, Slack, Teams, Wix, HubSpot or monday.

### Cited Findings
- **Google Workspace — Notion2Sheets** (Notion↔Sheets sync): ~$8,400 MRR, 400+ paying customers, ~40K installs (post ~1.5 yrs old); a later interview says >$5K MRR, 66K installs, 22K Notion workspaces, ~1% paying; users found it by searching the platform names in the marketplace — [Medium/Indie Hustle](https://medium.com/indie-hustle/his-notion-micro-saas-business-makes-8-400-mrr-1e2869633ad9), [FounderClub](https://www.founderclub.com/notion2sheets/). Self-reported, dated (2023-2024).
- **Google Workspace — BudgetSheet** (bank data into Sheets, Apps Script): $1.6K MRR, 4% free-to-paid — [Vance Lucas](https://vancelucas.com/blog/how-i-built-a-google-sheets-extension-making-1-6k-mrr/) (older, ~2021-22).
- **Notion add-on/Workspace — Sync2Sheets**: $1K MRR after ~6 months (Feb 2022); later listing claims ~$9K/mo — [Indie Hackers](https://www.indiehackers.com/product/notion2sheets/published-on-google-workspace-marketplace--Mb6b1sJZ_loG2Ia1xHi) (older).
- **Chrome — Closet Tools** (Poshmark reseller automation): ~$38K-42K/mo (sources differ) — [Chrome Goldmine](https://chromegoldmine.com/blog/profitable-chrome-extension-niches/), [Medium](https://medium.com/@tamimbuilds/8-solo-founders-who-quietly-hit-20k-62k-mrr-in-the-last-6-months-5032e610badc).
- **Chrome — GMass** (Gmail mail merge; founder-run): ~$130K MRR, ~10K subscribers per Chrome Goldmine — [Chrome Goldmine](https://chromegoldmine.com/blog/profitable-chrome-extension-niches/) (aggregator, unverified).
- **Chrome — Kleo** (LinkedIn content): $0→$62K MRR in <90 days — [Medium](https://medium.com/@tamimbuilds/8-solo-founders-who-quietly-hit-20k-62k-mrr-in-the-last-6-months-5032e610badc) (low reliability).
- **Chrome — Superpower ChatGPT** (Saeed Ezzati): >$10K/mo — Indie Hackers via search summary; **ByeByeAI** (Marc Lou): $4K MRR in 3 weeks (audience-driven, not marketplace-driven) — [Indie Hackers](https://www.indiehackers.com/post/tech/building-a-free-chrome-extension-in-3-days-and-turning-it-into-a-5-figure-mrr-ecosystem-3rIbjigZxiFsrgqJjJYp).
- **WordPress** — FlyPlugins $24K MRR; RSVP Pro $700 MRR (converted from free plugin); ~2.7 years old — [Indie Hackers](https://www.indiehackers.com/post/how-building-my-own-wordpress-solution-evolved-into-24k-mrr-oWv1ysO0F7ObEuxirYET). A 2026 new WooCommerce AI search plugin: $0 MRR, 85 downloads, <10 active installs after 3 weeks — [Indie Hackers](https://www.indiehackers.com/post/im-building-an-ai-search-plugin-for-woocommerce-0-mrr-85-downloads-3-weeks-in-tOSBok2Y0BsO6dua74Xp).
- **Atlassian** — 50 Marketplace businesses had grossed >$1M when lifetime sales were ~$1B; no per-solo-app figures found — [Atlassian Marketplace](https://developer.atlassian.com/platform/marketplace/), [Quora](https://www.quora.com/How-much-yearly-revenue-do-Atlassian-Marketplace-apps-make).

### Inferences
- Marketplace-native discovery works best when the user searches for a platform-pair ("Notion to Sheets", "QuickBooks to Sheets"); integration/connector add-ons are the recurring pattern among solo wins.
- Free-to-paid conversion of ~1-4% means a solo add-on needs tens of thousands of installs for $5K+ MRR.

### Gaps
- No TrustMRR-verified figures retrieved (TrustMRR not searched — budget). No 2025-2026 verified examples for Slack, Teams, HubSpot, Wix, monday, Airtable, Squarespace, Atlassian solo devs.

## 3. Underserved categories in the best channels (demand visible, incumbents weak)

### Takeaway
Google Workspace Marketplace is the strongest candidate: public install counts reveal multi-million-user add-ons with 2.5-3.4 ratings, unanswered support, broken Apps Script runtimes, and "free" bait-and-switch complaints — specifically in Sheets/Forms↔Calendar sync, Calendar→timesheet/billing, Gmail→Notion/forwarding, and label/inventory tools. WordPress.org is well-served (most leaders rate 90-100 and update weekly); Chrome is crowded with "Featured" incumbents.

### Cited Findings (Google Workspace — scraped 2026-10-28; ratings/users as displayed)
**A. Sheets/Forms → Google Calendar sync**
- Sheets2GCal (GCalTools) 3.2★, 8M+ users; Calendar Events Creator (New Addons) 2.5★, 3M+; Form to Calendar (New Addons) 3.4★, 1M+ — [ws search "calendar sync"/"booking"](https://workspace.google.com/marketplace/search/booking).
- Calendar Events Creator reviews: 2026-03-08 "DO NOT BUY. Designer states response to enquiries will be with 24hrs this is a lie"; 2025-04-25 "I paid $239 to allow all my team members to use it. When they tried it said out of Quota... I requested a refund and they've ghosted me"; 2024-08-15 "Paid for a subscription, but still get the 'out of quota' message"; 2023-09-26 "If your dates are created by formula and/or updated by a filter... this product won't work for you." Listing updated May 28, 2026; trial = 15 events — [listing](https://workspace.google.com/marketplace/app/calendar_events_creator/101859618418).
- Form to Calendar reviews: 2025-07-19 "Why are appointments showing up an hour late?"; 2025-01-02 "Doesnt populate your calendar at all completely pointless" — [listing](https://workspace.google.com/marketplace/app/form_to_calendar/210797006292).
- Sheets2GCal reviews: 2026-10-04 "Does not work, it was easier to script it myself in AppsScript"; 2026-03-14 "Doesn't work with the Sheets app... doom loop trying to login"; 2025-09-16 "imports all 15 years of calendar. Wish there was a way of refining the import"; 2024-11-23 user wanted it for payroll but it forced an external account signup. Positive 2026-03-24: used Calendar colors "as project codes and track hours" for employee timesheets — [listing](https://workspace.google.com/marketplace/app/sheets2gcal/137564231775).

**B. Google Calendar → timesheet / billable hours**
- Timesheet (TimeNavi) 3.2★, 19K+; TimeSheet (myhours.com) 4.0★, 586K+; Time Study - BPI Tools 3.4★, 231K+; small new entrants (Bright Desk 179 users, Calrows 49, "Calendar Timesheet" 0) — [ws search "timesheet"](https://workspace.google.com/marketplace/search/timesheet).
- TimeNavi reviews: 2026-02-13 "The export range sucks! ... dates cannot be manually changed"; 2025-03-17 "you can only export the current week or the current month and even those didn't actually work"; 2025-03-27 "we need more flexibility with the export range" — [listing](https://workspace.google.com/marketplace/app/timesheet/564137361273).
- myhours TimeSheet reviews: 2025-07-01 "it has recently been including time from dates not included in the specified range... I need to find another Google Calendar timesheet extension"; 2024-03-11 "The new update does NOT have the functionality that I need any longer... Now it's myHours and TimeOwl???" — [listing](https://workspace.google.com/marketplace/app/timesheet/6002835623).

**C. Gmail → Notion / email forwarding & saving**
- Gmail to Notion 2.9★, 2M+; Email Studio (Digital Inspiration) 2.6★, 566K+ — [ws search "signature"/"mail merge"](https://workspace.google.com/marketplace/search/mail%20merge).
- Gmail to Notion reviews: 2026-10-04 "not free. You get one synced task... Why would I pay $16 a month for something that says it's free?"; 2026-03-11 "Gives you *one* capture, then $16 / month"; 2025-12-09 & 2026-01-08 "only supports text and cannot handle images and files" — [listing](https://workspace.google.com/marketplace/app/gmail_to_notion_save_emails_to_notion_da/798174831908). Note: reading Gmail content = restricted scope → CASA.
- Email Studio reviews: 2026-06-24 "entered at least 10 tickets... without ever receiving a response. Since June 16th Email Studio < Email Forwarder has not been working"; 2026-06-12 "The Rhino runtime is deprecated"; 2026-09-12 "Does not forward emails automatically" — [listing](https://workspace.google.com/marketplace/app/email_studio_for_gmail/60106804857).

**D. Other weak-incumbent signals (no review deep-dive)**
- Inventory Management for Google Sheets (GearChain) 3.7★, 783K+ (negative reviews mostly 2020-2023); Next Generation Label Printing 2.7★, 300K+ (2020-12-24: "I just want a way to print address labels. Way too hard to figure out."), though label category also has strong 4.8★ multi-million incumbents (Labelmaker 6M+, Foxy Labels 1M+); pdfFiller 2.0★, 2M+; Dropbox Sign for Docs 2.5★, 703K+; PandaDoc for Docs 2.9★, 659K+; Freshdesk Gmail Gadget 1.8★, 202K+; Zoho CRM 3.4★, 1M+ — scraped search pages, data in ws_all.txt.
- QuickBooks↔Sheets is served by 4.8-5.0★ incumbents (G-Accon 37K+, CData 131K+) — not a weak-incumbent niche.

**WordPress.org (API pulled 2026-10-28)**
- Most business categories are healthy: invoices (300K, 100), booking (Amelia 90K/92, LatePoint 100K/98), Google reviews (1M/98). Weak spots among relevant B2B: YITH WooCommerce Request a Quote 10K installs, 66/100; YITH WooCommerce Waiting List 3K, 64/100; ExactMetrics (google-analytics-dashboard-for-wp) 200K, 50/100; Customer Area (client portal) 10K, 80/100 — [WordPress.org API](https://api.wordpress.org/plugins/info/1.2/?action=query_plugins&request[search]=quote+request).

**Chrome Web Store (ratings only, 2026-10-28)**
- CRM-in-Gmail: Copper CRM 3.6★, Zoho CRM for Gmail 3.8★ (Featured); invoice search dominated by AliExpress invoice tools with 2.5-3.7★ — [CWS "crm"](https://chromewebstore.google.com/search/crm), [CWS "invoice"](https://chromewebstore.google.com/search/invoice).

### Inferences
- Best 2-3 channels for this founder: (1) Google Workspace Marketplace (visible demand, weak multi-million-user incumbents, no rev share, Sheets/Calendar/Forms scopes avoid CASA); (2) Atlassian Marketplace on Forge (0% fee to $1M, Atlassian billing, B2B buyers) — but demand/incumbent data not gathered here; (3) Chrome Web Store for business workflows on top of SaaS sites (largest reach, but noisy, low per-user monetization).
- Concrete Workspace ideas: (a) a reliable Sheets/Forms→Calendar two-way sync with formula/filter-aware dates, timezone correctness, transparent per-seat pricing and responsive support (displacing Calendar Events Creator / Form to Calendar / Sheets2GCal, 12M+ combined users); (b) Calendar→timesheet & client billing with arbitrary date ranges, color/keyword→project mapping, invoice export (displacing TimeNavi/myhours TimeSheet complaints); (c) a modern Gmail auto-forwarding/rules add-on replacing Email Studio (but Gmail scopes likely trigger CASA — budget accordingly); (d) Gmail→Notion with attachments and honest pricing (also CASA).
- Calendar and Sheets scopes are generally "sensitive" not "restricted" (needs OAuth verification but not CASA) — general knowledge, verify in Google's scope docs before building.

### Gaps
- Workspace detail pages did not expose review counts per star or install trends over time; "users" counts are cumulative installs, not active users.
- No Chrome Web Store user counts or review text extracted; Slack/Atlassian/HubSpot/Wix listing-level demand not measured.

## 4. Known risks / platform policy changes

### Takeaway
Every channel carries a platform-dependency risk that has recently bitten developers: Chrome MV2 purge, Slack non-Marketplace rate limits, Google CASA costs plus Apps Script runtime deprecations and OAuth outages, and Atlassian's Connect→Forge forced migration with rising fees above the $1M cap.

### Cited Findings
- Chrome: MV2 disabled July 2025, store removal Aug 31, 2026 — [Chrome for Developers](https://developer.chrome.com/docs/extensions/develop/migrate/mv2-deprecation-timeline).
- Slack: non-Marketplace commercial apps limited to 1 req/min, 15 msgs for history methods from May 29, 2025 — [Slack changelog](https://docs.slack.dev/changelog/2025/05/29/rate-limit-changes-for-non-marketplace-apps).
- Google: CASA annual reassessment for restricted scopes, $3K-15K+ — [Cadence](https://cadence.withremote.ai/blog/cost-to-build-google-workspace-addon), [Nango](https://nango.dev/docs/api-integrations/google-shared/google-security-review); Rhino runtime deprecation breaking add-ons (Email Studio reviews June 2026) — [listing](https://workspace.google.com/marketplace/app/email_studio_for_gmail/60106804857); July 2025 OAuth outage took Sheets2GCal offline — [listing](https://workspace.google.com/marketplace/app/sheets2gcal/137564231775).
- Atlassian: Connect rate to 25% (Oct 2026), Forge 17% above $1M cap; Connect end-of-support reportedly Q4 2026 — [Atlassian](https://www.atlassian.com/blog/development/extended-timelines-for-marketplace-revenue-share-changes), [Isogun Labs](https://isogunlabs.com/blog/atlassian-marketplace-2026/).
- Wix: rev share jumps from 0% to 20% after year one — [Wix dev docs](https://dev.wix.com/docs/build-apps/launch-your-app/pricing-and-billing/about-monetizing-your-app).
- Microsoft: Entra ID + SaaS Fulfillment API integration required for transactable offers — [Microsoft Learn](https://learn.microsoft.com/en-us/partner-center/marketplace-offers/plan-saas-offer).

### Inferences
- Building the core product as a standalone Next.js + Supabase SaaS with thin marketplace "shells" (Workspace add-on, Chrome extension) limits single-platform risk; avoid restricted Gmail/Drive scopes in v1.

### Gaps
- Microsoft Teams store policy changes 2025-2026, HubSpot developer-platform changes (new "projects" platform), and Zapier partner tier requirements not researched in depth.
