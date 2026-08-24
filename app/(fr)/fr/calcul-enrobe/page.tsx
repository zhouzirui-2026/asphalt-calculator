import type { Metadata } from "next";
import Link from "next/link";
import { languageAlternates } from "../../../../site-config.mjs";
import { SOCIAL_IMAGE, TWITTER_IMAGE } from "../../../../lib/seo";
import { FaqSection, type FaqItem } from "../../../_components/FaqSection";
import { LocalizedMaterialEstimator } from "../../../_components/LocalizedMaterialEstimator";
import { LocalizedSiteShell } from "../../../_components/LocalizedSiteShell";

const alternates = languageAlternates("materialCalculator");

export const metadata: Metadata = {
  title: "Calcul enrobé : tonnage, volume et coût",
  description: "Calculez le tonnage d’enrobé à partir de la surface, de l’épaisseur compactée et de la masse volumique, avec marge et prix en euros.",
  alternates: { canonical: "/fr/calcul-enrobe", languages: alternates },
  openGraph: {
    type: "website",
    url: "/fr/calcul-enrobe",
    locale: "fr_FR",
    alternateLocale: ["en_US", "de_DE"],
    title: "Calcul enrobé : tonnage, volume et coût",
    description: "Préparez la quantité d’enrobé avec des unités métriques, une masse volumique modifiable et une formule visible.",
    images: [SOCIAL_IMAGE],
  },
  twitter: {
    card: "summary",
    title: "Calcul enrobé : tonnage, volume et coût",
    description: "Préparez la quantité d’enrobé avec des unités métriques, une masse volumique modifiable et une formule visible.",
    images: [TWITTER_IMAGE],
  },
};

const faqs: readonly FaqItem[] = [
  {
    question: "Comment calculer le tonnage d’enrobé ?",
    answer: "Multipliez la surface en mètres carrés par l’épaisseur compactée en mètres. Multipliez ensuite ce volume par la masse volumique compactée en kilogrammes par mètre cube, puis divisez la masse par 1 000. La marge éventuelle s’applique après ce calcul de base.",
  },
  {
    question: "Quelle masse volumique utilise le calculateur ?",
    answer: "La valeur initiale est de 2 323 kg/m³, soit environ 145 lb/ft³. Il s’agit d’une hypothèse modifiable. La donnée fournie pour l’enrobé réellement livré doit la remplacer lorsqu’elle est disponible.",
  },
  {
    question: "L’épaisseur affichée est-elle une recommandation ?",
    answer: "Non. Le calculateur utilise uniquement l’épaisseur compactée que vous saisissez. La structure, le support, le drainage, le trafic et le type d’enrobé doivent être définis pour le projet concerné.",
  },
  {
    question: "Le résultat remplace-t-il une commande ou un devis ?",
    answer: "Non. C’est une estimation mathématique de préparation. La centrale, le bureau d’études ou l’entreprise doivent confirmer la masse volumique, la quantité minimale, la livraison, le compactage, la marge et les contraintes du chantier.",
  },
];

export default function FrenchAsphaltCalculatorPage() {
  return (
    <LocalizedSiteShell currentPath="/fr/calcul-enrobe" locale="fr">
      <main className="page-main">
        <header className="tool-intro shell">
          <nav className="breadcrumb" aria-label="Fil d’Ariane">
            <Link href="/" hrefLang="en">Accueil (en anglais)</Link><span aria-hidden="true">/</span><span>Calcul d’enrobé</span>
          </nav>
          <p className="eyebrow">Préparation métrique du matériau</p>
          <h1>Calculateur d’enrobé</h1>
          <p className="tool-intro__lede">
            Calculez le volume, la masse et le tonnage d’enrobé à partir de la
            surface, de l’épaisseur compactée et de la masse volumique. Chaque
            hypothèse reste visible et peut être remplacée par la donnée de la centrale.
          </p>
          <div className="fact-strip" role="list" aria-label="Fonctions du calculateur">
            <span role="listitem">Mètres + centimètres</span><span role="listitem">kg/m³ + tonnes</span><span role="listitem">Euros par tonne</span>
          </div>
        </header>

        <div className="shell calculator-wrap">
          <LocalizedMaterialEstimator locale="fr" />
        </div>

        <div className="shell reading-grid">
          <div>
            <section className="content-section" aria-labelledby="fr-formule">
              <p className="eyebrow">De la surface à la quantité à prévoir</p>
              <h2 id="fr-formule">Formule du tonnage d’enrobé</h2>
              <p>
                Pour un rectangle, longueur × largeur donne la surface. Surface
                × épaisseur compactée donne le volume en place. Volume × masse
                volumique compactée donne la masse. La masse en kilogrammes
                divisée par 1 000 donne le tonnage métrique.
              </p>
              <p className="formula-callout">
                Tonnes = surface (m²) × épaisseur (cm) ÷ 100 × masse volumique (kg/m³) ÷ 1 000
              </p>
              <p>
                La marge est présentée séparément afin de distinguer la quantité
                mathématique de base d’une réserve choisie pour le projet.
              </p>
            </section>

            <section className="content-section" aria-labelledby="fr-exemple">
              <p className="eyebrow">Exemple reproductible</p>
              <h2 id="fr-exemple">20 m × 5 m avec 6 cm d’épaisseur</h2>
              <ol className="numbered-explainer">
                <li><strong>Surface :</strong> 20 m × 5 m = 100 m².</li>
                <li><strong>Volume :</strong> 100 m² × 0,06 m = 6 m³.</li>
                <li><strong>Masse :</strong> 6 m³ × 2 323 kg/m³ = 13 938 kg.</li>
                <li><strong>Quantité de base :</strong> 13 938 kg ÷ 1 000 = 13,938 t.</li>
                <li><strong>Avec 5 % de marge :</strong> 13,938 t × 1,05 = 14,635 t.</li>
              </ol>
            </section>

            <section className="content-section" aria-labelledby="fr-densite">
              <p className="eyebrow">Hypothèse principale</p>
              <h2 id="fr-densite">Pourquoi la masse volumique est modifiable</h2>
              <p>
                La valeur initiale de 2 323 kg/m³ correspond à 145 lb/ft³.
                L’Asphalt Institute indique qu’un mélange bitumineux mis en place
                pèse généralement 142 à 148 lb/ft³. La formulation et le compactage
                font varier la valeur réelle : la donnée du mélange livré reste prioritaire.
              </p>
              <p>
                <a href="https://www.asphaltinstitute.org/engineering/engineering-faqs/" hrefLang="en">Asphalt Institute : Engineering FAQs</a>
                {" · "}
                <a href="https://www.epa.gov/sites/production/files/2015-04/documents/methodology_enivro_footprint.pdf" hrefLang="en">EPA : tableau de méthode et de conversion</a>
              </p>
            </section>

            <FaqSection items={faqs} eyebrow="Des réponses claires" heading="Questions fréquentes" />
          </div>

          <aside className="reading-aside" aria-label="Points à vérifier">
            <div className="aside-card">
              <p className="eyebrow">Avant une commande</p>
              <h2>Confirmez quatre données</h2>
              <ul>
                <li>surface finie</li>
                <li>épaisseur finale compactée</li>
                <li>masse volumique de l’enrobé livré</li>
                <li>conditionnement, livraison et marge</li>
              </ul>
            </div>
            <div className="aside-card aside-card--plain">
              <h2>Méthode et limites</h2>
              <p>La documentation complète des sources et des calculs est actuellement disponible en anglais.</p>
              <Link href="/methodology" hrefLang="en">Ouvrir la méthode →</Link>
            </div>
          </aside>
        </div>

        <footer className="content-meta shell">
          <p><strong>Responsable :</strong> Asphalt Calculator Editorial Team</p>
          <p><strong>Créé et vérifié :</strong> 24 août 2026</p>
          <p><strong>Portée :</strong> estimation mathématique de préparation ; ni étude d’exécution, ni commande.</p>
          <Link href="/methodology" hrefLang="en">Vérifier les formules, les sources, les limites et les arrondis</Link>
        </footer>
      </main>
    </LocalizedSiteShell>
  );
}
