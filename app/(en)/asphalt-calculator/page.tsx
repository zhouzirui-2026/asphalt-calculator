import type { Metadata } from "next";
import Link from "next/link";
import { languageAlternates } from "../../../site-config.mjs";
import { SOCIAL_IMAGE, TWITTER_IMAGE } from "../../../lib/seo";
import { AsphaltEstimator } from "../../_components/AsphaltEstimator";
import { FaqSection, type FaqItem } from "../../_components/FaqSection";
import { LanguageSwitcher } from "../../_components/LanguageSwitcher";
import { SiteShell } from "../../_components/SiteShell";

const alternates = languageAlternates("materialCalculator");

export const metadata: Metadata = {
  title: "Asphalt Calculator: Tonnage, Volume & Cost",
  description:
    "Calculate asphalt or blacktop volume, weight, short tons, metric tonnes, waste, and optional material cost with editable density and visible formulas.",
  alternates: { canonical: "/asphalt-calculator", languages: alternates },
  openGraph: {
    type: "website",
    url: "/asphalt-calculator",
    title: "Asphalt Calculator: Tonnage, Volume & Cost",
    description:
      "Estimate asphalt tonnage with US or metric units, editable density, waste, and visible formulas.",
    images: [SOCIAL_IMAGE],
  },
  twitter: {
    card: "summary",
    title: "Asphalt Calculator: Tonnage, Volume & Cost",
    description:
      "Estimate asphalt tonnage with US or metric units, editable density, waste, and visible formulas.",
    images: [TWITTER_IMAGE],
  },
};

const faqs: readonly FaqItem[] = [
  {
    question: "How do I calculate asphalt tonnage?",
    answer: "Find the paved area, multiply by compacted thickness to get volume, multiply volume by compacted mix density to get weight, then divide pounds by 2,000 for short tons or kilograms by 1,000 for metric tonnes.",
  },
  {
    question: "What density does this asphalt calculator use?",
    answer: "The starting value is 145 lb/ft³, about 2,323 kg/m³. It is an editable planning default, not a value for every mix; replace it with your supplier's job-mix or measured density when available.",
  },
  {
    question: "Is blacktop calculated differently from asphalt?",
    answer: "Blacktop is a common informal name for asphalt pavement, so the same area, thickness, density, and weight workflow applies. The actual mixture and compacted density can still vary by project.",
  },
  {
    question: "Does the asphalt estimate include waste?",
    answer: "Only if you enter a waste allowance. The calculator starts at 0% and shows base tonnage separately from the order quantity after your allowance.",
  },
  {
    question: "Can this estimate replace a supplier quantity or contractor quote?",
    answer: "No. It is a planning estimate and does not account for every site condition, mix specification, compaction result, minimum order, delivery rule, tax, or contractor scope.",
  },
];

export default function AsphaltCalculatorPage() {
  return (
    <SiteShell currentPath="/asphalt-calculator">
      <main className="page-main">
        <header className="tool-intro shell">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span aria-hidden="true">/</span><span>Material calculator</span>
          </nav>
          <p className="eyebrow">Material workflow</p>
          <h1>Asphalt Calculator</h1>
          <p className="tool-intro__lede">
            Estimate asphalt or blacktop volume, weight, and tonnage from
            dimensions or a known area. Adjust density, waste, and material
            price instead of relying on hidden assumptions.
          </p>
          <div className="fact-strip" role="list" aria-label="Calculator scope">
            <span role="listitem">US + metric</span><span role="listitem">Short tons + tonnes</span><span role="listitem">Share + print locally</span>
          </div>
          <LanguageSwitcher currentLocale="en" />
        </header>

        <div className="shell calculator-wrap">
          <AsphaltEstimator mode="material" />
        </div>

        <div className="shell reading-grid">
          <div>
            <section className="content-section" aria-labelledby="how-it-works">
              <p className="eyebrow">From surface to order quantity</p>
              <h2 id="how-it-works">How the asphalt tonnage estimate works</h2>
              <ol className="numbered-explainer">
                <li><strong>Measure area.</strong> Use length × width for a rectangle, or enter a known total after dividing an irregular surface into measurable shapes.</li>
                <li><strong>Apply compacted thickness.</strong> Area × thickness produces compacted volume. The calculator converts inches to feet or centimeters to meters before multiplying.</li>
                <li><strong>Convert volume to weight.</strong> Volume × compacted mix density produces pounds or kilograms.</li>
                <li><strong>Convert weight to tonnage.</strong> Pounds ÷ 2,000 gives US short tons; kilograms ÷ 1,000 gives metric tonnes.</li>
                <li><strong>Add only your chosen allowance.</strong> Base tonnage × (1 + waste percentage ÷ 100) gives the displayed order quantity.</li>
              </ol>
            </section>

            <section className="content-section" aria-labelledby="density-assumption">
              <p className="eyebrow">The most important assumption</p>
              <h2 id="density-assumption">Why density is editable</h2>
              <p>
                The starting density is 145 lb/ft³ (about 2,323 kg/m³). The
                Asphalt Institute says asphalt mixture typically weighs 142–148
                lb/ft³ in place, while an EPA planning table uses 1.95 short tons
                per cubic yard, about 144.4 lb/ft³. Mix design and compaction can
                change the real value, so supplier information should take
                priority over this default.
              </p>
              <p>
                <a href="https://www.asphaltinstitute.org/engineering/engineering-faqs/">Read the Asphalt Institute engineering FAQ</a>
                {" · "}
                <a href="https://www.epa.gov/sites/production/files/2015-04/documents/methodology_enivro_footprint.pdf">Review the EPA methodology table</a>
              </p>
            </section>

            <section className="content-section" aria-labelledby="one-material-workflow">
              <p className="eyebrow">One task, several common names</p>
              <h2 id="one-material-workflow">Asphalt tonnage and blacktop use the same workflow</h2>
              <p>
                An asphalt tonnage calculator emphasizes the final weight, while
                a blacktop calculator uses an informal name for the same paving
                material task. Both still require area, compacted thickness, and
                compacted density. This page keeps those equivalent searches on
                one calculator so the assumptions and shared result stay consistent.
              </p>
              <div className="comparison-grid">
                <div>
                  <h3>Starting with area and depth?</h3>
                  <p>Use the calculator above for volume, base tonnage, an explicit allowance, and optional supplier price.</p>
                  <Link href="/how-to-calculate-asphalt-tonnage">Follow the tonnage formula step by step →</Link>
                </div>
                <div>
                  <h3>Starting with known volume?</h3>
                  <p>Skip the area and thickness fields and convert cubic yards or cubic meters directly to weight.</p>
                  <Link href="/asphalt-weight-calculator">Convert asphalt volume to weight →</Link>
                </div>
              </div>
            </section>

            <FaqSection items={faqs} />
          </div>

          <aside className="reading-aside" aria-label="Planning notes">
            <div className="aside-card">
              <p className="eyebrow">Before ordering</p>
              <h2>Confirm four inputs</h2>
              <ul>
                <li>Finished paved area</li>
                <li>Compacted design thickness</li>
                <li>Supplier mix density</li>
                <li>Order increments and allowance</li>
              </ul>
            </div>
            <div className="aside-card aside-card--plain">
              <h2>Need a budget workflow?</h2>
              <p>Use separate fields for preparation, paving, delivery, and other known allowances.</p>
              <Link href="/asphalt-driveway-cost-calculator">Open the driveway cost calculator →</Link>
            </div>
          </aside>
        </div>

        <footer className="content-meta shell">
          <p><strong>Author:</strong> Asphalt Calculator Editorial Team</p>
          <p><strong>Published and reviewed:</strong> August 18, 2026</p>
          <p><strong>Scope:</strong> Mathematical planning estimate; not engineering or bidding advice.</p>
          <Link href="/methodology">Review formulas, sources, limits, and rounding</Link>
        </footer>
      </main>
    </SiteShell>
  );
}
