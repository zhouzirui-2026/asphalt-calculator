import type { Metadata } from "next";
import Link from "next/link";
import { SOCIAL_IMAGE, TWITTER_IMAGE } from "../lib/seo";
import { SiteShell } from "./_components/SiteShell";

export const metadata: Metadata = {
  title: "Asphalt Project Planning, Without Hidden Assumptions",
  description:
    "Choose a material or driveway cost workflow and see every asphalt estimate formula, unit, and assumption.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title: "Asphalt Project Planning, Without Hidden Assumptions",
    description:
      "Choose a material or driveway cost workflow and see every formula, unit, and assumption.",
    images: [SOCIAL_IMAGE],
  },
  twitter: {
    card: "summary",
    title: "Asphalt Project Planning, Without Hidden Assumptions",
    description:
      "Choose a material or driveway cost workflow and see every formula, unit, and assumption.",
    images: [TWITTER_IMAGE],
  },
};

export default function Home() {
  return (
    <SiteShell currentPath="/">
      <main>
        <section className="hero shell" aria-labelledby="home-title">
          <div className="hero__copy">
            <p className="eyebrow">Field math, made inspectable</p>
            <h1 id="home-title">Plan the asphalt. See the math.</h1>
            <p className="hero__lede">
              Estimate material or build a driveway cost allowance with US and
              metric units, editable assumptions, and no account required.
            </p>
            <div className="button-row">
              <Link className="button button--primary" href="/asphalt-calculator">
                Estimate asphalt material
              </Link>
              <Link
                className="button button--secondary"
                href="/asphalt-driveway-cost-calculator"
              >
                Plan driveway costs
              </Link>
            </div>
            <p className="quiet-note">
              Planning estimates only — verify mix, quantity, and pricing with
              your local supplier or contractor.
            </p>
          </div>

          <aside className="hero__panel" aria-label="What the calculators show">
            <p className="panel-kicker">One transparent workflow</p>
            <ol className="process-list">
              <li>
                <span>01</span>
                <div><strong>Measure</strong><small>Area and compacted depth</small></div>
              </li>
              <li>
                <span>02</span>
                <div><strong>Convert</strong><small>Volume × editable density</small></div>
              </li>
              <li>
                <span>03</span>
                <div><strong>Plan</strong><small>Tonnage, waste, and optional cost</small></div>
              </li>
            </ol>
          </aside>
        </section>

        <section className="section shell" aria-labelledby="choose-workflow">
          <div className="section-heading">
            <p className="eyebrow">Choose by job to be done</p>
            <h2 id="choose-workflow">Start with the information you already have</h2>
            <p>
              Equivalent asphalt, tonnage, and blacktop searches share one
              material workflow. Separate pages exist only when the inputs or
              the outcome genuinely change.
            </p>
          </div>
          <div className="workflow-grid">
            <article className="workflow-card workflow-card--amber">
              <p className="card-index">Material / tonnage</p>
              <h3>How much asphalt should I order?</h3>
              <p>
                Convert dimensions or known area into volume, weight, short tons,
                metric tonnes, waste allowance, and optional material cost.
              </p>
              <Link href="/asphalt-calculator">
                Open the material calculator <span aria-hidden="true">→</span>
              </Link>
            </article>
            <article className="workflow-card workflow-card--slate">
              <p className="card-index">Driveway cost allowance</p>
              <h3>What budget inputs should I collect?</h3>
              <p>
                Combine material with your own preparation, paving, delivery,
                and fixed allowances. The result is not a contractor quote.
              </p>
              <Link href="/asphalt-driveway-cost-calculator">
                Open the cost calculator <span aria-hidden="true">→</span>
              </Link>
            </article>
            <article className="workflow-card workflow-card--sand">
              <p className="card-index">Known volume / unit weight</p>
              <h3>What does this asphalt volume weigh?</h3>
              <p>
                Convert compacted cubic yards or cubic meters directly into
                pounds, kilograms, short tons, and metric tonnes.
              </p>
              <Link href="/asphalt-weight-calculator">
                Open the weight calculator <span aria-hidden="true">→</span>
              </Link>
            </article>
            <article className="workflow-card workflow-card--surface">
              <p className="card-index">Formula / worked examples</p>
              <h3>How is asphalt tonnage calculated?</h3>
              <p>
                Follow area × thickness × density through US and metric
                examples, then verify the inputs in the calculator.
              </p>
              <Link href="/how-to-calculate-asphalt-tonnage">
                Read the tonnage guide <span aria-hidden="true">→</span>
              </Link>
            </article>
          </div>

          <aside className="related-tool-note" aria-labelledby="related-tool-title">
            <div>
              <p className="eyebrow">Another tool we maintain</p>
              <h3 id="related-tool-title">Planning a packaged load or shipment?</h3>
            </div>
            <p>
              <a href="https://pallet-calculator.com/">Pallet Calculator</a>{" "}
              helps compare pallet layouts, load dimensions, weight, and container
              floor capacity with visible assumptions.
            </p>
          </aside>
        </section>

        <section className="trust-band">
          <div className="shell trust-band__grid">
            <div>
              <p className="eyebrow eyebrow--light">Built for verification</p>
              <h2>Defaults are starting points, not hidden facts.</h2>
            </div>
            <ul className="check-list">
              <li>Every formula is shown</li>
              <li>Density and waste are editable</li>
              <li>No personal information is collected</li>
              <li>Sources and limits are visible</li>
            </ul>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
