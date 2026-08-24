# Architecture and product decisions

Date: 2026-08-20

Updated: 2026-08-24

Status: static-first production architecture with an unreleased German/French
pilot

## Product boundary

The site is a login-free planning tool. It has no accounts, payments, contact
form, outbound email, remote database, lead capture, advertising, or paid API.
Calculator inputs remain in the browser. GA4 is isolated to the canonical
production origin, strips calculator share queries from page paths, and keeps
advertising personalization and Google signals disabled.

Next.js prerenders useful explanatory HTML. Small client components import pure
formula and validation functions from `lib/calculations.ts`; they do not own a
second calculation implementation. Vercel serves the static build without an
application data layer.

## Independent implementation decision

ShipAny Two was not present in the private vendor workspace and no separate
purchase artifact was available for audit. A ShipAny One checkout existed only
as private licensed reference. No vendor source was copied or modified. The
independent Next.js implementation remains the lowest-maintenance choice for a
small calculator and avoids public licensed-source leakage.

## Route and locale architecture

`site-config.mjs` is the canonical manifest for origin, routes, index policy,
locales, localized path mapping, and equivalent-page alternates. The sitemap
generator, metadata, and release audit consume that contract.

Multiple root-layout route groups emit the right server-side document
language while preserving stable public URLs:

- `app/(en)` owns all unprefixed English routes;
- `app/(de)` owns the German prefix;
- `app/(fr)` owns the French prefix;
- `app/_components/DocumentLayout.tsx` owns the shared document shell;
- `app/global-not-found.tsx` provides the global branded 404 required by the
  multi-root layout design.

The architecture does not infer locale from a request header or redirect by
browser language. A language switcher links only declared equivalents.

| Route | Primary task | Index state |
| --- | --- | --- |
| `/` | Choose a workflow | Index |
| `/asphalt-calculator` | Estimate material volume, mass, order quantity, and optional material cost | Index |
| `/asphalt-driveway-cost-calculator` | Combine material with user-entered project allowances | Index |
| `/asphalt-weight-calculator` | Convert a known compacted volume to mass and unit weight | Index |
| `/how-to-calculate-asphalt-tonnage` | Learn and reproduce the tonnage method | Index |
| `/de/asphalt-rechner` | Perform the equivalent metric material estimate in German | Index |
| `/fr/calcul-enrobe` | Perform the equivalent metric material estimate in French | Index |
| `/methodology` | Audit formulas, defaults, sources, and limits | Index |
| `/about` | Understand scope, authorship, and corrections | Index |
| `/privacy` | Understand local processing and data practices | Noindex |
| `/terms` | Understand estimate and liability limits | Noindex |

Only the English, German, and French material-calculator routes are declared
equivalent. Other pages remain English-only and emit no hreflang.

## Calculation authority

The material workflow computes area, compacted volume, base weight, short tons
and metric tonnes, order allowance, and optional unit-price cost. The driveway
workflow adds only user-entered rates and fixed allowances. The known-volume
workflow converts compacted cubic yards or cubic metres into mass and unit
weight. The guide reuses the material calculator and does not duplicate math.

Localized copy may format units and numbers, but formulas, validation limits,
and conversions remain in `lib/calculations.ts`.

## Generated and release boundary

`public/robots.txt` and `public/sitemap.xml` are generated from the route
manifest and must remain synchronized. The site audit checks every allowlisted
route, route language, canonical, index policy, reciprocal hreflang, sitemap
parity, FAQ structure, internal links, 404 behavior, canonical-host redirect,
headers, analytics boundary, and public-file allowlist.

The localization branch starts from production `main` commit `ddab044` and is
isolated on `agent/de-fr-locales`. Production deployment is a separate,
explicitly authorized operation. Rollback does not move existing English URLs.
