import type { Metadata } from "next";
import Link from "next/link";
import { SOCIAL_IMAGE, TWITTER_IMAGE } from "../../../lib/seo";
import { SiteShell } from "../../_components/SiteShell";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms and estimate limits for using the asphalt material and driveway planning calculators.",
  alternates: { canonical: "/terms" },
  robots: { index: false, follow: false },
  openGraph: { type: "website", url: "/terms", title: "Terms of Use", description: "Planning-estimate terms for the asphalt material and driveway cost calculators.", images: [SOCIAL_IMAGE] },
  twitter: { card: "summary", title: "Terms of Use", description: "Planning-estimate terms for the asphalt material and driveway cost calculators.", images: [TWITTER_IMAGE] },
};

export default function TermsPage() {
  return <SiteShell currentPath="/terms"><main className="page-main prose-page shell">
    <nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span>Terms</span></nav>
    <header className="prose-header"><p className="eyebrow">Terms</p><h1>Terms of use</h1><p>Use the calculators as transparent planning aids, not as engineering documents or bids.</p><div className="byline"><span>Effective August 20, 2026</span><span>Last reviewed August 20, 2026</span></div></header>
    <section><h2>Planning estimate only</h2><p>Outputs depend entirely on the measurements, density, thickness, waste, and prices entered. They may differ from delivered quantity, compacted yield, final scope, invoice, or site conditions.</p></section>
    <section><h2>No professional or contractual advice</h2><p>The site does not provide engineering, construction, legal, safety, tax, or contracting advice. A result is not a pavement design, specification, order, offer, warranty, or contractor quote.</p></section>
    <section><h2>Your responsibility</h2><p>Verify measurements, mix, compacted density, pavement design, local requirements, supplier order rules, and complete contractor scope with qualified local professionals before purchasing material or authorizing work.</p></section>
    <section><h2>Availability and changes</h2><p>The site may correct formulas, sources, validation limits, or explanatory text. Important corrections should be documented with the review date. For implementation details, read the <Link href="/methodology">methodology</Link>.</p></section>
  </main></SiteShell>;
}
