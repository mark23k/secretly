# Shopify App Store opportunities for a solo, no-outreach founder

**How the data was collected (read first):** All app-level numbers below come from the live Shopify App Store (apps.shopify.com), fetched on **2026-10-28** with plain curl. App pages and review pages (`/<handle>/reviews?ratings[]=1&ratings[]=2&sort_by=newest`) are server-rendered. Search results load in a deferred Turbo frame, which I fetched the same way a browser does (the `Turbo-Frame: search_page` header). I did not change the user-agent or get around any bot check. Category listing pages (`/categories/.../all`) did not render results to curl, so I used keyword searches as the demand proxy instead.
- "N apps" is the store's search-result count for a keyword. It is a fuzzy-match count, not a category size, so read it as "how crowded the keyword is", not as an exact number of competitors.
- The "top-10 review sum" adds up the review counts of the first 10 organic results. Reviews track installs, so this is a rough demand proxy.
- Ratings and review counts are as shown on 2026-10-28. Raw HTML, parsed JSON and the scripts are in `/private/tmp/claude-501/-Users-moshekaplan-secretly/3960721d-ca1c-4ae9-8a78-0b3184a404e7/scratchpad/` (search2.txt, d1.txt, search3.json, d2.json).
- Indie Hackers, the Shopify Community forum and Medium returned HTTP 403 to WebFetch. Dealslide returned 429. Convert2x and adsx failed TLS. Wherever I cite those sources from search-engine summaries, I label them as such.

## Which categories have high demand and room for a better app? (Top apps, ratings, pricing, BFS, launch dates, 1–2★ complaints)

### Takeaway
Ratings almost never show the gap. Nearly every top-10 app in every category is rated 4.8–5.0, and most carry the Built for Shopify (BFS) badge. The real gaps show up in three places:
- apps that **Shopify or Intuit build themselves** and that merchants rate poorly: Retail Barcode Labels 2.3★, Shopify Order Printer 3.6★, Marketplace Connect 4.1★, Intuit's QuickBooks connector (a burst of 1★ reviews after a September 2026 migration);
- **older, non-BFS incumbents** whose recent 1–2★ reviews keep naming the same failures (sync errors, lost work, billing surprises, AI-only support);
- **small B2B and vertical niches** where the top apps have under 200 reviews and no BFS badge (line sheets/catalogs, consignment/vendor payouts, Xero sync).

The barcode/price-label space and the B2B catalog/line-sheet space look like the best fit for a solo Next.js builder.

### Cited Findings

**A. Weak incumbents (all data from App Store pages, fetched 2026-10-28)**

1. **Barcode / price labels: Shopify's own "Retail Barcode Labels"**
   - 2.3★ from 476 reviews. Breakdown: 208 one-star, 85 two-star. No BFS badge. Free. Launched Dec 3, 2018. — [App Store](https://apps.shopify.com/retail-barcode-labels/reviews?ratings%5B%5D=1&ratings%5B%5D=2&sort_by=newest)
   - Recent 1–2★ complaints:
     - Jul 29, 2026 (Saratoga Chocolate Co.): "The recent Retail Barcode Labels update removed our ability to print SKU on Avery 5167 labels… Printing only barcode and price substantially increases the likelihood of mislabeling inventory."
     - Jul 24, 2026 (Patch Magazine): "all of a sudden my barcodes are longer and a different font… no links or helpdesk available."
     - Jun 12, 2026 (Fulkerson Winery and Farm): "There is no way to print barcodes from Purchase orders… I now have to go into over 200 variants by hand."
     - Jun 10, 2026 (German merchant, translated): fixed label sizes make the app "unusable" for them.
     - Jun 14, 2026: "just stopped working cannot download/print labels."
   - Search "barcode": 1,196 apps; top-10 review sum 2,698. Several well-rated BFS alternatives already exist:
     - delta-retail-barcode: 5.0★ (619), free
     - barcode-management: 4.9★ (420)
     - yanet-barcode-labels: 4.9★ (457)
     - easyscan-inventory-and-order: 5.0★ (377)
     - — [App Store search "barcode"](https://apps.shopify.com/search?q=barcode)
   - Search "shelf labels": 940 apps. Top results are tiny: shelva-app 5.0★ (8), retail-labels (2), and several apps with 0 reviews. — [App Store search "shelf labels"](https://apps.shopify.com/search?q=shelf+labels)

2. **Invoices / packing slips: Shopify's own "Order Printer"**
   - 3.6★ from 384 reviews (171 one-star). Free. No BFS badge. This listing launched May 15, 2024. — [App Store](https://apps.shopify.com/shopify-order-printer/reviews?ratings%5B%5D=1&ratings%5B%5D=2&sort_by=newest)
   - Complaints:
     - Jul 16, 2026: "invoices are not compliant with UK or EU laws."
     - Jun 25 and Apr 17, 2026: cannot print **draft orders**.
     - May 19, 2026: "rounds up the figure on the invoice."
     - Apr 7, 2026: "cannot automate invoice in confirmation email… still missing after all these years."
   - The category is crowded with strong BFS apps:
     - Order Printer Pro: 4.9★ (3,018)
     - Vify: 5.0★ (1,214)
     - order-printer-templates: 4.9★ (778)
     - Avada PDF Invoice: 4.9★ (709)
     - — [App Store search "invoice"](https://apps.shopify.com/search?q=invoice), [App Store search "packing slip"](https://apps.shopify.com/search?q=packing+slip)
   - Search "draft order invoice": the top app built for this exact job has 3 reviews (draft-order-invoices, 5.0★). — [App Store search "draft order invoice"](https://apps.shopify.com/search?q=draft+order+invoice)

3. **QuickBooks / Xero accounting sync**
   - **QuickBooks Online Connector (Intuit)**: 4.6★ from 3,351 reviews (about 90% 5★, 95 one-star). Not BFS. Launched Feb 23, 2015. All 10 of its newest 1–2★ reviews are dated **Sep 10 – Oct 2, 2026**, which points to a forced migration.
     - Oct 1, 2026 (Dragonfly Leotards): "Zero notice of the upgrade, and removing the old Onesaas… No invoices only sales receipts. Zero value sales are not sent to quickbooks."
     - Sep 30, 2026: "app is creating duplicate invoice numbers."
     - Sep 13, 2026: "removed ability to pull across transactions as invoices."
     - — [App Store](https://apps.shopify.com/qbconnector/reviews?ratings%5B%5D=1&ratings%5B%5D=2&sort_by=newest)
   - **Xero (Amaka)**: 2.0★ from 15 reviews. Plans: Free (60 orders/mo), $18/mo (500 orders), $49/mo (unlimited).
     - Sep 9, 2026: "failed sync's constantly… isn't built to sync certain things I need, like taxes."
     - May 19, 2026: cannot link a Shopify SKU to a Xero item code.
     - — [App Store](https://apps.shopify.com/xero-accounting-integration/reviews?ratings%5B%5D=1&ratings%5B%5D=2&sort_by=newest)
   - Search "xero": 1,242 apps. Top-10 review sum is only 1,168. The leaders are A2X 4.9★ (360) and Xero Bridge 4.9★ (309, BFS). — [App Store search "xero"](https://apps.shopify.com/search?q=xero)
   - MyWorks QuickBooks Sync: 4.5★ (58), BFS, launched Nov 24, 2023. Pricing: Free (20 orders/mo), then $24/mo (100 orders).
     - Aug 8, 2026: "It took almost two days to receive a response to our support emails."
     - — [App Store](https://apps.shopify.com/quickbooks-sync-by-myworks)

4. **Marketplace / Etsy sync**
   - **Shopify Marketplace Connect**: 4.1★ from 2,134 reviews, with **309 one-star (14%)**. Free for the first 50 synced orders/mo, then 1% per order, capped at $99/mo. Launched Sep 19, 2017.
     - Sep 9, 2026: "Sync does not work. Screws up prices and inventory."
     - Sep 18, 2026: "lists your items and then removes them reducing the price to zero."
     - Sep 11, 2026: "Doesn't work for Target."
     - — [App Store](https://apps.shopify.com/marketplace-connect/reviews?ratings%5B%5D=1&ratings%5B%5D=2&sort_by=newest)
   - **CedCommerce Etsy integration**: 4.5★ (1,249), BFS. $9/mo for 10 products, $59/mo for 1,000.
     - Jul 29, 2026: "the app rewrote my Etsy SKUs."
     - Aug 24, 2026: spent "$5,000 on the enterprise solution" and was disappointed.
     - Oct 20, 2026: "very glitchy… customer service is outsourced."
     - — [App Store](https://apps.shopify.com/etsy-marketplace-integration/reviews?ratings%5B%5D=1&ratings%5B%5D=2&sort_by=newest)
   - **QuickSync Etsy**: 4.8★ (2,015). From $19/mo.
     - Sep 21, 2026: "the positive reviews are generally from users that have just downloaded the app."
     - — [App Store](https://apps.shopify.com/quicksync-etsy)

5. **B2B catalogs / line sheets: small demand, weak incumbents, no BFS app among the leaders**
   - Search "line sheet": 5,471 fuzzy matches, but the **top-10 review sum is only 402**. — [App Store search "line sheet"](https://apps.shopify.com/search?q=line+sheet)
   - **Easy Catalogs** (aleksovApps): 4.4★ (192). Not BFS. Launched May 1, 2020. Free, then $9.99/mo and up; one reviewer paid $359.99/yr for the top tier.
     - Mar 23, 2026: "Misleading pricing… Even the Basic Plan has a 10-page limit."
     - Mar 3, 2026: "deleted our catalog out of nowhere."
     - Oct 28, 2025: "constantly crashes, doesn't autosave."
     - Aug 26, 2025: work "is gone."
     - — [App Store](https://apps.shopify.com/easy-catalogs/reviews?ratings%5B%5D=1&ratings%5B%5D=2&sort_by=newest)
   - **Foldsquare**: 4.3★ (93). Launched Nov 19, 2013. $19.99/mo Retail tier.
     - Feb 18, 2025: "Slow, clunky."
     - Aug 15, 2025: can't find orders placed from interactive catalogs.
     - — [App Store](https://apps.shopify.com/foldsquare-catalog-maker)
   - **Zine Builder**: 4.5★ (56). Launched Jun 30, 2014. **$40/mo Essential, $80/mo Studio**.
     - Sep 10, 2022: "catalogs are deconfigured by themselves… the catalog disappears."
     - — [App Store](https://apps.shopify.com/zine-builder)

6. **Consignment / vendor payouts: a small vertical with old, buggy incumbents**
   - Search "consignment": 96 apps; top-10 review sum 292. — [App Store search "consignment"](https://apps.shopify.com/search?q=consignment)
   - **Vendor Consignment** (Visceral Apps): 4.6★ (31). Launched Jul 31, 2019. $9.99 / $39.99 / $59.99 per month. Its 1–2★ reviews are from 2020–21: "buggy as hell… vendors cant edit their addresses." — [App Store](https://apps.shopify.com/vendor-consignment)
   - **CollabPay**: 3.5★ (26). $40 / $60 per month. — [App Store](https://apps.shopify.com/collabpay)
   - **ConsignCloud**: 5.0★ (9). **$139–$189/mo**. — [App Store](https://apps.shopify.com/consigncloud)
   - Search "vendor payout": top-10 review sum 321. Leader: vendor-payout 4.9★ (46). — [App Store search](https://apps.shopify.com/search?q=vendor+payout)

7. **Size charts: commoditized, with pricing backlash against the leader**
   - **Kiwi Sizing**: 4.7★ (1,246). Not BFS. Launched Mar 5, 2018. Premium is $7.99/mo for 10 charts.
     - Aug 22, 2026: "I used to pay $6.99 a month and could publish up to 100 size charts… now… only allowed to publish 10."
     - Oct 15, 2026: charged "based on my store's total order volume."
     - Sep 23, 2026: "Average and expensive. Claude can make size charts for free."
     - — [App Store](https://apps.shopify.com/kiwi-sizing/reviews?ratings%5B%5D=1&ratings%5B%5D=2&sort_by=newest)
   - But **Avada Size Chart** is 5.0★ (880), BFS, with a free plan. — [App Store search "size chart"](https://apps.shopify.com/search?q=size+chart)

8. **Other weak or complained-about incumbents worth noting**
   - **Event Tickets (Staytuned)**: 4.5★ (335). Launched 2013. $1/ticket, or $19/mo + $0.75/ticket.
     - Jun 18, 2026: "all customer service is handled by an AI agent."
     - Apr 25, 2026: "tickets are not sending to customers… no human support over the weekend."
     - — [App Store](https://apps.shopify.com/event-tickets)
   - **Simprosys Google Shopping Feed**: 4.9★ (4,950). From $4.99/mo.
     - Apr 18 and May 23, 2026: the app "ruined our Google Merchant feed within 1 hour."
     - — [App Store](https://apps.shopify.com/google-shopping-feed)
   - **DataFeedWatch**: from **$64/mo**. A Sep 21, 2025 reviewer called it "an overpriced product feed uploader." — [App Store](https://apps.shopify.com/datafeedwatch)
   - **Chargeflow**: 4.5★ (434; 30 one-star). Takes 25% of recovered chargebacks.
     - Sep 18, 2026: "success rate is about 10%."
     - — [App Store](https://apps.shopify.com/chargeflow)
   - **BookThatApp**: 4.7★ (420). Launched May 29, 2012. LITE $25/mo, PREMIUM $49.95/mo.
     - Feb 22, 2026: "Overpriced and seems like it hasn't been updated in years."
     - — [App Store](https://apps.shopify.com/bookthatapp)
   - **Inventory sync**: three apps show the same failure pattern.
     - Syncio 4.7★ (170): Apr 6, 2026, "created around 300 duplicate products."
     - Easify Inventory Sync 4.5★ (71), BFS: Feb 7, 2026, "caused a critical outage."
     - — [Syncio](https://apps.shopify.com/syncio), [Easify](https://apps.shopify.com/easify-inventory-sync)
   - **Wholesale**:
     - Wholesale Gorilla: 4.8★ (320), $34.95–$149.95/mo. Aug 17, 2026: "AI customer support… Every week there is a new issue with the app not letting customers check out." — [App Store](https://apps.shopify.com/wholesale-gorilla)
     - Wholesale Pricing Discount: 4.9★ (752), BFS, $24.99+/mo. Jun 1, 2026: "App constantly breaks." — [App Store](https://apps.shopify.com/wholesale-pricing-discount)
   - **Uploadery (file upload)**: 4.6★ (180), BFS. Its listing advertises a free plan, but May 14 and May 31, 2026 reviewers say it auto-requires the $9.99 Professional plan. — [App Store](https://apps.shopify.com/uploadery)

**B. Keyword demand snapshot (2026-10-28)**

| Keyword | Result count | Top-10 review sum | Note |
|---|---|---|---|
| product reviews | 8,067 | 67,783 | |
| upsell | 3,280 | 22,788 | |
| popup | 7,839 | 19,312 | |
| back in stock | 4,114 | 18,231 | |
| customer tags | 9,891 | 18,009 | |
| pre order | 7,141 | 16,475 | |
| product options | 9,117 | 14,834 | |
| net terms | 5,667 | 8,087 | |
| appointment booking | 984 | 7,726 | |
| product feed | 8,610 | 7,616 | |
| returns | 4,020 | 7,269 | |
| invoice | 2,082 | 6,965 | |
| quickbooks | 206 | 5,666 | |
| wholesale | 1,998 | 5,962 | |
| rental | 3,336 | 5,181 | |
| delivery date | 6,342 | 4,725 | |
| accessibility | 3,009 | 4,033 | |
| inventory sync | 2,817 | 3,981 | |
| barcode | 1,196 | 2,698 | |
| size chart | 4,143 | 2,749 | |
| store locator | 5,257 | 2,246 | |
| request a quote | 1,697 | 2,180 | |
| order limits | 5,555 | 1,842 | |
| inventory forecasting | 1,369 | 1,851 | |
| metafields | 1,333 | 1,618 | |
| purchase orders | 5,897 | 1,325 | |
| event tickets | 3,732 | 1,189 | |
| xero | 1,242 | 1,168 | |
| gift wrap | 1,363 | 1,138 | |
| order editing | 4,918 | 961 | |
| sales rep | 8,118 | 935 | |
| donation | 546 | 605 | |
| line sheet | 5,471 | 402 | |
| vendor payout | 5,648 | 321 | |
| consignment | 96 | 292 | |
| prescription | 291 | 94 | Optical Rx lens apps |

— [Shopify App Store search](https://apps.shopify.com/search?q=wholesale) (same URL pattern for each keyword)

### Inferences
- **Best solo fit: barcode, price and shelf labels.**
  - The app Shopify itself offers is rated 2.3★, and its 2026 complaints name specific missing features: custom label sizes, SKU on Avery 5167, printing from purchase orders, Dymo template stability.
  - The work is mostly PDF and label layout plus reading products, variants and inventory through the GraphQL Admin API. That suits Next.js and an AI coding assistant well, and the support load is low.
  - The catch: BFS competitors with 400–600 reviews already exist. A new app would need a clear wedge, for example "labels from purchase orders / incoming inventory" or "any label size / Avery and Dymo presets that never change", and would win on keywords such as "shelf labels" and "price labels", where the leaders have under 10 reviews.
- **B2B line sheets / wholesale catalogs.**
  - Low competition: no BFS app among the leaders, and the incumbents are 4.3–4.5★ with lost-work and misleading-pricing complaints.
  - Buyers will pay: the incumbents charge $10–$80/mo.
  - The ceiling is the low search volume (top-10 review sum 402), so this looks like a few-thousand-dollar MRR niche, not a $20K+ one. That fits the founder's "steady income" goal.
- **QuickBooks / Xero sync.**
  - Demand is high and the incumbents are visibly hurting: Intuit's Sep–Oct 2026 migration backlash and a 2.0★ Xero app.
  - But accounting correctness (taxes, zero-rated sales, invoice numbering) carries heavy support and liability. The founder could handle it technically, but the support load is risky for a solo, no-outreach operator. A narrower wedge would be safer, e.g. "Shopify payouts → Xero bank reconciliation for small US stores".
- **Marketplace / Etsy / inventory sync** shows the most anger, but it is the hardest to get right: external APIs, data destruction on failure, constant support. Not recommended for a first app.
- **Consignment / vendor payouts** is a coherent vertical with pricing power ($40–$189/mo) and old or buggy incumbents. Demand is small, so it suits a "few hundred merchants × $30–60/mo" plan.
- Shopify-built free apps (Order Printer, Retail Barcode Labels, Marketplace Connect) cap prices but leave dissatisfied users. "Better than Shopify's free app" is a clear position, and their low ratings show unmet need.

### Gaps
- Exact install counts are not shown on the App Store, so I used review counts as the demand proxy. Third-party install trackers (StoreLeads, StoreCensus) were not checked.
- "Last updated" dates are not shown on listings; only "Launched" dates are, so app staleness is inferred from launch year and complaint content.
- Category-level app counts were not available because category listings did not render to curl.
- I did not analyze complaint frequency statistically. Quotes come from the newest roughly 10 one- and two-star reviews per app.

## Evidence on solo/indie Shopify app revenue

### Takeaway
Verified solo-app revenue data is scarce. The best primary evidence is broker listings (a Flippa listing at about $12.9K MRR with roughly 86% margin, marketed mainly through App Store ads). Founder-reported figures cluster between $1K and $30K MRR for single utility apps, with first-year results typically low ($0–3K MRR). Discovery for these apps is mostly App Store search and keywords. All indie revenue figures are self-reported unless noted.

### Cited Findings
- **Mergify** (combines a customer's multiple orders into one shipment) on Flippa:
  - $12,900 MRR; $138K TTM revenue; $115.5K TTM net profit (86% margin).
  - 3,060 active subscribers, 4% churn, 4.7★ from 96 reviews, 5 years old.
  - Marketing "limited to Shopify app store ads and Google Ads", with $10 CAC against $39 CLV. Needs under 20 hrs/week of support.
  - Asking price cut from $750K to $645K. These are seller and broker figures, not audited.
  - — [Flippa listing](https://flippa.com/12766656-mergify-is-a-shopify-app-that-combines-multiple-customer-orders-into-one-shipment-helping-stores-save-on-shipping-costs)
- **Kaching Appz:** Shopify's ecosystem post (Apr 28, 2026) says it grew from about $900K to $4.3M annual revenue in one year, with a team of 40. — [Shopify News](https://www.shopify.com/news/billion-dollar-ecosystem)
  - The same founder (Erikas Mališauskas) wrote that his first app reached $1,000 MRR in under 4 months and ranked #1 for several keywords within weeks of launch, crediting the name and description keywords. Seen only via search summary; Medium returned 403, and the post is older. — [Medium](https://malisauskas.medium.com/from-zero-to-1000-mrr-in-4-months-how-i-created-a-shopify-app-microsaas-b84cf72e24f5)
  - An Indie Hackers post describes the Kaching Appz portfolio passing $100K MRR. Search summary only (paywalled / 403). — [Indie Hackers](https://www.indiehackers.com/post/qdReVAgLjz6EpW4OrJSI)
- **Ecosystem scale:** Shopify paid developers more than $1.3B last year; more than 21,000 apps are live; active installs grew nearly 20% YoY.
  - Lightward's Locksmith has 162K+ installs, about 16K active subscribers and "8-figure" revenue, with a team of 12.
  - Shopify gives no average or distribution of developer earnings.
  - — [Shopify News, Apr 28, 2026](https://www.shopify.com/news/billion-dollar-ecosystem)
- **Indie Hackers examples** (titles and summaries only; IH returned 403):
  - "I bootstrapped a Shopify app to 78K CAD MRR in 3 years" — [IH](https://www.indiehackers.com/post/i-bootstrapped-a-shopify-app-to-78k-cad-mrr-in-3-years-ask-me-anything-5fbbc2b886)
  - "…to $25K MRR in less than a year" (Dec 2021, older) — [IH](https://www.indiehackers.com/post/i-bootstrapped-a-shopify-app-to-25k-mrr-in-less-than-a-year-ama-89f3d4c471)
  - A 2024 IH newsletter cited SuperLemon (~$29K MRR), WiseBundle (~$25K MRR) and StoreMapper (~$21K MRR) — [IH search summary](https://www.indiehackers.com/post/qdReVAgLjz6EpW4OrJSI)
  - StoreMapper (store locator) is live at 4.9★ (97 reviews), not BFS, launched Feb 4, 2013 — [App Store](https://apps.shopify.com/storemapper). That a ~$20K MRR app can run on only 97 reviews (2013-era) is notable.
  - "My Shopify app sat at 0 reviews for 3 weeks at $119/mo – I just made it free" — [IH](https://www.indiehackers.com/post/my-shopify-app-sat-at-0-reviews-for-3-weeks-at-119-mo-i-just-made-it-free-heres-the-honest-math-92c5164580)
  - Zigpoll's solo founder reportedly said the Shopify App Store is the largest single source of signups (about one third) and that traction took about two years. Search summary only. — [IH](https://www.indiehackers.com/post/tech/hitting-125k-mrr-as-a-solo-founder-by-doubling-down-on-the-right-segment-c4o2Tfs6mjdpip5yZhaO)
- **Early organic traction is slow** (Shopify Community thread, 2026; search summary only, page returned 403):
  - One developer reported a new app with no reviews gets "0–2 organic installs a week".
  - Another made about $1,000 over six months from a free app.
  - Several commenters fell back on outreach to get their first 10 users.
  - — [Shopify Community](https://community.shopify.com/t/how-did-you-get-your-first-10-organic-app-installations-in-2026/643974)
- **Benchmark estimates (vendor content; I could not verify the methods):**
  - ADSX (2026): solo apps typically stay under $500 MRR for 3–6 months and reach $1K–$3K MRR in year one. Many cluster at $2K–$20K MRR. Niche utilities top out around $5K–$30K MRR. — [ADSX](https://adsx.com/blog/how-much-shopify-app-developers-make) (fetch failed; search summary)
  - Convert2x (2026, "400+ apps"): average app about $8,769 MRR; top quartile about $13,300; App Store visitor-to-install conversion 3.41% (top quartile) vs 2.12% (average). — [Convert2x](https://convert2x.com/learn/grow-shopify-app-to-100k-mrr) (fetch failed; search summary)
- **For-sale listings:** DealSlide reportedly showed about 37 active Shopify app listings (synced Oct 18, 2026), e.g. a $140K two-app portfolio with about $42.9K annual revenue and a $950K upsell app with about $187.7K annual revenue. Search summary; the page returned 429. — [DealSlide](https://dealslide.com/shopify-apps-for-sale)
  - Acquire.com had a "Profitable Shopify App Portfolio with ~$500 MRR" listing; the page body did not load. — [Acquire](https://app.acquire.com/startup/wavy6rcufu-profitable-shopify-app-portfolio-with-500-mrr-and-low-support-overhead)
- **TrustMRR:** I found only TrustMRR's own Shopify app (a merchant revenue verifier launched Jul 24, 2026) and the TrustMRR marketplace in general. I found no TrustMRR-verified Shopify *app developer* revenue listings. — [App Store](https://apps.shopify.com/trustmrr-revenue), [TrustMRR FAQ](https://trustmrr.com/faq)

### Inferences
- A realistic plan for a no-outreach solo founder:
  - expect months at under $500 MRR;
  - aim for $1K–3K MRR in year one;
  - aim for $5K–15K MRR over 2–3 years in a niche utility.
- Mergify and StoreMapper show that "boring logistics utility, small support load, $10–30/mo pricing" can reach about $12–20K MRR at high margin.
- Mergify paid for App Store ads. Shopify's own App Store ads are the paid lever that still fits a no-outreach rule.

### Gaps
- No TrustMRR-verified Shopify app MRR records found.
- I could not read Indie Hackers or Starter Story interview texts (403). Details on how those merchants found the apps are unverified.
- No current Acquire.com multiples specific to Shopify apps. The most recent Acquire Shopify figure I saw, "up to 5x revenue" for large Shopify SaaS, is from 2022 and was seen only in a search summary.

## How App Store search and ranking works, the revenue-share terms, and the technical/approval requirements

### Takeaway
Shopify ranks search results on keyword matching plus merchant behavior after a search, with a boost for "trending" high-quality apps. BFS gives a visible badge and placement benefits but needs 50 net paid installs and 5 reviews first.

Revenue share is verified: **0% on the first $1M of lifetime gross app revenue (counted from Jan 1, 2025), then 15%, plus a 2.9% processing fee**. App Store billing is mandatory.

New apps must use the GraphQL Admin API (no REST), work as embedded apps with App Bridge and session tokens, and use theme app extensions for storefront changes. Shopify's template is now React Router (the successor to Remix). A Next.js build is possible but means more glue code.

### Cited Findings
- **Revenue share (official):**
  - "You keep 100% of your first $1,000,000 USD in lifetime gross app revenue, and 85% of earnings above that."
  - The threshold is lifetime, and "Only revenue earned on or after January 1, 2025 counts."
  - $19 one-time registration fee to publish on the App Store.
  - "All billing is subject to a 2.9% processing fee and applicable sales tax."
  - Developers with ≥$20M prior-year App Store earnings or ≥$100M company revenue pay 15% on everything.
  - — [shopify.dev revenue share](https://shopify.dev/docs/apps/launch/distribution/revenue-share)
  - Acquire.com's category page still says the default is 20%; that is outdated. — per search summary of [Acquire](https://acquire.com/shopify-apps-for-sale/)
- **Search ranking (official, Feb 27, 2023):**
  - Search uses behavioral data on "how merchants interact with results after searching". Apps merchants find most relevant "will rank higher overall".
  - Term-matching still counts, but "keyword stuffing will now have less of an impact".
  - A mechanism "dynamically increase[s] the ranking of apps that are gaining traction, especially if they are high quality".
  - The post does not mention reviews as a factor.
  - — [Shopify Partners blog](https://www.shopify.com/partners/blog/search-improvements)
- **BFS prerequisites (official):**
  - "a minimum of 50 net installs from active shops on paid plans", "a minimum of five reviews", and a minimum recent rating.
  - Admin performance: LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms.
  - Checkout requests p95 ≤ 500ms.
  - Design must use Polaris web components (e.g. `s-modal`, `s-page`) and the Contextual Save Bar; no embedding of external websites.
  - — [shopify.dev BFS requirements](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements)
  - BFS benefits: a badge on app cards and listing, and a BFS search filter. — [shopify.dev BFS overview](https://shopify.dev/docs/apps/launch/built-for-shopify.md)
  - Third-party claims of a "49% install boost" for BFS apps are unverified (search summary of [AppJubilee blog](https://blog.appjubilee.io/shopify-app-store-seo-rank-higher/)).
  - In my 2026-10-28 searches, 8–10 of the top 10 results carried BFS in most consumer categories (back in stock, pre order, delivery date, order printer). In niche B2B searches (line sheet, vendor payout, consignment, xero, multi-vendor) most leaders did *not* have BFS. — [App Store search](https://apps.shopify.com/search?q=line+sheet)
- **App Store requirements (official):**
  - Billing: "Apps that use off-platform billing cannot be distributed through the Shopify App store". Use Shopify App Pricing (managed pricing) or the Billing API, and merchants must be able to upgrade and downgrade themselves.
  - "As of April 1, 2025 all new public apps must be built exclusively with the GraphQL Admin API."
  - Embedded: latest App Bridge script loaded first; must work "without relying on third-party cookies or local storage".
  - Theme changes only via theme app extensions.
  - No statistics in the listing; a screencast and test credentials are required.
  - — [shopify.dev App Store requirements](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements)
- **Templates:** Shopify's Remix template README says "Remix is now React Router… use the Shopify App Template – React Router instead". The CLI command is `shopify app init --template=https://github.com/Shopify/shopify-app-template-react-router`. — [GitHub template](https://github.com/Shopify/shopify-app-template-react-router), [shopify.dev package docs](https://shopify.dev/docs/api/shopify-app-react-router/latest)
- **Listing reality (observed 2026-10-28):** App pages show the launch date, review distribution, an AI "What merchants think" summary (for apps with 100+ reviews and ≥4.0★), pricing plans and the BFS badge. Search results show a "Built-in feature" card where Shopify has a native feature (e.g. "bif:b2b" on "wholesale", "bif:draft-orders" on "invoice", "bif:inventory" on "purchase orders", "bif:metafields-and-metaobjects" on "metafields"). Shopify promotes its own native features above third-party apps for those keywords. — [App Store search "wholesale"](https://apps.shopify.com/search?q=wholesale)

### Inferences
- **Feasibility for a Next.js + Supabase + Stripe founder:**
  - Stripe cannot be used for merchant billing. It must be Shopify Billing or managed pricing.
  - Supabase works fine as the backend database.
  - Next.js can host an embedded app (App Bridge via script tag, session-token auth, GraphQL Admin API), but Shopify's tooling, docs and auth libraries assume the React Router template. The lowest-risk path is the official React Router template, with Supabase or Postgres for storage.
  - Expect the main effort to go into OAuth/session tokens, mandatory compliance webhooks, billing flows, theme app extensions (for storefront UI) and passing review. An AI coding assistant handles that boilerplate well.
- **Ranking for a new app:** pick keywords where the leaders have few reviews and no BFS badge. Earn the 5 reviews and 50 paid installs needed for BFS. Rely on behavioral relevance (click-through, installs, low uninstall rate) rather than keyword stuffing.
- **Avoid features Shopify now ships natively** (B2B, draft orders, inventory, metafields). The "Built-in feature" cards siphon off searches, and Shopify can absorb the feature later.

### Gaps
- Official review/approval turnaround time not found.
- No official weighting of reviews vs installs vs BFS in ranking.
- The exact "minimum recent rating" for BFS is not published.
- I did not confirm whether Shopify's 2026 docs still list GDPR/compliance webhooks as mandatory in the same section (WebFetch of the requirements page did not surface them; third-party guides say they are required).

## Saturated vs underserved categories

### Takeaway
Saturated:
- reviews
- upsell/bundles
- popups/email capture
- product options
- back-in-stock/pre-order
- delivery date/pickup
- cookie consent
- order limits
- size charts

In all of these, the top 10 are almost all BFS, 4.8–5.0★, free-plan apps with hundreds to tens of thousands of reviews.

Underserved, with weak or old incumbents:
- barcode/shelf/price labels
- B2B line sheets/catalogs and draft-order quotes/invoices
- consignment/vendor payouts
- Xero/QuickBooks sync for small stores
- event tickets
- specialist verticals (optical prescriptions, FFL firearms), which are small but thinly served

### Cited Findings
- **Saturated** (2026-10-28 searches):

| Keyword | Leaders | Top-10 review sum |
|---|---|---|
| product reviews | Judge.me 5.0★ (49,179), Loox 4.9★ (9,989) | 67,783 |
| upsell | Bundle Deals 5.0★ (6,517), Fast Bundle 5.0★ (3,604), ReConvert 4.8★ (3,116) | 22,788 |
| popup | PopConvert 4.9★ (8,678), EcomSend 4.9★ (7,693) | 19,312 |
| product options | Product Options Pro 4.9★ (5,212), Easify 4.9★ (3,193), BSS 4.9★ (2,371) | 14,834 |
| back in stock | CartBite 5.0★ (4,357), 3,957 and 3,867 reviewed apps; all 10 BFS with free plans | 18,231 |
| delivery date | 9/10 BFS | 4,725 |
| order limits | 7/10 BFS | 1,842 |
| cookie consent | GDPR Cookie Consent 5.0★ (3,111) | — |

— [App Store searches](https://apps.shopify.com/search?q=product+reviews)
- **Underserved signals:**
  - "shelf labels": leaders have 8, 2 and 1 reviews, and several have 0 — [search](https://apps.shopify.com/search?q=shelf+labels)
  - "draft order invoice": the purpose-built app has 3 reviews — [search](https://apps.shopify.com/search?q=draft+order+invoice)
  - "line sheet": top-10 review sum 402; leaders 4.3–4.5★, not BFS — [search](https://apps.shopify.com/search?q=line+sheet)
  - "consignment": 96 results; top-10 sum 292 — [search](https://apps.shopify.com/search?q=consignment)
  - "prescription": 291 results; top-10 sum 94; leaders have 44 and 38 reviews — [search](https://apps.shopify.com/search?q=prescription)
  - "ffl firearms": the top relevant apps have 2–5 reviews, and unrelated review apps fill the results — [search](https://apps.shopify.com/search?q=ffl+firearms)
  - "sales rep": top-10 sum 935; "sales-representative-commission-reports" is 3.3★ (28) — [search](https://apps.shopify.com/search?q=sales+rep)
  - "xero": top-10 sum 1,168, including a 2.0★ app — [search](https://apps.shopify.com/search?q=xero)
- **Compliance:**
  - "accessibility": led by sea-accessibility 5.0★ (329), BFS; accesswidget 3.5★ (17) — [search](https://apps.shopify.com/search?q=accessibility)
  - "age verification": led by Blockify 4.9★ (311), BFS — [search](https://apps.shopify.com/search?q=age+verification)
  - Several EU-specific compliance apps (EU warranty labels, "Widerrufsbutton" withdrawal button with 2,318 reviews) suggest regulation-driven niches can attract installs quickly. They are EU-relevant, not US. — [search "warranty"](https://apps.shopify.com/search?q=warranty), [search "returns"](https://apps.shopify.com/search?q=returns)
- **B2B/wholesale is busy at the top**: Faire, SparkLayer, Sami (994), B2B Solution (1,195), Wholesale Pricing Discount (752), almost all BFS. Shopify also shows a native B2B "Built-in feature" card. Sub-niches under it are thinner: line sheets, quick order forms, sales-rep tools, draft-order invoices. — [search "wholesale"](https://apps.shopify.com/search?q=wholesale)

### Inferences
- Avoid marketing and conversion widgets. They are saturated with free, BFS, 5.0★ apps that have thousands of reviews and are run by funded teams.
- Underserved opportunities sit in back-office and operations utilities for physical or B2B merchants (labels, catalogs, invoices/quotes, consignment, accounting exports). These match a solo developer's strengths: data-in, document-out, low storefront risk, and merchants who pay $10–60/mo.
- Shortlist ranked by (demand × incumbent weakness × solo feasibility):
  1. Barcode/shelf/price labels (with PO and receiving support)
  2. B2B line sheets/catalog PDFs with an order form that creates draft orders
  3. Consignment/vendor payouts for resale shops
  4. Draft-order quote/invoice PDFs (compliance-aware)
  5. Small-store Xero sync (higher risk)

### Gaps
- No install-count data to size niches precisely.
- US merchant share per niche not measured. The App Store is global, and many quoted reviewers are non-US.
- I could not confirm whether Shopify plans native features for labels or catalogs, which would compete.
