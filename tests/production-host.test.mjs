import assert from "node:assert/strict";
import test from "node:test";
import "next/dist/server/node-environment.js";
import { adapter } from "next/dist/server/web/adapter.js";
import { NextResponse } from "next/server.js";
import {
  productionRedirectUrl,
  trailingSlashRedirectUrl,
} from "../lib/production-host.ts";

for (const tail of ["/", "/asphalt-calculator?a=1&a=2&tag=a%26b", "/asphalt-driveway-cost-calculator/?space=two%20words&plus=a+b", "/de/asphalt-rechner?x=%2f", "/robots.txt", "/_next/static/example.js", "//external.example/path"]) {
  test(`redirect only the production alias and retain ${tail}`, () => {
    assert.equal(productionRedirectUrl(`https://asphalt-calculator-sooty.vercel.app${tail}`).href, `https://asphalt-calculator.top${tail}`);
  });
}
for (const host of ["asphalt-calculator.top", "www.asphalt-calculator.top", "asphalt-calculator-git-qa-phds-projects.vercel.app", "asphalt-calculator-example-phds-projects.vercel.app", "asphalt-calculator-sooty.vercel.app.evil.example", "evil-asphalt-calculator-sooty.vercel.app", "localhost:3000"]) {
  test(`continue existing routing for ${host}`, () => {
    assert.equal(productionRedirectUrl(`https://${host}/?a=1&a=2`), null);
  });
}
test("canonical and Preview slash removal preserves raw query", () => {
  for (const host of ["asphalt-calculator.top", "asphalt-calculator-git-qa-phds-projects.vercel.app"]) {
    assert.equal(trailingSlashRedirectUrl(`https://${host}/asphalt-calculator/?a=1&a=2&space=two%20words`).href, `https://${host}/asphalt-calculator?a=1&a=2&space=two%20words`);
    assert.equal(trailingSlashRedirectUrl(`https://${host}/`), null);
    assert.equal(trailingSlashRedirectUrl(`https://${host}/asphalt-calculator`), null);
  }
});
test("the installed Next adapter retains query and HTTP method without reading a body", async () => {
  const previous = process.env.__NEXT_NO_MIDDLEWARE_URL_NORMALIZE;
  process.env.__NEXT_NO_MIDDLEWARE_URL_NORMALIZE = "1";
  try {
    for (const method of ["GET", "HEAD", "POST"]) {
      const result = await adapter({
        page: "/proxy",
        handler: (request) => {
          assert.equal(request.method, method);
          assert.equal(request.bodyUsed, false);
          return NextResponse.redirect(productionRedirectUrl(request.url), 308);
        },
        request: {
          url: "https://asphalt-calculator-sooty.vercel.app/asphalt-calculator/?a=1&a=2&space=two%20words&plus=a+b&tag=a%26b",
          method,
          headers: {},
          nextConfig: {},
        },
      });
      assert.equal(result.response.status, 308);
      assert.equal(result.response.headers.get("location"), "https://asphalt-calculator.top/asphalt-calculator/?a=1&a=2&space=two%20words&plus=a+b&tag=a%26b");
    }
  } finally {
    if (previous === undefined) delete process.env.__NEXT_NO_MIDDLEWARE_URL_NORMALIZE;
    else process.env.__NEXT_NO_MIDDLEWARE_URL_NORMALIZE = previous;
  }
});
