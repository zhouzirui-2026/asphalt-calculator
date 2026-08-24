# Internationalization release contract

Date: 2026-08-24

Status: German/French pilot implemented as a release candidate; not deployed

## Decision

Keep US English unprefixed and add only two equivalent material-calculator
pages:

- English: `/asphalt-calculator`
- German: `/de/asphalt-rechner`
- French: `/fr/calcul-enrobe`

The project still has no first-party international query or country demand:
Google showed zero clicks and impressions in the short available window, Bing
had no useful performance export, and Yandex had no searchable pages. The user
nevertheless requested multilingual development, so this branch treats
locale-specific Semrush estimates and live result review as authorization for
a small, reversible experiment—not as evidence for broad translation.

## Implemented contract

- `site-config.mjs` owns locale codes, labels, direction, path prefixes,
  canonical URLs, route membership, and the equivalent-page map.
- Multiple root layouts emit `lang=en`, `lang=de`, or `lang=fr` in server HTML;
  all three remain left-to-right.
- English canonicals stay unchanged. German and French use lowercase language
  directories and native task slugs.
- Only the three equivalent calculator pages emit reciprocal `en`, `de`, `fr`,
  and `x-default` alternates. English-only pages emit no hreflang.
- The sitemap uses the same route and alternate map and includes `xhtml:link`
  parity for the equivalent cohort.
- The language switcher maps only real equivalents; it never guesses a
  localized URL.
- German and French pages use metric-first inputs, locale number formatting,
  localized calculator labels, validation, examples, explanations, and FAQ.
- `lib/calculations.ts` remains the formula and validation authority.
- Unknown locales and unsupported path mappings fail closed.

No browser-language redirect is introduced. Privacy, Terms, Methodology, and
About remain English and are linked with explicit English labeling where
needed. They are not declared localized equivalents.

## Release gate

Before production promotion:

1. Native or professionally competent review approves German and French
   terminology, grammar, examples, validation, legal/support wording, and
   supplier assumptions.
2. A Vercel Preview passes route, canonical-host, metadata, hreflang, sitemap,
   JavaScript, keyboard, desktop, 390 px, and 320 px checks.
3. The branch passes all repository and generic release audits with no secrets
   or unrelated generated files.
4. The user explicitly authorizes merge and production deployment.

After an authorized release, inspect crawl and rendering on Day 2, provider
coverage and errors on Day 7, and query/page/country/device plus calculator-use
outcomes on Day 28. Expand, revise, or remove the cohort from observed evidence.

## Deferred locales

Spanish, Portuguese, Italian, Dutch, and Polish are intentionally absent. The
research record explains the current evidence and uncertainty. Do not add a
locale code, route, hreflang alternate, or sitemap URL until a complete native
page cohort has an owner and release brief.

Rollback is a revert of the pilot commit or deployment rollback. Existing
English paths and canonicals do not move.
