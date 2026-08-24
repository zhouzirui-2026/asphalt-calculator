export const SITE_ORIGIN = "https://asphalt-calculator.top";

// Only launch-ready locales belong in this registry. Adding a locale here is a
// public URL decision: its pages must already have native-quality content,
// correct units/examples, self-canonicals, reciprocal hreflang, and sitemap
// parity. Candidate languages stay in the planning record until that gate is
// met.
export const DEFAULT_LOCALE = Object.freeze({
  code: "en",
  htmlLang: "en",
  direction: "ltr",
  pathPrefix: "",
  label: "English",
});

export const GERMAN_LOCALE = Object.freeze({
  code: "de",
  htmlLang: "de",
  direction: "ltr",
  pathPrefix: "/de",
  label: "Deutsch",
});

export const FRENCH_LOCALE = Object.freeze({
  code: "fr",
  htmlLang: "fr",
  direction: "ltr",
  pathPrefix: "/fr",
  label: "Français",
});

export const LOCALES = Object.freeze([
  DEFAULT_LOCALE,
  GERMAN_LOCALE,
  FRENCH_LOCALE,
]);

export const PAGE_ALTERNATES = Object.freeze({
  materialCalculator: Object.freeze({
    en: "/asphalt-calculator",
    de: "/de/asphalt-rechner",
    fr: "/fr/calcul-enrobe",
  }),
});

export function localeForCode(code) {
  const locale = LOCALES.find((candidate) => candidate.code === code);
  if (!locale) throw new Error(`Locale is not launch-ready: ${code}`);
  return locale;
}

export function localizedPath(path, localeCode = DEFAULT_LOCALE.code) {
  if (!/^\/(?!\/)/.test(path) || /[?#]/.test(path)) {
    throw new Error(`Expected a canonical root-relative path, received: ${path}`);
  }

  const locale = localeForCode(localeCode);
  if (!locale.pathPrefix) return path;
  const group = Object.values(PAGE_ALTERNATES)
    .find((candidate) => candidate[DEFAULT_LOCALE.code] === path);
  const localized = group?.[locale.code];
  if (!localized) {
    throw new Error(`No launch-ready ${locale.code} equivalent for: ${path}`);
  }
  return localized;
}

export function localizedUrl(path, localeCode = DEFAULT_LOCALE.code) {
  const localized = localizedPath(path, localeCode);
  return localized === "/" ? SITE_ORIGIN : `${SITE_ORIGIN}${localized}`;
}

export function canonicalUrl(path) {
  if (!/^\/(?!\/)/.test(path) || /[?#]/.test(path)) {
    throw new Error(`Expected a canonical root-relative path, received: ${path}`);
  }
  return path === "/" ? SITE_ORIGIN : `${SITE_ORIGIN}${path}`;
}

export function languageAlternates(groupName) {
  const group = PAGE_ALTERNATES[groupName];
  if (!group) throw new Error(`Unknown alternate group: ${groupName}`);
  return Object.freeze({
    ...Object.fromEntries(
      LOCALES.map((locale) => [locale.code, canonicalUrl(group[locale.code])]),
    ),
    "x-default": canonicalUrl(group[DEFAULT_LOCALE.code]),
  });
}

// Enabled only after the custom domain, HTTPS, canonical host, production
// routes, calculator fixtures, and analytics origin/data-minimization boundary passed the
// production verification recorded in docs/release-record.md.
export const SITE_INDEXING_ENABLED = true;

export const ROUTES = [
  { path: "/", localeCode: "en", indexableAtLaunch: true, changefreq: "monthly", priority: "1.0" },
  { path: "/asphalt-calculator", localeCode: "en", alternateGroup: "materialCalculator", indexableAtLaunch: true, changefreq: "monthly", priority: "0.9" },
  { path: "/asphalt-driveway-cost-calculator", localeCode: "en", indexableAtLaunch: true, changefreq: "monthly", priority: "0.9" },
  { path: "/asphalt-weight-calculator", localeCode: "en", indexableAtLaunch: true, changefreq: "monthly", priority: "0.8" },
  { path: "/how-to-calculate-asphalt-tonnage", localeCode: "en", indexableAtLaunch: true, changefreq: "yearly", priority: "0.7" },
  { path: "/methodology", localeCode: "en", indexableAtLaunch: true, changefreq: "yearly", priority: "0.6" },
  { path: "/about", localeCode: "en", indexableAtLaunch: true, changefreq: "yearly", priority: "0.5" },
  { path: "/privacy", localeCode: "en", indexableAtLaunch: false, changefreq: "yearly", priority: "0.2" },
  { path: "/terms", localeCode: "en", indexableAtLaunch: false, changefreq: "yearly", priority: "0.2" },
  { path: "/de/asphalt-rechner", localeCode: "de", alternateGroup: "materialCalculator", indexableAtLaunch: true, changefreq: "monthly", priority: "0.8" },
  { path: "/fr/calcul-enrobe", localeCode: "fr", alternateGroup: "materialCalculator", indexableAtLaunch: true, changefreq: "monthly", priority: "0.8" },
];

export const PUBLIC_FILE_ALLOWLIST = [
  "5830219258b6428a9aebc26296d902c2bf3dd321328c460d95738649794f17b7.txt",
  "favicon.svg",
  "og.png",
  "robots.txt",
  "sitemap.xml",
];
