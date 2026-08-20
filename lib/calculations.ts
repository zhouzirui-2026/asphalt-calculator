export type UnitSystem = "us" | "metric";
export type AreaMode = "rectangle" | "known-area";

export const SQ_FT_PER_SQ_M = 10.763910416709722;
export const FT_PER_M = 3.280839895013123;
export const CM_PER_IN = 2.54;
export const KG_M3_PER_LB_FT3 = 16.01846337396014;
export const LB_PER_KG = 2.2046226218487757;
export const LB_PER_SHORT_TON = 2000;
export const KG_PER_METRIC_TONNE = 1000;
export const SHORT_TONS_PER_METRIC_TONNE = 1.1023113109243878;
export const CUBIC_FT_PER_CUBIC_M = 35.31466672148859;
export const CUBIC_FT_PER_CUBIC_YD = 27;
export const DEFAULT_DENSITY_LB_FT3 = 145;

const DECIMAL_INPUT_PATTERN = /^-?(?:\d+(?:\.\d+)?|\.\d+)(?:[eE][+-]?\d+)?$/;

export function parseDecimalInput(value: string) {
  if (!DECIMAL_INPUT_PATTERN.test(value)) return Number.NaN;
  return Number(value);
}

export interface MaterialInput {
  unitSystem: UnitSystem;
  areaMode: AreaMode;
  length: number;
  width: number;
  area: number;
  thickness: number;
  density: number;
  wastePercent: number;
  unitPrice: number;
}

export interface MaterialResult {
  areaSqFt: number;
  areaSqM: number;
  baseVolumeCubicFt: number;
  baseVolumeCubicYd: number;
  baseVolumeCubicM: number;
  baseWeightLb: number;
  baseWeightKg: number;
  baseShortTons: number;
  baseMetricTonnes: number;
  orderVolumeCubicYd: number;
  orderVolumeCubicM: number;
  orderWeightLb: number;
  orderWeightKg: number;
  orderShortTons: number;
  orderMetricTonnes: number;
  materialCost: number;
  wasteMultiplier: number;
}

export interface DrivewayCostInput extends MaterialInput {
  preparationRate: number;
  pavingRate: number;
  deliveryCost: number;
  otherCost: number;
}

export interface DrivewayCostResult {
  material: MaterialResult;
  pricedArea: number;
  materialCost: number;
  preparationCost: number;
  pavingCost: number;
  deliveryCost: number;
  otherCost: number;
  totalCost: number;
  costPerArea: number;
}

export type ValidationErrors = Record<string, string>;

function isFiniteNumber(value: number) {
  return Number.isFinite(value);
}

function areaInSquareFeet(input: MaterialInput) {
  const displayedArea = input.areaMode === "rectangle"
    ? input.length * input.width
    : input.area;
  return input.unitSystem === "us"
    ? displayedArea
    : displayedArea * SQ_FT_PER_SQ_M;
}

function thicknessInFeet(input: MaterialInput) {
  return input.unitSystem === "us"
    ? input.thickness / 12
    : input.thickness / 100 * FT_PER_M;
}

function densityInLbPerCubicFoot(input: MaterialInput) {
  return input.unitSystem === "us"
    ? input.density
    : input.density / KG_M3_PER_LB_FT3;
}

export function validateMaterialInput(input: MaterialInput): ValidationErrors {
  const errors: ValidationErrors = {};
  const lengthLabel = input.unitSystem === "us" ? "feet" : "meters";
  const areaLabel = input.unitSystem === "us" ? "square feet" : "square meters";

  if (input.areaMode === "rectangle") {
    if (!isFiniteNumber(input.length) || input.length <= 0) {
      errors.length = `Enter a length greater than 0 ${lengthLabel}.`;
    }
    if (!isFiniteNumber(input.width) || input.width <= 0) {
      errors.width = `Enter a width greater than 0 ${lengthLabel}.`;
    }
    const lengthFt = input.unitSystem === "us" ? input.length : input.length * FT_PER_M;
    const widthFt = input.unitSystem === "us" ? input.width : input.width * FT_PER_M;
    if (isFiniteNumber(input.length) && input.length > 0 && !isFiniteNumber(lengthFt)) {
      errors.length = "Length is too large to calculate.";
    } else if (isFiniteNumber(lengthFt) && lengthFt > 1_000_000) {
      errors.length = "Length must not exceed 1,000,000 feet (304,800 m).";
    }
    if (isFiniteNumber(input.width) && input.width > 0 && !isFiniteNumber(widthFt)) {
      errors.width = "Width is too large to calculate.";
    } else if (isFiniteNumber(widthFt) && widthFt > 1_000_000) {
      errors.width = "Width must not exceed 1,000,000 feet (304,800 m).";
    }
  } else if (!isFiniteNumber(input.area) || input.area <= 0) {
    errors.area = `Enter an area greater than 0 ${areaLabel}.`;
  }

  const squareFeet = areaInSquareFeet(input);
  const hasPositiveAreaInputs = input.areaMode === "rectangle"
    ? isFiniteNumber(input.length) && input.length > 0
      && isFiniteNumber(input.width) && input.width > 0
    : isFiniteNumber(input.area) && input.area > 0;
  const areaFieldsAreValid = hasPositiveAreaInputs && (input.areaMode === "rectangle"
    ? !errors.length && !errors.width
    : !errors.area);
  if (areaFieldsAreValid) {
    if (!isFiniteNumber(squareFeet)) {
      errors.areaLimit = "Area is too large to calculate.";
    } else if (squareFeet > 100_000_000) {
      errors.areaLimit = "Area must not exceed 100,000,000 square feet (9,290,304 m²).";
    } else if (squareFeet < 0.000001) {
      errors.areaLimit = "Area must be at least 0.000001 square foot (0.000000093 m²).";
    }
  }

  const thicknessInches = input.unitSystem === "us"
    ? input.thickness
    : input.thickness / CM_PER_IN;
  if (!isFiniteNumber(input.thickness) || thicknessInches < 0.001) {
    errors.thickness = "Enter a compacted thickness of at least 0.001 inch (0.00254 cm).";
  } else if (thicknessInches > 120) {
    errors.thickness = "Thickness must not exceed 120 inches (304.8 cm).";
  }

  const densityLbFt3 = densityInLbPerCubicFoot(input);
  if (!isFiniteNumber(input.density) || densityLbFt3 < 50 || densityLbFt3 > 250) {
    errors.density = "Use a density from 50 to 250 lb/ft³ (801 to 4,005 kg/m³).";
  }

  if (!isFiniteNumber(input.wastePercent) || input.wastePercent < 0 || input.wastePercent > 100) {
    errors.wastePercent = "Waste allowance must be from 0% to 100%.";
  }

  const pricePerShortTon = input.unitSystem === "us"
    ? input.unitPrice
    : input.unitPrice / SHORT_TONS_PER_METRIC_TONNE;
  if (!isFiniteNumber(input.unitPrice) || input.unitPrice < 0 || pricePerShortTon > 100_000) {
    errors.unitPrice = "Material price must be from 0 to 100,000 per short ton equivalent (110,231 per metric tonne).";
  }

  return errors;
}

export function calculateMaterial(input: MaterialInput): MaterialResult {
  const errors = validateMaterialInput(input);
  if (Object.keys(errors).length > 0) {
    throw new RangeError(Object.values(errors)[0]);
  }

  const areaSqFt = areaInSquareFeet(input);
  const areaSqM = areaSqFt / SQ_FT_PER_SQ_M;
  const baseVolumeCubicFt = areaSqFt * thicknessInFeet(input);
  const baseVolumeCubicYd = baseVolumeCubicFt / CUBIC_FT_PER_CUBIC_YD;
  const baseVolumeCubicM = baseVolumeCubicFt / CUBIC_FT_PER_CUBIC_M;
  const baseWeightLb = baseVolumeCubicFt * densityInLbPerCubicFoot(input);
  const baseWeightKg = baseWeightLb / LB_PER_KG;
  const baseShortTons = baseWeightLb / LB_PER_SHORT_TON;
  const baseMetricTonnes = baseWeightKg / KG_PER_METRIC_TONNE;
  const wasteMultiplier = 1 + input.wastePercent / 100;
  const orderShortTons = baseShortTons * wasteMultiplier;
  const orderMetricTonnes = baseMetricTonnes * wasteMultiplier;
  const materialCost = input.unitSystem === "us"
    ? orderShortTons * input.unitPrice
    : orderMetricTonnes * input.unitPrice;

  return {
    areaSqFt,
    areaSqM,
    baseVolumeCubicFt,
    baseVolumeCubicYd,
    baseVolumeCubicM,
    baseWeightLb,
    baseWeightKg,
    baseShortTons,
    baseMetricTonnes,
    orderVolumeCubicYd: baseVolumeCubicYd * wasteMultiplier,
    orderVolumeCubicM: baseVolumeCubicM * wasteMultiplier,
    orderWeightLb: baseWeightLb * wasteMultiplier,
    orderWeightKg: baseWeightKg * wasteMultiplier,
    orderShortTons,
    orderMetricTonnes,
    materialCost,
    wasteMultiplier,
  };
}

export function validateDrivewayCostInput(input: DrivewayCostInput): ValidationErrors {
  const errors = validateMaterialInput(input);
  const rateFields = [
    ["preparationRate", input.preparationRate, "Preparation rate"],
    ["pavingRate", input.pavingRate, "Paving rate"],
  ] as const;
  const fixedFields = [
    ["deliveryCost", input.deliveryCost, "Delivery allowance"],
    ["otherCost", input.otherCost, "Other allowance"],
  ] as const;

  for (const [key, value, label] of rateFields) {
    const ratePerSqFt = input.unitSystem === "us" ? value : value / SQ_FT_PER_SQ_M;
    if (!isFiniteNumber(value) || value < 0 || ratePerSqFt > 1_000) {
      errors[key] = `${label} must be from 0 to 1,000/ft² equivalent (10,763.91/m²).`;
    }
  }
  for (const [key, value, label] of fixedFields) {
    if (!isFiniteNumber(value) || value < 0 || value > 10_000_000) {
      errors[key] = `${label} must be from 0 to 10,000,000.`;
    }
  }
  return errors;
}

export function calculateDrivewayCost(input: DrivewayCostInput): DrivewayCostResult {
  const errors = validateDrivewayCostInput(input);
  if (Object.keys(errors).length > 0) {
    throw new RangeError(Object.values(errors)[0]);
  }

  const material = calculateMaterial(input);
  const pricedArea = input.unitSystem === "us" ? material.areaSqFt : material.areaSqM;
  const preparationCost = pricedArea * input.preparationRate;
  const pavingCost = pricedArea * input.pavingRate;
  const totalCost = material.materialCost + preparationCost + pavingCost
    + input.deliveryCost + input.otherCost;

  return {
    material,
    pricedArea,
    materialCost: material.materialCost,
    preparationCost,
    pavingCost,
    deliveryCost: input.deliveryCost,
    otherCost: input.otherCost,
    totalCost,
    costPerArea: totalCost / pricedArea,
  };
}
