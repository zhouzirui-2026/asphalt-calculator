import Link from "next/link";
import type { ReactNode } from "react";

const shellCopy = {
  de: {
    skip: "Zum Inhalt springen",
    primaryNavigation: "Hauptnavigation",
    footerNavigation: "Fußnavigation",
    homeLabel: "Startseite des Asphalt-Rechners",
    calculator: "Asphalt-Rechner",
    methodology: "Methodik (Englisch)",
    about: "Über uns (Englisch)",
    support: "Kontakt",
    privacy: "Datenschutz (Englisch)",
    terms: "Bedingungen (Englisch)",
    footer: "Transparente Berechnungen für die Asphaltplanung.",
    notice: "Nur eine Planungsschätzung. Dichte, Menge, Lieferbedingungen und Preise mit örtlichen Fachbetrieben bestätigen.",
  },
  fr: {
    skip: "Aller au contenu",
    primaryNavigation: "Navigation principale",
    footerNavigation: "Navigation de pied de page",
    homeLabel: "Accueil du calculateur d’enrobé",
    calculator: "Calcul d’enrobé",
    methodology: "Méthode (en anglais)",
    about: "À propos (en anglais)",
    support: "Contact",
    privacy: "Confidentialité (en anglais)",
    terms: "Conditions (en anglais)",
    footer: "Des calculs transparents pour préparer un projet d’enrobé.",
    notice: "Estimation de préparation uniquement. Confirmez densité, quantité, livraison et prix auprès de professionnels locaux.",
  },
} as const;

export function LocalizedSiteShell({
  children,
  currentPath,
  locale,
}: {
  children: ReactNode;
  currentPath: string;
  locale: keyof typeof shellCopy;
}) {
  const copy = shellCopy[locale];
  return (
    <>
      <a className="skip-link" href="#main-content">{copy.skip}</a>
      <header className="site-header">
        <div className="shell site-header__inner">
          <Link className="brand" href={currentPath} aria-label={copy.homeLabel}>
            <span className="brand__mark" aria-hidden="true">AC</span>
            <span>Asphalt Calculator</span>
          </Link>
          <nav aria-label={copy.primaryNavigation}>
            <ul className="nav-list">
              <li><Link aria-current="page" href={currentPath}>{copy.calculator}</Link></li>
              <li><Link href="/methodology" hrefLang="en">{copy.methodology}</Link></li>
            </ul>
          </nav>
        </div>
      </header>
      <div id="main-content" tabIndex={-1}>{children}</div>
      <footer className="site-footer">
        <div className="shell site-footer__grid">
          <div>
            <Link className="brand brand--footer" href={currentPath}>
              <span className="brand__mark" aria-hidden="true">AC</span>
              <span>Asphalt Calculator</span>
            </Link>
            <p>{copy.footer}</p>
          </div>
          <nav aria-label={copy.footerNavigation}>
            <Link href={currentPath}>{copy.calculator}</Link>
            <Link href="/about" hrefLang="en">{copy.about}</Link>
            <Link href="/methodology" hrefLang="en">{copy.methodology}</Link>
            <a href="mailto:support@asphalt-calculator.top">{copy.support}</a>
            <Link href="/privacy" hrefLang="en">{copy.privacy}</Link>
            <Link href="/terms" hrefLang="en">{copy.terms}</Link>
          </nav>
          <p className="site-footer__notice">{copy.notice}</p>
        </div>
      </footer>
    </>
  );
}
