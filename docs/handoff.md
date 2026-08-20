# Launch handoff

Updated: 2026-08-20

Branch: `agent/launch-asphalt-top`

Baseline: `7b72f7e` on local `main`

## Current state

The launch candidate is a native Next.js 16 static-first site targeting
`https://asphalt-calculator.top`. Every product route is prerendered; calculator
inputs, unit conversion, cost estimates, sharing, and printing run in the
browser. The product has no accounts, remote database, payment, email, or
private vendor dependency.

Implemented routes:

- `/`
- `/asphalt-calculator`
- `/asphalt-driveway-cost-calculator`
- `/methodology`
- `/about`
- `/privacy`
- `/terms`

The launch uses GitHub for public source and Vercel for builds and hosting.
`SITE_INDEXING_ENABLED` remains `false` until the custom domain, HTTPS,
canonical host, all routes, security headers, calculator flows, and optional
analytics consent behavior pass on production.

## Analytics boundary

GA4 is configured only through `NEXT_PUBLIC_GA_MEASUREMENT_ID`. No Google tag is
rendered or requested until a visitor explicitly allows analytics. Page
locations exclude query strings and fragments so calculator/share parameters
are not sent. Declining or withdrawing consent removes matching GA cookies and
preserves unrelated cookies. The analytics preferences control is omitted when
no valid GA4 Measurement ID is configured.

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
5. Verify production HTTPS, redirects, metadata, routes, calculators, consent,
   and rollback evidence while indexing is still disabled.
6. Enable indexing in a separate reviewed commit, rebuild, deploy, and verify
   `robots.txt`, sitemap, page robots metadata, and canonicals.

Do not submit Search Console, Bing Webmaster Tools, IndexNow, directories,
backlinks, email, or other external forms as part of this release.

## Remaining non-blocking risk

- Automated browser coverage is Chromium-first; Safari and Firefox remain a
  follow-up compatibility check.
- Cost estimates depend on user-entered local rates and scope; the product does
  not present them as contractor quotes.
- The social card is larger than ideal but is not part of normal page rendering.
