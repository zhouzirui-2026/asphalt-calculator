# Architecture and product decisions

Date: 2026-08-18

Owner: Asphalt Calculator Editorial Team

Status: implementation decision for the local first release

## Product boundary

The first release is a static-first, login-free planning tool. It performs all
calculations in the browser and sends no project inputs to a server. It does not
include accounts, payments, email, a remote database, analytics, contractor lead
capture, or paid APIs.

The UI renders meaningful explanatory HTML on the server. Interactive fields use
small client components backed by pure functions in `lib/calculations.ts`.

## ShipAny Two decision

Read-only audit on 2026-08-18:

- expected vendor root: `C:\web-new\vendor-private\shipany`;
- present template: `C:\web-new\vendor-private\shipany\shipany-one`;
- present template commit: `e922c27e7977a6428b42bb7c59618463f393caab`
  on clean `main` tracking `origin/main`;
- present template remotes: fetch from
  `https://github.com/shipany-ai/shipany-one.git`; push is deliberately disabled
  as `disabled://licensed-template-source`;
- local authorization basis: `shipany-one/LICENSE`, last updated 2024-12-30,
  permits commercial applications but prohibits public source redistribution,
  standalone resale, attribution removal, and credential sharing;
- ShipAny Two local path: not present;
- ShipAny Two local commit: not available;
- ShipAny Two local license or purchase-authorization file: not available;
- ShipAny Two local Git remote configuration: not available;
- vendor policy found in `C:\web-new\vendor-private\README.md`: commercial
  applications are permitted, but public redistribution of boilerplate source
  is prohibited and required notices must be retained.

The user reports access to ShipAny Two, but there is no local checkout or
separate local purchase artifact to audit. No ShipAny source was read for
implementation, copied, or modified for this product; the ShipAny One checks
above were read-only boundary and authorization checks.

| Option | First view & static SEO | Maintenance / dependencies | Testing & security | Private-source leakage | SaaS fit | Decision |
| --- | --- | --- | --- | --- | --- | --- |
| Independent lightweight implementation | Small client surface; server-rendered explanatory HTML | Lowest; only the local site runtime | Pure calculation tests and bounded route audits | None | Exactly matches a no-account calculator | **Selected** |
| Legally derive selected ShipAny Two parts | Potentially good, but only after tracing copied modules and notices | Higher boundary and upgrade bookkeeping | Requires license, dependency, and attribution review | Material unless every copied boundary is proven | No necessary feature identified | Rejected |
| Use ShipAny Two as the complete base | Likely carries broad SaaS surface beyond the tool | Highest dependency and update load | Larger authentication/payment/database test matrix | Highest public-repository risk | Accounts, billing, and database are explicitly out of scope | Rejected |

The absence of a local, auditable ShipAny Two checkout is an additional hard
reason not to derive from it. Even if it is placed in `vendor-private` later,
the first release has no product need that justifies the extra boundary.

## Page and intent matrix

| Route | Primary user decision | Search intent boundary | Intended production index state |
| --- | --- | --- | --- |
| `/` | Choose a workflow | Site overview; not a duplicate calculator | Index |
| `/asphalt-calculator` | Estimate volume, weight, tonnage, waste, and optional material cost | `asphalt calculator`, `asphalt tonnage calculator`, `blacktop calculator` | Index |
| `/asphalt-driveway-cost-calculator` | Combine material with user-entered preparation, paving, delivery, and other allowances | `asphalt driveway cost calculator`, `asphalt cost per square foot` | Index |
| `/methodology` | Audit formulas, defaults, sources, rounding, and limits | Supporting trust document | Index |
| `/about` | Understand authorship, scope, and corrections policy | Supporting trust document | Index |
| `/privacy` | Understand local processing and data practices | Legal/support | Noindex |
| `/terms` | Understand estimate and liability limits | Legal/support | Noindex |

All routes remain `noindex, nofollow` during this local task. `robots.txt`
disallows all crawling. Releasing the safety gate is a separate launch action.

## Calculation authority

`lib/calculations.ts` owns formulas, conversions, validation limits, and cost
composition. Calculator components may format results but must not reimplement
math. This keeps unit tests independent from layout and makes all assumptions
reviewable.

The material workflow computes:

1. area from a rectangle or a user-supplied known area;
2. compacted volume from area × thickness;
3. base weight from volume × user-editable density;
4. short tons and metric tonnes from base weight;
5. order quantity by multiplying by `1 + waste% / 100`;
6. optional material cost from order quantity × the user-entered unit price.

The driveway workflow adds only user-entered area rates and fixed allowances.
It does not infer labor, equipment, taxes, permits, minimum orders, site
conditions, or a national price.

## Rollback

The starter-only baseline is commit `7b72f7e` on `main`. All product work is on
`agent/initial-build`. Rolling back the task means abandoning that branch; no
other workspace or vendor repository needs to change.
