# Naver Search Advisor verification

Updated: 2026-08-24 (Asia/Shanghai)

Property: `https://asphalt-calculator.top`

## Current state

Naver Search Advisor accepted the origin for ownership verification and issued
the following public HTML meta verification value:

```html
<meta name="naver-site-verification" content="f3d10a5731baa16cc14ac722e81dfbc90531b99d" />
```

This branch adds that value through the Next.js Metadata API and asserts its
presence in every production-rendered page. The value is public proof of site
control, not a credential or API secret.

## Required release sequence

1. Run the full local checks and production-like audit.
2. Review and deploy this single-purpose branch to the canonical production
   origin only after explicit production-deployment authorization.
3. Confirm the homepage returns the exact meta tag above.
4. Select the HTML tag method in Naver Search Advisor and click ownership
   verification.
5. After the property appears, submit only
   `https://asphalt-calculator.top/sitemap.xml` and record Naver's receipt.

Do not click ownership verification before the tag is live. A failed ownership
check is not a crawl, index, or ranking signal.
