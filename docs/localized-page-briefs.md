# German and French page briefs

Date: 2026-08-24

These briefs turn the recorded query evidence into two user tasks. They are
content contracts, not instructions to repeat keywords mechanically.

## German: `/de/asphalt-rechner`

- Primary task: estimate compacted asphalt volume and metric tonnes from area,
  thickness, density, and waste.
- Primary vocabulary: `Asphalt Rechner`; supporting wording: `Asphalt
  Berechnung`, `Asphalt Gewicht`, `Dichte von Asphalt`, `1 Tonne Asphalt
  wieviel m²`.
- Searcher outcome: leave with a reproducible order estimate and understand
  why density, compacted thickness, and waste affect it.
- Required calculator state: metres, centimetres, kg/m³, percentage waste,
  optional euros per metric tonne; no imperial-only control or untranslated
  validation message.
- Required explanation: area × thickness = compacted volume; volume × density
  = base mass; divide kilograms by 1,000 for metric tonnes; apply waste last.
- Worked example: 20 m × 5 m × 6 cm at 2,323 kg/m³ and 5% waste yields
  6 m³, 13.938 t base mass, and 14.635 t order quantity.
- Trust boundary: planning estimate only; actual compacted density, layer
  design, loss, supplier minimums, and site conditions require local
  confirmation.
- Internal links: English equivalent, methodology, about, privacy, and terms.
- Completion signal: a valid result is produced; no entered calculator values
  are sent to analytics.

## French: `/fr/calcul-enrobe`

- Primary task: calculer le volume compacté et le tonnage d'enrobé à partir de
  la surface, de l'épaisseur, de la masse volumique et de la marge.
- Primary vocabulary: `calcul enrobé`; supporting wording: `calculateur
  enrobé`, `calcul tonnage enrobé`, `calcul enrobé au m2`.
- Searcher outcome: obtain a transparent metric estimate and see each step of
  the formula.
- Required calculator state: mètres, centimètres, kg/m³, marge en pourcentage,
  prix facultatif en euros par tonne métrique; French number formatting and
  validation throughout.
- Required explanation: surface × épaisseur = volume compacté; volume × masse
  volumique = masse de base; divide kilograms by 1,000; apply the margin last.
- Worked example: 20 m × 5 m × 6 cm at 2,323 kg/m³ and 5% margin yields
  6 m³, 13.938 t base mass, and 14.635 t order quantity, displayed with French
  number punctuation.
- Trust boundary: estimate only; validate the pavement design, compacted mix
  density, waste, access, and supplier rules locally.
- Internal links: English equivalent, methodology, about, privacy, and terms.
- Completion signal: a valid result is produced; entered values remain in the
  browser except when the user explicitly creates a share link.

## Editorial acceptance

Both pages must render useful explanatory HTML before JavaScript, use one clear
H1, expose a self-canonical and complete reciprocal hreflang set, retain the
same formula authority as English, and pass native-language review before any
production release. A translated shell around English body copy is not an
acceptable page.
