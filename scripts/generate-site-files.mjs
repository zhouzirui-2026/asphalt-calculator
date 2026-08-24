import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import {
  canonicalUrl,
  languageAlternates,
  ROUTES,
  SITE_INDEXING_ENABLED,
  SITE_ORIGIN,
} from "../site-config.mjs";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const checkOnly = process.argv.includes("--check");

const robots = SITE_INDEXING_ENABLED
  ? [
      "# Production crawling policy.",
      "User-agent: *",
      "Allow: /",
      `Sitemap: ${SITE_ORIGIN}/sitemap.xml`,
      "",
    ].join("\n")
  : [
      "# PRE-RELEASE SAFETY GATE — keep until the custom domain is verified.",
      "User-agent: *",
      "Disallow: /",
      `Sitemap: ${SITE_ORIGIN}/sitemap.xml`,
      "",
    ].join("\n");

const sitemapEntries = ROUTES
  .filter((route) => route.indexableAtLaunch)
  .map((route) => {
    const alternateLinks = route.alternateGroup
      ? Object.entries(languageAlternates(route.alternateGroup)).map(([language, href]) => (
          `    <xhtml:link rel="alternate" hreflang="${language}" href="${href}" />`
        ))
      : [];
    return [
      "  <url>",
      `    <loc>${canonicalUrl(route.path)}</loc>`,
      ...alternateLinks,
      `    <changefreq>${route.changefreq}</changefreq>`,
      `    <priority>${route.priority}</priority>`,
      "  </url>",
    ].join("\n");
  })
  .join("\n");

const sitemap = [
  "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
  "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\" xmlns:xhtml=\"http://www.w3.org/1999/xhtml\">",
  sitemapEntries,
  "</urlset>",
  "",
].join("\n");

const outputs = [
  ["public/robots.txt", robots],
  ["public/sitemap.xml", sitemap],
];

for (const [relativePath, expected] of outputs) {
  const url = new URL(relativePath, `file:///${projectRoot.replaceAll("\\", "/")}/`);
  if (checkOnly) {
    const actual = await readFile(url, "utf8");
    assert.equal(actual, expected, `${relativePath} is out of sync; run npm run sync:site`);
  } else {
    await writeFile(url, expected, "utf8");
  }
}

console.log(checkOnly ? "Generated SEO files are in sync." : "Generated robots.txt and sitemap.xml.");
