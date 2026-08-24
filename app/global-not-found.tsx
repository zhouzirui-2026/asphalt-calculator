import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "./_components/SiteShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Page not found | Asphalt Calculator",
  robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="en" dir="ltr">
      <body>
        <SiteShell currentPath="">
          <main className="page-main prose-page shell">
            <header className="prose-header">
              <p className="eyebrow">404 · Page not found</p>
              <h1>This route is not part of the plan.</h1>
              <p>The address may be incomplete, or the page may have moved.</p>
            </header>
            <section>
              <h2>Choose a calculator</h2>
              <p>
                <Link href="/asphalt-calculator">Estimate asphalt material</Link>
                {" or "}
                <Link href="/asphalt-driveway-cost-calculator">build a driveway cost allowance</Link>.
              </p>
            </section>
          </main>
        </SiteShell>
      </body>
    </html>
  );
}
