import type { Metadata } from "next";
import Link from "next/link";
import { SOCIAL_IMAGE, TWITTER_IMAGE } from "../../lib/seo";
import { AsphaltWeightConverter } from "../_components/AsphaltWeightConverter";
import { FaqSection, type FaqItem } from "../_components/FaqSection";
import { SiteShell } from "../_components/SiteShell";

export const metadata: Metadata = {
  title: "Asphalt Weight Calculator: Volume to Tons",
  description:
    "Convert compacted asphalt volume in cubic yards or cubic meters to pounds, kilograms, short tons, and metric tonnes with editable density.",
  alternates: { canonical: "/asphalt-weight-calculator" },
  openGraph: {
    type: "website",
    url: "/asphalt-weight-calculator",
    title: "Asphalt Weight Calculator: Volume to Tons",
    description:
      "Convert a known compacted asphalt volume to weight and see the unit-weight math.",
    images: [SOCIAL_IMAGE],
  },
  twitter: {
    card: "summary",
    title: "Asphalt Weight Calculator: Volume to Tons",
    description:
      "Convert a known compacted asphalt volume to weight and see the unit-weight math.",
    images: [TWITTER_IMAGE],
  },
};

const faqs: readonly FaqItem[] = [
  {
    question: "How much does one cubic yard of asphalt weigh?",
    answer: "At the editable starting density of 145 lb/ft³, one compacted cubic yard converts to 3,915 lb or 1.9575 US short tons. Actual compacted mix density varies, so replace the default with supplier or job-mix data when available.",
  },
  {
    question: "What is the unit weight of asphalt?",
    answer: "Unit weight is the weight per unit of volume. This page starts at 145 lb/ft³, about 2,323 kg/m³, and shows the equivalent short tons per cubic yard and metric tonnes per cubic meter.",
  },
  {
    question: "How do I convert cubic yards of asphalt to tons?",
    answer: "Multiply cubic yards by 27 to get cubic feet, multiply by compacted density in pounds per cubic foot, then divide by 2,000 to get US short tons.",
  },
  {
    question: "Should I use loose or compacted asphalt volume?",
    answer: "Use a volume and density that describe the same material condition. This calculator is framed around compacted in-place volume and compacted density; mixing a loose volume with compacted density produces a misleading result.",
  },
  {
    question: "Can this calculator find volume from driveway dimensions?",
    answer: "No. This page starts with a known volume. Use the main asphalt calculator when you need to calculate volume and tonnage from area and compacted thickness.",
  },
];

export default function AsphaltWeightCalculatorPage() {
  return (
    <SiteShell currentPath="/asphalt-weight-calculator">
      <main className="page-main">
        <header className="tool-intro shell">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span aria-hidden="true">/</span><span>Asphalt weight</span>
          </nav>
          <p className="eyebrow">Volume-to-weight workflow</p>
          <h1>Asphalt Weight Calculator</h1>
          <p className="tool-intro__lede">
            Convert a known compacted asphalt volume into pounds, kilograms,
            US short tons, and metric tonnes. The density stays visible and
            editable because unit weight changes with the mix and compaction.
          </p>
          <div className="fact-strip" role="list" aria-label="Calculator scope">
            <span role="listitem">Cubic yards + m³</span><span role="listitem">Pounds + kilograms</span><span role="listitem">Short tons + tonnes</span>
          </div>
        </header>

        <div className="shell calculator-wrap">
          <AsphaltWeightConverter />
        </div>

        <div className="shell reading-grid">
          <div>
            <section className="content-section" aria-labelledby="weight-formula">
              <p className="eyebrow">One conversion, two unit systems</p>
              <h2 id="weight-formula">Asphalt weight is volume × density</h2>
              <div className="formula-box">
                <code>Weight = compacted volume × compacted density</code>
                <p>US short tons = pounds ÷ 2,000</p>
                <p>Metric tonnes = kilograms ÷ 1,000</p>
              </div>
              <p>
                In US units, multiply cubic yards by 27 before applying a density
                stated in lb/ft³. In metric units, cubic meters and kg/m³ are
                already compatible. The converter displays both systems so the
                result can be checked without changing the physical quantity.
              </p>
            </section>

            <section className="content-section" aria-labelledby="unit-weight-table">
              <p className="eyebrow">Illustrative density range</p>
              <h2 id="unit-weight-table">Weight per cubic yard changes with density</h2>
              <p>
                The Asphalt Institute reports that asphalt mixture typically
                weighs 142–148 lb/ft³ in place. The table applies the same
                conversion at three points in that range; it is not a substitute
                for a project-specific mix value.
              </p>
              <div className="table-wrap" role="group" aria-label="Asphalt unit weight table">
                <table>
                  <caption>Compacted asphalt weight at selected in-place densities</caption>
                  <thead><tr><th scope="col">Density</th><th scope="col">Weight per yd³</th><th scope="col">Metric equivalent</th></tr></thead>
                  <tbody>
                    <tr><td>142 lb/ft³</td><td>1.917 short tons</td><td>2.275 t/m³</td></tr>
                    <tr><td>145 lb/ft³</td><td>1.9575 short tons</td><td>2.323 t/m³</td></tr>
                    <tr><td>148 lb/ft³</td><td>1.998 short tons</td><td>2.371 t/m³</td></tr>
                  </tbody>
                </table>
              </div>
              <p>
                <a href="https://www.asphaltinstitute.org/engineering/engineering-faqs/">Review the Asphalt Institute engineering FAQ</a>
                {" · "}
                <Link href="/methodology">See all conversion sources and limits</Link>
              </p>
            </section>

            <FaqSection items={faqs} heading="Asphalt weight and unit weight questions" />
          </div>

          <aside className="reading-aside" aria-label="Asphalt weight planning notes">
            <div className="aside-card">
              <p className="eyebrow">Use matching conditions</p>
              <h2>Volume and density must describe the same state.</h2>
              <p>Do not combine loose truck volume with a compacted in-place density.</p>
            </div>
            <div className="aside-card aside-card--plain">
              <h2>Starting from area?</h2>
              <p>Calculate compacted volume, weight, tonnage, allowance, and optional material cost from dimensions.</p>
              <Link href="/asphalt-calculator">Open the asphalt tonnage workflow →</Link>
            </div>
          </aside>
        </div>

        <footer className="content-meta shell">
          <p><strong>Author:</strong> Asphalt Calculator Editorial Team</p>
          <p><strong>Prepared and source-reviewed:</strong> August 24, 2026</p>
          <p><strong>Scope:</strong> Compacted volume-to-weight conversion; not an order quantity or pavement design.</p>
          <Link href="/methodology">Review formulas, sources, limits, and rounding</Link>
        </footer>
      </main>
    </SiteShell>
  );
}
