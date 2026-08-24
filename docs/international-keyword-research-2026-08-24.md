# International keyword research

Observed: 2026-08-24 (Asia/Shanghai)

Scope: desktop keyword overview in the named country database, supported by a
live search-result review. Values are third-party estimates, not traffic
forecasts. They are a prioritization input and must not be represented as
first-party demand.

## Evidence collected

| Market / seed | Exact monthly volume | KD | Related evidence | Decision |
| --- | ---: | ---: | --- | --- |
| US — `asphalt calculator` | 22.2K | 16 | Global 26.1K; variants 41.4K across 704 terms; questions 2.1K across 117 terms | Existing English product and long-tail reference set |
| Germany — `asphalt rechner` | 170 | 8 | Global 210; variants 240 across 10 terms; related wording included `asphalt gewicht`, `asphalt berechnung`, `dichte von asphalt`, and `1 tonne asphalt wieviel m2` | Build one native German material-calculator page |
| France — `calculateur enrobé` | unavailable | unavailable | Variant cohort 390 across 98 terms; `calcul enrobé` 70/KD 10, `calcul enrobé au m2` 50, `calcul tonnage enrobé` 40; question cohort 60 across 22 terms | Build one native French material-calculator page around the stronger `calcul enrobé` vocabulary |
| Mexico — `calculadora de asfalto` | 30 | 9 | Global 260; variants 140 across 106 terms | Defer; evidence is weaker than the first pilot cohort |
| Brazil — `calculadora de asfalto` | 20 | unavailable | Variants 180 across 215 terms; questions 40 across 75 terms | Defer; Portuguese needs its own native review |
| Italy — `calcolatore asfalto` | unavailable | unavailable | Variant cohort 30 across 26 terms; `calcolo asfalto` 20 | Defer |
| Netherlands — `asfalt berekenen` | unavailable | unavailable | No measurable volume; seven variants | Defer |
| Poland — `kalkulator asfaltu` | unavailable | unavailable | Semrush interface repeatedly failed to return a usable overview | No decision from missing evidence; defer |

The Semrush API connection was available but did not have enough API units for
this research. These observations came from the user's authenticated Semrush
web interface. The date, database, device, seed, and unavailable values are
recorded so later reviewers can reproduce or replace the snapshot.

## Live result review

The German result set contained dedicated calculators such as
`rechnerplus.de/asphalt-berechnen` and `miniwebtool.com/de/asphalt-rechner`.
The French result set contained dedicated tonnage tools such as
`maitre-ao.fr/fr/outils/calculateur-tonnage-enrobes` and
`i24app.com/fr/tools/calculateur-denrobe`. This supports a calculator-shaped
intent in both markets; it does not establish ranking feasibility or copy
quality.

## Query-to-task map

| Query cluster | User task | Page | Deliberate boundary |
| --- | --- | --- | --- |
| `asphalt rechner`, `asphalt berechnung` | Convert area, compacted thickness, density, and waste into volume and metric tonnes | `/de/asphalt-rechner` | One metric material estimator, not a separate synonym page |
| `asphalt gewicht`, `dichte von asphalt`, `1 tonne asphalt wieviel m2` | Understand how density changes mass and how tonnes relate to coverage | Supporting sections and FAQ on `/de/asphalt-rechner` | No German weight subpage until it has distinct first-party demand |
| `calcul enrobé`, `calculateur enrobé`, `calcul tonnage enrobé` | Calculate compacted enrobé volume and tonnes | `/fr/calcul-enrobe` | One metric material estimator |
| `calcul enrobé au m2` | Relate surface area and compacted thickness to quantity | Worked example and FAQ on `/fr/calcul-enrobe` | No thin per-m² synonym route |

## Pilot decision

Release only the two complete, reversible routes above. English stays
unprefixed. German and French use explicit language subdirectories and native
slugs. The calculator defaults to metric inputs, localized number formatting,
and a user-editable compacted density of 2,323 kg/m³. Calculation formulas stay
in `lib/calculations.ts`.

Spanish, Portuguese, Italian, Dutch, and Polish are not rejected permanently.
They are held until the first cohort has linguistic review and Day-2/7/28
crawl, index, query, and calculator-use evidence. No locale should be expanded
from translation convenience alone.
