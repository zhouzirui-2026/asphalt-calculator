import type { Metadata } from "next";
import Link from "next/link";
import { languageAlternates } from "../../../../site-config.mjs";
import { SOCIAL_IMAGE, TWITTER_IMAGE } from "../../../../lib/seo";
import { FaqSection, type FaqItem } from "../../../_components/FaqSection";
import { LanguageSwitcher } from "../../../_components/LanguageSwitcher";
import { LocalizedMaterialEstimator } from "../../../_components/LocalizedMaterialEstimator";
import { LocalizedSiteShell } from "../../../_components/LocalizedSiteShell";

const alternates = languageAlternates("materialCalculator");

export const metadata: Metadata = {
  title: "Asphalt-Rechner: Tonnen, Volumen & Kosten",
  description: "Asphaltmenge in Tonnen aus Fläche, verdichteter Dicke und Dichte berechnen. Mit Mengenzuschlag, Euro-Preis und offenem Rechenweg.",
  alternates: { canonical: "/de/asphalt-rechner", languages: alternates },
  openGraph: {
    type: "website",
    url: "/de/asphalt-rechner",
    locale: "de_DE",
    alternateLocale: ["en_US", "fr_FR"],
    title: "Asphalt-Rechner: Tonnen, Volumen & Kosten",
    description: "Asphaltbedarf mit metrischen Eingaben, editierbarer Dichte und sichtbarer Formel planen.",
    images: [SOCIAL_IMAGE],
  },
  twitter: {
    card: "summary",
    title: "Asphalt-Rechner: Tonnen, Volumen & Kosten",
    description: "Asphaltbedarf mit metrischen Eingaben, editierbarer Dichte und sichtbarer Formel planen.",
    images: [TWITTER_IMAGE],
  },
};

const faqs: readonly FaqItem[] = [
  {
    question: "Wie berechne ich die benötigten Tonnen Asphalt?",
    answer: "Fläche in Quadratmetern mit der verdichteten Schichtdicke in Metern multiplizieren. Das Volumen anschließend mit der verdichteten Dichte in Kilogramm pro Kubikmeter multiplizieren und das Gewicht durch 1.000 teilen. Ein Zuschlag wird erst danach angewendet.",
  },
  {
    question: "Welche Dichte verwendet der Asphalt-Rechner?",
    answer: "Der Startwert beträgt 2.323 kg/m³ und entspricht ungefähr 145 lb/ft³. Er ist nur eine editierbare Planungshilfe. Wenn das Lieferwerk eine Dichte für das konkrete Mischgut nennt, hat dieser Wert Vorrang.",
  },
  {
    question: "Ist die Schichtdicke eine Empfehlung?",
    answer: "Nein. Der Rechner verwendet die eingegebene verdichtete Enddicke nur als Rechenwert. Aufbau, Mischgut, Untergrund, Entwässerung und Belastung müssen projektspezifisch geplant werden.",
  },
  {
    question: "Ist das Ergebnis eine verbindliche Bestellmenge?",
    answer: "Nein. Das Ergebnis ist eine mathematische Planungsschätzung. Lieferwerk, Planer oder Fachbetrieb müssen Dichte, Mindestmenge, Lieferstaffel, Verdichtung, Zuschlag und Baustellenbedingungen bestätigen.",
  },
];

export default function GermanAsphaltCalculatorPage() {
  return (
    <LocalizedSiteShell currentPath="/de/asphalt-rechner" locale="de">
      <main className="page-main">
        <header className="tool-intro shell">
          <nav className="breadcrumb" aria-label="Brotkrümelnavigation">
            <Link href="/" hrefLang="en">Startseite (Englisch)</Link><span aria-hidden="true">/</span><span>Asphalt-Rechner</span>
          </nav>
          <p className="eyebrow">Metrische Materialplanung</p>
          <h1>Asphalt-Rechner</h1>
          <p className="tool-intro__lede">
            Berechnen Sie Volumen, Gewicht und Tonnen Asphalt aus Fläche,
            verdichteter Schichtdicke und Mischgutdichte. Alle Annahmen bleiben
            sichtbar und können an die Angaben des Lieferwerks angepasst werden.
          </p>
          <div className="fact-strip" role="list" aria-label="Funktionsumfang">
            <span role="listitem">Meter + Zentimeter</span><span role="listitem">kg/m³ + Tonnen</span><span role="listitem">Euro je Tonne</span>
          </div>
          <LanguageSwitcher currentLocale="de" />
        </header>

        <div className="shell calculator-wrap">
          <LocalizedMaterialEstimator locale="de" />
        </div>

        <div className="shell reading-grid">
          <div>
            <section className="content-section" aria-labelledby="de-formel">
              <p className="eyebrow">Von der Fläche zur Bestellplanung</p>
              <h2 id="de-formel">Formel für die Asphaltmenge</h2>
              <p>
                Für eine rechteckige Fläche gilt: Länge × Breite ergibt die
                Fläche. Fläche × verdichtete Dicke ergibt das kompakte Volumen.
                Volumen × verdichtete Mischgutdichte ergibt das Gewicht. Das
                Gewicht in Kilogramm geteilt durch 1.000 ergibt metrische Tonnen.
              </p>
              <p className="formula-callout">
                Tonnen = Fläche (m²) × Dicke (cm) ÷ 100 × Dichte (kg/m³) ÷ 1.000
              </p>
              <p>
                Der Mengenzuschlag wird getrennt ausgewiesen. So bleiben
                Grundmenge und ein vom Projekt abhängiger Zuschlag nachvollziehbar.
              </p>
            </section>

            <section className="content-section" aria-labelledby="de-beispiel">
              <p className="eyebrow">Reproduzierbares Beispiel</p>
              <h2 id="de-beispiel">20 m × 5 m bei 6 cm Dicke</h2>
              <ol className="numbered-explainer">
                <li><strong>Fläche:</strong> 20 m × 5 m = 100 m².</li>
                <li><strong>Volumen:</strong> 100 m² × 0,06 m = 6 m³.</li>
                <li><strong>Gewicht:</strong> 6 m³ × 2.323 kg/m³ = 13.938 kg.</li>
                <li><strong>Grundmenge:</strong> 13.938 kg ÷ 1.000 = 13,938 t.</li>
                <li><strong>Mit 5 % Zuschlag:</strong> 13,938 t × 1,05 = 14,635 t.</li>
              </ol>
            </section>

            <section className="content-section" aria-labelledby="de-dichte">
              <p className="eyebrow">Wichtigste Annahme</p>
              <h2 id="de-dichte">Warum die Dichte editierbar ist</h2>
              <p>
                Der Startwert von 2.323 kg/m³ entspricht 145 lb/ft³. Das Asphalt
                Institute nennt für eingebautes Asphaltmischgut typischerweise
                142–148 lb/ft³. Mischgutrezeptur und Verdichtung verändern den
                tatsächlichen Wert; konkrete Lieferwerksdaten haben deshalb Vorrang.
              </p>
              <p>
                <a href="https://www.asphaltinstitute.org/engineering/engineering-faqs/" hrefLang="en">Asphalt Institute: Engineering FAQs</a>
                {" · "}
                <a href="https://www.epa.gov/sites/production/files/2015-04/documents/methodology_enivro_footprint.pdf" hrefLang="en">EPA: Umrechnungs- und Methodiktabelle</a>
              </p>
            </section>

            <FaqSection items={faqs} eyebrow="Fragen, klar beantwortet" heading="Häufige Fragen" />
          </div>

          <aside className="reading-aside" aria-label="Planungshinweise">
            <div className="aside-card">
              <p className="eyebrow">Vor einer Bestellung</p>
              <h2>Vier Werte bestätigen</h2>
              <ul>
                <li>fertige Fläche</li>
                <li>verdichtete Enddicke</li>
                <li>Dichte des konkreten Mischguts</li>
                <li>Lieferstaffel und Zuschlag</li>
              </ul>
            </div>
            <div className="aside-card aside-card--plain">
              <h2>Methodik und Grenzen</h2>
              <p>Die vollständige Quellen- und Rechendokumentation ist derzeit auf Englisch verfügbar.</p>
              <Link href="/methodology" hrefLang="en">Methodik öffnen →</Link>
            </div>
          </aside>
        </div>

        <footer className="content-meta shell">
          <p><strong>Verantwortlich:</strong> Asphalt Calculator Editorial Team</p>
          <p><strong>Erstellt und geprüft:</strong> 24. August 2026</p>
          <p><strong>Geltungsbereich:</strong> Mathematische Planungsschätzung; keine Ausführungsplanung oder Bestellung.</p>
          <Link href="/methodology" hrefLang="en">Formeln, Quellen, Grenzen und Rundung prüfen</Link>
        </footer>
      </main>
    </LocalizedSiteShell>
  );
}
