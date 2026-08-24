import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { readdir, readFile, stat } from "node:fs/promises";
import { request } from "node:http";
import { createServer } from "node:net";
import { fileURLToPath } from "node:url";
import { setTimeout as delay } from "node:timers/promises";
import {
  PUBLIC_FILE_ALLOWLIST,
  ROUTES,
  SITE_INDEXING_ENABLED,
  SITE_ORIGIN,
} from "../site-config.mjs";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
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

async function availablePort() {
  const server = createServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const { port } = address;
  server.close();
  await once(server, "close");
  return port;
}

async function startProductionServer() {
  const port = await availablePort();
  const nextBin = fileURLToPath(new URL("../node_modules/next/dist/bin/next", import.meta.url));
  const child = spawn(process.execPath, [nextBin, "start", "-H", "127.0.0.1", "-p", String(port)], {
    cwd: projectRoot,
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let logs = "";
  child.stdout.on("data", (chunk) => { logs += chunk; });
  child.stderr.on("data", (chunk) => { logs += chunk; });

  const baseUrl = `http://127.0.0.1:${port}`;
  for (let attempt = 0; attempt < 80; attempt += 1) {
    assert.equal(child.exitCode, null, `Next production server exited early:\n${logs}`);
    try {
      const response = await fetch(baseUrl, { redirect: "manual" });
      if (response.status === 200) return { baseUrl, child, port };
    } catch {
      // The server may not have bound its socket yet.
    }
    await delay(125);
  }
  child.kill();
  throw new Error(`Timed out starting Next production server:\n${logs}`);
}

async function stopProductionServer(child) {
  if (child.exitCode !== null) return;
  child.kill();
  await Promise.race([once(child, "exit"), delay(5_000)]);
  if (child.exitCode === null) child.kill("SIGKILL");
}

async function requestWithHost(port, path, host) {
  return new Promise((resolve, reject) => {
    const req = request({
      host: "127.0.0.1",
      port,
      path,
      method: "GET",
      headers: { host },
    }, (response) => {
      response.resume();
      resolve({ status: response.statusCode, location: response.headers.location });
    });
    req.on("error", reject);
    req.end();
  });
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

const server = await startProductionServer();
try {
  const pages = new Map();
  for (const path of routePaths) {
    const response = await fetch(`${server.baseUrl}${path}`, { headers: { accept: "text/html" } });
    assert.equal(response.status, 200, `${path} must return 200`);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i, `${path} must be HTML`);
    assert.match(response.headers.get("content-security-policy") ?? "", /frame-ancestors 'none'/i, `${path} needs CSP`);
    assert.equal(response.headers.get("x-content-type-options"), "nosniff", `${path} needs nosniff`);
    assert.equal(response.headers.get("x-frame-options"), "DENY", `${path} needs frame protection`);
    pages.set(path, await response.text());
  }

  const missing = await fetch(`${server.baseUrl}/not-an-allowlisted-route`);
  assert.equal(missing.status, 404, "Unknown route must return 404");
  assert.match(await missing.text(), /Page not found/i, "Unknown route must use the branded 404");

  const canonicalHost = new URL(SITE_ORIGIN).hostname;
  const hostRedirect = await requestWithHost(server.port, "/methodology", `www.${canonicalHost}`);
  assert.equal(hostRedirect.status, 308, "www host must redirect permanently");
  assert.equal(hostRedirect.location, `${SITE_ORIGIN}/methodology`, "www redirect target mismatch");

  const titles = new Set();
  const descriptions = new Set();
  const h1s = new Set();
  const inbound = new Map(routePaths.map((path) => [path, 0]));

  for (const [path, html] of pages) {
    const route = ROUTES.find((candidate) => candidate.path === path);
    assert.ok(route);
    const title = tags(html, "title")[0];
    const description = metaContent(html, "description");
    const h1 = tags(html, "h1");
    const canonical = linkHref(html, "canonical");
    const robots = metaContent(html, "robots") ?? "";
    const expectedUrl = path === "/" ? SITE_ORIGIN : `${SITE_ORIGIN}${path}`;
    const shouldIndex = SITE_INDEXING_ENABLED && route.indexableAtLaunch;
    assert.ok(title, `${path} needs a title`);
    assert.ok(title.length <= 60, `${path} title must be <=60 characters; got ${title.length}`);
    assert.ok(description, `${path} needs a meta description`);
    assert.ok(description.length <= 160, `${path} description must be <=160 characters; got ${description.length}`);
    assert.equal(h1.length, 1, `${path} must have exactly one H1`);
    assert.equal(canonical, expectedUrl, `${path} canonical mismatch`);
    assert.match(robots, shouldIndex ? /\bindex\b/i : /\bnoindex\b/i, `${path} robots index state mismatch`);
    assert.match(robots, shouldIndex ? /\bfollow\b/i : /\bnofollow\b/i, `${path} robots follow state mismatch`);
    assert.ok(metaContent(html, "og:title", "property"), `${path} needs og:title`);
    assert.ok(metaContent(html, "og:description", "property"), `${path} needs og:description`);
    assert.equal(metaContent(html, "og:url", "property"), expectedUrl, `${path} og:url mismatch`);
    assert.equal(
      metaContent(html, "naver-site-verification"),
      "f3d10a5731baa16cc14ac722e81dfbc90531b99d",
      `${path} must expose the current Naver ownership token`,
    );
    assert.equal(metaContent(html, "og:image", "property"), `${SITE_ORIGIN}/og.png`, `${path} og:image mismatch`);
    assert.ok(metaContent(html, "twitter:card"), `${path} needs twitter:card`);
    assert.ok(metaContent(html, "twitter:title"), `${path} needs twitter:title`);
    assert.ok(metaContent(html, "twitter:description"), `${path} needs twitter:description`);
    assert.equal(metaContent(html, "twitter:image"), `${SITE_ORIGIN}/og.png`, `${path} twitter:image mismatch`);
    assert.doesNotMatch(html, /googletagmanager\.com\/gtag/i, `${path} must not server-render the client-only Google Analytics tag`);
    assert.match(html, /href=["']mailto:support@asphalt-calculator\.top["']/i, `${path} needs the monitored support alias in the shared footer`);
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

  const homeHtml = pages.get("/");
  assert.ok(homeHtml, "Homepage HTML must be available for reciprocal-link audit");
  const palletLinks = [...homeHtml.matchAll(/<a\b[^>]*href=["']https:\/\/pallet-calculator\.com\/["'][^>]*>/gi)];
  assert.equal(palletLinks.length, 1, "Homepage must contain exactly one crawlable Pallet Calculator link");
  assert.match(homeHtml, /Another tool we maintain/i, "Owned-site relationship must be visible beside the reciprocal link");

  const privacyHtml = pages.get("/privacy");
  assert.ok(privacyHtml, "Privacy HTML must be available for support-email audit");
  assert.match(privacyHtml, /Cloudflare Email Routing/i, "Privacy policy must disclose the inbound email processor");
  assert.match(privacyHtml, /monitored Google mailbox/i, "Privacy policy must disclose the forwarding destination category");
  assert.match(privacyHtml, /calculator never emails your measurements/i, "Privacy policy must separate calculator inputs from support email");
  assert.match(privacyHtml, /Google Analytics loads automatically/i, "Privacy policy must disclose automatic GA4 loading");
  assert.match(privacyHtml, /removes URL query strings/i, "Privacy policy must disclose GA4 share-query exclusion");

  for (const [path, count] of inbound) assert.ok(count > 0, `${path} is an orphan route`);
} finally {
  await stopProductionServer(server.child);
}

const diskRoutes = ["/", ...await routeFiles(new URL("../app/", import.meta.url))].sort();
assert.deepEqual(diskRoutes, [...routePaths].sort(), "App page routes must equal the route allowlist");

const robots = await readFile(new URL("../public/robots.txt", import.meta.url), "utf8");
assert.match(robots, /User-agent:\s*\*/i);
if (SITE_INDEXING_ENABLED) {
  assert.match(robots, /Allow:\s*\//i, "Production robots.txt must allow crawling");
  assert.doesNotMatch(robots, /Disallow:\s*\//i, "Production robots.txt must not disallow the site");
} else {
  assert.match(robots, /Disallow:\s*\//i, "Pre-release robots.txt must disallow all crawling");
}
assert.match(robots, new RegExp(`Sitemap: ${escapeRegex(SITE_ORIGIN)}/sitemap\\.xml`));

const sitemap = await readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((match) => match[1])
  .sort();
const expectedSitemap = ROUTES
  .filter((route) => route.indexableAtLaunch)
  .map((route) => route.path === "/" ? SITE_ORIGIN : `${SITE_ORIGIN}${route.path}`)
  .sort();
assert.deepEqual(
  sitemapUrls,
  expectedSitemap,
  "Sitemap must contain only exact self-canonical production URLs",
);

const publicRoot = new URL("../public/", import.meta.url);
const publicFiles = (await filesRecursively(publicRoot))
  .map((url) => decodeURIComponent(url.pathname.slice(publicRoot.pathname.length)))
  .sort();
assert.deepEqual(publicFiles, [...PUBLIC_FILE_ALLOWLIST].sort(), "Public files and paths must equal the allowlist");

const buildFiles = await filesRecursively(new URL("../.next/", import.meta.url));
const forbidden = /(vendor-private|shipany|BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY|\bsk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{40,}\b)/i;
let clientJavaScript = "";
for (const url of buildFiles) {
  if (!/\.(?:js|css|html|json|txt|xml|map)$/i.test(url.pathname)) continue;
  const content = await readFile(url, "utf8");
  assert.doesNotMatch(content, forbidden, `Possible private or secret material in deployable build: ${url.pathname}`);
  if (/\/static\/.*\.js$/i.test(url.pathname)) clientJavaScript += content;
}
assert.match(clientJavaScript, /googletagmanager\.com\/gtag\/js/i, "Client build must contain the production-only GA4 loader");
assert.match(clientJavaScript, /dataLayer\.push\(arguments\)/i, "Client build must initialize the standard gtag arguments queue");
assert.doesNotMatch(clientJavaScript, /asphalt-analytics-consent|Allow analytics|Continue without analytics/i, "Client build must not retain the removed opt-in gate");

console.log(`Site audit passed for ${routePaths.length} routes: production HTTP, metadata, canonical, indexing gate, security headers, host redirect, 404, social tags, FAQ parity, structured data, internal links, sitemap, robots, route allowlist, analytics origin boundary, and public-build boundary.`);
