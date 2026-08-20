import assert from "node:assert/strict";
import test from "node:test";
import {
  CM_PER_IN,
  DEFAULT_DENSITY_LB_FT3,
  KG_M3_PER_LB_FT3,
  SHORT_TONS_PER_METRIC_TONNE,
  SQ_FT_PER_SQ_M,
  calculateDrivewayCost,
  calculateMaterial,
  parseDecimalInput,
  validateDrivewayCostInput,
  validateMaterialInput,
} from "../lib/calculations.ts";
import {
  analyticsPageLocation,
  isGoogleAnalyticsCookieName,
  isValidGaMeasurementId,
} from "../lib/analytics.ts";

const usInput = {
  unitSystem: "us",
  areaMode: "rectangle",
  length: 20,
  width: 10,
  area: 0,
  thickness: 4,
  density: DEFAULT_DENSITY_LB_FT3,
  wastePercent: 5,
  unitPrice: 100,
};

test("analytics accepts GA4 IDs and strips share-link query values", () => {
  assert.equal(isValidGaMeasurementId("G-ABC123XYZ"), true);
  assert.equal(isValidGaMeasurementId("UA-123-1"), false);
  assert.equal(isValidGaMeasurementId("G-ABC123;alert(1)"), false);
  assert.equal(
    analyticsPageLocation(
      "https://asphalt-calculator.top",
      "/asphalt-calculator?l=20&w=10&p=100#results",
    ),
    "https://asphalt-calculator.top/asphalt-calculator",
  );
  for (const name of ["_ga", "_ga_ABC123", "_gid", "_gat", "_gat_gtag_G_ABC", "_gac_UA_1"]) {
    assert.equal(isGoogleAnalyticsCookieName(name), true, `${name} should be removable`);
  }
  for (const name of ["session", "asphalt-analytics-consent", "ga", "_other"]) {
    assert.equal(isGoogleAnalyticsCookieName(name), false, `${name} must be preserved`);
  }
});

test("parses only decimal strings accepted by number inputs", () => {
  assert.equal(parseDecimalInput("12.5"), 12.5);
  assert.equal(parseDecimalInput(".5"), 0.5);
  assert.equal(parseDecimalInput("1e+3"), 1_000);
  for (const value of ["", " ", " 1", "+1", "1.", "0x10", "0b10", "Infinity"]) {
    assert.ok(Number.isNaN(parseDecimalInput(value)), `${value || "empty"} must be rejected`);
  }
});

test("calculates US area, volume, base tonnage, waste, and material cost", () => {
  const result = calculateMaterial(usInput);
  assert.equal(result.areaSqFt, 200);
  assert.ok(Math.abs(result.baseVolumeCubicFt - 66.6666666667) < 1e-9);
  assert.ok(Math.abs(result.baseShortTons - 4.8333333333) < 1e-9);
  assert.ok(Math.abs(result.orderShortTons - 5.075) < 1e-12);
  assert.ok(Math.abs(result.materialCost - 507.5) < 1e-9);
});

test("known-area mode ignores rectangle dimensions", () => {
  const result = calculateMaterial({
    ...usInput,
    areaMode: "known-area",
    length: 0,
    width: 0,
    area: 1_000,
    thickness: 3,
    wastePercent: 0,
  });
  assert.equal(result.areaSqFt, 1_000);
  assert.equal(result.baseVolumeCubicFt, 250);
  assert.equal(result.baseShortTons, 18.125);
});

test("metric inputs produce the same physical quantity and equivalent price", () => {
  const us = calculateMaterial(usInput);
  const metric = calculateMaterial({
    unitSystem: "metric",
    areaMode: "rectangle",
    length: 20 / 3.280839895013123,
    width: 10 / 3.280839895013123,
    area: 0,
    thickness: 4 * CM_PER_IN,
    density: DEFAULT_DENSITY_LB_FT3 * KG_M3_PER_LB_FT3,
    wastePercent: 5,
    unitPrice: 100 * SHORT_TONS_PER_METRIC_TONNE,
  });
  assert.ok(Math.abs(metric.orderMetricTonnes - us.orderMetricTonnes) < 1e-12);
  assert.ok(Math.abs(metric.orderShortTons - us.orderShortTons) < 1e-12);
  assert.ok(Math.abs(metric.materialCost - us.materialCost) < 1e-9);
});

test("area conversion is exact enough for common field inputs", () => {
  const result = calculateMaterial({
    ...usInput,
    unitSystem: "metric",
    areaMode: "known-area",
    area: 100,
    thickness: 10,
    density: DEFAULT_DENSITY_LB_FT3 * KG_M3_PER_LB_FT3,
    wastePercent: 0,
    unitPrice: 0,
  });
  assert.ok(Math.abs(result.areaSqFt - 100 * SQ_FT_PER_SQ_M) < 1e-10);
  assert.ok(Math.abs(result.areaSqM - 100) < 1e-10);
});

test("rejects zero, negative, non-finite, and out-of-range material inputs", () => {
  const invalid = validateMaterialInput({
    ...usInput,
    length: 0,
    width: -1,
    thickness: Number.NaN,
    density: 10,
    wastePercent: 101,
    unitPrice: -1,
  });
  assert.deepEqual(Object.keys(invalid).sort(), [
    "density",
    "length",
    "thickness",
    "unitPrice",
    "wastePercent",
    "width",
  ]);
  assert.throws(() => calculateMaterial({ ...usInput, length: 0 }), RangeError);
});

test("accepts documented upper boundaries and rejects values beyond them", () => {
  assert.deepEqual(validateMaterialInput({
    ...usInput,
    areaMode: "known-area",
    area: 100_000_000,
    thickness: 120,
    density: 250,
    wastePercent: 100,
    unitPrice: 100_000,
  }), {});
  assert.ok(validateMaterialInput({
    ...usInput,
    areaMode: "known-area",
    area: 100_000_001,
  }).areaLimit);
});

test("rejects metric conversions and derived areas that overflow", () => {
  const rectangleErrors = validateMaterialInput({
    ...usInput,
    unitSystem: "metric",
    length: 1e308,
    width: 1e308,
    thickness: 10,
    density: DEFAULT_DENSITY_LB_FT3 * KG_M3_PER_LB_FT3,
  });
  assert.ok(rectangleErrors.length);
  assert.ok(rectangleErrors.width);
  assert.equal(rectangleErrors.areaLimit, undefined, "derived errors must not duplicate dimension errors");
  assert.throws(() => calculateMaterial({
    ...usInput,
    unitSystem: "metric",
    length: 1e308,
    width: 1e308,
    thickness: 10,
    density: DEFAULT_DENSITY_LB_FT3 * KG_M3_PER_LB_FT3,
  }), RangeError);

  const knownAreaErrors = validateMaterialInput({
    ...usInput,
    unitSystem: "metric",
    areaMode: "known-area",
    area: 1e308,
    thickness: 10,
    density: DEFAULT_DENSITY_LB_FT3 * KG_M3_PER_LB_FT3,
  });
  assert.ok(knownAreaErrors.areaLimit);
});

test("rejects positive dimensions whose derived area underflows to zero", () => {
  const underflowInput = {
    ...usInput,
    length: 1e-300,
    width: 1e-300,
  };
  assert.ok(validateMaterialInput(underflowInput).areaLimit);
  assert.throws(() => calculateMaterial(underflowInput), RangeError);
  assert.throws(() => calculateDrivewayCost({
    ...underflowInput,
    preparationRate: 0,
    pavingRate: 0,
    deliveryCost: 0,
    otherCost: 0,
  }), RangeError);
});

test("driveway cost separates material, area rates, and fixed allowances", () => {
  const result = calculateDrivewayCost({
    ...usInput,
    unitPrice: 100,
    preparationRate: 1.5,
    pavingRate: 3,
    deliveryCost: 250,
    otherCost: 100,
  });
  assert.equal(result.materialCost, 507.5);
  assert.equal(result.preparationCost, 300);
  assert.equal(result.pavingCost, 600);
  assert.equal(result.totalCost, 1_757.5);
  assert.equal(result.costPerArea, 8.7875);
});

test("equivalent metric driveway rates preserve total cost across unit systems", () => {
  const us = calculateDrivewayCost({
    ...usInput,
    preparationRate: 1.5,
    pavingRate: 3,
    deliveryCost: 250,
    otherCost: 100,
  });
  const metric = calculateDrivewayCost({
    unitSystem: "metric",
    areaMode: "rectangle",
    length: 20 / 3.280839895013123,
    width: 10 / 3.280839895013123,
    area: 0,
    thickness: 4 * CM_PER_IN,
    density: DEFAULT_DENSITY_LB_FT3 * KG_M3_PER_LB_FT3,
    wastePercent: 5,
    unitPrice: 100 * SHORT_TONS_PER_METRIC_TONNE,
    preparationRate: 1.5 * SQ_FT_PER_SQ_M,
    pavingRate: 3 * SQ_FT_PER_SQ_M,
    deliveryCost: 250,
    otherCost: 100,
  });
  assert.ok(Math.abs(metric.totalCost - us.totalCost) < 1e-9);
  assert.ok(Math.abs(metric.costPerArea - us.costPerArea * SQ_FT_PER_SQ_M) < 1e-9);
});

test("driveway cost validation rejects negative and excessive allowances", () => {
  const errors = validateDrivewayCostInput({
    ...usInput,
    preparationRate: -1,
    pavingRate: 1_001,
    deliveryCost: Number.POSITIVE_INFINITY,
    otherCost: 10_000_001,
  });
  assert.ok(errors.preparationRate);
  assert.ok(errors.pavingRate);
  assert.ok(errors.deliveryCost);
  assert.ok(errors.otherCost);
});

test("metric validation uses physical and economic equivalents at boundaries", () => {
  assert.deepEqual(validateDrivewayCostInput({
    unitSystem: "metric",
    areaMode: "known-area",
    length: 0,
    width: 0,
    area: 100_000_000 / SQ_FT_PER_SQ_M,
    thickness: 120 * CM_PER_IN,
    density: 250 * KG_M3_PER_LB_FT3,
    wastePercent: 100,
    unitPrice: 100_000 * SHORT_TONS_PER_METRIC_TONNE,
    preparationRate: 1_000 * SQ_FT_PER_SQ_M,
    pavingRate: 1_000 * SQ_FT_PER_SQ_M,
    deliveryCost: 10_000_000,
    otherCost: 10_000_000,
  }), {});
});
