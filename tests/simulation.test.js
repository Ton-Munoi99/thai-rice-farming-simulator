import assert from "node:assert/strict";
import test from "node:test";
import { DEFAULT_INPUTS } from "../src/data/mockData.js";
import { buildDebtAnalysis } from "../src/simulation/DebtEngine.js";
import { buildSurvivalPlans } from "../src/simulation/PlanEngine.js";
import { buildSensitivityAnalysis } from "../src/simulation/SensitivityEngine.js";
import { computeSimulation, estimateStrawHarvest, fertilizerNutrients } from "../src/simulation/SimulationEngine.js";

function cloneInputs(inputs = DEFAULT_INPUTS) {
  return {
    ...inputs,
    applications: inputs.applications.map((app) => ({ ...app })),
  };
}

function modelFor(inputs = DEFAULT_INPUTS, context = {}) {
  return computeSimulation(cloneInputs(inputs), {
    varietyKey: "white",
    pricePerTon: 8000,
    strawPricePerKg: 0.75,
    ...context,
  });
}

test("fertilizerNutrients calculates N/P/K and fertilizer cost from applications", () => {
  const totals = fertilizerNutrients([
    { stage: "Basal", formula: "16-20-0", rate: 30 },
    { stage: "Tillering", formula: "46-0-0", rate: 10 },
    { stage: "Panicle", formula: "0-0-60", rate: 8 },
  ]);

  assert.equal(totals.rate, 48);
  assert.equal(Number(totals.N.toFixed(1)), 9.4);
  assert.equal(Number(totals.P.toFixed(1)), 6);
  assert.equal(Number(totals.K.toFixed(1)), 4.8);
  assert.equal(totals.cost, 1208);
  assert.deepEqual(totals.byStage.Tillering, { n: 4.6, p: 0, k: 0, rate: 10 });
});

test("estimateStrawHarvest caps collectable straw at surplus straw and keeps collection percent under 100", () => {
  const good = estimateStrawHarvest(cloneInputs(), 526, { strawPricePerKg: 0.75 }, { shortage: false, flooded: false, nExcess: false });
  const flood = estimateStrawHarvest(
    { ...cloneInputs(), weather: "Heavy Rain / Flood", disease: 55 },
    526,
    { strawPricePerKg: 0.75 },
    { shortage: false, flooded: true, nExcess: false },
  );

  assert.ok(good.collectableKgPerRai <= good.surplusKgPerRai);
  assert.ok(good.collectionPercent <= 100);
  assert.ok(flood.collectableKgPerRai < good.collectableKgPerRai);
  assert.equal(good.revenuePerRai, Math.round((good.collectableKgPerRai * 0.75) / 10) * 10);
});

test("computeSimulation keeps market price external to yield and cost", () => {
  const lowPrice = modelFor(DEFAULT_INPUTS, { pricePerTon: 7000 });
  const highPrice = modelFor(DEFAULT_INPUTS, { pricePerTon: 9000 });

  assert.equal(lowPrice.estimatedYieldKgPerRai, highPrice.estimatedYieldKgPerRai);
  assert.equal(lowPrice.costPerRai, highPrice.costPerRai);
  assert.equal(lowPrice.straw.collectableKgPerRai, highPrice.straw.collectableKgPerRai);
  assert.ok(highPrice.riceRevenuePerRai > lowPrice.riceRevenuePerRai);
  assert.ok(highPrice.profitPerRai > lowPrice.profitPerRai);
});

test("linked threat and weather conditions raise related cost drivers", () => {
  const base = modelFor(DEFAULT_INPUTS);
  const stressedInputs = {
    ...cloneInputs(),
    water: "Rainfed",
    groundwater: 10,
    pest: 75,
    disease: 65,
    weed: 70,
    weather: "Heavy Rain / Flood",
    managementTiming: 45,
  };
  const stressed = modelFor(stressedInputs);

  assert.ok(stressed.costPerRai > base.costPerRai);
  assert.ok(stressed.costDrivers.total > base.costDrivers.total);
  assert.ok((stressed.costDrivers.byItem.labor ?? 0) > 0);
  assert.ok((stressed.costDrivers.byItem.fuel ?? 0) > 0);
  assert.ok((stressed.costDrivers.byItem.transport ?? 0) > 0);
  assert.ok(stressed.chemicalProgram.cost > base.chemicalProgram.cost);
});

test("survival plans are sorted by profit and include apply-ready payloads", () => {
  const inputs = cloneInputs();
  const liveModel = modelFor(inputs);
  const plans = buildSurvivalPlans({
    inputs,
    liveModel,
    pricePerTon: 8000,
    strawPricePerKg: 0.75,
    varietyKey: "white",
    yieldPotentialOverride: null,
  });

  assert.equal(plans.length, 3);
  assert.deepEqual(
    plans.map((plan) => plan.model.profitPerRai),
    [...plans.map((plan) => plan.model.profitPerRai)].sort((a, b) => b - a),
  );
  assert.ok(plans.some((plan) => plan.profitDelta > 0));

  for (const plan of plans) {
    assert.ok(plan.key);
    assert.ok(plan.payload.inputs.applications.length > 0);
    assert.ok(plan.payload.costProfile);
    assert.equal(typeof plan.payload.strawPricePerKg, "number");
    assert.equal(plan.gapAfter, Math.max(0, 1000 - plan.model.profitPerRai));
  }
});

test("sensitivity analysis includes current price/yield and lower costs improve profit", () => {
  const inputs = cloneInputs();
  const model = modelFor(inputs);
  const analysis = buildSensitivityAnalysis({ inputs, model, pricePerTon: 8000, strawPricePerKg: 0.75 });

  assert.ok(analysis.priceColumns.includes(8000));
  assert.equal(analysis.currentYield, model.estimatedYieldKgPerRai);
  assert.equal(analysis.currentCost, model.costPerRai);

  const costDown = analysis.costLevels.find((level) => level.key === "down");
  const current = analysis.costLevels.find((level) => level.key === "current");
  const costUp = analysis.costLevels.find((level) => level.key === "up");
  assert.ok(costDown.profit > current.profit);
  assert.ok(current.profit > costUp.profit);
});

test("debt analysis stays cash-positive for profitable scenarios and computes debt for losses", () => {
  const inputs = cloneInputs();
  const profitable = modelFor(inputs, { pricePerTon: 18000, strawPricePerKg: 1.05 });
  const profitDebt = buildDebtAnalysis({ farmSize: 10, inputs, model: profitable, pricePerTon: 18000, strawPricePerKg: 1.05 });
  assert.equal(profitDebt.cashShortfall, 0);
  assert.equal(profitDebt.debtDue, 0);
  assert.equal(profitDebt.status.tone, "good");

  const lossModel = modelFor({
    ...inputs,
    pest: 80,
    disease: 70,
    weed: 70,
    weather: "Heavy Rain / Flood",
  });
  const lossDebt = buildDebtAnalysis({ farmSize: 10, inputs, model: lossModel, pricePerTon: 8000, strawPricePerKg: 0.75 });
  assert.ok(lossDebt.cashShortfall > 0);
  assert.ok(lossDebt.debtDue >= lossDebt.cashShortfall);
  assert.ok(lossDebt.requiredPricePerTon >= 8000);
});
