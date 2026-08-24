import Link from "next/link";
import { PAGE_ALTERNATES } from "../../site-config.mjs";

const labels = {
  en: "English",
  de: "Deutsch",
  fr: "Français",
} as const;

const switcherCopy = {
  en: { label: "Language", title: "Language" },
  de: { label: "Sprache", title: "Sprache" },
  fr: { label: "Langue", title: "Langue" },
} as const;

export function LanguageSwitcher({ currentLocale }: { currentLocale: keyof typeof labels }) {
  const copy = switcherCopy[currentLocale];
  return (
    <nav className="language-switcher" aria-label={copy.label}>
      <span>{copy.title}</span>
      <div>
        {Object.entries(PAGE_ALTERNATES.materialCalculator).map(([locale, href]) => (
          <Link
            key={locale}
            href={href}
            hrefLang={locale}
            lang={locale}
            aria-current={currentLocale === locale ? "page" : undefined}
          >
            {labels[locale as keyof typeof labels]}
          </Link>
        ))}
      </div>
    </nav>
  );
}
