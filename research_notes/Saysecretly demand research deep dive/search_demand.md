# US Search Demand for saysecretly.com Product Ideas (Google Trends + keyword volumes, 2021-2026)

**Method note (read first).** Data was pulled on 2026-10-27.
- **Google Trends, run through pytrends 4.x.** Settings: geo=US, timeframe 2021-01-01 to 2026-10-27, monthly points. Terms ran in batches of up to 5 that all shared the anchor **"anonymous chat"** (two batches used "anonymous message", rescaled by 0.60, its measured ratio to the anchor). That keeps every number on one scale. Trends was **not blocked**. pytrends' built-in `retries` option crashes with current urllib3 (`method_whitelist` error), so I ran it without retries and it worked. Raw data: `/private/tmp/claude-501/-Users-moshekaplan-secretly/3960721d-ca1c-4ae9-8a78-0b3184a404e7/scratchpad/trends_raw.json`, `.../trends_raw2.json`, `.../analysis.txt`. Trends pages can't be cited directly: they are generated per query, so the source is listed as "Google Trends via pytrends, 2026-10-27".
- **"Ratio to anchor"** is the term's average over the trailing 12 months (Oct 2025-Sep 2026) divided by the anchor's average over the same months.
- **Absolute volumes.** Free tools that give US volumes were mostly gated:
  - Ahrefs free keyword generator: the page loads but returns no data without its interactive captcha.
  - SpyFu: HTTP 403.
  - Semrush public domain pages: returned only a Mexico database for ngl.link, and 404 for kudoboard.com, futureme.org and elfster.com.

  RankHero (an Etsy SEO tool that shows Google monthly volumes split by country) gave US numbers for a few terms. I used them to **calibrate** the Trends ratios: 1 unit of "anonymous chat" ≈ **4,000-5,300 US searches/month**. This rests on three of the four RankHero checks agreeing: secret santa, white elephant and farewell card. The fourth, secret admirer, did not agree. Treat every number labelled "calibrated estimate" as order-of-magnitude only.
- **Trends caveat.** Trends matches multi-word terms entered without quotes broadly: any query containing all the words, in any order. Generic phrases like "group card", "group gift", "sign a card" and "how to tell someone" are therefore heavily inflated compared with exact-match keyword tools.
- **SERP checks.** The WebSearch tool available here does not return true Google page-1 results. It returned a non-Google index with many spam/parasite pages, so "who ranks" is only partly answered (see Q3).

## Q1. Approximate US monthly search volume, 5-year trend, and seasonality per keyword

### Takeaway
The largest exact-intent demand in this space is **seasonal group-gifting**: secret santa, white elephant and elfster. Each runs at roughly 25k-80k US searches/month on a yearly average, with a 5-7x December spike. Next are the **brand/slang-driven anonymous-messaging terms** ("ngl", "anonymous text", "anonymous email"), which are evergreen. Literal "anonymous message / confession / compliment / apology" phrases are small (hundreds to low thousands per month). The fastest risers are **confession website, anonymous feedback/survey/employee feedback, anonymous dating, online group card, and tea app** (spiked July 2025).

### Cited Findings
Every row below is Google Trends US data pulled via pytrends on 2026-10-27, anchored on "anonymous chat". "Est. US/mo" is the ratio × 4,000-5,300 (calibrated estimate). The trend column compares each term's trailing-12-month average ending Sep 2026 with the same window ending Sep 2022. Seasonality shows the peak months as a multiple of the average month, measured over 2022-2025.

**Anonymous messaging**
| Term | Ratio to anchor | Est. US/mo | Trend 2022→2026 | Peak months |
|---|---|---|---|---|
| ngl (slang + NGL app; mostly "ngl meaning") | 11.6 | ~46k-61k | rising (+19%) | Jan 1.4x, Dec 1.3x, Sep 1.3x |
| anonymous text | 1.32 | ~5k-7k | flat (+3%) | none (flat) |
| anonymous email | 1.20 | ~5k-6k | rising (+84%) | none (flat) |
| anonymous chat (anchor) | 1.00 | ~4k-5k | rising (yearly avg index 3.2 in 2021 → 5.3 in 2026) | slight Nov/Dec |
| anonymous message | 0.60 | ~2.4k-3.2k | flat (+5%) | Feb 1.3x (Valentine's) |
| anonymous questions | 0.45 | ~1.8k-2.4k | flat/down (-12%) | Jul 1.4x, Jun 1.2x |
| send anonymous text | 0.32 | ~1.3k-1.7k | flat/slightly down (-12%) | flat |
| confession website | 0.23 | ~0.9k-1.2k | **sharply rising** (near zero before 2024, peak Jun 2026) | Dec, Jun-Jul |
| sendit (anonymous Q&A app) | 0.17 | ~0.7k-0.9k | **collapsing** (-93%) | Jun-Jul |
| anonymous confessions / confession | 0.07-0.08 | ~300-400 | confession: rising (+132%); confessions: flat | Apr, Dec |
| anonymous q&a | 0.07 | ~300 | flat | Jun 2.2x |
| ngl link | ~0 | <100 | spiked Jun 2022, now ~0 | — |

**Honest / hard conversations**
| Term | Ratio | Est. US/mo | Trend | Peak |
|---|---|---|---|---|
| how to tell someone (broad, inflated) | 23.7 | very large (Trends broad match) | flat/up (+10%) | none |
| secret admirer | 0.72 | ~3k-4k (RankHero says US 14,800/mo, so the sources conflict) | **falling** (-21%) | Feb 1.8x |
| tell someone anonymously | 0.03 | ~100-150 | flat | Jul |
| anonymous apology / anonymous compliment / tell someone you like them anonymously | ~0 | below Trends threshold (likely <100/mo) | — | — |

Google Autocomplete for "tell someone anonymously" is led by STD-notification intent: "tell someone anonymously they have std", "notify someone anonymously about std", "how to tell someone anonymously their spouse is cheating" ([Google Suggest API, 2026-10-27](https://suggestqueries.google.com/complete/search?client=firefox&hl=en&gl=us&q=tell%20someone%20anonymously)).

**Surprises & groups**
| Term | Ratio | Est. US/mo | Trend | Peak |
|---|---|---|---|---|
| secret santa | 15.2 | ~60k-80k (RankHero US: 60,500) | rising (+39%) | Dec 6.1x, Nov 3.8x |
| white elephant | 14.0 | ~56k-74k (RankHero US: 74,000) | rising (+32%) | Dec 7.1x, Nov 1.9x |
| elfster | 6.3 | ~25k-34k | rising (+36%) | Dec 5.2x, Nov 4.4x |
| group card (broad, inflated; includes card games) | 22.5 | inflated; RankHero exact = 9,900 all-country | index up 4.5x in 2025-26 (likely broad-match artifact) | Dec, Nov, Jul |
| sign a card (broad) | 6.8 | inflated | rising (+83%) | Dec |
| group gift (broad) | 5.6 | inflated; RankHero US exact ≈ 1,000 | index up 5x in 2025-26 | Dec 2.8x |
| online group card | 1.54 | ~6k-8k (index) | **rising** (~6x since 2022, most of it in 2025-26) | Dec 2.1x, Nov 1.5x |
| secret santa generator | 1.15-1.21 | ~5k-6k yearly avg; ~25-35k in Nov/Dec | flat/up (+15-19%) | Nov 5.6-5.8x, Dec 4.4x |
| kudoboard | 0.43-0.44 | ~1.8k-2.3k | **falling** (-37%) | Mar-May (graduation/retirement season) |
| farewell card | 0.44 | ~1.8k-2.3k (RankHero US: 1,900) | flat/up (+20%) | Feb, Apr-May |
| surprise party ideas | 0.15 | ~600-800 | falling (-28%) | none |
| groupgreeting | 0.08 | ~300-400 | falling (-52%) | Apr-Jul |

**Reveal later**
| Term | Ratio | Est. US/mo | Trend | Peak |
|---|---|---|---|---|
| letter to future self | 0.26-0.27 | ~1.0k-1.4k | flat (-2%) | May 1.9x, Aug 1.8x (end of school year / back to school) |
| futureme (brand) | 0.10 | ~400-530 | **falling** (-35%) | May-Jun, Jan |
| time capsule letter | 0.07 | ~300-370 (RankHero US: 170) | flat (-10%) | May 2.6x, Feb 1.9x |

**Workplace / business**
| Term | Ratio | Est. US/mo | Trend | Peak |
|---|---|---|---|---|
| anonymous survey | 0.75 | ~3k-4k | rising (+58%) | Sep-Oct, Feb |
| anonymous tip line | 0.44 | ~1.8k-2.3k | rising (+42%) | Sep, Jun-Jul |
| anonymous feedback | 0.31 | ~1.2k-1.6k | **rising** (+142%) | flat |
| whistleblower hotline | 0.16 | ~650-850 | rising (+69%) | flat |
| anonymous employee feedback | 0.03 | ~100-150 | rising fast from a tiny base (7.5x) | Feb |
| anonymous suggestion box | ~0 | <100-200 | falling (-73%) | Mar, Jul, Nov |

RankHero gives "suggestion box" (generic, not anonymous) about 14,800/mo across all countries, with the US at 3,600 ([RankHero](https://www.rankhero.com/keywords/suggestion-box)). Autocomplete for "anonymous feedback" includes "anonymous feedback form", "anonymous feedback tool online free" and "anonymous feedback form google" ([Google Suggest](https://suggestqueries.google.com/complete/search?client=firefox&hl=en&gl=us&q=anonymous%20feedback)).

**Adult / dating**
| Term | Ratio | Est. US/mo | Trend | Peak |
|---|---|---|---|---|
| tea app | 14.6 | ~58k-77k (trailing-12-month avg; far higher at the Jul 2025 peak) | baseline ≈1 index point through 2024, then ~17x | spiked Jul 2025 (3.6x), Aug |
| are we dating the same guy | 0.80 | ~3k-4k | appears 2023; peaked Jan 2024; now flat/declining | Jan-Feb |
| dating app safety | 0.53 | ~2k-3k (driven by a single Dec 2025 spike) | new | one-off spike Dec 2025 |
| anonymous dating | 0.21 | ~800-1.1k | **rising** (2.7x since 2022) | Nov-Dec |

- **RankHero US monthly volumes** (Google data, country split shown on each page):
  - secret santa: 60,500 US, 301,000 all-country; monthly series shows 1.83M in Dec 2025 vs 18,100 in May-Jul 2026 — [RankHero, updated Oct 06 2026](https://www.rankhero.com/keywords/secret-santa)
  - white elephant: 74,000 US, 165,000 total; 673,000 in Dec 2025 — [RankHero, Sep 16 2026](https://www.rankhero.com/keywords/white-elephant)
  - secret admirer: 14,800 US, 33,100 total — [RankHero](https://www.rankhero.com/keywords/secret-admirer)
  - farewell card: 1,900 US, 14,800 total — [RankHero](https://www.rankhero.com/keywords/farewell-card)
  - group gift: 1,000 US, 1,900 total; Dec 2025 peak 5,400 — [RankHero](https://www.rankhero.com/keywords/group-gift)
  - time capsule letter: 170 US, 480 total — [RankHero](https://www.rankhero.com/keywords/time-capsule-letter)
  - group card: 9,900 total, no US split; CPC $55.57 — [RankHero](https://www.rankhero.com/keywords/group-card)
- Semrush puts "secret santa generator" at about 33,100 searches (database/country not stated; probably a peak-season or global figure) — [Semrush via search snippet, sneakysanta.com](https://tr.semrush.com/website/sneakysanta.com/overview).
- Semrush's Mexico database (Sep 2026) shows "ngl" at 74,000/mo and ngl.link with about 724K organic visits. This is not US data, but it shows the NGL brand is large outside the US — [Semrush ngl.link](https://www.semrush.com/website/ngl.link/overview/).
- Tea app context: Tea became the #1 free app in Apple's US App Store on July 24, 2025, then had a data leak the next morning. This matches the Trends spike — [Pirate Wires](https://www.piratewires.com/p/the-tea-hack-not-actually-a-hack-a-complete-timeline?f=author).
- Kudoboard.com traffic, per Semrush: about 1.4M visits in one March, up 22.67% from Feb (~1.15M). Brand traffic is large even though the "kudoboard" search index is falling; much of it is probably direct or link traffic — [Semrush fr](https://fr.semrush.com/website/kudoboard.com/overview).
- Autocomplete variants with intent signal ([Google Suggest API, 2026-10-27](https://suggestqueries.google.com/complete/search?client=firefox&hl=en&gl=us&q=send%20anonymous)):
  - send anonymous text message free / send anonymous text online / send anonymous email
  - anonymous message website / link / app / board / bot discord
  - anonymous confessions website / app / discord bot
  - secret santa generator / questionnaire / app / website / name generator
  - letter to future self prompt / template / free
  - group cards online free / group card signing
  - anonymous suggestion box online / teams / microsoft forms / for employees
  - tea app for men / checker / leak
  - are we dating the same guy website / app / lawsuit / shut down

### Inferences
- The size gap is large. Seasonal group-gifting terms (secret santa + white elephant + elfster + generator) total roughly 150k-200k US searches/month on a yearly average, concentrated in Nov-Dec. Literal anonymous-message phrases total only about 10k-20k/month across all variants.
- "ngl" volume is mostly people looking up the slang meaning ("ngl meaning in text"), not demand for an anonymous-messaging product. Do not count it as addressable demand.
- The broad-match inflation (group card, sign a card, group gift) means exact-match figures are probably closer to RankHero's lower numbers. Even so, "online group card" (more specific) rose about 6x in two years, which points to real growth in digital group cards.
- Many terms show a 2025-26 lift: anonymous email, sign a card, anonymous survey, anonymous chat. Part of this may be a platform-wide Trends shift, so treat growth under ~30% as roughly flat.

### Gaps
- No Google Keyword Planner access, and Ahrefs, Semrush (US) and SpyFu were blocked or captcha-gated, so there is no authoritative exact-match US volume for most terms. Every "Est. US/mo" is a calibrated estimate with roughly ±50% or worse uncertainty.
- RankHero's "secret admirer" US figure (14,800) conflicts with the Trends calibration (~3-4k). It is unresolved which is right; the movie and lyrics queries may be counted differently.
- Terms below the Trends threshold (anonymous apology, anonymous compliment, tell someone you like them anonymously) got no reliable volume; they are probably under 100-200/month.

## Q2. Which ideas have the largest, most stable (evergreen) demand, and which are rising?

### Takeaway
**Largest:** seasonal group gifting (secret santa / white elephant / elfster / secret santa generator), which is huge but about 70% concentrated in Nov-Dec. **Most evergreen:** anonymous text/chat/email, anonymous survey/tip line, letter to future self (mild May/Aug bumps), farewell cards (mild spring peak). **Rising:** confession websites, anonymous feedback (+142%), anonymous employee feedback, anonymous dating (2.7x), online group card (~6x), whistleblower hotline (+69%), anonymous survey (+58%). **Falling:** secret admirer (-21%), kudoboard (-37%), futureme (-35%), groupgreeting (-52%), sendit (-93%), anonymous suggestion box (-73%), surprise party ideas (-28%).

### Cited Findings
- All trend and seasonality figures come from the Q1 tables (Google Trends via pytrends, US, 2021-01 to 2026-10, pulled 2026-10-27).
- Size of the secret santa season: 1.83M searches in Dec 2025 vs 18,100 in May-Jul 2026, about a 100x swing — [RankHero](https://www.rankhero.com/keywords/secret-santa). White elephant: 673,000 in Dec 2025 vs 90,500 in off months — [RankHero](https://www.rankhero.com/keywords/white-elephant).
- Tea app demand is event-driven: it went viral and had a breach in July 2025 ([Pirate Wires](https://www.piratewires.com/p/the-tea-hack-not-actually-a-hack-a-complete-timeline?f=author)). Autocomplete now shows "tea app leak", and "are we dating the same guy lawsuit / shut down" ([Google Suggest](https://suggestqueries.google.com/complete/search?client=firefox&hl=en&gl=us&q=are%20we%20dating)).
- Anonymous Q&A apps are fading or volatile in search: "ngl link" spiked in Jun 2022 and is now near zero; "sendit" is down 93% since 2022 (Google Trends via pytrends).

### Inferences
- A product built on secret santa / white elephant gets the most volume but must monetize in a ~8-week window. The competition is entrenched (Elfster and many free generators).
- The B2B anonymous-feedback cluster (feedback, survey, employee feedback, tip line, whistleblower hotline) is mid-sized, about 7k-10k/month combined, but steadily rising. Business intent and high CPCs typically support monetization (CPC not verified for these terms).
- Consumer "say it anonymously" demand (message, confession, apology, compliment, secret admirer) is small and spread across many phrases. Confession websites are the one rising sub-niche. The secret admirer peak in February suggests a Valentine's angle.
- Group cards look like a real growth market: online group card is up ~6x, while incumbent brand searches (kudoboard, groupgreeting) are falling. That suggests demand is spreading to new or generic providers.

### Gaps
- The Trends 2025-26 lift across many unrelated terms could be a data-collection artifact. I could not confirm this from an official Google source.
- No external validation (e.g., Exploding Topics) was found for these specific terms. The groupgreeting Exploding Topics page appeared in search results but was not fetched.

## Q3. Keyword difficulty / competition signals (who ranks on page 1)

### Takeaway
I only have partial signals. RankHero gives difficulty scores for a few terms: secret admirer 12, farewell card 28, time capsule letter 28, group card 36, white elephant 42, secret santa 44, group gift 46 (out of 100). Group card has a very high CPC ($55.57), which signals commercial competition. True Google page-1 results could not be pulled.

### Cited Findings
- RankHero keyword difficulty and CPC (Google CPC; difficulty is RankHero's own score):
  - secret santa: KD 44, CPC $0.71, low ad competition — [RankHero](https://www.rankhero.com/keywords/secret-santa)
  - white elephant: KD 42 — [RankHero](https://www.rankhero.com/keywords/white-elephant)
  - group card: KD 36, CPC $55.57, medium ad competition — [RankHero](https://www.rankhero.com/keywords/group-card)
  - group gift: KD 46, CPC $2.16, high ad competition — [RankHero](https://www.rankhero.com/keywords/group-gift)
  - farewell card: KD 28, CPC $1.32, high ad competition — [RankHero](https://www.rankhero.com/keywords/farewell-card)
  - secret admirer: KD 12 — [RankHero](https://www.rankhero.com/keywords/secret-admirer)
  - suggestion box: KD 11, CPC $1.03 — [RankHero](https://www.rankhero.com/keywords/suggestion-box)
- Group-card competitors: GroupCard (founded 2007), GroupGreeting (2009), Thankbox (2020, UK), Sign The Card (2021, AU), Ellacard, GroupTogether, Kudoboard — [CB Insights](https://www.cbinsights.com/compare/interactive-gift-corporation-vs-kudoboard). Search results for "online group card" surfaced Collection Pot, TheeCards, GroupGreeting, GroupTogether and a groupcards.io "best group card websites of 2026" listicle — [collectionpot.com](https://www.collectionpot.com/eCard), [groupcards.io](https://groupcards.io/blog/the-best-group-card-websites-of-2025-top-picks-for-farewells-birthdays-team-celebrations/).
- The "anonymous feedback tool" results are dominated by SaaS listicles from Retently, Zonka Feedback, Hugo, Fellow.ai, CultureMonkey and Sogolytics. This is a crowded B2B content space — [Fellow](https://fellow.ai/blog/the-best-anonymous-feedback-tools-for-your-team), [Zonka](https://www.zonkafeedback.com/blog/anonymous-feedback-tools).
- "Secret santa generator" results included roundups (Educator's Technology), utility tools (CodeItBro) and many parasite-SEO pages on unrelated domains — [Educators Technology](https://www.educatorstechnology.com/2022/12/the-7-best-secret-santa-generators.html), [CodeItBro](https://www.codeitbro.com/tool/secret-santa-generator).
- Results for "send anonymous message online" and "anonymous confession website" were dominated by low-quality or parasite pages (hijacked .gov/.edu PDFs, spam blogs) plus Wikipedia — [Wikipedia: Confessions page](https://en.wikipedia.org/wiki/Confessions_page), [forestvpn blog](https://forestvpn.com/blog/privacy-and-security/how-to-send-message-anonymously).
- "Letter to future self" results were dominated by content and guides (Seth's Blog, Holstee, Substack), not tools — [Holstee](https://holstee.com/blogs/mindful-matter/an-open-letter-to-my-future-self), [Seth's Blog](https://seths.blog/2021/03/a-letter-to-your-future-self/).

### Inferences
- The WebSearch index is not Google, but where it showed parasite and spam pages (anonymous message, confession website, secret santa generator), the niche may have weak, fragmented quality competition. A focused tool page could plausibly rank. This needs to be verified on a real Google SERP.
- The B2B anonymous-feedback space is SEO-heavy with funded SaaS content and would be hard to rank in. Group cards have well-funded incumbents and expensive clicks ($55 CPC), which also signals high value per customer.

### Gaps
- No real Google page-1 SERP data, no Ahrefs/Semrush keyword difficulty for most terms, and no US CPCs for the anonymous-messaging or workplace terms. All were blocked or unavailable with free, non-interactive tools. A manual check in Google Keyword Planner and an incognito US Google SERP is recommended.
