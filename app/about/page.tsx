import type { Metadata } from "next";
import Link from "next/link";
import { SOCIAL_IMAGE, TWITTER_IMAGE } from "../../lib/seo";
import { SiteShell } from "../_components/SiteShell";

export const metadata: Metadata = {
  title: "About This Asphalt Calculator",
  description: "Learn who maintains the site, what it calculates, the factual boundaries it follows, and how corrections are handled.",
  alternates: { canonical: "/about" },
  openGraph: { type: "website", url: "/about", title: "About This Asphalt Calculator", description: "A transparent, source-linked planning tool with a deliberately narrow scope.", images: [SOCIAL_IMAGE] },
  twitter: { card: "summary", title: "About This Asphalt Calculator", description: "A transparent, source-linked planning tool with a deliberately narrow scope.", images: [TWITTER_IMAGE] },
};

export default function AboutPage() {
  return <SiteShell currentPath="/about"><main className="page-main prose-page shell">
    <nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span>About</span></nav>
    <header className="prose-header"><p className="eyebrow">About the project</p><h1>A narrow tool with visible assumptions</h1><p>Asphalt Calculator is an independent planning tool for people who need to organize measurements, tonnage, and user-supplied cost inputs before speaking with a supplier or contractor.</p><div className="byline"><span>Maintained by Asphalt Calculator Editorial Team</span><span>Last reviewed August 18, 2026</span></div></header>
    <section><h2>What we publish</h2><p>We publish two workflows: a material calculator for volume, weight, tonnage, waste, and optional material price; and a driveway cost calculator that adds only the local allowances entered by the user.</p></section>
    <section><h2>What we do not claim</h2><p>We are not a paving contractor, engineering firm, testing laboratory, standards body, or price-reporting service. We do not claim professional certification, guaranteed accuracy, a suitable pavement design, or a contractor quote.</p></section>
    <section><h2>Editorial and correction policy</h2><p>Factual defaults must be linked to an authoritative source and remain editable. Formulas are unit tested. A correction should update the source note, calculator implementation when relevant, tests, visible explanation, and review date together.</p><p>During this local first release, no public contact channel is provided and no personal information is collected. A verified contact method belongs on the launch checklist before publication.</p></section>
    <section><h2>Start with the right workflow</h2><p><Link href="/asphalt-calculator">Estimate asphalt material and tonnage</Link>, <Link href="/asphalt-driveway-cost-calculator">build a driveway cost allowance</Link>, or <Link href="/methodology">audit the methodology and sources</Link>.</p></section>
  </main></SiteShell>;
}
