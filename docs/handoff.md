# Product and internationalization handoff

Updated: 2026-08-24

Branch: `agent/de-fr-locales`

Baseline: `ddab044` on public `main`

## Integrated prerequisite state

This task branch combines two completed, independently reviewed prerequisites:

- the task-led long-tail release, which adds `/asphalt-weight-calculator` and
  `/how-to-calculate-asphalt-tonnage` without creating synonym-only tonnage,
  blacktop, online, or driveway routes;
- the internationalization-readiness release, which adds a fail-closed locale
  registry, canonical URL helpers, HTML language/direction checks, typed SVG
  favicon metadata, and production-like artifact auditing.

The branch is an integration worktree for the German and French localization
pilot. Production remains unchanged until a separately authorized release.

## Current routes before locale implementation

- `/`
- `/asphalt-calculator`
- `/asphalt-driveway-cost-calculator`
- `/asphalt-weight-calculator`
- `/how-to-calculate-asphalt-tonnage`
- `/methodology`
- `/about`
- `/privacy`
- `/terms`

Every route is prerendered. Calculator inputs, unit conversion, estimates,
sharing, and printing run in the browser. The product has no accounts, remote
database, payment, contact form, outbound email service, advertising, paid API,
or private vendor dependency.

## Search and locale boundary

The observed provider state is recorded in
`docs/search-status-2026-08-24.md`. The locale evidence gate and URL contract are
in `docs/internationalization-readiness.md`; the long-tail task map is in
`docs/long-tail-page-plan.md`.

`site-config.mjs` owns the site origin, route allowlist, default locale, locale
direction, and canonical URL helpers. The sitemap generator and audits consume
that same contract. Before this pilot is implemented, only `en` is registered
and no hreflang is emitted.

## Validation

Run from a clean checkout:

```powershell
npm ci
npm run check
npm test
npm run build
npm run audit:site
npm run audit:artifact:render
npm audit
git diff --check
```

The repository audit verifies all allowlisted routes, metadata, canonicals,
index policy, FAQ parity, sitemap and robots output, internal links, 404
behavior, canonical-host redirect, security headers, locale markup, favicon
type, public-file allowlist, and the deployable secret boundary. The generic
artifact adapter remains a second independent inspection surface.

## Release and rollback

1. Finish the German/French pilot and all local validation in this worktree.
2. Review the complete branch diff against `origin/main`.
3. Push and create a draft PR only when authorized.
4. Verify a Vercel Preview at desktop, 390 px, and 320 px.
5. Merge and promote only with separate explicit authorization.
6. After an authorized release, run Day-2/7/28 locale query, crawl, index, and
   task-completion reviews before expanding the language set.

Do not submit Search Console, Bing Webmaster Tools, IndexNow, directories,
backlinks, DNS, or other external forms as part of this implementation.

