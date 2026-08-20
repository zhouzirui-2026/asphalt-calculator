# Launch checklist

Executed release evidence is recorded in `release-record.md`. Unchecked items
below are explicit post-launch improvements, not claims that were completed.

## Product and factual review

- [x] Confirm the product name and acquire `asphalt-calculator.top`.
- [x] Set the single production HTTPS origin to
  `https://asphalt-calculator.top`.
- [x] Reconfirm density wording against the linked Asphalt Institute and EPA
  sources; update implementation, tests, visible copy, and review dates together
  if the default changes.
- [ ] Post-launch: obtain an independent qualified human review of construction
  wording and legal policies; do not add an invented credential or endorsement.
- [ ] Post-launch: add a real monitored correction/contact method only after its
  personal-information and delivery process is documented. No contact method is
  claimed or exposed at launch.

## Index safety gate

- [x] Change intended index routes in the page metadata from pre-release
  `noindex, nofollow` to `index, follow`; keep privacy and terms noindex unless a
  later SEO decision explicitly includes them.
- [x] Change generated `robots.txt` from `Disallow: /` to the approved production
  policy and run `npm run sync:site`.
- [x] Confirm every sitemap URL uses the production canonical origin and includes
  only intended index routes.
- [x] Re-run the site audit in a launch mode that expects indexable pages; never
  simply disable the current assertions without replacing them.

## Quality and operations

- [x] Run `npm ci`, `npm run check`, `npm test`, `npm run build`,
  `npm run audit:site`, `npm audit`, and `git diff --check` from a clean checkout.
- [x] Verify every route and both calculator workflows at desktop and mobile
  widths in a production-like preview that supports clean URLs.
- [x] Test keyboard-only use, focus order, visible focus, error announcements,
  reduced motion, print output, and share-link restoration.
- [x] Confirm the final public build contains no `.env` values, secrets,
  analytics exports, personal information, vendor-private paths, or ShipAny code.
- [x] Confirm security headers, HTTPS redirects, canonical host redirects, a
  custom 404, monitoring, rollback, and incident ownership in preview.
- [ ] Review the 2.7 MB social image against target platform limits and compress
  it losslessly if the chosen hosting or preview tool shows a material delay.

## Explicit external authorization

- [x] Obtain user authorization before deployment, DNS changes, production
  publication, analytics/ads activation, email, Search Console or Bing Webmaster
  verification, sitemap submission, IndexNow, or any search-engine submission.
- [x] After authorization, deploy the allowlisted build output — never the
  repository root or `vendor-private`.
- [x] Capture the production route/redirect/header audit and rollback reference.

The custom-domain production gate is complete. Unchecked post-launch
improvements remain documented and must not be represented as completed.
