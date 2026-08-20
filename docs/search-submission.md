# Search discovery submissions

Updated: 2026-08-20 (Asia/Shanghai)

This runbook records the repeatable discovery-submission workflow for
`https://asphalt-calculator.top`. A submission receipt proves that a provider
received or processed a request; it does not prove crawl, indexing, ranking,
traffic, or revenue.

## Production prerequisites

- The five intended index pages return 200, are self-canonical, and have no
  `noindex` directive.
- `https://asphalt-calculator.top/robots.txt` allows crawling and references
  the canonical sitemap.
- `https://asphalt-calculator.top/sitemap.xml` contains the five intended
  canonical URLs exactly once.
- Google and Yandex verification tags are emitted from `app/layout.tsx`.
- The site-specific IndexNow key is allowlisted in `public/` and must never be
  copied to another domain.

## Local validation

```powershell
npm run search:indexnow:self-test
npm run search:indexnow:dry-run
npm run check
npm test
npm run build
npm run audit:site
git diff --check
```

The dry run validates the local sitemap and key without contacting IndexNow.
After the exact commit is deployed and the public key URL returns the same
value, the authorized one-time bootstrap command is:

```powershell
node scripts/submit-indexnow.mjs --config search-project.json --bootstrap --execute --confirm-origin https://asphalt-calculator.top
```

Routine releases must submit only new, materially updated, or removed
canonical URLs. Do not repeat the full bootstrap for unchanged content.

## Provider workflow

1. Verify the exact HTTPS URL-prefix property in Google Search Console, submit
   `sitemap.xml`, and record the UI response.
2. Import that verified property into Bing Webmaster Tools when available,
   confirm the canonical sitemap, and use the IndexNow dashboard for received,
   crawled, and indexed samples.
3. Verify the exact HTTPS property in Yandex Webmaster, add the canonical
   sitemap once, and leave it in place for regular processing.
4. Treat Product Hunt as a public product launch, not a search-engine receipt.
   Prepare its exact URL, tagline, description, topics, pricing, thumbnail,
   gallery, maker identity, first comment, and launch timing; require one fresh
   approval for that final payload before publishing.

## Receipt fields

Keep UTC time, production commit, provider/channel, property, artifact or URL
batch, URL count, provider response, evidence note, and Day 2/7/28 follow-up.
Use precise states: `dry-run passed`, `request received`, `processing`,
`success/ok`, `not submitted`, or `failed`.

Official references:

- Google Search Console sitemap report:
  https://support.google.com/webmasters/answer/7451001
- Bing sitemaps and IndexNow:
  https://www.bing.com/webmasters/help/sitemaps-3b5cf6ed
- IndexNow protocol:
  https://www.indexnow.org/documentation
- Yandex sitemap files:
  https://yandex.com/support/webmaster/en/indexing-options/sitemap
- Product Hunt launch guide:
  https://www.producthunt.com/launch/preparing-for-launch
