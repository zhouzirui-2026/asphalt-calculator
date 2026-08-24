import assert from "node:assert/strict";
import test from "node:test";
import {
  canonicalUrl,
  DEFAULT_LOCALE,
  FRENCH_LOCALE,
  GERMAN_LOCALE,
  languageAlternates,
  localeForCode,
  localizedPath,
  localizedUrl,
  LOCALES,
  PAGE_ALTERNATES,
  SITE_ORIGIN,
} from "../site-config.mjs";

test("the launch locale registry contains English, German, and French", () => {
  assert.deepEqual(LOCALES, [DEFAULT_LOCALE, GERMAN_LOCALE, FRENCH_LOCALE]);
  assert.deepEqual(DEFAULT_LOCALE, {
    code: "en",
    htmlLang: "en",
    direction: "ltr",
    pathPrefix: "",
    label: "English",
  });
  assert.equal(localeForCode("en"), DEFAULT_LOCALE);
  assert.equal(localeForCode("de"), GERMAN_LOCALE);
  assert.equal(localeForCode("fr"), FRENCH_LOCALE);
});
test("the material calculator has stable localized slugs and canonical URLs", () => {
  assert.deepEqual(PAGE_ALTERNATES.materialCalculator, {
    en: "/asphalt-calculator",
    de: "/de/asphalt-rechner",
    fr: "/fr/calcul-enrobe",
  });
  assert.equal(localizedPath("/asphalt-calculator"), "/asphalt-calculator");
  assert.equal(localizedPath("/asphalt-calculator", "de"), "/de/asphalt-rechner");
  assert.equal(localizedPath("/asphalt-calculator", "fr"), "/fr/calcul-enrobe");
  assert.equal(localizedUrl("/asphalt-calculator", "de"), `${SITE_ORIGIN}/de/asphalt-rechner`);
  assert.equal(canonicalUrl("/fr/calcul-enrobe"), `${SITE_ORIGIN}/fr/calcul-enrobe`);
});

test("language alternates are reciprocal and use English as x-default", () => {
  assert.deepEqual(languageAlternates("materialCalculator"), {
    en: `${SITE_ORIGIN}/asphalt-calculator`,
    de: `${SITE_ORIGIN}/de/asphalt-rechner`,
    fr: `${SITE_ORIGIN}/fr/calcul-enrobe`,
    "x-default": `${SITE_ORIGIN}/asphalt-calculator`,
  });
});

test("locale helpers fail closed for unpublished or non-equivalent routes", () => {
  assert.throws(() => localeForCode("es"), /not launch-ready/);
  assert.throws(() => localizedPath("/about", "de"), /No launch-ready de equivalent/);
  assert.throws(() => localizedPath("asphalt-calculator"), /root-relative/);
  assert.throws(() => localizedPath("//asphalt-calculator"), /root-relative/);
  assert.throws(() => localizedPath("/asphalt-calculator?unit=us"), /root-relative/);
  assert.throws(() => canonicalUrl("/fr/calcul-enrobe#result"), /root-relative/);
});
