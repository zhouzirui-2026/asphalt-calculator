import type { Metadata } from "next";
import Link from "next/link";
import { SOCIAL_IMAGE, TWITTER_IMAGE } from "../../../lib/seo";
import { AsphaltEstimator } from "../../_components/AsphaltEstimator";
import { FaqSection, type FaqItem } from "../../_components/FaqSection";
import { SiteShell } from "../../_components/SiteShell";

export const metadata: Metadata = {
  title: "How to Calculate Asphalt Tonnage: Formula & Example",
  description:
    "Learn the asphalt tonnage formula step by step, check US and metric examples, then calculate tons from area, compacted thickness, and density.",
  alternates: { canonical: "/how-to-calculate-asphalt-tonnage" },
  openGraph: {
    type: "article",
    url: "/how-to-calculate-asphalt-tonnage",
    title: "How to Calculate Asphalt Tonnage",
    description:
      "Use the area × thickness × density formula, follow worked examples, and check the result in a calculator.",
    images: [SOCIAL_IMAGE],
  },
  twitter: {
    card: "summary",
    title: "How to Calculate Asphalt Tonnage",
    description:
      "Use the area × thickness × density formula, follow worked examples, and check the result in a calculator.",
    images: [TWITTER_IMAGE],
  },
};

const faqs: readonly FaqItem[] = [
  {
    question: "What is the formula for asphalt tonnage?",
    answer: "For US short tons, multiply area in square feet by compacted thickness in inches divided by 12, multiply by compacted density in pounds per cubic foot, then divide by 2,000.",
  },
  {
    question: "How do you calculate asphalt tonnage from length and width?",
    answer: "Multiply length by width to get area, multiply area by compacted thickness in compatible units to get volume, multiply volume by compacted density, then convert the resulting weight to short tons or metric tonnes.",
  },
  {
    question: "How do you calculate tons of asphalt from square feet?",
    answer: "Square footage alone is not enough. You also need the compacted thickness and compacted mix density. The same square footage requires more tonnage when the layer is thicker or the mix is denser.",
  },
  {
    question: "Which asphalt density should I use?",
    answer: "Use the compacted density from the supplier, job-mix formula, or project documents when available. The calculator starts at an editable 145 lb/ft³, about 2,323 kg/m³, as a planning value rather than a universal specification.",
  },
  {
    question: "Does calculated tonnage include a waste allowance?",
    answer: "Base tonnage does not. Apply a separate allowance only after calculating base weight, and use a percentage supported by the project measurements, supplier guidance, order increments, and site conditions.",
  },
];

export default function HowToCalculateAsphaltTonnagePage() {
  return (
    <SiteShell currentPath="/how-to-calculate-asphalt-tonnage">
      <main className="page-main">
        <header className="tool-intro shell">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span aria-hidden="true">/</span><span>Tonnage formula guide</span>
          </nav>
          <p className="eyebrow">Formula guide + calculator</p>
          <h1>How to Calculate Asphalt Tonnage</h1>
          <p className="tool-intro__lede">
            Calculate compacted volume from area and thickness, multiply by the
            compacted mix density, then convert the weight to US short tons or
            metric tonnes. Keep any order allowance as a separate final step.
          </p>
          <div className="formula-box formula-box--hero">
            <code>US short tons = area ft² × thickness in ÷ 12 × density lb/ft³ ÷ 2,000</code>
          </div>
        </header>

        <div className="shell calculator-wrap">
          <AsphaltEstimator mode="material" />
        </div>

        <div className="shell reading-grid">
          <div>
            <section className="content-section" aria-labelledby="tonnage-steps">
              <p className="eyebrow">Show every unit change</p>
              <h2 id="tonnage-steps">Calculate asphalt tons in five steps</h2>
              <ol className="numbered-explainer">
                <li><strong>Find the paved area.</strong> For a rectangle, multiply length by width. Add measured sections before using a known total area.</li>
                <li><strong>Convert compacted thickness.</strong> Divide inches by 12 to use feet, or divide centimeters by 100 to use meters.</li>
                <li><strong>Calculate compacted volume.</strong> Multiply area by the converted compacted thickness.</li>
                <li><strong>Calculate base weight.</strong> Multiply compacted volume by a density stated in matching cubic units.</li>
                <li><strong>Convert and apply an allowance separately.</strong> Divide pounds by 2,000 for short tons or kilograms by 1,000 for metric tonnes, then add only the project-specific allowance you choose.</li>
              </ol>
            </section>

            <section className="content-section" aria-labelledby="us-example">
              <p className="eyebrow">Worked US example</p>
              <h2 id="us-example">1,000 ft² at 3 inches compacted</h2>
              <div className="table-wrap" role="group" aria-label="US asphalt tonnage example">
                <table>
                  <caption>Example using 145 lb/ft³ and a separately chosen 5% allowance</caption>
                  <thead><tr><th scope="col">Step</th><th scope="col">Calculation</th><th scope="col">Result</th></tr></thead>
                  <tbody>
                    <tr><td>Volume</td><td>1,000 ft² × 3 in ÷ 12</td><td>250 ft³</td></tr>
                    <tr><td>Weight</td><td>250 ft³ × 145 lb/ft³</td><td>36,250 lb</td></tr>
                    <tr><td>Base tonnage</td><td>36,250 lb ÷ 2,000</td><td>18.125 short tons</td></tr>
                    <tr><td>With 5% allowance</td><td>18.125 × 1.05</td><td>19.031 short tons</td></tr>
                  </tbody>
                </table>
              </div>
              <p>
                The allowance is shown only to demonstrate the final operation;
                the calculator starts at 0% so it does not choose one for you.
              </p>
            </section>

            <section className="content-section" aria-labelledby="metric-example">
              <p className="eyebrow">Worked metric example</p>
              <h2 id="metric-example">100 m² at 5 centimeters compacted</h2>
              <div className="formula-box">
                <code>100 m² × 0.05 m = 5 m³</code>
                <p>5 m³ × 2,323 kg/m³ = 11,615 kg</p>
                <p>11,615 kg ÷ 1,000 = 11.615 metric tonnes before any allowance</p>
              </div>
              <p>
                The density is rounded for the written example. The calculator
                retains full precision when it converts between unit systems.
              </p>
            </section>

            <section className="content-section" aria-labelledby="common-errors">
              <p className="eyebrow">Keep the model consistent</p>
              <h2 id="common-errors">Four common tonnage calculation errors</h2>
              <ul className="check-list check-list--light">
                <li>Multiplying square feet by inches without converting inches to feet</li>
                <li>Using a generic density after project-specific supplier data is available</li>
                <li>Combining loose volume with a compacted in-place density</li>
                <li>Hiding the order allowance inside the density or base tonnage</li>
              </ul>
              <p>
                If you already know the compacted volume, skip the area and
                thickness steps and use the <Link href="/asphalt-weight-calculator">asphalt weight calculator</Link>.
              </p>
            </section>

            <FaqSection items={faqs} heading="Asphalt tonnage formula questions" />
          </div>

          <aside className="reading-aside" aria-label="Asphalt tonnage guide notes">
            <div className="aside-card">
              <p className="eyebrow">The model</p>
              <h2>Area → volume → weight → tons</h2>
              <p>Each arrow is a unit conversion you can reproduce by hand.</p>
            </div>
            <div className="aside-card aside-card--plain">
              <h2>Why 145 lb/ft³?</h2>
              <p>It is an editable planning start within a published in-place range, not a value for every asphalt mix.</p>
              <a href="https://www.asphaltinstitute.org/engineering/engineering-faqs/">Read the Asphalt Institute source →</a>
            </div>
          </aside>
        </div>

        <footer className="content-meta shell">
          <p><strong>Author:</strong> Asphalt Calculator Editorial Team</p>
          <p><strong>Prepared and source-reviewed:</strong> August 24, 2026</p>
          <p><strong>Scope:</strong> Reproducible planning math; not pavement design, supplier quantity, or a purchase order.</p>
          <Link href="/methodology">Review formulas, sources, validation, and rounding</Link>
        </footer>
      </main>
    </SiteShell>
  );
}
