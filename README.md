# Asphalt Calculator

An English-first, US-market planning site for asphalt material and driveway
cost allowances. It is responsive, accessible, login-free, and static-first.
All seven routes are prerendered as HTML; calculator logic runs in the browser.

Status: authorized launch candidate for `https://asphalt-calculator.top`. The
repository deliberately keeps `noindex, nofollow` and `Disallow: /` until the
custom domain, HTTPS, canonical redirect, routes, and consent behavior have
been verified on Vercel.

## Routes

- `/` — workflow-oriented home page;
- `/asphalt-calculator` — area, thickness, volume, density, weight, tonnage,
  waste, and optional material cost;
- `/asphalt-driveway-cost-calculator` — material plus user-entered preparation,
  paving, delivery, and other allowances;
- `/methodology` — formulas, conversions, default evidence, validation, and
  factual boundaries;
- `/about`, `/privacy`, `/terms` — trust and legal support.

The tonnage and blacktop synonym intents remain on `/asphalt-calculator`; there
are no near-duplicate routes. See [docs/architecture.md](docs/architecture.md)
for the intent matrix and ShipAny Two decision.

## Local development

Requires Node.js 22.13 or newer.

```powershell
npm ci
npm run dev
```

The local URL is normally `http://localhost:3000`.

The production build uses native Next.js, but every product route is statically
prerendered. No application API, database, account system, or Vercel Function is
required for normal requests.

## Analytics configuration

Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` to the GA4 web stream ID in Vercel. The ID is
public configuration, not a secret. If it is absent or invalid, no consent
banner or Google script is emitted. If configured, Google Analytics loads only
after the visitor selects **Allow analytics**. Page locations are sent without
query strings so share-link dimensions and prices remain local.

## Validation

```powershell
npm run check
npm test
npm run build
npm run audit:site
npm audit
git diff --check
```

`npm run check` verifies generated SEO files, lint, and TypeScript. The unit
suite covers formulas, unit conversions, waste, cost, invalid inputs, and
boundaries. The post-build audit renders every allowlisted route and checks
metadata, a single H1, canonical URLs, noindex, social tags, structured data,
visible FAQ parity, internal links, orphan routes, robots, sitemap, and the
deployable-build secret/private-source boundary.

## Authoritative files

- `lib/calculations.ts` — formulas, conversions, validation, and cost model;
- `site-config.mjs` — route allowlist, staged origin, and public-file allowlist;
- `scripts/generate-site-files.mjs` — `robots.txt` and `sitemap.xml` generator;
- `docs/sources.md` — source record and unsourced-assumption policy;
- `docs/launch-checklist.md` — required steps before any publication;
- `docs/handoff.md` — current implementation and verification status.

## Privacy and scope

There are no accounts, advertising scripts, payments, email forms, remote
databases, or paid APIs. A public support alias forwards inbound messages to a
monitored mailbox; it is not connected to calculator inputs. Optional GA4 is
consent-gated and excludes share-link queries. Results are mathematical planning
estimates, not pavement designs, specifications, purchase orders, professional
advice, or contractor quotes.
