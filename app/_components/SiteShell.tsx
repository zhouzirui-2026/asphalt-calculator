import Link from "next/link";
import type { ReactNode } from "react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { DirectoryBadges } from "./DirectoryBadges";

const navigation = [
  ["/asphalt-calculator", "Material calculator"],
  ["/asphalt-driveway-cost-calculator", "Driveway cost"],
  ["/methodology", "Methodology"],
] as const;

export function SiteShell({
  children,
  currentPath,
}: {
  children: ReactNode;
  currentPath: string;
}) {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="site-header">
        <div className="shell site-header__inner">
          <Link className="brand" href="/" aria-label="Asphalt Calculator home">
            <span className="brand__mark" aria-hidden="true">AC</span>
            <span>Asphalt Calculator</span>
          </Link>
          <div className="site-header__controls">
            {currentPath === "/asphalt-calculator" ? (
              <LanguageSwitcher currentLocale="en" />
            ) : null}
            <nav aria-label="Primary navigation">
              <ul className="nav-list">
                {navigation.map(([href, label]) => (
                  <li key={href}>
                    <Link
                      aria-current={currentPath === href ? "page" : undefined}
                      href={href}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </header>
      <div id="main-content" tabIndex={-1}>{children}</div>
      <footer className="site-footer">
        <div className="shell site-footer__grid">
          <div>
            <Link className="brand brand--footer" href="/">
              <span className="brand__mark" aria-hidden="true">AC</span>
              <span>Asphalt Calculator</span>
            </Link>
            <p>Transparent planning math for asphalt projects.</p>
          </div>
          <nav aria-label="Footer navigation">
            <Link href="/asphalt-weight-calculator">Weight calculator</Link>
            <Link href="/how-to-calculate-asphalt-tonnage">Tonnage formula</Link>
            <Link href="/about">About</Link>
            <Link href="/methodology">Methodology</Link>
            <a href="mailto:support@asphalt-calculator.top">Support</a>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </nav>
          <p className="site-footer__notice">
            Estimates are for planning only. Confirm requirements and prices
            with qualified local professionals.
          </p>
          <DirectoryBadges />
        </div>
      </footer>
    </>
  );
}
