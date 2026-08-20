# Production release record

Updated: 2026-08-20 (Asia/Shanghai)

## Identity

| Field | Value |
| --- | --- |
| Canonical origin | `https://asphalt-calculator.top` |
| Public repository | `https://github.com/zhouzirui-2026/asphalt-calculator` |
| Initial release PR | `#1` |
| Initial production commit | `5f9ec8dde965d7b653a6b6fe5b18b03d14951719` |
| Vercel project | `asphalt-calculator` in `phds-projects` |
| Initial production deployment | `https://asphalt-calculator-7spaedma8-phds-projects.vercel.app` |
| GA4 web stream | `Asphalt Calculator website` (`G-7218RG03KP`) |
| Indexing state during domain cutover | Disabled; enabled only in a follow-up reviewed branch |

The GA4 Measurement ID is a public browser identifier, not a credential. Login
sessions, API tokens, cookies, property access, and analytics exports are not
stored in this repository.

## Production architecture

```text
GitHub main -> Vercel Next.js build and application origin
registrar -> Cloudflare nameservers -> Vercel custom-domain records
browser consent -> GA4 web stream (canonical production host only)
```

This intentionally follows the operating separation already proven by the
Pallet Calculator release: the registrar retains ownership and nameserver
control, Cloudflare is authoritative DNS, and Vercel hosts the application.
Project-specific DNS targets, analytics IDs, mail records, and verification
tokens are never copied between products.

## Executed release sequence

1. Ran generated-file, lint, typecheck, unit, build, site-audit, dependency,
   secret-boundary, desktop, mobile, keyboard, calculator, and consent checks.
2. Published the reviewed repository to GitHub, merged PR #1, and required the
   main GitHub Actions run to pass.
3. Created and connected the Vercel project. The first CLI-created project used
   Framework Preset `Other`; it produced a `Ready` deployment that did not serve
   the Next.js routes. The project was corrected to `Next.js`, rebuilt, and
   verified by requesting real routes. Future releases must inspect the Vercel
   project contract before trusting deployment state.
4. Created a site-specific GA4 property and web stream for the canonical origin,
   reporting in USD for the US-market calculator. Enhanced Measurement was
   disabled because the application sends manually sanitized page views and
   share-link query parameters must not reach analytics.
5. Added both custom domains to Vercel and read their current live DNS
   recommendations instead of copying records from another product.
6. Confirmed the registrar's old DNS zone contained zero records. Created a
   Cloudflare Free zone, added the apex and `www` records as DNS-only, then moved
   authoritative nameservers from Baota DNS to Cloudflare.

## DNS change record

| Item | Before | After |
| --- | --- | --- |
| Authoritative NS 1 | `ns1.baotadns.com` | `dell.ns.cloudflare.com` |
| Authoritative NS 2 | `ns2.baotadns.com` | `dion.ns.cloudflare.com` |
| Apex web record | absent | `A @ 76.76.21.21`, DNS-only, automatic TTL |
| `www` web record | absent | `A www 76.76.21.21`, DNS-only, automatic TTL |
| Mail/verification records migrated | none present | none added |

The two A targets are the values Vercel displayed for this project during the
cutover. Reinspect Vercel before any future DNS change; hosted targets can vary
by project and over time.

## Verification evidence

Before the NS move, the production deployment and GA-enabled Preview passed:

- all seven planned routes and the branded 404;
- one H1, canonical origin, noindex metadata, and `robots.txt: Disallow: /`;
- security headers, sitemap, public-file allowlist, and secret boundary;
- material fixture `20 ft x 10 ft x 4 in`, 5% waste, `$100/ton` = `5.075`
  short tons and `$507.50` material;
- cost fixture = `$1,757.50` and `$8.79/ft²`;
- explicit-consent GA load, sanitized page location, consent withdrawal, and
  absence of the Google tag before consent;
- 390 x 844 mobile flow without page-level overflow.

After the NS move, the canonical domain served HTTPS, the apex returned 200,
`www` returned a permanent redirect that preserved the path and query string,
all seven routes returned 200 with the expected noindex safety gate, and the
branded missing route returned 404. The production browser repeated both known
calculator fixtures. The Google tag was absent before consent and the expected
GA4 script appeared once after consent.

The dedicated follow-up release changes the indexing gate, regenerated robots
policy, Node major pin, release documentation, and one analytics hardening found
during Preview: even if a GA4 ID is accidentally present in Preview or local
environments, the consent UI and Google tag now activate only when the browser's
exact HTTPS origin is the canonical production origin. It is accepted only if
CI, Preview, merge, and the post-merge production crawl all pass.

The post-merge sitemap crawl also detected that the homepage `<loc>` used the
equivalent but non-identical trailing-slash form while its canonical omitted the
slash. A final focused release aligns the root sitemap URL to the exact canonical
and makes the local audit compare complete sitemap URLs, not only pathnames.

## Excluded external actions

This release does not send email, submit Search Console/Bing/Yandex/IndexNow,
submit directories or backlinks, modify unrelated domains, or deploy purchased
vendor code.

## Rollback

- Application rollback: restore the previous Ready Vercel production deployment
  associated with the known-good commit, then verify the canonical domain.
- DNS rollback during cutover: restore the prior registrar nameservers only if
  Cloudflare activation fails and the old authoritative DNS remains available.
- Cloudflare proxy rollback: records currently use DNS-only, so no proxy-layer
  cache or TLS rollback is required.
