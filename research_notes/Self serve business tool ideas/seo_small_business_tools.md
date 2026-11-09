# Self-serve, SEO-led web tools for US small businesses (free tool/template -> paid plan, no sales team)

Method notes (read first):
- **Absolute US volumes** come from seodata.dev keyword pages, which say their numbers are "Monthly average for US, from the Google Ads API". Each page shows its own "updated" date (May–Oct 2026). Google Ads puts volumes into buckets and merges close variants. That is why several variants show the same number (e.g. "time card calculator" / "timecard calculator" / "time punch calculator" are all 201,000). Read these as the size of a **keyword cluster**, not of one exact phrase. The anonymous tier allowed about 20 lookups before returning HTTP 429. I waited, retried, and did not get around the limit.
- **Relative interest and trend** come from pytrends: geo='US', the last 12 months up to late Oct 2026, with "invoice generator" as the anchor in every batch (raw output: `/private/tmp/claude-501/-Users-moshekaplan-secretly/3960721d-ca1c-4ae9-8a78-0b3184a404e7/scratchpad/data/trends.json`). The "trend" ratio compares the last 13 weeks (≈Jul–Oct 2026) with the first 13 weeks (≈Nov 2025–Jan 2026), so it is **heavily seasonal**. Gift certificates peak in the holidays, and quotes and estimates peak in winter/spring planning. It does not show long-term growth or decline.
- **Pytrends and the Google Ads buckets disagree a lot** on some terms. Pay stub generator is 33,100 in Ads but only 0.11× "invoice generator" in Trends. Mileage log is 2,400 in Ads but 0.38× in Trends. Trends counts exact query strings, while Ads merges variants. Treat any single volume as ±2–3×.
- **Google autocomplete** (suggestqueries.google.com, client=firefox, gl=us) worked for some seeds. About half the requests failed with connection resets or "self-signed certificate in certificate chain" errors, which points to TLS interception somewhere on the local network. **starterstory.com** pages failed with the same certificate error, and **similarweb.com** was blocked by the fetch tool's domain policy. That is why there are no Similarweb traffic numbers below. One fetched page (rankhero.com) turned out to be **Etsy** keyword data rather than Google data and was thrown out.
- Many search results for "free X template" were scraped spam pages on hijacked university/government subdomains (e.g. live.museum.manchester.ac.uk, msoid.icmbio.gov.br, lbas.lboro.ac.uk, track.ctrader.com). They are evidence of how much low-quality spam competes for template keywords, not real competitors.

## Which small-business jobs show strong recurring US search demand for a tool?

### Takeaway
Demand comes in three tiers. Huge horizontal clusters: time card calculator (~201k/mo), invoice generator (~49.5k), pay stub generator (~33k), receipt maker (~22k), gift certificate template (~18k). Mid-size clusters: sign-in sheet (~14.8k), employee schedule template (~8.1k), rent receipt template (~6.6k), quote template (~5.4k), estimate template / work order template (~3.6k each). A long tail of vertical sub-keywords sits at about 300–2,000 each. The mid-tier and vertical keywords carry high CPCs ($10–17, even $52 for "cleaning business software"), which suggests advertisers make money on them. Over the 12-month window, none of these clusters shows clear growth beyond seasonal swings.

### Cited Findings
US monthly searches (Google Ads API via seodata.dev; CPC and competition from the same page):
- "time card calculator" 201,000/mo, CPC $4.80, competition 0. Variants "time punch calculator" and "timecard calculator" are bucketed the same — [seodata.dev](https://www.seodata.dev/keyword/time-card-calculator). A Semrush page for timecardcalculator.net lists the exact term at only ~4,752 (Oct 2025) — [Semrush](https://nl.semrush.com/website/timecardcalculator.net/overview). This large conflict is probably exact-match vs variant grouping.
- "invoice generator" 49,500/mo, CPC $17.23, competition 0.71. "create invoice free" 27,100 — [seodata.dev](https://www.seodata.dev/keyword/invoice-generator). Other estimates conflict: an undated newsletter says 56,000 US — [Chris' Newsletter](https://kintu.beehiiv.com/p/7-high-demand-businesses-you-can-start-today-54d0). A Semrush page says 318,100 with no region given (Sep 2025) — [Semrush/onlineinvoices.com](https://ja.semrush.com/website/onlineinvoices.com/overview). Helcim says "nearly 1 million monthly searches" for free online invoice tools (vendor claim) — [Helcim](https://www.helcim.com/announcements/the-best-free-invoice-generator/).
- "pay stub generator" 33,100/mo, CPC $12.96. "pay stub checker" 60,500 and "paycheck stubs" 49,500 — [seodata.dev](https://www.seodata.dev/keyword/pay-stub-generator)
- "receipt generator" 9,900. "receipt maker" / "make a receipt" 22,200 — [seodata.dev](https://www.seodata.dev/keyword/receipt-generator)
- "gift certificate template" 18,100, CPC $1.24, competition 1.0. "gift card templates" 22,200 — [seodata.dev](https://www.seodata.dev/keyword/gift-certificate-template)
- "sign in sheet" 14,800, CPC $1.78, competition 0.16. "sign in sheet template" 8,100 — [seodata.dev](https://www.seodata.dev/keyword/sign-in-sheet)
- "employee schedule template" 8,100, CPC $10.67, competition 0.84. "working schedule template" 9,900 — [seodata.dev](https://www.seodata.dev/keyword/employee-schedule-template)
- "rent receipt template" 6,600, CPC $3.16. "rental receipt" 12,100 — [seodata.dev](https://www.seodata.dev/keyword/rent-receipt-template)
- "quote template" 5,400, CPC $14.18 — [seodata.dev](https://www.seodata.dev/keyword/quote-template)
- "estimate template" 3,600, CPC $12.05. "free estimate template" 2,900. "job estimate template" 1,300 — [seodata.dev](https://www.seodata.dev/keyword/estimate-template)
- "contractor estimate template" 1,600, CPC $13.63. "construction estimate template" 1,900 — [seodata.dev](https://www.seodata.dev/keyword/contractor-estimate-template)
- "painting estimate template" 1,000 — [seodata.dev](https://www.seodata.dev/keyword/painting-estimate-template). "landscaping estimate template" 390 — [seodata.dev](https://www.seodata.dev/keyword/landscaping-estimate-template)
- "work order template" 3,600, CPC $11.59, competition 0.96 — [seodata.dev](https://www.seodata.dev/keyword/work-order-template)
- "inventory spreadsheet" 2,900, CPC $16.58 — [seodata.dev](https://www.seodata.dev/keyword/inventory-spreadsheet)
- "mileage log" 2,400 — [seodata.dev](https://www.seodata.dev/keyword/mileage-log). This conflicts with pytrends, which puts "mileage log" at 0.38× "invoice generator" (would imply ~15–20k). Unresolved.
- "client intake form" 1,600, CPC $14.73. "intake form" 3,600 — [seodata.dev](https://www.seodata.dev/keyword/client-intake-form)
- "punch card template" 1,300 — [seodata.dev](https://www.seodata.dev/keyword/punch-card-template)
- "cleaning business software" 1,300, **CPC $52.07** — [seodata.dev](https://www.seodata.dev/keyword/cleaning-business-software)
- "qr code menu" 1,000. "qr code menus" 1,600 — [seodata.dev](https://www.seodata.dev/keyword/qr-code-menu)
- "rental inspection checklist" 880 — [seodata.dev](https://www.seodata.dev/keyword/rental-inspection-checklist)
- "waiver template" 720. "liability waiver form" 2,900. "liability waiver template" 2,400 — [seodata.dev](https://www.seodata.dev/keyword/waiver-template)
- "tip pool calculator" 480. "tip pooling calculator" 320 — [seodata.dev](https://www.seodata.dev/keyword/tip-pool-calculator)

Pytrends, US, last 12 months. Interest is shown relative to "invoice generator" (=1.0), followed by the late/early-window ratio (seasonal):
- invoice template 2.98 (0.86); time card calculator 1.74 (0.82); appointment booking 1.65 (0.61); sign in sheet 1.29 (0.99); quote template 0.99 (0.40); cleaning checklist 0.98 (0.65); lease agreement template 0.67 (0.86); estimate template 0.65 (0.41); timesheet calculator 0.60 (0.87); rental agreement template 0.40; mileage log 0.38; inventory spreadsheet 0.33 (1.07, the only one rising); receipt generator 0.32; qr code menu 0.30 (0.59); gift certificate template 0.24 (0.15, holiday seasonal); waiver template 0.22; client intake form 0.20 (0.88); work order template 0.17; restaurant waitlist 0.16; pay stub generator 0.11; employee schedule template 0.10; work schedule maker 0.05; punch card template 0.01; tip pool calculator 0.002. The anchor itself was 0.85. Source: own pytrends pull (script and data in the scratchpad path above).

Google autocomplete (US) shows vertical modifiers. These suggest where vertical landing pages would match real queries:
- "estimate template for …" → construction, contractor, car repair, painting, landscaping, google docs/sheets, excel
- "client intake form for …" → esthetician, massage therapy, law firm, taxes, waxing, therapy, cosmetology, cleaning services, attorney, counseling
- "inspection checklist for …" → rental property, landlords, apartment, fire extinguisher, fall protection equipment, section 8, certificate of occupancy
- "inventory spreadsheet for …" → small business, restaurant, coffee shop, rental property
- "mileage log for …" → taxes, reimbursement, irs, company vehicle, doordash, business expenses
- "cleaning checklist for …" → business, airbnb, move out (mostly consumer intent)
- "pay stub generator …" → free pdf, with tax deductions, reddit, shopify
(Source: own queries to https://suggestqueries.google.com/complete/search?client=firefox&hl=en&gl=us&q=..., Oct 2026. Seeds that failed with network errors: "invoice generator for", "time card calculator", "sign in sheet for", "quote maker for", "work order template for", "tip pool".)

### Inferences
- The biggest clusters (time card calculator, invoice generator, pay stub, receipts) carry a lot of consumer and employee intent. Workers check their own hours, and individuals make one-off invoices or receipts. So only part of that traffic is a business owner who might subscribe.
- High CPC ($10–17) on mid-size template keywords (estimate, quote, work order, employee schedule, intake form, inventory) is the best demand-quality signal. It means vendors like Jobber, Housecall Pro and 7shifts pay for these clicks because the searchers convert to software buyers.
- "Sign in sheet" has big volume but a low CPC ($1.78) and low competition. That fits mostly print/download intent with weak software monetization.
- Tip pooling (~800/mo combined) and punch card templates (~1–2k) are too small to support a business through SEO alone.

### Gaps
- No Similarweb, Ahrefs or Semrush keyword difficulty data for the long tail (Similarweb blocked; no paid tool access). The Google Ads volumes are bucketed and cover variant clusters.
- Not checked in Google Ads: appointment booking (very likely dominated by brands), employee schedule "maker", lease/rental agreement templates, cleaning checklist for business, timesheet calculator.
- The pytrends trend window is seasonal. A 5-year pull would be needed to separate secular growth from seasonality.

## Best 8–10 candidates: who ranks on page 1, their pricing, traffic, and review complaints

### Takeaway
On every candidate, page 1 is held by vendors who use the free tool as a lead magnet. Examples: Clockify, Hubstaff and QuickBooks for time cards; Homebase, ClickUp and Agendrix for schedules; Toast, 7shifts, Connecteam and MarketMan for tip pools; Typeform, Jotform-style form builders and Carepatron for intake forms; Housecall Pro, BuildBook and ContractorPlus for estimates; invoice-generator.com (Invoiced) and Invoice Simple (EverCommerce) for invoices. Small or indie tools do show up on page 1 for several terms: 101planners, gigacalculator, TimeClick, miniwebtool, my-co.app, Spreadsheet Daddy. So the SERPs can be beaten with a good single-purpose tool. Converting that traffic into a paid subscription is the hard part, because the paid alternatives are full suites with free tiers.

### Cited Findings
**1. Time card / timesheet calculator (~201k cluster)**
- Page 1 includes Hubstaff, Clockify (several URLs), TimeChamp, Gigacalculator, TimeClick, QuickBooks, Apploye, dqydj and an indie "TimeCardCalc". All offer free calculators. Gigacalculator says no registration and "free for the foreseeable future". TimeClick upsells paid software — [WebSearch SERP snapshot](https://hubstaff.com/time-tracking/free-timecard-calculator), [Clockify](https://clockify.me/time-card-calculator), [Gigacalculator](https://www.gigacalculator.com/calculators/work-hours-timesheet-calculator.php), [TimeClick](https://timeclick.com/time-card-calculator/), [QuickBooks](https://quickbooks.intuit.com/time-tracking/resources/time-card-calculator/), [TimeCardCalc](https://hunted.space/product/timecard-calc)

**2. Invoice generator (~49.5k)**
- invoice-generator.com is run by Invoiced, Inc. Semrush estimates ~1.6–1.7M visits/month (Dec–Feb), with 78.5% direct and 13.9% google.com, which suggests a lot of repeat users — [Semrush via search result](https://cw.semrush.com/website/invoice-generator.com/overview). These are modelled estimates.
- Invoice Simple was acquired by EverCommerce on Apr 13, 2020 (revenue not disclosed) — [PitchBook](https://pitchbook.com/profiles/company/268473-43). It runs many vertical template pages (e.g. an "SEO invoice" template) — [Invoice Simple](https://invoicesimple.com/invoice-template/seo-invoice)
- Indie Hackers has many "free invoice generator, no signup" launches, which shows how crowded this is — [IH post 1](https://www.indiehackers.com/post/built-a-free-invoice-generator-that-actually-works-no-signup-required-7376376991), [IH post 2](https://www.indiehackers.com/post/i-built-a-free-invoicing-tool-because-30-month-for-a-pdf-generator-felt-wrong-WHwk8rSCS1lQDifGvTrm). Several TrustMRR invoicing listings show zero or near-zero revenue: Trevidia had no active subscriptions, InstantInvoice had 4 active subscriptions, Invoicemonk showed $0 — [Trevidia](https://trustmrr.com/startup/trevidia-ltd?metric=mrr), [InstantInvoice](https://trustmrr.com/startup/instantinvoice-io), [Invoicemonk](https://trustmrr.com/startup/invoicemonk.md). (Doran Pay's $406k MRR listing appeared to be mixed up with unrelated content in the search snippet, so it is unverified — [Doran Pay](https://trustmrr.com/startup/doran-pay?metric=mrr).)

**3. Contractor estimate / quote template (estimate 3.6k + quote 5.4k + contractor/construction ~3.5k + trade variants)**
- Page 1 includes BuildBook, Housecall Pro, ContractorPlus ("no signup", PDF export) and Spreadsheet Daddy, plus heavy spam — [BuildBook](https://app.buildbook.co/free-construction-estimate-template), [ContractorPlus](https://contractorplus.app/resources/free-estimate-templates), [Spreadsheet Daddy](https://spreadsheetdaddy.com/?p=21445), [Housecall Pro](https://www.housecallpro.com/?p=82643)
- Joist (incumbent estimate/invoice app for contractors) has 4.1/5 on Capterra (85 reviews). Recurring complaints: card-payment fees and bad payment experiences, the cheapest plan seen at $96, features locked to higher tiers, no automatic invoice sequencing, no employee hour tracking, thin CRM and reporting, and outgrowing it — [Capterra Joist reviews](https://capterra.com/p/230138/Joist/reviews/), [GetOneCrew Joist review](https://www.getonecrew.com/post/joist-app-reviews)
- An Acquire.com listing: "AI Estimating SaaS for Contractors" with $156k TTM revenue and $135k profit (period ending Jul 2026, per the search snippet; the listing page itself rendered empty, so channel and pricing are unverified) — [Acquire.com](https://app.acquire.com/startup/f6mi01o8yq-ai-estimating-saas-for-contractors-faster-bids-156k-ttm-revenue-135k-profit)

**4. Employee schedule maker / template (~8–10k)**
- Page 1 includes 101planners (indie printables site, browser tool, no signup, exports to Sheets/Excel/PDF), Homebase (free tool, no signup), Agendrix (free plan), ClickUp, Visme, Everhour listicles and my-co.app — [101planners](https://www.101planners.com/employee-schedule-maker/), [Homebase](https://www.joinhomebase.com/schedule-maker-tool), [Agendrix](https://agendrix.com/free-employee-scheduling-software), [ClickUp](https://clickup.com/free-tools/work-schedule-maker)
- Homebase: Capterra 4.6 (1,100+ reviews) and Trustpilot 3.4. Complaints focus on payroll and tax support and on price creep from per-location pricing plus add-ons (Plus plan $70/location/month cited). The free tier is limited to 1 location and 10 employees — [Capterra](https://www.capterra.com/p/212114/Homebase/), [Trustpilot](https://www.trustpilot.com/review/joinhomebase.com?page=2), [Turnozo review](https://turnozo.com/blog/homebase-review)

**5. Tip pooling calculator (~800 combined)**
- Page 1 is almost all vendors: Toast, 7shifts, Connecteam, MarketMan, Kickfin, Agendrix, Ferry, plus indie tools like miniwebtool, my-co.app and shiftflow — [Toast](https://pos.toasttab.com/vi-us/resources/tip-pooling-calculator), [7shifts](https://www.7shifts.com/resources/templates/tip-pooling-calculator), [Connecteam](https://connecteam.com/free-tools/free-tip-pooling-calculator/)
- Paid tip software exists. 7shifts Tip Management add-on is $49.99/location/month plus $1 per payout. TipHaus reportedly starts at $89/month (via Capterra). Tipnpost $120/month (low-confidence source) — [TheRestaurantHQ](https://www.therestauranthq.com/technology/tipping-software/), [G2 TipHaus](https://www.g2.com/products/tiphaus/pricing)

**6. Client intake form, vertical (esthetician, massage, cleaning, law, tax)**
- "esthetician client intake form" page 1 includes AidaForm, Typeform, Pabau, Carepatron, ClickUp, SurveySparrow and fomr.io, plus spam. These are horizontal form builders and practice-management suites. AidaForm puts e-signature in paid plans — [AidaForm](https://aidaform.com/templates/esthetician-client-intake-form.html), [Typeform](https://typeform.com/templates/esthetician-client-intake-form-template), [Carepatron](https://carepatron.com/templates/esthetician-client-intake-form)

**7. Liability waivers (~6–8k across "liability waiver form/template")**
- Smartwaiver pricing is based on signed waivers per month. Aggregators disagree: ~$18–19/mo for 100 waivers, up to $155–260/mo — [G2](https://www.g2.com/products/smartwaiver/pricing), [FitGap](https://us.fitgap.com/products/smartwaiver). WaiverForever starts at about $19/mo (Capterra/GetApp) — [Capterra](https://www.capterra.com/p/176524/WaiverForever/). WaiverFile, WaiverSign, WaiverElectronic and WaiverKing also compete — [WaiverFile pricing](https://www.waiverfile.com/Pricing.aspx)

**8. Pay stub generator (~33k)**
- Page 1 includes Shopify, Wix and Otto free tools, 123PayStubs, StubCreator and app-store apps, plus spam — [Oberlo](https://www.oberlo.com/blog/paystub-generator), [Otto](https://joinotto.com/tools/paystub-generator)
- There is serious fraud and legal risk. The FTC filed a complaint against a seller of fake pay stubs and bank statements. A Tampa company was accused of selling fake stubs using a payroll processor's branding. Fraud-detection firms call stub generators a document-fraud vector — [FTC complaint](https://www.ftc.gov/system/files/documents/cases/katrina_moore-_complaint.pdf), [WTSP](https://wtsp.com/article/news/local/tampa-fake-pay-stub-company-accused-of-fraud/67-396446012), [Resistant AI](https://resistant.ai/blog/paystub-generators)

**9. Rent receipt / rental inspection checklist (landlords; rent receipt 6.6k + rental receipt 12.1k; inspection checklist ~1.5k)**
- Autocomplete shows "inspection checklist for rental property / landlords / section 8" (own query). Page-1 owners were not checked in this pass.

### Inferences
- "Beatable" here means indie sites already rank (101planners, gigacalculator, miniwebtool, my-co.app, Spreadsheet Daddy, TimeCardCalc). The SERPs are not locked to Fortune-500 domains. The domains that do rank are mostly well-established SaaS blogs with strong authority, though.
- The best monetization gap from the reviews is in contractor estimating. Joist users complain about price ($96 tier), payment fees and missing basics like invoice sequencing and hour tracking. Jobber and Housecall Pro sit at a much higher price. A simple $15–30/mo "estimate → e-sign → invoice" tool for one trade (e.g. painters, landscapers) fills a clear gap.
- Waivers are a proven paid niche at $15–200/mo with usage-based pricing. Competitors are small and many, and their pricing is clear.
- Pay stub generators have high volume and willingness to pay (per-stub fees), but the fraud and chargeback exposure makes them a poor fit for a solo founder on Stripe. Avoid.

### Gaps
- No Similarweb traffic numbers (domain blocked), and no keyword difficulty scores.
- Not collected: G2/Trustpilot complaint mining for waivers, intake forms or Invoice Simple; page-1 inspection for rent receipt and rental inspection queries.
- Did not check Stripe's restricted-business list for pay stub generators.

## Verified revenue examples of SEO-led small-business micro-SaaS, and how long SEO took

### Takeaway
I found no fully verified (Stripe-connected) revenue example of an SEO-led, SMB-focused micro-SaaS that also documents its SEO timeline. The best evidence is secondhand: SignWell (templates SEO, multi-million revenue, figures conflict), Smartwaiver (self-funded, >1,000 paying customers), and a solo restaurant waitlist app (claimed ~$40k/mo, but app-store-led, not SEO). TrustMRR data suggests most indie invoicing tools earn almost nothing. Every SEO ramp time I found (3–6 months) is a planning assumption, not measured data.

### Cited Findings
- **SignWell** (e-signature; formerly Docsketch, spun out of Bidsketch in 2019): grew with the same free-template SEO playbook as Bidsketch. One profile claims $5M revenue in 2024 with 7 employees. Starter Story's revenue page shows $417K/mo in 2024 and a sourced $83K/mo run-rate as of Jan 2026. The sources conflict and the drop is unexplained — [Starter Story revenue page (snippet; page fetch blocked by TLS error)](https://www.starterstory.com/businesses/signwell/revenue), [onepage-research profile](https://onepage-research.sliplane.app/products/signwell)
- **Smartwaiver**: self-funded, monthly subscription, "more than 1,000 paying customers" (older, undated founder interview). 85M+ waivers issued by mid-2020 — [StartupBend](https://startupbend.com/articles/50startups-smartwaiver-provides-digital-waivers-for-the-masses/), [BusinessWire 2020](https://www.businesswire.com/news/home/20200625005418/en/Smartwaiver-Sees-Surge-in-Demand-for-Digital-Waivers-as-Businesses-Manage-COVID-19-Liability)
- **Restaurant waitlist app (solo founder "Joe", app named Waitly/"Weightley")**: claimed over $40k/month. Free in Year 1, ~$14.5k in Year 2. Distribution through Apple Search Ads, not SEO. All figures come from third-party video summaries and are unverified — [Starter Story video page (blocked)](https://www.starterstory.com/stories/my-app-makes-41k-month), [gist.ly summary](https://gist.ly/youtube-summarizer/how-joe-built-a-40kmonth-waitlist-app-solo)
- **Invoiced / invoice-generator.com**: a free tool with ~1.6M modelled monthly visits that feeds a paid AR product. Revenue not disclosed — [Semrush snippet](https://cw.semrush.com/website/invoice-generator.com/overview)
- **Invoice Simple** was acquired by EverCommerce (2020); terms and revenue not disclosed — [PitchBook](https://pitchbook.com/profiles/company/268473-43)
- **TrustMRR context**: one third-party summary says the median tracked SaaS earns about $7 MRR — [bigideasdb](https://bigideasdb.com/docs/trustmrr-overview). Several invoicing listings show 0–4 active subscriptions (see above). TrustMRR's homepage categories have no dedicated local-business category, and no contractor, salon or waiver tools appeared on its leaderboard — [TrustMRR](https://trustmrr.com/)
- **Home-service lead-gen tool on TrustMRR**: $79–$500/mo flat plans, 22 paying customers, $5K MRR, $147k asking price (via search summary; not SEO-specific) — [TrustMRR nextjobconnect](https://trustmrr.com/startup/nextjobconnect-llc)
- **Contractor estimating SaaS on Acquire.com**: $156k TTM revenue and $135k profit (title only; acquisition channel unknown) — [Acquire.com](https://app.acquire.com/startup/f6mi01o8yq-ai-estimating-saas-for-contractors-faster-bids-156k-ttm-revenue-135k-profit)
- **Standout CV** (resume builder, not SMB): 18M organic visitors, $30K MRR, $1M+ lifetime (podcast description). Shows that the free-tool → paid SEO model works for document generators — [Latka podcast](https://nathanlatkathetop.libsyn.com/founder-uses-genius-playbook-to-hit-1m-revenue-with-no-employees)
- **SEO ramp**: a free-tool strategy guide assumes "3–6 months to meaningful volume" (planning assumption, not data) — [playbooks.com free-tool-strategy](https://playbooks.com/skills/skenetechnologies/plg-skills/free-tool-strategy). A SaaS Hero vendor post claims a 7-month break-even for organic B2B SaaS (marketing claim) — [SaaS Hero](https://www.saashero.net/?p=13739)

### Inferences
- The proven pattern is a **document/template generator plus a paid workflow** (send, sign, track, pay): SignWell, Bidsketch, Invoiced, Invoice Simple. A plain calculator monetizes poorly unless it is part of a workflow the business repeats every week.
- A realistic expectation for a new domain is 6–12+ months before SEO brings meaningful signups. That is my inference from the planning benchmarks and from the large number of zero-revenue indie invoice tools, not measured data.

### Gaps
- No Stripe-verified (TrustMRR) SMB-vertical SEO success story was found with a documented timeline. Starter Story pages could not be fetched (TLS error), so the founder interviews there (SignWell, the waitlist app) are known only from snippets and summaries.
- No data on free-tool → paid conversion rates in this category.

## Which are saturated vs which have an open niche angle?

### Takeaway
Saturated: generic invoice generator, receipt maker, appointment booking (Calendly/Square/booking suites), QR code menus, generic employee scheduling (Homebase/Sling/7shifts free tiers), gift certificates (Canva-type template sites; low CPC), and time card calculators (dozens of free tools, mostly employee intent). More open: **trade-specific estimate→invoice tools** (painters, landscapers, cleaners, handymen), **vertical intake + consent forms** (estheticians, massage, lash/brow, tattoo), **landlord micro-tools** (rent receipts plus move-in/move-out inspection checklists with photos and e-sign), and **liability waivers for small activity businesses**. These have mid-size demand, high CPC, and simple paid substitutes priced at $15–100/mo.

### Cited Findings
- Generic invoicing is crowded with free tools and indie clones. A vendor blog calls invoice generator SaaS a crowded market with underserved niches (vendor opinion) — [Questera](https://www.questera.ai/blogs/build-invoice-generator-saas-with-ai). Many IH launches and near-zero TrustMRR results are cited above.
- Scheduling free tiers from Homebase, Agendrix and Findmyshift (free up to 5 staff) already serve the bottom of the market — [Homebase](https://www.joinhomebase.com/schedule-maker-tool), [Agendrix](https://agendrix.com/free-employee-scheduling-software), [101planners](https://www.101planners.com/employee-schedule-maker/)
- QR menu: 1,000–1,600/mo and Trends interest fell (0.59 ratio) — [seodata.dev](https://www.seodata.dev/keyword/qr-code-menu)
- Vertical estimate keywords exist with real CPC: painting estimate template 1,000 ($6.60), landscaping 390 ($7.37), contractor 1,600 ($13.63) — [painting](https://www.seodata.dev/keyword/painting-estimate-template), [landscaping](https://www.seodata.dev/keyword/landscaping-estimate-template), [contractor](https://www.seodata.dev/keyword/contractor-estimate-template)
- "cleaning business software" 1,300/mo at $52 CPC with 0.13 competition — [seodata.dev](https://www.seodata.dev/keyword/cleaning-business-software)
- Intake-form vertical demand from autocomplete: esthetician, massage, waxing, cosmetology, cleaning services, law and tax (own autocomplete query). The current page 1 is generic form builders, not vertical-native tools — [Typeform](https://typeform.com/templates/esthetician-client-intake-form-template), [AidaForm](https://aidaform.com/templates/esthetician-client-intake-form.html)
- Waivers: liability waiver form 2,900 and template 2,400. Paid market at ~$15–260/mo — [seodata.dev](https://www.seodata.dev/keyword/waiver-template), [FitGap Smartwaiver](https://us.fitgap.com/products/smartwaiver)
- Tip pooling: tiny search demand, and page 1 is owned by Toast, 7shifts and Connecteam, though paid add-ons sell for $50–120/mo — [seodata.dev](https://www.seodata.dev/keyword/tip-pool-calculator), [TheRestaurantHQ](https://www.therestauranthq.com/technology/tipping-software/)

### Inferences
Candidate shortlist for a solo Next.js + Supabase + Stripe founder. Ranked by my judgement from the evidence above; all are inferences:
1. **Trade-specific estimate → e-sign → invoice** (painters, landscapers, cleaners, handymen, pressure washing). Free estimate template/generator pages for each trade, then $15–29/mo. Evidence: 5–10k combined template volume, $12–14 CPC, Joist price and feature complaints.
2. **Vertical client intake + consent forms with e-signature** (esthetician, massage, lash, tattoo, salon). Free printable/fillable templates, then $12–25/mo for unlimited digital forms with stored records. Competitors are horizontal form builders.
3. **Liability waivers for small activity businesses** (fitness studios, rentals, climbing, events). A proven paid category. Compete on simpler flat pricing and vertical templates.
4. **Landlord micro-suite** (rent receipt generator, move-in/move-out inspection checklist with photos, lease templates) for 1–10-unit landlords. Rent receipt plus rental receipt ≈ 19k/mo. Watch for incumbents like TurboTenant and RentRedi (not checked here).
5. **Cleaning business quote/checklist tool** (high CPC). Not page-1 checked.
6. **Small-team schedule maker → paid sharing/SMS** is possible but faces strong free incumbents. Lower priority.
- Avoid: pay stub generator (fraud and payment risk), generic invoice/receipt generators (saturated), QR menus (declining, low-priced), tip pooling (too small), punch cards (too small).

### Gaps
- Not checked: page 1 for "cleaning business software", landlord queries, or "liability waiver template", and pricing for TurboTenant, RentRedi, Jobber or Housecall Pro.
- None of the vertical angles has a confirmed revenue case study tied to SEO.
