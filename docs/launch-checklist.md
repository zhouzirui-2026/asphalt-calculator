# Future launch checklist

This checklist is intentionally not executed by the local build task.

## Product and factual review

- [ ] Confirm the product name and acquire a domain without trademark conflict.
- [ ] Replace `https://asphalt-calculator.example` in `site-config.mjs` and
  `app/layout.tsx` with the single production HTTPS origin.
- [ ] Reconfirm density wording against the linked Asphalt Institute and EPA
  sources; update implementation, tests, visible copy, and review dates together
  if the default changes.
- [ ] Obtain an independent qualified review of construction wording and legal
  policies; do not add an invented credential or endorsement.
- [ ] Add a real, monitored correction/contact method and document how it handles
  personal information before enabling it.

## Index safety gate

- [ ] Change intended index routes in the page metadata from pre-release
  `noindex, nofollow` to `index, follow`; keep privacy and terms noindex unless a
  later SEO decision explicitly includes them.
- [ ] Change generated `robots.txt` from `Disallow: /` to the approved production
  policy and run `npm run sync:site`.
- [ ] Confirm every sitemap URL uses the production canonical origin and includes
  only intended index routes.
- [ ] Re-run the site audit in a launch mode that expects indexable pages; never
  simply disable the current assertions without replacing them.

## Quality and operations

- [ ] Run `npm ci`, `npm run check`, `npm test`, `npm run build`,
  `npm run audit:site`, `npm audit`, and `git diff --check` from a clean checkout.
- [ ] Verify every route and both calculator workflows at desktop and mobile
  widths in a production-like preview that supports clean URLs.
- [ ] Test keyboard-only use, focus order, visible focus, error announcements,
  reduced motion, print output, and share-link restoration.
- [ ] Confirm the final public build contains no `.env` values, secrets,
  analytics exports, personal information, vendor-private paths, or ShipAny code.
- [ ] Confirm security headers, HTTPS redirects, canonical host redirects, a
  custom 404, monitoring, rollback, and incident ownership in preview.
- [ ] Review the 2.7 MB social image against target platform limits and compress
  it losslessly if the chosen hosting or preview tool shows a material delay.

## Explicit external authorization

- [ ] Obtain user authorization before deployment, DNS changes, production
  publication, analytics/ads activation, email, Search Console or Bing Webmaster
  verification, sitemap submission, IndexNow, or any search-engine submission.
- [ ] After authorization, deploy the allowlisted build output — never the
  repository root or `vendor-private`.
- [ ] Capture the production route/redirect/header audit and rollback reference.

Until all applicable items are complete, keep this project local and noindex.
