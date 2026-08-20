export const SITE_ORIGIN = "https://asphalt-calculator.top";

// Enabled only after the custom domain, HTTPS, canonical host, production
// routes, calculator fixtures, and analytics consent boundary passed the
// production verification recorded in docs/release-record.md.
export const SITE_INDEXING_ENABLED = true;

export const ROUTES = [
  { path: "/", indexableAtLaunch: true, changefreq: "monthly", priority: "1.0" },
  { path: "/asphalt-calculator", indexableAtLaunch: true, changefreq: "monthly", priority: "0.9" },
  { path: "/asphalt-driveway-cost-calculator", indexableAtLaunch: true, changefreq: "monthly", priority: "0.9" },
  { path: "/methodology", indexableAtLaunch: true, changefreq: "yearly", priority: "0.6" },
  { path: "/about", indexableAtLaunch: true, changefreq: "yearly", priority: "0.5" },
  { path: "/privacy", indexableAtLaunch: false, changefreq: "yearly", priority: "0.2" },
  { path: "/terms", indexableAtLaunch: false, changefreq: "yearly", priority: "0.2" },
];

export const PUBLIC_FILE_ALLOWLIST = [
  "5830219258b6428a9aebc26296d902c2bf3dd321328c460d95738649794f17b7.txt",
  "favicon.svg",
  "og.png",
  "robots.txt",
  "sitemap.xml",
];
