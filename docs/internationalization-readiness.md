# Internationalization readiness

Date: 2026-08-24

Status: technical preparation only; no non-English public locale is approved

## Decision

Keep the current US-English site unprefixed and publish no translated routes or
hreflang yet. The first-party reports contain no search-performance evidence:
Google shows 0 clicks and 0 impressions, Bing reports no available search
performance, and Yandex has 0 searchable pages. The user-provided Semrush
snapshot was scoped to the US English database. It cannot select a language.

The production site also has only five indexable pages. The default expansion
gate is 10–30 useful, maintained pages in the primary language or equivalent
proven depth before localization. Pending long-tail work does not count as
production evidence until it is reviewed and released.

## Implemented readiness contract

- `site-config.mjs` owns the launch-ready locale registry, default locale, text
  direction, path prefix, and canonical locale URL helpers.
- Only `en` is launch-ready. Unknown locale codes fail closed.
- English canonicals stay unchanged and unprefixed.
- The root layout derives `lang` and `dir` from the locale contract.
- The release audit rejects premature hreflang while only one useful locale
  exists and verifies the declared SVG favicon and MIME type.
- The generated sitemap uses the same canonical URL helper, so the locale URL
  contract and sitemap cannot silently diverge.

This infrastructure does not invent translated content, add public routes,
change canonical URLs, alter sitemap membership, or redirect users by browser
language.

## Future public URL contract

When a target locale passes the release gate:

- keep English at `/...`;
- place each non-default locale under a lowercase language subdirectory such as
  `/<locale>/...`;
- use one stable localized slug per task, based on native query wording rather
  than word-for-word English translation;
- do not use query parameters for locale selection;
- do not force redirects from `Accept-Language`; offer an explicit language
  switcher and remember preference locally if needed;
- give every localized page the correct HTML `lang`, localized units, number
  and date formats, examples, navigation, calculator labels/errors, sources,
  privacy/terms, and reachable support wording;
- emit a self-canonical plus reciprocal hreflang for every equivalent page and
  one deliberate `x-default`; include only crawlable, equivalent pages in the
  sitemap;
- never point an incomplete translation at the English canonical or publish a
  translated shell around English body content.

The old `/zh/index.html` URL appears only as a historical Google crawl sample.
It currently returns 404 and provides no query, click, backlink, or task
evidence. Do not recreate or redirect it until the destructive URL evidence
gate is met.

## Target-locale evidence gate

Select the first language only when all of the following are recorded:

1. At least 28 days, preferably 90 days, of Google and Bing query/page/country/
   device evidence with export time and filters.
2. A distinct target-language query vocabulary and task map, corroborated by a
   locale-specific live SERP rather than translation convenience.
3. Native-quality translation and review ownership for the calculator,
   validation messages, examples, sources, trust pages, and future updates.
4. A small complete page cohort with crawlable HTML, correct units/formats,
   internal links, self-canonicals, reciprocal hreflang, `x-default`, and
   sitemap parity.
5. Production events and privacy rules that distinguish locale without sending
   calculator inputs or query strings.

## Next implementation milestone after locale approval

Use a route architecture that can render a correct server-side `<html lang>`
for both the unprefixed English tree and prefixed locale trees without turning
the calculators into client-only pages. A multiple-root-layout or equivalent
build-time route design must be previewed before changing the current root
layout. Reuse the calculation layer; translate UI/content, not formulas.

Start with one complete cohort, verify desktop/mobile/keyboard behavior and
metadata, then observe Day 2/7/28 crawl, index, query, page, and task outcomes.
Rollback is removal of the unreleased locale registry entry and locale routes;
existing English URLs remain unchanged.
