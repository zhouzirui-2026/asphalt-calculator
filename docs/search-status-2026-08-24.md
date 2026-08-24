# Search discovery status

Observed: 2026-08-24, Asia/Shanghai

Property: `https://asphalt-calculator.top`

This snapshot separates submission, ownership verification, discovery, crawl,
and index states. A successful receipt is not proof of indexing, ranking,
traffic, or revenue.

## Production SEO artifact

- The canonical host, five currently deployed indexable routes, `robots.txt`,
  `sitemap.xml`, and the domain-specific IndexNow key file returned 200.
- Current production pages are English, self-canonical, and index/follow;
  Privacy and Terms remain noindex/nofollow.
- `www` permanently redirects to the exact apex path.
- Production sitemap membership is still five URLs. Long-tail and German/French
  routes in task branches are not deployed or submitted.
- Google and Cloudflare DNS-over-HTTPS both returned `76.76.21.21` for the apex
  during review. This is a point-in-time health observation.

## Provider status

| Provider/channel | Submission/discovery | Crawl/index status | Decision |
| --- | --- | --- | --- |
| Google Search Console | `/sitemap.xml` submitted 2026-08-20; last read 2026-08-23; `Success`; 5 discovered pages | Index report last updated 2026-08-21: 2 indexed (`/`, `/about`); 3 current pages discovered but not indexed | Wait and monitor; do not resubmit unchanged sitemap |
| Google legacy URLs | Not in the current sitemap | `/zh/index.html`, `/index.html`, and `/contact.html` were crawled but not indexed | Preserve 404 until query/link evidence supports a redirect |
| Google performance | Web search, three-month selector | 0 clicks and 0 impressions in the available 2026-08-19–21 chart | No first-party locale evidence yet |
| Bing sitemap | Apex sitemap imported 2026-08-20; `Success`; 5 discovered URLs | Older `www` sitemap remains as a historical successful record | Keep both records unless separately authorized to remove one |
| Bing IndexNow | Dashboard showed five recent URLs from source `Self` | Four inspected routes were indexed; `/methodology` was pending/not indexed | Provider-visible receipt; do not notify unchanged URLs again |
| Yandex Webmaster | Sitemap added 2026-08-20 and processing | 7 pages added, 0 searchable pages, 0 clicks; one older DNS diagnostic | Recheck Day 7/28; public artifacts and independent DNS resolvers were healthy |
| Naver Search Advisor | User re-registered and explicitly authorized direct submission. The property is at ownership verification, which issued an HTML-file option and an HTML-meta option | Public production does not yet contain either current verification artifact; the offered file URL returned 404 during review | A separate verification branch is prepared. Do not press verify or submit the sitemap until an explicitly authorized production deployment makes proof public |
| Seznam, Yep, Internet Archive, Amazonbot | Listed as IndexNow participants | No direct project dashboard receipt | Notification eligibility only; index state unknown |
| Baidu | No verified property or tokenized submission record | Unknown | Not submitted; never store a private submission credential in Git |

The Naver verification value is a public ownership proof, not an account
credential, but it still belongs in a minimal reviewable release. The exact
state and rollback sequence are documented on `agent/naver-verification`.

## Follow-up

- Day 7 (2026-08-27): recheck Google current-page coverage, Bing Methodology,
  Yandex processing/diagnostics, and provider errors.
- Day 28 (2026-09-17): export Google/Bing query, page, country, device, clicks,
  impressions, CTR, and position; record indexed canonical counts and Yandex
  searchable pages.
- After an authorized Naver proof deployment: verify ownership, add the exact
  production sitemap once, save the receipt, and distinguish verification from
  later crawl/index observations.
- Do not submit unreleased long-tail or localized URLs.
