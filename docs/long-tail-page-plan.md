# Long-tail workflow expansion

Date: 2026-08-24

Status: implementation candidate on `agent/long-tail-workflows`

## Objective and boundary

Expand the US-English site around evidenced asphalt-calculation query families
without creating keyword-substitution pages. A new route is allowed only when
its starting input, successful output, or learning task differs from the two
existing calculators.

In scope: repository code, two new static-first routes, existing page copy and
internal links, calculation tests, generated sitemap, and local release QA.
Production publication, search-engine submission, DNS, analytics configuration,
advertising, and destructive URL changes are not authorized by this task.

## Evidence register

| Source | Snapshot and scope | Finding | Confidence | Limitation | Decision use |
| --- | --- | --- | --- | --- | --- |
| User-provided Semrush keyword overview screenshots | 2026-08-24; US database; desktop; seed `Asphalt Calculator` | Seed estimate: 22.2K monthly volume, KD 16, CPC $1.16; keyword intent shown as commercial | Medium | Third-party estimates, single date, no export of all 704 variants | Protect and improve the primary calculator |
| User-provided Semrush variant screenshot | 2026-08-24; US desktop | `asphalt driveway cost calculator` 1.9K/KD 22; `asphalt tonnage calculator` 1.0K/KD 11; `asphalt calculator online` 720/KD 11; `asphalt driveway calculator` 590/KD 16 | Medium | Vendor grouping may merge variants; volume is not observed site traffic | Map synonyms to task-led pages |
| User-provided Semrush question screenshot | 2026-08-24; US desktop | `how to calculate asphalt tonnage` 390/KD 5; close question variants shown at 260, 210, 140, and 110 | Medium | Estimated demand; no question export or seasonality history | Create one formula-and-example guide, not five pages |
| User-provided Semrush keyword-strategy screenshot | 2026-08-24; US desktop | Cluster examples include `blacktop calculator`, `weight of asphalt`, `how to figure asphalt`, and `unit weight of asphalt` | Medium-low | Screenshot shows terms but not full per-term metrics | Keep blacktop on the material page; test a distinct known-volume converter |
| Live web search observation | 2026-08-24; query samples for tonnage, blacktop, asphalt weight, and formula questions | Results mix usable calculators with formula guides; area/thickness calculators and volume-to-weight answers are distinguishable tasks | Medium | Search results vary by location, device, and personalization | Confirm page type and differentiator, not ranking likelihood |
| Repository and production contract | `main` at `ddab044`; canonical `https://asphalt-calculator.top`; nine-day launch history is not available | Existing `/asphalt-calculator` already calculates volume, weight, tonnage, allowance, and optional material cost; driveway cost has separate inputs | High | First-party query/page baseline is younger than the preferred 28-day window | Protect both existing URLs; make no redirect, merge, or canonical change |

Semrush figures above are opportunity estimates. They are not added to first-party
Search Console impressions, GA page views, or calculator completions.

## Query to user-task and landing-page map

| Query family | User task | Current page | Decision | Target page and unique value | Success evidence |
| --- | --- | --- | --- | --- | --- |
| `asphalt calculator`, `asphalt tonnage calculator`, `asphalt calculator online`, `blacktop calculator` | Start from area and compacted thickness; get volume, weight, order quantity, and optional material cost | `/asphalt-calculator` | Protect + improve | Same URL; explain why tonnage and blacktop share the model; link to formula and known-volume tasks | Query/landing impressions and clicks; valid production calculation fixture |
| `asphalt driveway cost calculator`, `asphalt driveway calculator` | Estimate driveway material and assemble user-supplied preparation, paving, delivery, and other allowances | `/asphalt-driveway-cost-calculator` | Protect + improve | Same URL; broaden wording while preserving the cost-specific inputs and quote boundary | Query/landing impressions and clicks; valid cost fixture |
| `weight of asphalt`, `unit weight of asphalt`, cubic yards to asphalt tons | Start from known compacted volume; convert to pounds, kilograms, short tons, tonnes, and unit weight | None | Create | `/asphalt-weight-calculator`; no area or thickness inputs; reversible US/metric conversion | Route views/search evidence; one-cubic-yard and unit-equivalence fixtures |
| `how to calculate asphalt tonnage` and close question forms | Understand and reproduce the area × thickness × density formula with US and metric examples | Formula section on calculator and methodology | Create differentiated guide | `/how-to-calculate-asphalt-tonnage`; answer-first formula, worked examples, common errors, and the tested calculator | Query/landing evidence; formula/example audit; calculator fixture |

## Explicitly rejected routes

- `/asphalt-tonnage-calculator`: same inputs and output as
  `/asphalt-calculator`; the existing URL already serves the task.
- `/blacktop-calculator`: a word substitution, not a different workflow.
- `/asphalt-calculator-online`: the modifier does not change the task.
- `/asphalt-driveway-calculator`: the current driveway cost page already
  combines driveway quantity and user-entered cost scope.
- One page per “how do you / how to / tons of / tonnage for” question: these
  are equivalent phrasings for one formula guide.

Reconsider a separate route only after at least 28 days, preferably 90 days, of
query-to-landing evidence shows a different task that the mapped page cannot
complete with a section or feature.

## Public URL and internal-link contract

The two new routes are lowercase, hyphenated, extensionless, self-canonical,
indexable, and included in the generated sitemap. They are linked from the
homepage, shared footer, methodology, and relevant calculator content. No
redirect or canonical changes are introduced.

```text
/
├── /asphalt-calculator
│   ├── /how-to-calculate-asphalt-tonnage
│   └── /asphalt-weight-calculator
├── /asphalt-driveway-cost-calculator
└── /methodology
```

## Page briefs

### `/asphalt-weight-calculator`

- Primary job: convert a known compacted volume to mass and unit weight.
- Inputs: US/metric mode, compacted volume, editable compacted density.
- Outputs: cubic-yard/cubic-meter equivalents, pounds, kilograms, short tons,
  metric tonnes, short tons per cubic yard, and tonnes per cubic meter.
- Model boundary: mathematical volume × density conversion; no thickness,
  waste, order increment, price, or mix selection.
- Source: existing Asphalt Institute density range and NIST/FHWA unit records.
- Accessibility: labeled numeric fields, field errors, focused result, polite
  result status, keyboard controls, copy fallback, 320 px reflow.
- Share behavior: query includes only unit system, volume, and density; analytics
  continues to strip all query strings from page locations.

### `/how-to-calculate-asphalt-tonnage`

- Primary job: learn, reproduce, and verify the tonnage formula.
- First answer: exact US formula with compatible units.
- Unique value: five-step method, US and metric worked examples, common error
  checklist, source explanation, and a live calculator backed by the same pure
  calculation layer.
- Model boundary: compacted volume and compacted density; allowance is a visible
  separate step; no pavement design or supplier order claim.
- Structured data: only visible FAQ questions and answers are emitted.

## Measurement and observation

The current product sends sanitized canonical page locations through GA4 only
on the exact production origin. It does not send calculator values. This task
adds no new analytics parameter or third-party script.

- Acquisition: Search Console/Bing query, page, country, device, clicks,
  impressions, CTR, and position for each new URL and the two protected URLs.
- Usage proxy: sanitized page views and related-page navigation where available.
- Known gap: calculator start/completion is not currently measured, so page
  views do not prove successful calculation.
- Guardrails: crawl/index errors, landing-page overlap, 404s, mobile overflow,
  validation errors found in QA, and support corrections.

Day 2: verify production URLs, canonical, sitemap fetch, mobile calculator and
analytics query stripping. Day 7: check crawl/index exclusions and unexpected
query-to-page overlap. Day 28: compare query/page acquisition and decide whether
to keep, revise, or leave the experiment inconclusive. No synonym-page expansion
before that review.

## Release gates and rollback

1. Pure volume-to-weight tests pass in US and metric modes, including invalid and
   upper-bound cases.
2. Existing material and driveway fixtures remain unchanged.
3. Metadata, canonicals, FAQ parity, sitemap, route allowlist, internal links,
   404, headers, and public-build boundary pass the production-like site audit.
4. Desktop, 390 px, 320 px, keyboard, error, share, and print paths are checked.
5. The branch changes only intended public source/generated artifacts and docs;
   no screenshot, analytics export, credential, or private vendor material enters
   the repository.

Rollback is a single application release: revert the task commit or restore the
previous Vercel production deployment. Because no existing URL is removed or
redirected, rollback does not require a URL migration or DNS change.
