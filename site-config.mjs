export const SITE_ORIGIN = "https://asphalt-calculator.example";

export const ROUTES = [
  { path: "/", indexableAtLaunch: true, changefreq: "monthly", priority: "1.0" },
  { path: "/asphalt-calculator", indexableAtLaunch: true, changefreq: "monthly", priority: "0.9" },
  { path: "/asphalt-driveway-cost-calculator", indexableAtLaunch: true, changefreq: "monthly", priority: "0.9" },
  { path: "/methodology", indexableAtLaunch: true, changefreq: "yearly", priority: "0.6" },
  { path: "/about", indexableAtLaunch: true, changefreq: "yearly", priority: "0.5" },
  { path: "/privacy", indexableAtLaunch: false, changefreq: "yearly", priority: "0.2" },
  { path: "/terms", indexableAtLaunch: false, changefreq: "yearly", priority: "0.2" },
];

export const PUBLIC_FILE_ALLOWLIST = ["og.png", "robots.txt", "sitemap.xml"];
