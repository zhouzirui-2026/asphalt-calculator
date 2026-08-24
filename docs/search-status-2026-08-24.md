# Search discovery status

Observed: 2026-08-24, Asia/Shanghai

Property: `https://asphalt-calculator.top`

This snapshot separates submission, discovery, crawl, and index states. A
successful sitemap or IndexNow notification is not proof of indexing, ranking,
traffic, or revenue. No sitemap, URL, validation, or reindex request was sent
during this review.

## Production SEO artifact

- The canonical host, five indexable routes, `robots.txt`, `sitemap.xml`, and
  the domain-specific IndexNow key file return 200.
- The apex pages are English (`lang=en`), self-canonical, and index/follow.
  Privacy and Terms remain noindex/nofollow.
- `www` permanently redirects to the exact apex path.
- The live sitemap contains five canonical URLs. The two long-tail routes on
  `agent/long-tail-workflows` are not deployed and therefore are not submitted.
- Google DNS-over-HTTPS and Cloudflare DNS-over-HTTPS both returned
  `76.76.21.21` for the apex during this review. This is evidence that the
  current public DNS was healthy from two independent resolvers, not a promise
  that every crawler could reach it at every earlier observation time.

## Provider status

| Provider/channel | Submission/discovery | Crawl/index status | Decision |
| --- | --- | --- | --- |
| Google Search Console | `/sitemap.xml` submitted 2026-08-20; last read 2026-08-23; `Success`; 5 discovered pages | Index report last updated 2026-08-21: 2 indexed (`/`, `/about`); 3 current pages discovered but not indexed (`/asphalt-calculator`, `/asphalt-driveway-cost-calculator`, `/methodology`) | Healthy submission; wait and monitor instead of resubmitting |
| Google legacy URLs | Not in the current sitemap | 3 old URLs were crawled but not indexed: `/zh/index.html`, `/index.html`, and `/contact.html` | Preserve 404 behavior; do not redirect without query/link evidence |
| Google performance | Property report, Web search, three-month selector | 0 clicks and 0 impressions; the available chart covers only 2026-08-19 through 2026-08-21 | No country/query evidence exists yet for localization |
| Bing sitemap | Current apex sitemap imported 2026-08-20; `Success`; 5 discovered URLs | The older `www` sitemap from 2025 remains `Success` with 16 historical URLs | Keep the current sitemap; do not delete the historical record without separate authorization |
| Bing IndexNow | Dashboard showed 5 URLs from source `Self` in the last five hours, displayed as `Today at 11:49` | `/`, `/asphalt-calculator`, `/asphalt-driveway-cost-calculator`, and `/about` were indexed; `/methodology` was not indexed. The recent crawl status was `Pending` for inspected rows | Received and provider-visible; do not notify unchanged URLs again |
| Yandex Webmaster | Sitemap added 2026-08-20 and still in the processing queue; Yandex states processing can take one to two weeks | 7 pages added, 0 searchable pages, 0 clicks | Continue the scheduled Day-7/Day-28 review; no re-add |
| Yandex diagnostics | One error: DNS connection failure, last checked 2026-08-23; recommendations included sitemap not yet used and favicon not found | Public page, sitemap, favicon, and two public DNS resolvers were healthy on 2026-08-24 | Treat the DNS result as stale or transient unless it repeats; add an explicit SVG favicon MIME declaration in the next release candidate |
| Naver | No direct Search Advisor property, verification artifact, or sitemap receipt is recorded | IndexNow lists Naver as a participating engine, but protocol sharing does not prove Naver crawl or index | Direct submission: not submitted |
| Seznam, Yep, Internet Archive, Amazonbot | Listed as IndexNow participants, so verified notifications may be shared by participating engines | No direct project dashboard receipt | Notification eligibility only; index state unknown |
| Baidu | No verified property or tokenized submission record exists | Unknown | Direct submission: not submitted; never store a Baidu token in Git |

The Bing dashboard's recent five-URL receipt is newer than the local
2026-08-20 submission log. This review did not create it, and its origin should
remain recorded as unknown rather than being attributed to a person or tool.

## Follow-up

- 2026-08-27 (Day 7): recheck Google current-page coverage, Bing
  `/methodology`, Yandex sitemap processing/DNS diagnostics, and provider errors.
- 2026-09-17 (Day 28): export query, page, country, device, clicks,
  impressions, CTR, and position from Google and Bing; record indexed canonical
  counts and Yandex searchable pages.
- Do not choose a target locale, redirect legacy URLs, validate a provider fix,
  or request indexing from this snapshot alone.
