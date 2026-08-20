import type { Metadata } from "next";
import Link from "next/link";
import { SOCIAL_IMAGE, TWITTER_IMAGE } from "../../lib/seo";
import { SiteShell } from "../_components/SiteShell";

export const metadata: Metadata = {
  title: "Methodology: Asphalt Estimate Formulas & Sources",
  description:
    "Audit the asphalt calculator formulas, density default, unit conversions, validation limits, rounding, cost boundaries, and primary sources.",
  alternates: { canonical: "/methodology" },
  openGraph: {
    type: "article",
    url: "/methodology",
    title: "Methodology: Asphalt Estimate Formulas & Sources",
    description: "See the exact formulas, defaults, validation limits, and sources behind each estimate.",
    images: [SOCIAL_IMAGE],
  },
  twitter: {
    card: "summary",
    title: "Methodology: Asphalt Estimate Formulas & Sources",
    description: "See the exact formulas, defaults, validation limits, and sources behind each estimate.",
    images: [TWITTER_IMAGE],
  },
};

export default function MethodologyPage() {
  return (
    <SiteShell currentPath="/methodology">
      <main className="page-main prose-page shell">
        <nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span>Methodology</span></nav>
        <header className="prose-header">
          <p className="eyebrow">Audit the estimate</p>
          <h1>Methodology, formulas, and sources</h1>
          <p>Every output comes from the inputs shown in the calculator. This page documents conversions, defaults, validation, rounding, and what the site deliberately does not infer.</p>
          <div className="byline"><span>By Asphalt Calculator Editorial Team</span><span>Published and reviewed August 18, 2026</span></div>
        </header>

        <section aria-labelledby="material-formula"><h2 id="material-formula">Material formula</h2>
          <ol>
            <li><strong>Area:</strong> length × width, or a known total area supplied by the user.</li>
            <li><strong>Compacted volume:</strong> area × compacted thickness after both values are in compatible units.</li>
            <li><strong>Base weight:</strong> compacted volume × compacted mix density.</li>
            <li><strong>Base tonnage:</strong> pounds ÷ 2,000 for US short tons; kilograms ÷ 1,000 for metric tonnes.</li>
            <li><strong>Order quantity:</strong> base tonnage × (1 + waste percentage ÷ 100).</li>
            <li><strong>Optional material cost:</strong> order quantity × the user-entered price per short ton or metric tonne.</li>
          </ol>
        </section>

        <section aria-labelledby="density-source"><h2 id="density-source">Density default and its limit</h2>
          <p>The starting density is 145 lb/ft³ (about 2,323 kg/m³). It is a rounded planning value, not a specification.</p>
          <ul>
            <li>The <a href="https://www.asphaltinstitute.org/engineering/engineering-faqs/">Asphalt Institute engineering FAQ</a> states that asphalt mixture typically weighs 142–148 lb/ft³ in place and describes the volume × density ÷ 2,000 workflow.</li>
            <li>The <a href="https://www.epa.gov/sites/production/files/2015-04/documents/methodology_enivro_footprint.pdf">EPA cleanup-footprint methodology</a> uses 1.95 short tons per cubic yard for asphalt, equivalent to about 144.4 lb/ft³.</li>
          </ul>
          <p>A supplier’s job-mix or measured compacted density should replace the default when available.</p>
        </section>

        <section aria-labelledby="unit-conversions"><h2 id="unit-conversions">Unit conversions</h2>
          <div className="table-wrap"><table><thead><tr><th>Conversion</th><th>Value used</th></tr></thead><tbody>
            <tr><td>International foot</td><td>0.3048 meter</td></tr>
            <tr><td>Square meter</td><td>10.7639104167 square feet</td></tr>
            <tr><td>Inch</td><td>2.54 centimeters</td></tr>
            <tr><td>Pound</td><td>0.45359237 kilogram</td></tr>
            <tr><td>Short ton</td><td>2,000 pounds</td></tr>
            <tr><td>Metric tonne</td><td>1,000 kilograms</td></tr>
            <tr><td>Cubic yard</td><td>27 cubic feet</td></tr>
          </tbody></table></div>
          <p>References: <a href="https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors">NIST Guide to the SI, Appendix B</a>, <a href="https://www.nist.gov/document/2026-nist-handbook-44-appendix-b">NIST Handbook 44 Appendix B</a>, and the <a href="https://www.fhwa.dot.gov/publications/research/infrastructure/pavements/10065/10065.pdf">FHWA conversion table</a>.</p>
        </section>

        <section aria-labelledby="cost-boundary"><h2 id="cost-boundary">Cost formula and factual boundary</h2>
          <p>The driveway workflow adds material cost, preparation rate × area, paving rate × area, delivery allowance, and one other fixed allowance. Every price starts at zero and comes from the user. The site does not publish or infer a national price.</p>
          <p>Cost per square foot or square meter is the user-built total divided by the entered paved area. It describes that scenario only; it is not a market rate or quote.</p>
        </section>

        <section aria-labelledby="validation-rounding"><h2 id="validation-rounding">Validation, boundaries, and rounding</h2>
          <ul>
            <li>Inputs and their converted or derived values must remain finite. Each dimension is capped at 1,000,000 ft (304,800 m); area is limited to 0.000001–100,000,000 ft²; compacted thickness is limited to 0.001–120 in; density must be 50–250 lb/ft³ equivalent.</li>
            <li>Waste is limited to 0–100%; price and allowance fields reject negative and non-finite values.</li>
            <li>Calculations retain full floating-point precision. The interface rounds only displayed values, generally to two decimals and tonnage to three.</li>
          </ul>
        </section>

        <section aria-labelledby="not-design"><h2 id="not-design">What this methodology cannot decide</h2>
          <p>The calculator does not design pavement thickness, base, grading, drainage, compaction procedure, mix, reinforcement, edges, or traffic capacity. Those choices depend on site conditions and local requirements and belong with a qualified local professional.</p>
          <div className="button-row"><Link className="button button--primary" href="/asphalt-calculator">Use the material calculator</Link><Link className="button button--secondary" href="/asphalt-driveway-cost-calculator">Build a driveway allowance</Link></div>
        </section>
      </main>
    </SiteShell>
  );
}
