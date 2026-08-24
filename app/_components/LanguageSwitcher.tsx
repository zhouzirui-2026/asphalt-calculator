"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { PAGE_ALTERNATES } from "../../site-config.mjs";

const labels = {
  en: "English",
  de: "Deutsch",
  fr: "Français",
} as const;

const switcherCopy = {
  en: { label: "Choose language", prompt: "Language" },
  de: { label: "Sprache auswählen", prompt: "Sprache" },
  fr: { label: "Choisir la langue", prompt: "Langue" },
} as const;

export function LanguageSwitcher({ currentLocale }: { currentLocale: keyof typeof labels }) {
  const copy = switcherCopy[currentLocale];
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !detailsRef.current?.open) return;
      detailsRef.current.open = false;
      detailsRef.current.querySelector<HTMLElement>("summary")?.focus();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <nav className="language-switcher" aria-label={copy.label}>
      <details ref={detailsRef}>
        <summary>
          <span className="language-switcher__prompt">{copy.prompt}</span>
          <strong>{labels[currentLocale]}</strong>
          <span className="language-switcher__chevron" aria-hidden="true">▾</span>
        </summary>
        <div className="language-switcher__menu">
          {Object.entries(PAGE_ALTERNATES.materialCalculator).map(([locale, href]) => (
            <Link
              key={locale}
              href={href}
              hrefLang={locale}
              lang={locale}
              aria-current={currentLocale === locale ? "page" : undefined}
            >
              <span>{labels[locale as keyof typeof labels]}</span>
              <span className="language-switcher__code" aria-hidden="true">
                {locale.toUpperCase()}
              </span>
            </Link>
          ))}
        </div>
      </details>
    </nav>
  );
}
