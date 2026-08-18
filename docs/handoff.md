# Local implementation handoff

Updated: 2026-08-18

Branch: `agent/initial-build`

Baseline: `7b72f7e` on local `main`

## Current state

The first local release is implemented as a vinext/Vite static-first site using
the Sites-compatible Cloudflare Worker build. There is no persistence or remote
application capability. Calculators run in client components while all
explanatory and SEO content is server-rendered.

Implemented routes:

- `/`
- `/asphalt-calculator`
- `/asphalt-driveway-cost-calculator`
- `/methodology`
- `/about`
- `/privacy`
- `/terms`

Generated public files are limited to `robots.txt`, `sitemap.xml`, and the
site-specific `og.png` social card. Every route is pre-release `noindex,
nofollow`; robots disallows all crawling.

## Verification completed

- Formula/unit/cost/parsing/validation test suite: 13 passing.
- Generated-file sync, ESLint, and TypeScript: passing.
- Production build: passing with vinext/Vite.
- Post-build SEO/site audit: passing for all 7 routes, including strict public
  path allowlisting and secret/private-source scanning across the full `dist`.
- Production local HTTP: 7 planned HTML routes, robots, and sitemap returned
  200; an unknown route returned 404.
- Browser desktop: homepage, material workflow, cost workflow, valid result,
  invalid-input summary/focus, US→metric conversion, and share URL checked.
- Browser mobile at 390×844: no horizontal overflow; full material flow and
  content stack visually checked.
- Browser console: no errors on a fresh production-browser session.
- Browser regression checks cover strict share-parameter parsing, metric
  overflow rejection, stale-estimate unit labels, accessible input-unit names,
  skip-link focus transfer, and visible two-color focus rings.
- Independent review found no remaining P0 or P1 after the reported issues were
  corrected. See `docs/review.md`.
- Dependency audit: 0 vulnerabilities.

## Known non-blocking risks

- The canonical origin is a reserved `.example` placeholder and must change
  before any preview intended for discovery or production.
- Cost completeness is only as good as user-entered scope; the UI and content
  state this repeatedly.
- A custom not-found page is not part of the first route matrix; the framework
  returns a correct 404. Consider a branded 404 at launch.
- Browser validation covered Chromium automation, not Safari or Firefox.
- The social card is visually verified and text-correct but is 2.7 MB; it is not
  loaded in normal page rendering and is a launch-time optimization candidate.
- The Sites-compatible vinext runtime remains on a beta release and reports
  route classification as unknown during build; rendered-route and production
  HTTP audits compensate locally, but framework upgrades need regression tests.

## Next authorized action

No deployment or publication is authorized. Follow `docs/launch-checklist.md`
only in a future task with explicit permission.
