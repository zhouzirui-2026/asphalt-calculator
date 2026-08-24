# Product and internationalization handoff

Updated: 2026-08-24

Branch: `agent/de-fr-locales`

Worktree: `C:\web-new\workspaces\asphalt-calculator-de-fr`

Baseline: public `main` at `ddab044`; prerequisite commits integrated as
`6a9b7d4` and `37ccd12`

## Implemented release candidate

This branch combines the reviewed English long-tail work with a two-page
international pilot. It now has 11 business routes:

- English: `/`, `/asphalt-calculator`,
  `/asphalt-driveway-cost-calculator`, `/asphalt-weight-calculator`,
  `/how-to-calculate-asphalt-tonnage`, `/methodology`, `/about`, `/privacy`,
  and `/terms`;
- German: `/de/asphalt-rechner`;
- French: `/fr/calcul-enrobe`.

All business routes prerender. Calculations, validation, result formatting,
sharing, and printing execute in the browser against pure functions from
`lib/calculations.ts`. The product still has no account, database, payment,
contact form, outbound email service, paid API, advertising, or private vendor
runtime.

The localized calculator is metric-first and includes native labels, errors,
examples, explanations, FAQ, number formatting, navigation, and a mapped
language switcher. Multiple root layouts make the server HTML language correct.
Only the three true calculator equivalents emit reciprocal hreflang and
sitemap alternates.

## Evidence and decisions

- Keyword and SERP observations: `docs/international-keyword-research-2026-08-24.md`
- German/French task contracts: `docs/localized-page-briefs.md`
- Locale and release rules: `docs/internationalization-readiness.md`
- Search-provider snapshot: `docs/search-status-2026-08-24.md`
- English long-tail task map: `docs/long-tail-page-plan.md`

German and French are a reversible evidence-gathering pilot. Spanish,
Portuguese, Italian, Dutch, and Polish remain deferred.

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

At handoff time the final branch passed sync, lint, type checking, all 21 tests,
production build, the 11-route repository audit, the generic rendered-artifact
audit, `npm audit` with zero reported vulnerabilities, and `git diff --check`.
Browser QA covered desktop, 390 px, and 320 px; calculation, invalid input,
localized number/currency formatting, share state, reciprocal language links,
HTML metadata, keyboard skip focus, horizontal overflow, page/console errors,
and WCAG A/AA. Automated accessibility reported zero violations after the
language-switcher contrast fix; gradient-backed result content still requires
the recorded visual review because automated contrast could not determine its
background.

## Separate Naver task

`agent/naver-verification` is isolated in
`C:\web-new\workspaces\asphalt-calculator-naver-verify`. It adds the current
Naver public meta proof and audit coverage. It must not be merged into this
localization task. Verification and sitemap submission require a production
deployment followed by an external Search Advisor action; production promotion
has not been authorized by the localization request.

## Release and rollback

1. Review the final diff against `main` and obtain native-language approval.
2. Push or open a draft PR only when authorized.
3. Verify a Vercel Preview at desktop, 390 px, and 320 px.
4. Merge and promote only with separate explicit authorization.
5. Observe Day-2/7/28 locale outcomes before adding another language.

Rollback is a Git revert or Vercel rollback to the prior deployment. Existing
English URLs and canonicals remain stable.
