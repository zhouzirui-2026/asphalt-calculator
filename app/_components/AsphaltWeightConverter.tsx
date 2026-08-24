"use client";

import { useEffect, useRef, useState } from "react";
import {
  CUBIC_M_PER_CUBIC_YD,
  DEFAULT_DENSITY_LB_FT3,
  KG_M3_PER_LB_FT3,
  calculateAsphaltWeight,
  parseDecimalInput,
  validateAsphaltWeightInput,
  type AsphaltWeightInput,
  type AsphaltWeightResult,
  type UnitSystem,
  type ValidationErrors,
} from "../../lib/calculations";

interface WeightFormState {
  unitSystem: UnitSystem;
  volume: string;
  density: string;
}

const INITIAL_STATE: WeightFormState = {
  unitSystem: "us",
  volume: "1",
  density: String(DEFAULT_DENSITY_LB_FT3),
};

function inputFrom(state: WeightFormState): AsphaltWeightInput {
  return {
    unitSystem: state.unitSystem,
    volume: parseDecimalInput(state.volume),
    density: parseDecimalInput(state.density),
  };
}

function initialResult() {
  return calculateAsphaltWeight(inputFrom(INITIAL_STATE));
}

function format(value: number, maximumFractionDigits = 3) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
    minimumFractionDigits: 0,
  }).format(value);
}

function convertedValue(value: string, multiplier: number) {
  const number = parseDecimalInput(value);
  if (!Number.isFinite(number)) return value;
  return String(Number((number * multiplier).toPrecision(10)));
}

function queryState() {
  if (typeof window === "undefined" || window.location.search === "") return null;
  const params = new URLSearchParams(window.location.search);
  return {
    unitSystem: params.get("u") === "metric" ? "metric" : "us",
    volume: params.get("v") ?? INITIAL_STATE.volume,
    density: params.get("d") ?? INITIAL_STATE.density,
  } satisfies WeightFormState;
}

export function AsphaltWeightConverter() {
  const [form, setForm] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [result, setResult] = useState<AsphaltWeightResult>(initialResult);
  const [resultAvailable, setResultAvailable] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const [shareStatus, setShareStatus] = useState("");
  const errorRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const shared = queryState();
    if (!shared) return;
    const timeoutId = window.setTimeout(() => {
      const input = inputFrom(shared);
      const nextErrors = validateAsphaltWeightInput(input);
      setForm(shared);
      setErrors(nextErrors);
      if (Object.keys(nextErrors).length === 0) {
        setResult(calculateAsphaltWeight(input));
        setResultAvailable(true);
        setIsDirty(false);
      } else {
        setResultAvailable(false);
        setIsDirty(true);
      }
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  function update(field: "volume" | "density", value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
    setIsDirty(true);
    setShareStatus("");
  }

  function switchUnits(nextSystem: UnitSystem) {
    if (nextSystem === form.unitSystem) return;
    const toMetric = form.unitSystem === "us";
    const nextForm: WeightFormState = {
      unitSystem: nextSystem,
      volume: convertedValue(
        form.volume,
        toMetric ? CUBIC_M_PER_CUBIC_YD : 1 / CUBIC_M_PER_CUBIC_YD,
      ),
      density: convertedValue(
        form.density,
        toMetric ? KG_M3_PER_LB_FT3 : 1 / KG_M3_PER_LB_FT3,
      ),
    };
    const input = inputFrom(nextForm);
    const nextErrors = validateAsphaltWeightInput(input);
    setForm(nextForm);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setResult(calculateAsphaltWeight(input));
      setResultAvailable(true);
      setIsDirty(false);
    } else {
      setIsDirty(true);
    }
    setShareStatus("");
  }

  function calculate({ focus = true } = {}) {
    const input = inputFrom(form);
    const nextErrors = validateAsphaltWeightInput(input);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      if (focus) requestAnimationFrame(() => errorRef.current?.focus());
      return null;
    }
    const nextResult = calculateAsphaltWeight(input);
    setResult(nextResult);
    setResultAvailable(true);
    setIsDirty(false);
    if (focus) requestAnimationFrame(() => resultRef.current?.focus());
    return nextResult;
  }

  async function copyShareLink() {
    if (!calculate({ focus: false })) return;
    const params = new URLSearchParams({
      u: form.unitSystem,
      v: form.volume,
      d: form.density,
    });
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", url);
    try {
      await navigator.clipboard.writeText(url);
      setShareStatus("Share link copied. It contains only the volume and density shown here.");
    } catch {
      setShareStatus("Share link is now in the address bar. Copy it from there.");
    }
  }

  const usesUs = form.unitSystem === "us";
  const volumeUnit = usesUs ? "yd³" : "m³";
  const densityUnit = usesUs ? "lb/ft³" : "kg/m³";
  const primaryValue = usesUs ? result.shortTons : result.metricTonnes;
  const primaryUnit = usesUs ? "short tons" : "metric tonnes";
  const descriptionIds = (field: "volume" | "density") => [
    `${field}-help`,
    errors[field] ? `${field}-error` : "",
  ].filter(Boolean).join(" ");

  return (
    <section className="calculator-card weight-calculator" aria-label="Asphalt volume to weight calculator">
      <form
        className="calculator-form"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          calculate();
        }}
      >
        <div className="calculator-form__heading">
          <div>
            <p className="step-label">Known volume</p>
            <h2>Convert asphalt volume to weight</h2>
          </div>
          <p>Use compacted volume and a project-specific density when available.</p>
        </div>

        {Object.keys(errors).length > 0 ? (
          <div className="error-summary" role="alert" tabIndex={-1} ref={errorRef}>
            <strong>Check the highlighted inputs.</strong>
            <span>{Object.keys(errors).length} issue{Object.keys(errors).length === 1 ? "" : "s"} {Object.keys(errors).length === 1 ? "needs" : "need"} attention.</span>
          </div>
        ) : null}

        <fieldset className="control-group">
          <legend>Measurement system</legend>
          <div className="segmented-control">
            <button type="button" aria-pressed={usesUs} onClick={() => switchUnits("us")}>
              Cubic yards
            </button>
            <button type="button" aria-pressed={!usesUs} onClick={() => switchUnits("metric")}>
              Cubic meters
            </button>
          </div>
        </fieldset>

        <div className={`field${errors.volume ? " field--error" : ""}`}>
          <label htmlFor="weight-volume">Compacted asphalt volume</label>
          <div className="input-with-unit">
            <input
              id="weight-volume"
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              value={form.volume}
              aria-label={`Compacted asphalt volume (${volumeUnit})`}
              aria-invalid={Boolean(errors.volume)}
              aria-describedby={descriptionIds("volume")}
              onChange={(event) => update("volume", event.target.value)}
            />
            <span aria-hidden="true">{volumeUnit}</span>
          </div>
          <small id="volume-help">Use the compacted or in-place volume, not a loose truck volume.</small>
          {errors.volume ? <p className="field-error" id="volume-error">{errors.volume}</p> : null}
        </div>

        <div className={`field${errors.density ? " field--error" : ""}`}>
          <label htmlFor="weight-density">Compacted mix density</label>
          <div className="input-with-unit">
            <input
              id="weight-density"
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              value={form.density}
              aria-label={`Compacted mix density (${densityUnit})`}
              aria-invalid={Boolean(errors.density)}
              aria-describedby={descriptionIds("density")}
              onChange={(event) => update("density", event.target.value)}
            />
            <span aria-hidden="true">{densityUnit}</span>
          </div>
          <small id="density-help">The starting value converts from 145 lb/ft³; replace it with supplier data.</small>
          {errors.density ? <p className="field-error" id="density-error">{errors.density}</p> : null}
        </div>

        <button className="calculate-button" type="submit">Calculate asphalt weight</button>
      </form>

      <div className="calculator-results" ref={resultRef} tabIndex={-1} aria-live="polite">
        <div className="results-heading">
          <div>
            <p className="step-label">Converted weight</p>
            <h2>Asphalt weight</h2>
          </div>
          <span className="estimate-badge">{!resultAvailable ? "No result" : isDirty ? "Update needed" : "Planning value"}</span>
        </div>

        {isDirty && resultAvailable ? (
          <p className="result-stale" role="status">Inputs changed. Calculate again to update the result below.</p>
        ) : null}

        {!resultAvailable ? (
          <div className="primary-result">
            <span>Shared inputs are invalid</span>
            <strong>Fix the highlighted fields</strong>
            <small>Then calculate to create a new conversion.</small>
          </div>
        ) : (
          <>
            <div className="primary-result">
              <span>Weight for the entered volume</span>
              <strong>{format(primaryValue)} {primaryUnit}</strong>
              <small>{usesUs ? `${format(result.metricTonnes)} metric tonnes` : `${format(result.shortTons)} US short tons`}</small>
            </div>
            <dl className="result-grid">
              <div><dt>Pounds</dt><dd>{format(result.weightLb, 1)} lb</dd></div>
              <div><dt>Kilograms</dt><dd>{format(result.weightKg, 1)} kg</dd></div>
              <div><dt>US unit weight</dt><dd>{format(result.shortTonsPerCubicYd, 4)} tons/yd³</dd></div>
              <div><dt>Metric unit weight</dt><dd>{format(result.metricTonnesPerCubicM, 4)} t/m³</dd></div>
            </dl>
            <details className="math-details">
              <summary>Show the conversion</summary>
              <ol>
                <li>Normalize the entered volume to cubic feet.</li>
                <li>Multiply cubic feet by the compacted density in lb/ft³.</li>
                <li>Divide pounds by 2,000 for US short tons.</li>
                <li>Convert pounds to kilograms, then divide by 1,000 for metric tonnes.</li>
              </ol>
            </details>
            <div className="result-actions">
              <button type="button" onClick={copyShareLink}>Copy share link</button>
              <button type="button" onClick={() => window.print()}>Print conversion</button>
            </div>
          </>
        )}
        <p className="share-status" aria-live="polite">{shareStatus}</p>
        <p className="result-disclaimer">
          This converts volume to weight only. It does not select a pavement depth,
          mix, order allowance, or supplier quantity.
        </p>
      </div>
    </section>
  );
}
