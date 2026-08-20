#!/usr/bin/env node

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve, sep } from "node:path";

const args = parseArgs(process.argv.slice(2));
if (args.selfTest) {
  runSelfTest();
  process.exit(0);
}
if (!args.config) fail("--config is required. Copy and parameterize search-project.json.");

const configPath = resolve(process.cwd(), args.config);
const config = await loadConfig(configPath);
const configDir = dirname(configPath);
const keyPath = safeChild(configDir, config.indexNow.keyFile, "indexNow.keyFile");
const key = (await readRequiredFile(keyPath, "IndexNow key file")).trim();
validateKey(key);

if (args.bootstrap && (args.changed.length || args.deleted.length)) fail("Use --bootstrap by itself, or provide --url/--deleted-url values, not both.");
if (!args.bootstrap && !args.changed.length && !args.deleted.length) fail("Provide --bootstrap, --url, or --deleted-url. No URLs are guessed.");

if (args.execute) {
  if (!args.confirmOrigin) fail("--execute requires --confirm-origin with the exact configured origin.");
  if (args.confirmOrigin !== config.siteOrigin) fail(`--confirm-origin must exactly equal ${config.siteOrigin}.`);
} else if (args.confirmOrigin) {
  fail("--confirm-origin is only valid with --execute.");
}

let urlList;
if (args.bootstrap) {
  const sitemap = args.execute
    ? await fetchExactText(config.sitemapUrl, "production sitemap", config)
    : await readRequiredFile(safeChild(configDir, config.localSitemap, "localSitemap"), "local sitemap");
  urlList = parseSitemap(sitemap, config);
} else {
  urlList = validateChangedUrls(args.changed, args.deleted, config);
}

if (!args.execute) {
  console.log("Mode: dry-run (no network submission)");
  console.log(`Validated ${urlList.length} ${args.bootstrap ? "bootstrap" : "changed/deleted"} URL(s) for ${config.siteOrigin}.`);
  console.log(`Endpoint reserved for explicit execution: ${config.indexNow.endpoint}`);
  process.exit(0);
}

const publishedKey = (await fetchExactText(config.indexNow.keyLocation, "published IndexNow key", config)).trim();
if (publishedKey !== key) fail("Published IndexNow key does not match the configured local key file.");

const payload = {
  host: new URL(config.siteOrigin).host,
  key,
  keyLocation: config.indexNow.keyLocation,
  urlList,
};
const response = await fetch(config.indexNow.endpoint, {
  method: "POST",
  headers: {
    "content-type": "application/json; charset=utf-8",
    "user-agent": config.indexNow.userAgent,
  },
  body: JSON.stringify(payload),
  redirect: "manual",
  signal: AbortSignal.timeout(config.indexNow.timeoutMs),
});
const responseBody = await response.text();
if (![200, 202].includes(response.status)) {
  const retryAfter = response.headers.get("retry-after");
  fail(`IndexNow returned HTTP ${response.status}${retryAfter ? ` (Retry-After: ${sanitize(retryAfter)})` : ""}${responseBody ? `: ${sanitize(responseBody)}` : ""}`);
}

console.log(`IndexNow received ${urlList.length} URL(s) with HTTP ${response.status}.`);
console.log(`Submitted host: ${payload.host}`);
console.log(args.bootstrap ? `Bootstrap source: ${config.sitemapUrl}` : "Submission mode: changed/deleted URLs only");
if (response.status === 202) {
  console.log("Key validation is pending; confirm the provider dashboard before treating this as complete.");
  process.exitCode = 2;
}

function parseArgs(values) {
  const parsed = { config: "", bootstrap: false, changed: [], deleted: [], execute: false, confirmOrigin: "", selfTest: false };
  for (let i = 0; i < values.length; i += 1) {
    const value = values[i];
    if (value === "--config") parsed.config = take(values, ++i, value);
    else if (value === "--bootstrap") parsed.bootstrap = true;
    else if (value === "--url") parsed.changed.push(take(values, ++i, value));
    else if (value === "--deleted-url") parsed.deleted.push(take(values, ++i, value));
    else if (value === "--execute") parsed.execute = true;
    else if (value === "--confirm-origin") parsed.confirmOrigin = take(values, ++i, value);
    else if (value === "--self-test") parsed.selfTest = true;
    else fail(`Unknown option: ${value}`);
  }
  return parsed;
}

function take(values, index, name) {
  const value = values[index];
  if (!value || value.startsWith("--")) fail(`${name} requires a value.`);
  return value;
}

async function loadConfig(path) {
  let source;
  try { source = await readFile(path, "utf8"); }
  catch (error) { fail(`Cannot read config ${path}: ${error.message}`); }
  let value;
  try { value = JSON.parse(source); }
  catch (error) { fail(`Config is not valid JSON: ${error.message}`); }
  return validateConfig(value);
}

function validateConfig(value) {
  if (!value || Array.isArray(value) || typeof value !== "object") fail("Config must be a JSON object.");
  const topKeys = new Set(["siteOrigin", "localSitemap", "sitemapUrl", "indexNow"]);
  for (const key of Object.keys(value)) if (!topKeys.has(key)) fail(`Unknown config field: ${key}`);
  const site = exactHttpsOrigin(value.siteOrigin, "siteOrigin");
  if (typeof value.localSitemap !== "string" || !value.localSitemap) fail("localSitemap is required.");
  const sitemap = exactHttpsUrl(value.sitemapUrl, "sitemapUrl");
  if (sitemap.origin !== site.origin || sitemap.search || sitemap.hash) fail("sitemapUrl must use siteOrigin and contain no query or fragment.");
  if (!value.indexNow || Array.isArray(value.indexNow) || typeof value.indexNow !== "object") fail("indexNow object is required.");
  const indexKeys = new Set(["keyFile", "keyLocation", "endpoint", "userAgent", "timeoutMs"]);
  for (const key of Object.keys(value.indexNow)) if (!indexKeys.has(key)) fail(`Unknown indexNow field: ${key}`);
  for (const key of ["keyFile", "keyLocation", "endpoint", "userAgent"]) if (typeof value.indexNow[key] !== "string" || !value.indexNow[key]) fail(`indexNow.${key} is required.`);
  const keyLocation = exactHttpsUrl(value.indexNow.keyLocation, "indexNow.keyLocation");
  if (keyLocation.origin !== site.origin || keyLocation.search || keyLocation.hash) fail("indexNow.keyLocation must use siteOrigin and contain no query or fragment.");
  const endpoint = exactHttpsUrl(value.indexNow.endpoint, "indexNow.endpoint");
  if (endpoint.username || endpoint.password || endpoint.hash) fail("indexNow.endpoint must not contain credentials or a fragment.");
  const timeoutMs = value.indexNow.timeoutMs ?? 15000;
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 60000) fail("indexNow.timeoutMs must be an integer from 1000 to 60000.");
  if (value.indexNow.userAgent.length > 200 || /[\r\n]/.test(value.indexNow.userAgent)) fail("indexNow.userAgent is invalid.");
  return {
    siteOrigin: site.origin,
    localSitemap: value.localSitemap,
    sitemapUrl: sitemap.href,
    indexNow: { ...value.indexNow, keyLocation: keyLocation.href, endpoint: endpoint.href, timeoutMs },
  };
}

function exactHttpsOrigin(raw, label) {
  const url = exactHttpsUrl(raw, label);
  if (url.pathname !== "/" || url.search || url.hash || url.username || url.password) fail(`${label} must be an HTTPS origin with no credentials, path, query, or fragment.`);
  return url;
}

function exactHttpsUrl(raw, label) {
  if (typeof raw !== "string" || !raw) fail(`${label} is required.`);
  let url;
  try { url = new URL(raw); } catch { fail(`${label} must be an absolute URL.`); }
  if (url.protocol !== "https:") fail(`${label} must use HTTPS.`);
  return url;
}

function validateKey(value) {
  if (!/^[A-Za-z0-9-]{8,128}$/.test(value)) fail("IndexNow key must contain 8–128 letters, numbers, or hyphens.");
}

function parseSitemap(xml, config) {
  const urls = [...xml.matchAll(/<loc\b[^>]*>([\s\S]*?)<\/loc\s*>/gi)].map((match) => decodeXml(match[1].trim()));
  if (!urls.length) fail("Sitemap contains no loc URLs.");
  if (urls.length > 10_000) fail("IndexNow accepts at most 10,000 URLs per request.");
  if (new Set(urls).size !== urls.length) fail("Sitemap contains duplicate URLs.");
  for (const value of urls) validateSubmissionUrl(value, false, config);
  return urls.map((value) => new URL(value).href);
}

function validateChangedUrls(changed, deleted, config) {
  const tagged = [...changed.map((value) => ({ value, deleted: false })), ...deleted.map((value) => ({ value, deleted: true }))];
  if (tagged.length > 10_000) fail("IndexNow accepts at most 10,000 URLs per request.");
  const urls = tagged.map(({ value, deleted: removed }) => validateSubmissionUrl(value, removed, config));
  if (new Set(urls).size !== urls.length) fail("Submission contains duplicate URLs.");
  return urls;
}

function validateSubmissionUrl(value, deleted, config) {
  let url;
  try { url = new URL(value); } catch { fail(`Submission URL is invalid: ${value}`); }
  if (url.protocol !== "https:" || url.origin !== config.siteOrigin) fail(`Submission URL must use ${config.siteOrigin}: ${value}`);
  if (url.username || url.password || url.search || url.hash) fail(`Submission URL must contain no credentials, query, or fragment: ${value}`);
  if (!deleted && (url.pathname.endsWith(".html") || (url.pathname !== "/" && url.pathname.endsWith("/")))) fail(`Added/updated URL is not canonical clean-URL form: ${value}`);
  return url.href;
}

async function fetchExactText(url, label, config) {
  let response;
  try {
    response = await fetch(url, {
      headers: { "user-agent": config.indexNow.userAgent },
      redirect: "manual",
      signal: AbortSignal.timeout(config.indexNow.timeoutMs),
    });
  } catch (error) {
    fail(`${label} request failed: ${error.message}`);
  }
  if (response.status >= 300 && response.status < 400) fail(`${label} must not redirect (HTTP ${response.status}): ${url}`);
  if (!response.ok) fail(`${label} returned HTTP ${response.status}: ${url}`);
  return response.text();
}

async function readRequiredFile(path, label) {
  try { return await readFile(path, "utf8"); }
  catch (error) { fail(`Cannot read ${label} at ${path}: ${error.message}`); }
}

function safeChild(root, value, label) {
  const path = resolve(root, value);
  if (path === root || path.startsWith(`${root}${sep}`)) return path;
  fail(`${label} resolves outside the config directory.`);
}

function decodeXml(value) {
  return value.replaceAll("&amp;", "&").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&quot;", '"').replaceAll("&apos;", "'");
}

function sanitize(value) {
  return Array.from(String(value), (character) => {
    const codePoint = character.codePointAt(0);
    return codePoint < 32 || codePoint === 127 ? " " : character;
  }).join("").trim().slice(0, 500);
}
function fail(message) { console.error(`Search submission error: ${sanitize(message)}`); process.exit(2); }

function runSelfTest() {
  const config = validateConfig({
    siteOrigin: "https://example.test",
    localSitemap: "sitemap.xml",
    sitemapUrl: "https://example.test/sitemap.xml",
    indexNow: {
      keyFile: "example-key.txt",
      keyLocation: "https://example.test/example-key.txt",
      endpoint: "https://api.indexnow.org/indexnow",
      userAgent: "SelfTest/1.0",
      timeoutMs: 5000,
    },
  });
  validateKey("example-key-1234");
  assert.deepEqual(parseSitemap('<urlset><url><loc>https://example.test/</loc></url><url><loc>https://example.test/page</loc></url></urlset>', config), ["https://example.test/", "https://example.test/page"]);
  assert.deepEqual(validateChangedUrls(["https://example.test/new"], ["https://example.test/old.html"], config), ["https://example.test/new", "https://example.test/old.html"]);
  assert.throws(() => new URL("not a url"));
  console.log("submit_indexnow.mjs self-test passed.");
}
