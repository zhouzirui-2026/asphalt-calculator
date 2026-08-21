# Launch handoff

Updated: 2026-08-20

Branch: `agent/enable-production-indexing`

Baseline: `5f9ec8d` on public `main`

## Current state

The launch candidate is a native Next.js 16 static-first site targeting
`https://asphalt-calculator.top`. Every product route is prerendered; calculator
inputs, unit conversion, cost estimates, sharing, and printing run in the
browser. The product has no accounts, remote database, payment, contact form,
outbound email service, or private vendor dependency. The documented inbound
support alias is separate from calculator operation.

Implemented routes:

- `/`
- `/asphalt-calculator`
- `/asphalt-driveway-cost-calculator`
- `/methodology`
- `/about`
- `/privacy`
- `/terms`

The launch uses GitHub for public source, Vercel for builds and hosting, and
Cloudflare as authoritative DNS. The registrar retains domain ownership and NS
control. The executed evidence and rollback path are in `release-record.md`.
`SITE_INDEXING_ENABLED` is enabled on the dedicated production-indexing branch
after the custom domain, HTTPS, canonical host, all routes, security headers,
calculator flows, and analytics behavior passed on production.

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

The site audit starts the production Next.js server and verifies the seven
allowlisted routes, metadata, canonical URLs, noindex/index policy, FAQ visible
text versus JSON-LD, sitemap and robots output, internal links, 404 behavior,
canonical-host redirect, security headers, public-file allowlist, and secret
boundary across `.next`.

## Release sequence

1. Push this branch to the public GitHub repository and create a draft PR.
2. Deploy a Vercel Preview with indexing disabled and verify desktop/mobile.
3. Configure the site-specific GA4 stream and Vercel public environment value.
4. Merge the verified candidate, add the apex and `www` domains, then apply only
   Vercel's exact DNS records at the authoritative DNS provider.
5. Verify production HTTPS, redirects, metadata, routes, calculators, analytics,
   and rollback evidence while indexing is still disabled.
6. Enable indexing in a separate reviewed commit, rebuild, deploy, and verify
   `robots.txt`, sitemap, page robots metadata, and canonicals.

Do not submit Search Console, Bing Webmaster Tools, IndexNow, directories,
backlinks, or other external forms as part of this release. The separately
authorized post-launch inbound support route does not send outbound email.

## Remaining non-blocking risk

- Automated browser coverage is Chromium-first; Safari and Firefox remain a
  follow-up compatibility check.
- Cost estimates depend on user-entered local rates and scope; the product does
  not present them as contractor quotes.
- The social card is larger than ideal but is not part of normal page rendering.
