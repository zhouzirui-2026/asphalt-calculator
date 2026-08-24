"use client";

import { useEffect, useRef, useState } from "react";
import {
  calculateMaterial,
  parseDecimalInput,
  validateMaterialInput,
  type AreaMode,
  type MaterialInput,
  type MaterialResult,
  type ValidationErrors,
} from "../../lib/calculations";

type SupportedLocale = "de" | "fr";

interface FormState {
  areaMode: AreaMode;
  length: string;
  width: string;
  area: string;
  thickness: string;
  density: string;
  wastePercent: string;
  unitPrice: string;
}

interface EstimateState {
  input: MaterialInput;
  result: MaterialResult;
}

const INITIAL_STATE: FormState = {
  areaMode: "rectangle",
  length: "20",
  width: "5",
  area: "100",
  thickness: "6",
  density: "2323",
  wastePercent: "5",
  unitPrice: "0",
};

const QUERY_KEYS = {
  length: "l",
  width: "w",
  area: "a",
  thickness: "t",
  density: "d",
  wastePercent: "x",
  unitPrice: "p",
} as const;

const copy = {
  de: {
    locale: "de-DE",
    currency: "EUR",
    ariaLabel: "Asphaltmengen-Rechner",
    inputs: "Eingaben",
    formTitle: "Fläche und Schicht eingeben",
    validationHint: "Pflichtfelder werden beim Berechnen geprüft.",
    errorTitle: "Bitte prüfen Sie die markierten Eingaben.",
    errorSummary: "Mindestens ein Wert ist ungültig oder liegt außerhalb des Rechenbereichs.",
    areaInput: "Flächeneingabe",
    rectangle: "Länge × Breite",
    knownArea: "Bekannte Gesamtfläche",
    areaHelp: "Unregelmäßige Flächen in einfache Formen teilen und die Teilflächen addieren.",
    length: "Länge",
    width: "Breite",
    area: "Gesamtfläche",
    thickness: "Verdichtete Schichtdicke",
    thicknessHelp: "Die geplante Dicke nach dem Verdichten eingeben; der Rechner schreibt keine Dicke vor.",
    density: "Verdichtete Mischgutdichte",
    densityHelp: "Startwert 2.323 kg/m³. Wenn verfügbar, die Angabe des Lieferwerks verwenden.",
    waste: "Mengenzuschlag",
    wasteHelp: "5 % ist nur ein editierbarer Startwert. Den tatsächlichen Projektzuschlag eintragen.",
    price: "Materialpreis je Tonne",
    priceHelp: "Optionaler aktueller Lieferpreis; 0 bedeutet, dass keine Kosten berechnet werden.",
    calculate: "Asphaltmenge berechnen",
    estimate: "Ergebnis",
    resultTitle: "Einzuplanende Materialmenge",
    badgeReady: "Keine Bestellung",
    badgeDirty: "Neu berechnen",
    badgeInvalid: "Kein Ergebnis",
    stale: "Eingaben wurden geändert. Bitte neu berechnen.",
    invalidShared: "Die Werte im geteilten Link sind ungültig.",
    fixFields: "Markierte Felder korrigieren",
    orderQuantity: "Menge mit Zuschlag",
    baseQuantity: "Grundmenge ohne Zuschlag",
    areaResult: "Fläche",
    volumeResult: "Verdichtetes Volumen",
    weightResult: "Grundgewicht",
    wasteResult: "Zuschlag",
    costResult: "Materialkosten",
    noPrice: "Kein Preis eingetragen",
    math: "Rechenweg anzeigen",
    mathArea: "Fläche",
    mathVolume: "Volumen",
    mathWeight: "Gewicht",
    mathBase: "Grundmenge",
    mathOrder: "Planmenge",
    copyLink: "Link kopieren",
    print: "Ergebnis drucken",
    copied: "Link kopiert. Er enthält nur die hier sichtbaren Rechenwerte.",
    copyFallback: "Der Link steht jetzt in der Adresszeile und kann dort kopiert werden.",
    disclaimer: "Nur eine Planungsschätzung. Verdichtete Dichte, Bestellmenge, Lieferregeln und Preis beim örtlichen Lieferwerk oder Fachbetrieb bestätigen.",
    errors: {
      length: "Eine Länge größer als 0 m eingeben.",
      width: "Eine Breite größer als 0 m eingeben.",
      area: "Eine Fläche größer als 0 m² eingeben.",
      areaLimit: "Die Fläche liegt außerhalb des zulässigen Rechenbereichs.",
      thickness: "Eine gültige verdichtete Schichtdicke in cm eingeben.",
      density: "Eine Dichte zwischen 801 und 4.005 kg/m³ verwenden.",
      wastePercent: "Der Zuschlag muss zwischen 0 % und 100 % liegen.",
      unitPrice: "Einen nichtnegativen Preis im zulässigen Bereich eingeben.",
    },
  },
  fr: {
    locale: "fr-FR",
    currency: "EUR",
    ariaLabel: "Calculateur de quantité d’enrobé",
    inputs: "Données",
    formTitle: "Saisissez la surface et l’épaisseur",
    validationHint: "Les champs obligatoires sont vérifiés lors du calcul.",
    errorTitle: "Vérifiez les champs signalés.",
    errorSummary: "Au moins une valeur est invalide ou dépasse la plage de calcul.",
    areaInput: "Saisie de la surface",
    rectangle: "Longueur × largeur",
    knownArea: "Surface totale connue",
    areaHelp: "Découpez une forme irrégulière en surfaces simples, puis additionnez-les.",
    length: "Longueur",
    width: "Largeur",
    area: "Surface totale",
    thickness: "Épaisseur compactée",
    thicknessHelp: "Indiquez l’épaisseur finie après compactage ; le calculateur n’impose aucune épaisseur.",
    density: "Masse volumique compactée",
    densityHelp: "Valeur initiale : 2 323 kg/m³. Utilisez la donnée de la centrale lorsqu’elle est disponible.",
    waste: "Marge de quantité",
    wasteHelp: "5 % est une valeur initiale modifiable, pas une recommandation universelle.",
    price: "Prix du matériau par tonne",
    priceHelp: "Prix local facultatif ; 0 signifie qu’aucun coût n’est calculé.",
    calculate: "Calculer la quantité d’enrobé",
    estimate: "Estimation",
    resultTitle: "Quantité de matériau à prévoir",
    badgeReady: "Pas un devis",
    badgeDirty: "Recalcul requis",
    badgeInvalid: "Aucun résultat",
    stale: "Les données ont changé. Recalculez pour actualiser le résultat.",
    invalidShared: "Les valeurs du lien partagé sont invalides.",
    fixFields: "Corrigez les champs signalés",
    orderQuantity: "Quantité avec marge",
    baseQuantity: "Quantité de base sans marge",
    areaResult: "Surface",
    volumeResult: "Volume compacté",
    weightResult: "Masse de base",
    wasteResult: "Marge",
    costResult: "Coût du matériau",
    noPrice: "Aucun prix saisi",
    math: "Afficher le détail du calcul",
    mathArea: "Surface",
    mathVolume: "Volume",
    mathWeight: "Masse",
    mathBase: "Quantité de base",
    mathOrder: "Quantité à prévoir",
    copyLink: "Copier le lien",
    print: "Imprimer l’estimation",
    copied: "Lien copié. Il contient uniquement les valeurs de calcul visibles ici.",
    copyFallback: "Le lien se trouve maintenant dans la barre d’adresse ; copiez-le depuis cette barre.",
    disclaimer: "Estimation de préparation uniquement. Confirmez la masse volumique, la quantité à commander, les conditions de livraison et le prix auprès d’une centrale ou d’un professionnel local.",
    errors: {
      length: "Saisissez une longueur supérieure à 0 m.",
      width: "Saisissez une largeur supérieure à 0 m.",
      area: "Saisissez une surface supérieure à 0 m².",
      areaLimit: "La surface dépasse la plage de calcul autorisée.",
      thickness: "Saisissez une épaisseur compactée valide en cm.",
      density: "Utilisez une masse volumique comprise entre 801 et 4 005 kg/m³.",
      wastePercent: "La marge doit être comprise entre 0 % et 100 %.",
      unitPrice: "Saisissez un prix positif ou nul dans la plage autorisée.",
    },
  },
} as const;

function numberFrom(value: string) {
  return parseDecimalInput(value);
}

function inputFrom(state: FormState): MaterialInput {
  return {
    unitSystem: "metric",
    areaMode: state.areaMode,
    length: numberFrom(state.length),
    width: numberFrom(state.width),
    area: numberFrom(state.area),
    thickness: numberFrom(state.thickness),
    density: numberFrom(state.density),
    wastePercent: numberFrom(state.wastePercent),
    unitPrice: numberFrom(state.unitPrice),
  };
}

function estimateFrom(state: FormState): EstimateState {
  const input = inputFrom(state);
  return { input, result: calculateMaterial(input) };
}

function stateFromQuery() {
  if (typeof window === "undefined" || window.location.search === "") return null;
  const params = new URLSearchParams(window.location.search);
  const state: FormState = {
    ...INITIAL_STATE,
    areaMode: params.get("m") === "known-area" ? "known-area" : "rectangle",
  };
  for (const [field, key] of Object.entries(QUERY_KEYS) as Array<[keyof typeof QUERY_KEYS, string]>) {
    const value = params.get(key);
    if (value !== null) state[field] = value;
  }
  return state;
}

function InputField({
  error,
  help,
  id,
  label,
  onChange,
  unit,
  value,
}: {
  error?: string;
  help?: string;
  id: string;
  label: string;
  onChange: (value: string) => void;
  unit: string;
  value: string;
}) {
  const descriptionIds = [help ? `${id}-help` : "", error ? `${id}-error` : ""]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={`field${error ? " field--error" : ""}`}>
      <label htmlFor={id}>{label}</label>
      <div className="input-with-unit">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min="0"
          step="any"
          value={value}
          aria-label={`${label} (${unit})`}
          aria-invalid={Boolean(error)}
          aria-describedby={descriptionIds || undefined}
          onChange={(event) => onChange(event.target.value)}
        />
        <span aria-hidden="true">{unit}</span>
      </div>
      {help ? <small id={`${id}-help`}>{help}</small> : null}
      {error ? <p className="field-error" id={`${id}-error`}>{error}</p> : null}
    </div>
  );
}

export function LocalizedMaterialEstimator({ locale }: { locale: SupportedLocale }) {
  const words = copy[locale];
  const [form, setForm] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [estimate, setEstimate] = useState<EstimateState>(() => estimateFrom(INITIAL_STATE));
  const [estimateAvailable, setEstimateAvailable] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const [shareStatus, setShareStatus] = useState("");
  const errorRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const shared = stateFromQuery();
    if (!shared) return;
    const timeoutId = window.setTimeout(() => {
      const input = inputFrom(shared);
      const nextErrors = validateMaterialInput(input);
      setForm(shared);
      setErrors(nextErrors);
      if (Object.keys(nextErrors).length === 0) {
        setEstimate({ input, result: calculateMaterial(input) });
        setEstimateAvailable(true);
        setIsDirty(false);
      } else {
        setEstimateAvailable(false);
        setIsDirty(true);
      }
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  function update(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[field];
      if (["length", "width", "area"].includes(field)) delete next.areaLimit;
      return next;
    });
    setShareStatus("");
    setIsDirty(true);
  }

  function calculate({ focus = true } = {}) {
    const input = inputFrom(form);
    const nextErrors = validateMaterialInput(input);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      if (focus) requestAnimationFrame(() => errorRef.current?.focus());
      return null;
    }
    const nextEstimate = { input, result: calculateMaterial(input) };
    setEstimate(nextEstimate);
    setEstimateAvailable(true);
    setIsDirty(false);
    if (focus) requestAnimationFrame(() => resultRef.current?.focus());
    return nextEstimate;
  }

  async function copyShareLink() {
    if (!calculate({ focus: false })) return;
    const params = new URLSearchParams({ m: form.areaMode });
    for (const [field, key] of Object.entries(QUERY_KEYS) as Array<[keyof typeof QUERY_KEYS, string]>) {
      params.set(key, form[field]);
    }
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", url);
    try {
      await navigator.clipboard.writeText(url);
      setShareStatus(words.copied);
    } catch {
      setShareStatus(words.copyFallback);
    }
  }

  const format = (value: number, maximumFractionDigits = 2) => new Intl.NumberFormat(words.locale, {
    maximumFractionDigits,
    minimumFractionDigits: 0,
  }).format(value);
  const money = (value: number) => new Intl.NumberFormat(words.locale, {
    style: "currency",
    currency: words.currency,
    maximumFractionDigits: 2,
  }).format(value);
  const error = (field: keyof typeof words.errors) => errors[field] ? words.errors[field] : undefined;
  const result = estimate.result;
  const input = estimate.input;
  const areaError = errors.areaLimit ? words.errors.areaLimit : undefined;

  return (
    <section className="calculator-card" aria-label={words.ariaLabel}>
      <form
        className="calculator-form"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          calculate();
        }}
      >
        <div className="calculator-form__heading">
          <div><p className="step-label">{words.inputs}</p><h2>{words.formTitle}</h2></div>
          <p>{words.validationHint}</p>
        </div>

        {Object.keys(errors).length > 0 ? (
          <div className="error-summary" role="alert" tabIndex={-1} ref={errorRef}>
            <strong>{words.errorTitle}</strong><span>{words.errorSummary}</span>
          </div>
        ) : null}

        <div className="field-row field-row--two">
          <div className="field">
            <label htmlFor={`${locale}-area-mode`}>{words.areaInput}</label>
            <select
              id={`${locale}-area-mode`}
              value={form.areaMode}
              onChange={(event) => update("areaMode", event.target.value as AreaMode)}
            >
              <option value="rectangle">{words.rectangle}</option>
              <option value="known-area">{words.knownArea}</option>
            </select>
            <small>{words.areaHelp}</small>
          </div>
        </div>

        {form.areaMode === "rectangle" ? (
          <div className="field-row field-row--two">
            <InputField id={`${locale}-length`} label={words.length} value={form.length} unit="m" error={error("length") || areaError} onChange={(value) => update("length", value)} />
            <InputField id={`${locale}-width`} label={words.width} value={form.width} unit="m" error={error("width")} onChange={(value) => update("width", value)} />
          </div>
        ) : (
          <InputField id={`${locale}-area`} label={words.area} value={form.area} unit="m²" error={error("area") || areaError} onChange={(value) => update("area", value)} />
        )}

        <div className="field-row field-row--two">
          <InputField id={`${locale}-thickness`} label={words.thickness} value={form.thickness} unit="cm" help={words.thicknessHelp} error={error("thickness")} onChange={(value) => update("thickness", value)} />
          <InputField id={`${locale}-density`} label={words.density} value={form.density} unit="kg/m³" help={words.densityHelp} error={error("density")} onChange={(value) => update("density", value)} />
        </div>

        <div className="field-row field-row--two">
          <InputField id={`${locale}-waste`} label={words.waste} value={form.wastePercent} unit="%" help={words.wasteHelp} error={error("wastePercent")} onChange={(value) => update("wastePercent", value)} />
          <InputField id={`${locale}-price`} label={words.price} value={form.unitPrice} unit="€/t" help={words.priceHelp} error={error("unitPrice")} onChange={(value) => update("unitPrice", value)} />
        </div>

        <button className="calculate-button" type="submit">{words.calculate}</button>
      </form>

      <div className="calculator-results" ref={resultRef} tabIndex={-1} aria-live="polite">
        <div className="results-heading">
          <div><p className="step-label">{words.estimate}</p><h2>{words.resultTitle}</h2></div>
          <span className="estimate-badge">{!estimateAvailable ? words.badgeInvalid : isDirty ? words.badgeDirty : words.badgeReady}</span>
        </div>

        {isDirty && estimateAvailable ? <p className="result-stale" role="status">{words.stale}</p> : null}

        {!estimateAvailable ? (
          <div className="primary-result"><span>{words.invalidShared}</span><strong>{words.fixFields}</strong></div>
        ) : (
          <div className="primary-result">
            <span>{words.orderQuantity}</span>
            <strong>{format(result.orderMetricTonnes, 3)} t</strong>
            <small>{format(result.orderWeightKg)} kg</small>
          </div>
        )}

        {estimateAvailable ? (
          <dl className="result-grid">
            <div><dt>{words.areaResult}</dt><dd>{format(result.areaSqM)} m²</dd></div>
            <div><dt>{words.volumeResult}</dt><dd>{format(result.baseVolumeCubicM, 3)} m³</dd></div>
            <div><dt>{words.weightResult}</dt><dd>{format(result.baseWeightKg)} kg</dd></div>
            <div><dt>{words.baseQuantity}</dt><dd>{format(result.baseMetricTonnes, 3)} t</dd></div>
            <div><dt>{words.wasteResult}</dt><dd>{format(input.wastePercent)} %</dd></div>
            <div><dt>{words.costResult}</dt><dd>{input.unitPrice > 0 ? money(result.materialCost) : words.noPrice}</dd></div>
          </dl>
        ) : null}

        {estimateAvailable ? (
          <details className="math-details">
            <summary>{words.math}</summary>
            <ol>
              <li>{words.mathArea} = {input.areaMode === "rectangle" ? `${format(input.length)} m × ${format(input.width)} m` : words.knownArea} = {format(result.areaSqM)} m²</li>
              <li>{words.mathVolume} = {format(result.areaSqM)} m² × {format(input.thickness)} cm ÷ 100 = {format(result.baseVolumeCubicM, 3)} m³</li>
              <li>{words.mathWeight} = {format(result.baseVolumeCubicM, 3)} m³ × {format(input.density)} kg/m³ = {format(result.baseWeightKg)} kg</li>
              <li>{words.mathBase} = {format(result.baseWeightKg)} kg ÷ {format(1000)} = {format(result.baseMetricTonnes, 3)} t</li>
              <li>{words.mathOrder} = {format(result.baseMetricTonnes, 3)} t × (1 + {format(input.wastePercent)} ÷ 100) = {format(result.orderMetricTonnes, 3)} t</li>
            </ol>
          </details>
        ) : null}

        {estimateAvailable ? (
          <div className="result-actions">
            <button type="button" onClick={copyShareLink}>{words.copyLink}</button>
            <button type="button" onClick={() => window.print()}>{words.print}</button>
          </div>
        ) : null}
        <p className="share-status" aria-live="polite">{shareStatus}</p>
        <p className="result-disclaimer">{words.disclaimer}</p>
      </div>
    </section>
  );
}
