import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import { PUBLIC_FILE_ALLOWLIST, ROUTES, SITE_ORIGIN } from "../site-config.mjs";

const routePaths = ROUTES.map((route) => route.path);

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function decodeHtml(value) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function metaContent(html, key, attribute = "name") {
  const tag = html.match(new RegExp(`<meta(?=[^>]*\\b${attribute}=["']${escapeRegex(key)}["'])[^>]*>`, "i"))?.[0];
  return tag?.match(/\bcontent=["']([^"']*)["']/i)?.[1] ?? null;
}

function linkHref(html, rel) {
  const tag = html.match(new RegExp(`<link(?=[^>]*\\brel=["']${escapeRegex(rel)}["'])[^>]*>`, "i"))?.[0];
  return tag?.match(/\bhref=["']([^"']*)["']/i)?.[1] ?? null;
}

function tags(html, tagName) {
  return [...html.matchAll(new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "gi"))]
    .map((match) => decodeHtml(match[1]));
}

async function renderRoutes() {
  const workerUrl = new URL(`../dist/server/index.js?audit=${Date.now()}`, import.meta.url);
  const { default: worker } = await import(workerUrl.href);
  const pages = new Map();
  for (const path of routePaths) {
    const response = await worker.fetch(
      new Request(`${SITE_ORIGIN}${path}`, { headers: { accept: "text/html" } }),
      {},
      { waitUntil() {}, passThroughOnException() {} },
    );
    assert.equal(response.status, 200, `${path} must return 200`);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i, `${path} must be HTML`);
    pages.set(path, await response.text());
  }
  return pages;
}

async function routeFiles(dirUrl, prefix = "") {
  const found = [];
  for (const entry of await readdir(dirUrl, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith("_")) continue;
    const isRouteGroup = entry.name.startsWith("(") && entry.name.endsWith(")");
    const nestedPrefix = isRouteGroup ? prefix : `${prefix}/${entry.name}`;
    const nestedUrl = new URL(`${entry.name}/`, dirUrl);
    try {
      await stat(new URL("page.tsx", nestedUrl));
      found.push(nestedPrefix);
    } catch {
      // A directory without page.tsx can still contain nested route segments.
    }
    found.push(...await routeFiles(nestedUrl, nestedPrefix));
  }
  return found;
}

async function filesRecursively(dirUrl) {
  const output = [];
  for (const entry of await readdir(dirUrl, { withFileTypes: true })) {
    const url = new URL(entry.name + (entry.isDirectory() ? "/" : ""), dirUrl);
    if (entry.isDirectory()) output.push(...await filesRecursively(url));
    else output.push(url);
  }
  return output;
}

const pages = await renderRoutes();
const titles = new Set();
const descriptions = new Set();
const h1s = new Set();
const inbound = new Map(routePaths.map((path) => [path, 0]));

for (const [path, html] of pages) {
  const title = tags(html, "title")[0];
  const description = metaContent(html, "description");
  const h1 = tags(html, "h1");
  const canonical = linkHref(html, "canonical");
  const expectedUrl = path === "/" ? SITE_ORIGIN : `${SITE_ORIGIN}${path}`;
  assert.ok(title, `${path} needs a title`);
  assert.ok(title.length <= 60, `${path} title must be <=60 characters; got ${title.length}`);
  assert.ok(description, `${path} needs a meta description`);
  assert.ok(description.length <= 160, `${path} description must be <=160 characters; got ${description.length}`);
  assert.equal(h1.length, 1, `${path} must have exactly one H1`);
  assert.equal(canonical, expectedUrl, `${path} canonical mismatch`);
  assert.match(metaContent(html, "robots") ?? "", /noindex/i, `${path} must remain noindex`);
  assert.match(metaContent(html, "robots") ?? "", /nofollow/i, `${path} must remain nofollow`);
  assert.ok(metaContent(html, "og:title", "property"), `${path} needs og:title`);
  assert.ok(metaContent(html, "og:description", "property"), `${path} needs og:description`);
  assert.equal(metaContent(html, "og:url", "property"), expectedUrl, `${path} og:url mismatch`);
  assert.equal(metaContent(html, "og:image", "property"), `${SITE_ORIGIN}/og.png`, `${path} og:image mismatch`);
  assert.ok(metaContent(html, "twitter:card"), `${path} needs twitter:card`);
  assert.ok(metaContent(html, "twitter:title"), `${path} needs twitter:title`);
  assert.ok(metaContent(html, "twitter:description"), `${path} needs twitter:description`);
  assert.equal(metaContent(html, "twitter:image"), `${SITE_ORIGIN}/og.png`, `${path} twitter:image mismatch`);
  assert.ok(!titles.has(title), `${path} title duplicates another route`);
  assert.ok(!descriptions.has(description), `${path} description duplicates another route`);
  assert.ok(!h1s.has(h1[0]), `${path} H1 duplicates another route`);
  titles.add(title);
  descriptions.add(description);
  h1s.add(h1[0]);

  const jsonLd = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => JSON.parse(decodeHtml(match[1])));
  const faqData = jsonLd.find((data) => data["@type"] === "FAQPage");
  const visibleQuestions = [...html.matchAll(/<summary\b[^>]*data-faq-question[^>]*>([\s\S]*?)<\/summary>/gi)]
    .map((match) => decodeHtml(match[1]));
  const visibleAnswers = [...html.matchAll(/<p\b[^>]*data-faq-answer[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((match) => decodeHtml(match[1]));
  if (visibleQuestions.length > 0) {
    assert.ok(faqData, `${path} visible FAQ needs FAQPage JSON-LD`);
    assert.deepEqual(faqData.mainEntity.map((item) => item.name), visibleQuestions, `${path} FAQ questions must match word-for-word`);
    assert.deepEqual(faqData.mainEntity.map((item) => item.acceptedAnswer.text), visibleAnswers, `${path} FAQ answers must match word-for-word`);
  } else {
    assert.equal(faqData, undefined, `${path} must not have hidden FAQ schema`);
  }

  for (const match of html.matchAll(/<a\b[^>]*href=["']([^"']+)["']/gi)) {
    const href = decodeHtml(match[1]);
    if (!href.startsWith("/") || href.startsWith("//")) continue;
    const target = href.split(/[?#]/)[0] || "/";
    assert.ok(routePaths.includes(target), `${path} links to non-allowlisted route ${target}`);
    if (target !== path) inbound.set(target, (inbound.get(target) ?? 0) + 1);
  }
}

for (const [path, count] of inbound) assert.ok(count > 0, `${path} is an orphan route`);

const diskRoutes = ["/", ...await routeFiles(new URL("../app/", import.meta.url))].sort();
assert.deepEqual(diskRoutes, [...routePaths].sort(), "App page routes must equal the route allowlist");

const robots = await readFile(new URL("../public/robots.txt", import.meta.url), "utf8");
assert.match(robots, /User-agent:\s*\*/i);
assert.match(robots, /Disallow:\s*\//i, "Pre-release robots.txt must disallow all crawling");
assert.match(robots, new RegExp(`Sitemap: ${escapeRegex(SITE_ORIGIN)}/sitemap\\.xml`));

const sitemap = await readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8");
const sitemapPaths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((match) => new URL(match[1]).pathname)
  .sort();
const expectedSitemap = ROUTES.filter((route) => route.indexableAtLaunch).map((route) => route.path).sort();
assert.deepEqual(sitemapPaths, expectedSitemap, "Sitemap must contain only intended production index routes");

const publicRoot = new URL("../public/", import.meta.url);
const publicFiles = (await filesRecursively(publicRoot))
  .map((url) => decodeURIComponent(url.pathname.slice(publicRoot.pathname.length)))
  .sort();
assert.deepEqual(
  publicFiles,
  [...PUBLIC_FILE_ALLOWLIST].sort(),
  "Public files, including their paths, must exactly equal the public allowlist",
);

const buildFiles = await filesRecursively(new URL("../dist/", import.meta.url));
const forbidden = /(vendor-private|shipany|BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY|sk-[A-Za-z0-9_-]{20,}|api[_-]?key\s*[:=])/i;
for (const url of buildFiles) {
  if (!/\.(?:js|css|html|json|txt|xml|map)$/i.test(url.pathname)) continue;
  const content = await readFile(url, "utf8");
  assert.doesNotMatch(content, forbidden, `Possible private or secret material in deployable build: ${url.pathname}`);
}

console.log(`Site audit passed for ${routePaths.length} routes: metadata, canonical, noindex, social tags, FAQ parity, structured data, internal links, sitemap, robots, route allowlist, and public-build boundary.`);
