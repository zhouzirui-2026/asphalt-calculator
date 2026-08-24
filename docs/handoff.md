# Product handoff

Updated: 2026-08-24

Branch: `agent/long-tail-workflows`

Baseline: `ddab044` on public `main`

## Current state

The production product is a native Next.js 16 static-first site at
`https://asphalt-calculator.top`. This task candidate adds a known-volume asphalt
weight converter and one answer-first tonnage formula guide while keeping
tonnage, blacktop, online, driveway, and close question synonyms on task-led
canonical pages. Every product route is prerendered; calculator inputs, unit
conversion, estimates, sharing, and printing run in the browser. The product has
no accounts, remote database, payment, contact form, outbound email service, or
private vendor dependency. The documented inbound support alias is separate
from calculator operation.

Implemented routes:

- `/`
- `/asphalt-calculator`
- `/asphalt-driveway-cost-calculator`
- `/asphalt-weight-calculator`
- `/how-to-calculate-asphalt-tonnage`
- `/methodology`
- `/about`
- `/privacy`
- `/terms`

The launch uses GitHub for public source, Vercel for builds and hosting, and
Cloudflare as authoritative DNS. The registrar retains domain ownership and NS
control. The executed evidence and rollback path are in `release-record.md`.
`SITE_INDEXING_ENABLED` remains enabled for the production site. Privacy and
terms remain noindex. This task makes no DNS, domain, analytics configuration,
search-submission, or production deployment change.

## Analytics boundary

GA4 is configured only through `NEXT_PUBLIC_GA_MEASUREMENT_ID`. The Google tag
loads automatically on the exact canonical production origin and is omitted in
local and Preview environments. Page locations exclude query strings and
fragments so calculator/share parameters are not sent. Advertising
personalization and Google signals remain disabled.

Measurement IDs are public site identifiers, but login sessions, API tokens,
cookies, analytics exports, and credentials must never be committed.

## Local verification

Run from a clean checkout:

```powershell
npm ci
npm run check
npm test
npm run build
npm run audit:site
npm audit
git diff --check
```

The site audit starts the production Next.js server and verifies the nine
allowlisted routes, metadata, canonical URLs, noindex/index policy, FAQ visible
text versus JSON-LD, sitemap and robots output, internal links, 404 behavior,
canonical-host redirect, security headers, public-file allowlist, and secret
boundary across `.next`.

`npm run audit:artifact:render` also creates an ignored `dist/` adapter containing
the exact rendered HTML, committed public files, and client-static assets for
the Web Project Operator generic artifact auditor. `site-policy.json` delegates
two duplicate checks to the stricter repository audit: exact FAQ parity, because
the generic parser does not decode Next's `&#x27;` apostrophe entity, and exact
root canonical/sitemap equality, because the generic URL parser normalizes the
raw no-slash origin to `/`. The repository audit compares both contracts against
the raw rendered values and remains mandatory.

## Review and release sequence

1. Complete local checks, the production-like route audit, and desktop/mobile
   browser QA on this task worktree.
2. Review the task diff against `docs/long-tail-page-plan.md` and confirm no
   synonym-only route was introduced.
3. Push the branch and create a draft PR only when authorized.
4. Verify a Vercel Preview, including both new workflows, metadata, canonicals,
   internal links, 320/390 px layouts, keyboard errors, sharing, and analytics
   query stripping.
5. Merge and promote to production only with separate explicit authorization.
   The previous Ready production deployment is the rollback point.
6. After an authorized release, run the Day 2/7/28 query, crawl, landing-page
   overlap, and experience checks before expanding the page family.

Do not submit Search Console, Bing Webmaster Tools, IndexNow, directories,
backlinks, or other external forms as part of this implementation. The
separately authorized post-launch inbound support route does not send outbound
email.

## Remaining non-blocking risk

- Automated browser coverage is Chromium-first; Safari and Firefox remain a
  follow-up compatibility check.
- Cost estimates depend on user-entered local rates and scope; the product does
  not present them as contractor quotes.
- The social card is larger than ideal but is not part of normal page rendering.
