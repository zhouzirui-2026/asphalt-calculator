import type { Metadata } from "next";
import Link from "next/link";
import { SOCIAL_IMAGE, TWITTER_IMAGE } from "../../../lib/seo";
import { AsphaltEstimator } from "../../_components/AsphaltEstimator";
import { FaqSection, type FaqItem } from "../../_components/FaqSection";
import { SiteShell } from "../../_components/SiteShell";

export const metadata: Metadata = {
  title: "Asphalt Driveway Cost Calculator",
  description:
    "Use an asphalt driveway calculator for material and planning cost from local preparation, paving, delivery, and other inputs. No national price.",
  alternates: { canonical: "/asphalt-driveway-cost-calculator" },
  openGraph: {
    type: "website",
    url: "/asphalt-driveway-cost-calculator",
    title: "Asphalt Driveway Cost Calculator",
    description:
      "Combine asphalt quantity with your own local cost inputs and see every included allowance.",
    images: [SOCIAL_IMAGE],
  },
  twitter: {
    card: "summary",
    title: "Asphalt Driveway Cost Calculator",
    description:
      "Combine asphalt quantity with your own local cost inputs and see every included allowance.",
    images: [TWITTER_IMAGE],
  },
};

const faqs: readonly FaqItem[] = [
  {
    question: "How does the asphalt driveway cost calculator work?",
    answer: "It estimates asphalt quantity from area, compacted thickness, density, and waste, then adds only the local material price, square-area rates, and fixed allowances you enter.",
  },
  {
    question: "Does this page use a national asphalt cost per square foot?",
    answer: "No. Material, preparation, paving, delivery, and other cost fields start at zero because actual prices and scope vary by location, project, supplier, contractor, and timing.",
  },
  {
    question: "What should I enter for driveway thickness?",
    answer: "Enter the compacted design thickness from your project plan or a qualified local professional. This site does not select a thickness because suitable pavement structure depends on soil, base, drainage, traffic, climate, and local requirements.",
  },
  {
    question: "Is the result a contractor quote?",
    answer: "No. It is a user-built planning allowance and may omit demolition, grading, base repair, drainage, permits, mobilization, minimum charges, taxes, access constraints, or other contractor scope.",
  },
  {
    question: "Why can I see a cost per square foot or square meter?",
    answer: "The calculator divides the combined allowance by the paved area you entered. That output describes only your selected inputs and is not a published market rate.",
  },
  {
    question: "What if I only need asphalt quantity for a driveway?",
    answer: "Leave all cost inputs at zero or use the main asphalt calculator for a material-only result. Both workflows keep area, compacted thickness, density, and any allowance visible.",
  },
];

export default function AsphaltDrivewayCostPage() {
  return (
    <SiteShell currentPath="/asphalt-driveway-cost-calculator">
      <main className="page-main">
        <header className="tool-intro tool-intro--cost shell">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span aria-hidden="true">/</span><span>Driveway cost</span>
          </nav>
          <p className="eyebrow">Cost workflow</p>
          <h1>Asphalt Driveway Cost Calculator</h1>
          <p className="tool-intro__lede">
            Use this asphalt driveway calculator to estimate material and build
            a planning allowance from current local inputs. Material and
            contractor scope stay separate, and every cost field starts at zero
            until you provide a value.
          </p>
          <div className="scope-callout">
            <strong>This is not a contractor quote.</strong>
            <span>Use it to organize known costs and spot missing scope before requesting or comparing written bids.</span>
          </div>
        </header>

        <div className="shell calculator-wrap">
          <AsphaltEstimator mode="cost" />
        </div>

        <div className="shell reading-grid">
          <div>
            <section className="content-section" aria-labelledby="cost-formula">
              <p className="eyebrow">Your inputs, not a national price</p>
              <h2 id="cost-formula">How the driveway cost allowance is built</h2>
              <p>
                The material calculation uses the same visible area × thickness
                × density workflow as the <Link href="/asphalt-calculator">asphalt tonnage calculator</Link>.
                The cost page then adds the categories below without estimating
                any missing price on your behalf.
              </p>
              <div className="formula-box">
                <code>Total = material + preparation + paving + delivery + other</code>
                <p>Cost per area = total ÷ paved area</p>
              </div>
            </section>

            <section className="content-section" aria-labelledby="scope-table-title">
              <p className="eyebrow">Scope check</p>
              <h2 id="scope-table-title">What the displayed total does and does not include</h2>
              <div className="comparison-grid">
                <div>
                  <h3>Included when you enter it</h3>
                  <ul><li>Asphalt material</li><li>Preparation rate × paved area</li><li>Paving rate × paved area</li><li>Delivery allowance</li><li>One other identified fixed allowance</li></ul>
                </div>
                <div>
                  <h3>Never inferred by this site</h3>
                  <ul><li>Demolition or disposal</li><li>Base, grading, or drainage design</li><li>Permits, taxes, or minimum charges</li><li>Mobilization and access constraints</li><li>Warranty or contractor margin</li></ul>
                </div>
              </div>
            </section>

            <FaqSection items={faqs} heading="Driveway cost questions" />
          </div>

          <aside className="reading-aside" aria-label="Cost planning notes">
            <div className="aside-card aside-card--amber">
              <p className="eyebrow">Better comparison</p>
              <h2>Ask each bidder for the same scope.</h2>
              <p>Compare dimensions, compacted thickness, mix, base work, drainage, edges, schedule, and exclusions — not only the bottom-line price.</p>
            </div>
            <div className="aside-card aside-card--plain">
              <h2>Only need material?</h2>
              <p>Use the main tool for volume, weight, tonnage, waste, and optional supplier price.</p>
              <Link href="/asphalt-calculator">Open the asphalt calculator →</Link>
            </div>
          </aside>
        </div>

        <footer className="content-meta shell">
          <p><strong>Author:</strong> Asphalt Calculator Editorial Team</p>
          <p><strong>Published and reviewed:</strong> August 18, 2026</p>
          <p><strong>Price policy:</strong> No fixed national price is published; cost outputs come only from user-entered values.</p>
          <Link href="/methodology">Review formulas, sources, limits, and rounding</Link>
        </footer>
      </main>
    </SiteShell>
  );
}
