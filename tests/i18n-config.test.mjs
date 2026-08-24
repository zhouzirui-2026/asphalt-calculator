import assert from "node:assert/strict";
import test from "node:test";
import {
  DEFAULT_LOCALE,
  localeForCode,
  localizedPath,
  localizedUrl,
  LOCALES,
  SITE_ORIGIN,
} from "../site-config.mjs";

test("the launch locale registry contains only the unprefixed English locale", () => {
  assert.deepEqual(LOCALES, [DEFAULT_LOCALE]);
  assert.deepEqual(DEFAULT_LOCALE, {
    code: "en",
    htmlLang: "en",
    direction: "ltr",
    pathPrefix: "",
  });
  assert.equal(localeForCode("en"), DEFAULT_LOCALE);
});

test("default-locale paths and URLs preserve the production canonical contract", () => {
  assert.equal(localizedPath("/"), "/");
  assert.equal(localizedPath("/asphalt-calculator"), "/asphalt-calculator");
  assert.equal(localizedUrl("/"), SITE_ORIGIN);
  assert.equal(
    localizedUrl("/asphalt-calculator"),
    `${SITE_ORIGIN}/asphalt-calculator`,
  );
});

test("locale helpers fail closed for unpublished locales and noncanonical paths", () => {
  assert.throws(() => localeForCode("es"), /not launch-ready/);
  assert.throws(() => localizedPath("asphalt-calculator"), /root-relative/);
  assert.throws(() => localizedPath("//asphalt-calculator"), /root-relative/);
  assert.throws(() => localizedPath("/asphalt-calculator?unit=us"), /root-relative/);
  assert.throws(() => localizedPath("/asphalt-calculator#results"), /root-relative/);
});
