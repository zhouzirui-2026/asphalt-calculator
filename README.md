# Asphalt Calculator

An English-first, US-market planning site for asphalt material and driveway
cost allowances. It is responsive, accessible, login-free, static-first, and
keeps all calculator inputs in the browser.

Status: local pre-release. The repository deliberately ships `noindex,
nofollow` on every route and `Disallow: /` in `robots.txt`. Do not remove the
safety gate without a separately authorized launch.

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

There are no accounts, analytics, advertising scripts, payments, email forms,
remote databases, or paid APIs. Share links contain only the visible calculator
inputs. Results are mathematical planning estimates, not pavement designs,
specifications, purchase orders, professional advice, or contractor quotes.
