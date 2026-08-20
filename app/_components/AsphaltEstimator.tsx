"use client";

import { useEffect, useRef, useState } from "react";
import {
  CM_PER_IN,
  DEFAULT_DENSITY_LB_FT3,
  FT_PER_M,
  KG_M3_PER_LB_FT3,
  SHORT_TONS_PER_METRIC_TONNE,
  SQ_FT_PER_SQ_M,
  calculateDrivewayCost,
  calculateMaterial,
  parseDecimalInput,
  validateDrivewayCostInput,
  validateMaterialInput,
  type AreaMode,
  type DrivewayCostInput,
  type DrivewayCostResult,
  type MaterialResult,
  type UnitSystem,
  type ValidationErrors,
} from "../../lib/calculations";

type CalculatorMode = "material" | "cost";

interface FormState {
  unitSystem: UnitSystem;
  areaMode: AreaMode;
  length: string;
  width: string;
  area: string;
  thickness: string;
  density: string;
  wastePercent: string;
  unitPrice: string;
  preparationRate: string;
  pavingRate: string;
  deliveryCost: string;
  otherCost: string;
}

interface EstimateState {
  material: MaterialResult;
  cost?: DrivewayCostResult;
  input: DrivewayCostInput;
}

const INITIAL_STATE: FormState = {
  unitSystem: "us",
  areaMode: "rectangle",
  length: "50",
  width: "20",
  area: "1000",
  thickness: "3",
  density: String(DEFAULT_DENSITY_LB_FT3),
  wastePercent: "0",
  unitPrice: "0",
  preparationRate: "0",
  pavingRate: "0",
  deliveryCost: "0",
  otherCost: "0",
};

const QUERY_KEYS: Record<Exclude<keyof FormState, "unitSystem" | "areaMode">, string> = {
  length: "l",
  width: "w",
  area: "a",
  thickness: "t",
  density: "d",
  wastePercent: "x",
  unitPrice: "p",
  preparationRate: "pr",
  pavingRate: "ir",
  deliveryCost: "dc",
  otherCost: "oc",
};

function numberFrom(value: string) {
  return parseDecimalInput(value);
}

function inputFrom(state: FormState): DrivewayCostInput {
  return {
    unitSystem: state.unitSystem,
    areaMode: state.areaMode,
    length: numberFrom(state.length),
    width: numberFrom(state.width),
    area: numberFrom(state.area),
    thickness: numberFrom(state.thickness),
    density: numberFrom(state.density),
    wastePercent: numberFrom(state.wastePercent),
    unitPrice: numberFrom(state.unitPrice),
    preparationRate: numberFrom(state.preparationRate),
    pavingRate: numberFrom(state.pavingRate),
    deliveryCost: numberFrom(state.deliveryCost),
    otherCost: numberFrom(state.otherCost),
  };
}

function initialEstimate(mode: CalculatorMode) {
  const input = inputFrom(INITIAL_STATE);
  return {
    material: calculateMaterial(input),
    cost: mode === "cost" ? calculateDrivewayCost(input) : undefined,
    input,
  } satisfies EstimateState;
}

function format(value: number, maximumFractionDigits = 2) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
    minimumFractionDigits: 0,
  }).format(value);
}

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function convertedValue(value: string, multiplier: number) {
  const number = numberFrom(value);
  if (!Number.isFinite(number)) return value;
  return String(Number((number * multiplier).toPrecision(10)));
}

function queryState(mode: CalculatorMode) {
  if (typeof window === "undefined" || window.location.search === "") return null;
  const params = new URLSearchParams(window.location.search);
  const unitSystem = params.get("u");
  const areaMode = params.get("m");
  const next: FormState = {
    ...INITIAL_STATE,
    unitSystem: unitSystem === "metric" ? "metric" : "us",
    areaMode: areaMode === "known-area" ? "known-area" : "rectangle",
  };
  const allowed = mode === "cost"
    ? Object.keys(QUERY_KEYS)
    : Object.keys(QUERY_KEYS).filter((key) => ![
      "preparationRate", "pavingRate", "deliveryCost", "otherCost",
    ].includes(key));
  for (const field of allowed as Array<keyof typeof QUERY_KEYS>) {
    const value = params.get(QUERY_KEYS[field]);
    if (value !== null) next[field] = value;
  }
  return next;
}

function InputField({
  id,
  label,
  value,
  unit,
  help,
  error,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  unit?: string;
  help?: string;
  error?: string;
  onChange: (value: string) => void;
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
          aria-label={`${label}${unit ? ` (${unit})` : ""}`}
          aria-invalid={Boolean(error)}
          aria-describedby={descriptionIds || undefined}
          onChange={(event) => onChange(event.target.value)}
        />
        {unit ? <span aria-hidden="true">{unit}</span> : null}
      </div>
      {help ? <small id={`${id}-help`}>{help}</small> : null}
      {error ? <p className="field-error" id={`${id}-error`}>{error}</p> : null}
    </div>
  );
}

export function AsphaltEstimator({ mode }: { mode: CalculatorMode }) {
  const [form, setForm] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [estimate, setEstimate] = useState<EstimateState>(() => initialEstimate(mode));
  const [estimateAvailable, setEstimateAvailable] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const [shareStatus, setShareStatus] = useState("");
  const errorRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const prefix = mode === "cost" ? "cost" : "material";

  useEffect(() => {
    const shared = queryState(mode);
    if (!shared) return;
    const timeoutId = window.setTimeout(() => {
      const input = inputFrom(shared);
      const nextErrors = mode === "cost"
        ? validateDrivewayCostInput(input)
        : validateMaterialInput(input);
      setForm(shared);
      setErrors(nextErrors);
      if (Object.keys(nextErrors).length === 0) {
        const material = calculateMaterial(input);
        setEstimate({
          material,
          cost: mode === "cost" ? calculateDrivewayCost(input) : undefined,
          input,
        });
        setEstimateAvailable(true);
        setIsDirty(false);
      } else {
        setEstimateAvailable(false);
        setIsDirty(true);
      }
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [mode]);

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

  function switchUnits(nextSystem: UnitSystem) {
    if (nextSystem === form.unitSystem) return;
    const toMetric = form.unitSystem === "us";
    const nextForm: FormState = {
      ...form,
      unitSystem: nextSystem,
      length: convertedValue(form.length, toMetric ? 1 / FT_PER_M : FT_PER_M),
      width: convertedValue(form.width, toMetric ? 1 / FT_PER_M : FT_PER_M),
      area: convertedValue(form.area, toMetric ? 1 / SQ_FT_PER_SQ_M : SQ_FT_PER_SQ_M),
      thickness: convertedValue(form.thickness, toMetric ? CM_PER_IN : 1 / CM_PER_IN),
      density: convertedValue(form.density, toMetric ? KG_M3_PER_LB_FT3 : 1 / KG_M3_PER_LB_FT3),
      unitPrice: convertedValue(form.unitPrice, toMetric ? SHORT_TONS_PER_METRIC_TONNE : 1 / SHORT_TONS_PER_METRIC_TONNE),
      preparationRate: convertedValue(form.preparationRate, toMetric ? SQ_FT_PER_SQ_M : 1 / SQ_FT_PER_SQ_M),
      pavingRate: convertedValue(form.pavingRate, toMetric ? SQ_FT_PER_SQ_M : 1 / SQ_FT_PER_SQ_M),
    };
    const nextInput = inputFrom(nextForm);
    const nextErrors = mode === "cost"
      ? validateDrivewayCostInput(nextInput)
      : validateMaterialInput(nextInput);
    setForm(nextForm);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setEstimate({
        material: calculateMaterial(nextInput),
        cost: mode === "cost" ? calculateDrivewayCost(nextInput) : undefined,
        input: nextInput,
      });
      setEstimateAvailable(true);
      setIsDirty(false);
    } else {
      setIsDirty(true);
    }
    setShareStatus("");
  }

  function calculate({ focus = true } = {}) {
    const input = inputFrom(form);
    const nextErrors = mode === "cost"
      ? validateDrivewayCostInput(input)
      : validateMaterialInput(input);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      if (focus) requestAnimationFrame(() => errorRef.current?.focus());
      return null;
    }
    const material = calculateMaterial(input);
    const nextEstimate: EstimateState = {
      material,
      cost: mode === "cost" ? calculateDrivewayCost(input) : undefined,
      input,
    };
    setEstimate(nextEstimate);
    setEstimateAvailable(true);
    setIsDirty(false);
    if (focus) requestAnimationFrame(() => resultRef.current?.focus());
    return nextEstimate;
  }

  async function copyShareLink() {
    const validEstimate = calculate({ focus: false });
    if (!validEstimate) return;
    const params = new URLSearchParams({ u: form.unitSystem, m: form.areaMode });
    for (const [field, key] of Object.entries(QUERY_KEYS) as Array<[keyof typeof QUERY_KEYS, string]>) {
      if (mode === "material" && [
        "preparationRate", "pavingRate", "deliveryCost", "otherCost",
      ].includes(field)) continue;
      params.set(key, form[field]);
    }
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", url);
    try {
      await navigator.clipboard.writeText(url);
      setShareStatus("Share link copied. It contains only the calculator inputs shown here.");
    } catch {
      setShareStatus("Share link is now in the address bar. Copy it from there.");
    }
  }

  const formUsesUs = form.unitSystem === "us";
  const dimensionsUnit = formUsesUs ? "ft" : "m";
  const areaUnit = formUsesUs ? "ft²" : "m²";
  const thicknessUnit = formUsesUs ? "in" : "cm";
  const densityUnit = formUsesUs ? "lb/ft³" : "kg/m³";
  const tonUnit = formUsesUs ? "short ton" : "metric tonne";
  const rateUnit = formUsesUs ? "ft²" : "m²";
  const input = estimate.input;
  const result = estimate.material;
  const estimateUsesUs = input.unitSystem === "us";
  const estimateDimensionsUnit = estimateUsesUs ? "ft" : "m";
  const estimateAreaUnit = estimateUsesUs ? "ft²" : "m²";
  const estimateThicknessUnit = estimateUsesUs ? "in" : "cm";
  const estimateDensityUnit = estimateUsesUs ? "lb/ft³" : "kg/m³";
  const estimateTonUnit = estimateUsesUs ? "short ton" : "metric tonne";
  const displayedArea = estimateUsesUs ? result.areaSqFt : result.areaSqM;
  const displayedVolume = estimateUsesUs ? result.baseVolumeCubicFt : result.baseVolumeCubicM;
  const displayedWeight = estimateUsesUs ? result.baseWeightLb : result.baseWeightKg;
  const displayedBaseTons = estimateUsesUs ? result.baseShortTons : result.baseMetricTonnes;
  const displayedOrderTons = estimateUsesUs ? result.orderShortTons : result.orderMetricTonnes;

  return (
    <section className="calculator-card" aria-label={mode === "cost" ? "Driveway cost calculator" : "Asphalt material calculator"}>
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
            <p className="step-label">Inputs</p>
            <h2>{mode === "cost" ? "Build your planning allowance" : "Enter the paved area"}</h2>
          </div>
          <p>Required fields are validated when you calculate.</p>
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
            <button
              type="button"
              aria-pressed={formUsesUs}
              onClick={() => switchUnits("us")}
            >
              US customary
            </button>
            <button
              type="button"
              aria-pressed={!formUsesUs}
              onClick={() => switchUnits("metric")}
            >
              Metric
            </button>
          </div>
        </fieldset>

        <div className="field-row field-row--two">
          <div className="field">
            <label htmlFor={`${prefix}-area-mode`}>Area input</label>
            <select
              id={`${prefix}-area-mode`}
              value={form.areaMode}
              onChange={(event) => update("areaMode", event.target.value)}
            >
              <option value="rectangle">Length × width</option>
              <option value="known-area">Known total area</option>
            </select>
            <small>Split irregular areas into rectangles, then enter the total.</small>
          </div>
        </div>

        {form.areaMode === "rectangle" ? (
          <div className="field-row field-row--two">
            <InputField
              id={`${prefix}-length`}
              label="Length"
              value={form.length}
              unit={dimensionsUnit}
              error={errors.length || errors.areaLimit}
              onChange={(value) => update("length", value)}
            />
            <InputField
              id={`${prefix}-width`}
              label="Width"
              value={form.width}
              unit={dimensionsUnit}
              error={errors.width}
              onChange={(value) => update("width", value)}
            />
          </div>
        ) : (
          <InputField
            id={`${prefix}-area`}
            label="Total paved area"
            value={form.area}
            unit={areaUnit}
            error={errors.area || errors.areaLimit}
            onChange={(value) => update("area", value)}
          />
        )}

        <div className="field-row field-row--two">
          <InputField
            id={`${prefix}-thickness`}
            label="Compacted thickness"
            value={form.thickness}
            unit={thicknessUnit}
            help="Enter the project design depth; this site does not prescribe one."
            error={errors.thickness}
            onChange={(value) => update("thickness", value)}
          />
          <InputField
            id={`${prefix}-density`}
            label="Compacted mix density"
            value={form.density}
            unit={densityUnit}
            help={formUsesUs ? "Default 145 lb/ft³; replace it with supplier data." : "Converted from 145 lb/ft³; replace it with supplier data."}
            error={errors.density}
            onChange={(value) => update("density", value)}
          />
        </div>

        <div className="field-row field-row--two">
          <InputField
            id={`${prefix}-waste`}
            label="Waste allowance"
            value={form.wastePercent}
            unit="%"
            help="Starts at 0%. Add only an allowance appropriate to your plan."
            error={errors.wastePercent}
            onChange={(value) => update("wastePercent", value)}
          />
          <InputField
            id={`${prefix}-price`}
            label={`Material price per ${tonUnit}`}
            value={form.unitPrice}
            unit="$"
            help="Optional. Enter a current local supplier price."
            error={errors.unitPrice}
            onChange={(value) => update("unitPrice", value)}
          />
        </div>

        {mode === "cost" ? (
          <fieldset className="cost-fields">
            <legend>Your cost allowances</legend>
            <p>Use written local estimates or quotes. Zero means the item is not included.</p>
            <div className="field-row field-row--two">
              <InputField
                id={`${prefix}-preparation`}
                label={`Preparation per ${rateUnit}`}
                value={form.preparationRate}
                unit="$"
                error={errors.preparationRate}
                onChange={(value) => update("preparationRate", value)}
              />
              <InputField
                id={`${prefix}-paving`}
                label={`Paving / installation per ${rateUnit}`}
                value={form.pavingRate}
                unit="$"
                error={errors.pavingRate}
                onChange={(value) => update("pavingRate", value)}
              />
              <InputField
                id={`${prefix}-delivery`}
                label="Delivery allowance"
                value={form.deliveryCost}
                unit="$"
                error={errors.deliveryCost}
                onChange={(value) => update("deliveryCost", value)}
              />
              <InputField
                id={`${prefix}-other`}
                label="Other fixed allowance"
                value={form.otherCost}
                unit="$"
                help="For a known item you can identify; do not use it to hide assumptions."
                error={errors.otherCost}
                onChange={(value) => update("otherCost", value)}
              />
            </div>
          </fieldset>
        ) : null}

        <button className="calculate-button" type="submit">
          {mode === "cost" ? "Calculate planning cost" : "Calculate asphalt quantity"}
        </button>
      </form>

      <div className="calculator-results" ref={resultRef} tabIndex={-1} aria-live="polite">
        <div className="results-heading">
          <div>
            <p className="step-label">Estimate</p>
            <h2>{mode === "cost" ? "Planning total" : "Material to plan for"}</h2>
          </div>
          <span className="estimate-badge">{!estimateAvailable ? "No estimate" : isDirty ? "Update needed" : "Not a quote"}</span>
        </div>

        {isDirty && estimateAvailable ? (
          <p className="result-stale" role="status">
            Inputs changed. Calculate again to update the estimate below.
          </p>
        ) : null}

        {!estimateAvailable ? (
          <div className="primary-result">
            <span>Shared inputs are invalid</span>
            <strong>Fix the highlighted fields</strong>
            <small>Then calculate to create a new estimate.</small>
          </div>
        ) : mode === "cost" && estimate.cost ? (
          <div className="primary-result">
            <span>Combined allowance</span>
            <strong>{money(estimate.cost.totalCost)}</strong>
            <small>{money(estimate.cost.costPerArea)} per {estimateAreaUnit}</small>
          </div>
        ) : (
          <div className="primary-result">
            <span>Order quantity with allowance</span>
            <strong>{format(displayedOrderTons, 3)} {estimateTonUnit}{displayedOrderTons === 1 ? "" : "s"}</strong>
            <small>{estimateUsesUs ? `${format(result.orderMetricTonnes, 3)} metric tonnes` : `${format(result.orderShortTons, 3)} short tons`}</small>
          </div>
        )}

        {estimateAvailable ? <dl className="result-grid">
          <div><dt>Area</dt><dd>{format(displayedArea)} {estimateAreaUnit}</dd></div>
          <div><dt>Base volume</dt><dd>{format(displayedVolume, 3)} {estimateUsesUs ? "ft³" : "m³"}</dd></div>
          <div><dt>Base weight</dt><dd>{format(displayedWeight)} {estimateUsesUs ? "lb" : "kg"}</dd></div>
          <div><dt>Base tonnage</dt><dd>{format(displayedBaseTons, 3)} {estimateTonUnit}{displayedBaseTons === 1 ? "" : "s"}</dd></div>
          <div><dt>Waste allowance</dt><dd>{format(input.wastePercent)}%</dd></div>
          <div><dt>Material cost</dt><dd>{input.unitPrice > 0 ? money(result.materialCost) : "No price entered"}</dd></div>
        </dl> : null}

        {estimateAvailable && mode === "cost" && estimate.cost ? (
          <div className="cost-breakdown">
            <h3>Included in this total</h3>
            <dl>
              <div><dt>Material</dt><dd>{money(estimate.cost.materialCost)}</dd></div>
              <div><dt>Preparation</dt><dd>{money(estimate.cost.preparationCost)}</dd></div>
              <div><dt>Paving / installation</dt><dd>{money(estimate.cost.pavingCost)}</dd></div>
              <div><dt>Delivery</dt><dd>{money(estimate.cost.deliveryCost)}</dd></div>
              <div><dt>Other fixed allowance</dt><dd>{money(estimate.cost.otherCost)}</dd></div>
            </dl>
          </div>
        ) : null}

        {estimateAvailable ? <details className="math-details">
          <summary>Show this estimate’s math</summary>
          <ol>
            <li>
              Area = {input.areaMode === "rectangle"
                ? `${format(input.length)} ${estimateDimensionsUnit} × ${format(input.width)} ${estimateDimensionsUnit}`
                : `entered total`} = {format(displayedArea)} {estimateAreaUnit}
            </li>
            <li>
              Volume = {format(displayedArea)} {estimateAreaUnit} × {format(input.thickness)} {estimateThicknessUnit}
              {estimateUsesUs ? " ÷ 12" : " ÷ 100"} = {format(displayedVolume, 3)} {estimateUsesUs ? "ft³" : "m³"}
            </li>
            <li>
              Weight = volume × {format(input.density)} {estimateDensityUnit} = {format(displayedWeight)} {estimateUsesUs ? "lb" : "kg"}
            </li>
            <li>
              Base tonnage = weight ÷ {estimateUsesUs ? "2,000 lb/short ton" : "1,000 kg/metric tonne"} = {format(displayedBaseTons, 3)} {estimateTonUnit}{displayedBaseTons === 1 ? "" : "s"}
            </li>
            <li>
              Order quantity = base tonnage × (1 + {format(input.wastePercent)} ÷ 100) = {format(displayedOrderTons, 3)} {estimateTonUnit}{displayedOrderTons === 1 ? "" : "s"}
            </li>
          </ol>
        </details> : null}

        {estimateAvailable ? <div className="result-actions">
          <button type="button" onClick={copyShareLink}>Copy share link</button>
          <button type="button" onClick={() => window.print()}>Print estimate</button>
        </div> : null}
        <p className="share-status" aria-live="polite">{shareStatus}</p>
        <p className="result-disclaimer">
          Planning estimate only. Confirm compacted density, quantity, order
          increments, scope, and current pricing with local professionals.
        </p>
      </div>
    </section>
  );
}
