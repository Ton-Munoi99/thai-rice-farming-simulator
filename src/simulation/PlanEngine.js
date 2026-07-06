import { VARIETIES } from "../data/mockData.js";
import { buildAutoRecommendation, computeSimulation, fertilizerNutrients } from "./SimulationEngine.js";
import { clamp } from "../utils/format.js";

const PLAN_TARGET_PROFIT = 1000;

function cloneInputs(inputs) {
  return {
    ...inputs,
    applications: inputs.applications.map((app) => ({ ...app })),
  };
}

function costProfileFromModel(model) {
  return model.costBreakdown.reduce((profile, item) => {
    profile[item.key] = item.value;
    return profile;
  }, {});
}

function scaleCostProfile(profile, patches) {
  return Object.entries(profile).reduce((next, [key, value]) => {
    const factor = patches[key] ?? 1;
    next[key] = Math.max(0, Math.round(value * factor));
    return next;
  }, {});
}

function simulatePlan({ costProfile, inputs, pricePerTon, strawPricePerKg, varietyKey, yieldPotentialOverride }) {
  const fertilizerReferenceCost = fertilizerNutrients(inputs.applications).cost;
  const profile = costProfile ? { ...costProfile, fertilizerReferenceCost } : null;
  return computeSimulation(inputs, { varietyKey, pricePerTon, strawPricePerKg, costProfile: profile, yieldPotentialOverride });
}

export function buildSurvivalPlans(simulation) {
  const { inputs, liveModel, pricePerTon, strawPricePerKg, varietyKey, yieldPotentialOverride } = simulation;
  const variety = VARIETIES[varietyKey];
  const baseProfile = costProfileFromModel(liveModel);
  const targetProfit = PLAN_TARGET_PROFIT;
  const currentProfit = liveModel.profitPerRai;

  const costInputs = cloneInputs(inputs);
  const costProfile = scaleCostProfile(baseProfile, {
    chemicals: 0.9,
    labor: 0.86,
    fuel: 0.88,
    transport: 0.82,
  });
  const costModel = simulatePlan({
    costProfile,
    inputs: costInputs,
    pricePerTon,
    strawPricePerKg,
    varietyKey,
    yieldPotentialOverride,
  });

  const yieldInputs = {
    ...cloneInputs(inputs),
    applications: buildAutoRecommendation(inputs, varietyKey).applications.map((app) => ({ ...app })),
    water: inputs.water === "Rainfed" ? "Alternate Wet-Dry (AWD)" : inputs.water,
    groundwater: clamp(Math.max(inputs.groundwater, 58), 0, 100),
    pest: clamp(Math.min(inputs.pest, 18), 0, 100),
    disease: clamp(Math.min(inputs.disease, 16), 0, 100),
    weed: clamp(Math.min(inputs.weed, 20), 0, 100),
    managementTiming: clamp(Math.max(inputs.managementTiming, 86), 0, 100),
  };
  const yieldProfile = scaleCostProfile(baseProfile, {
    chemicals: 1.05,
    labor: 1.02,
    fuel: 1.04,
  });
  const yieldPotential = Math.max(liveModel.yieldPotential ?? variety.potential, variety.potential) + 60;
  const yieldModel = simulatePlan({
    costProfile: yieldProfile,
    inputs: yieldInputs,
    pricePerTon,
    strawPricePerKg,
    varietyKey,
    yieldPotentialOverride: Math.max(yieldPotentialOverride ?? 0, yieldPotential),
  });

  const mixedInputs = {
    ...cloneInputs(inputs),
    applications: buildAutoRecommendation(inputs, varietyKey).applications.map((app) => ({ ...app })),
    water: "Alternate Wet-Dry (AWD)",
    groundwater: clamp(Math.max(inputs.groundwater, 52), 0, 100),
    pest: clamp(Math.min(inputs.pest, 24), 0, 100),
    disease: clamp(Math.min(inputs.disease, 22), 0, 100),
    weed: clamp(Math.min(inputs.weed, 24), 0, 100),
    managementTiming: clamp(Math.max(inputs.managementTiming, 80), 0, 100),
  };
  const mixedProfile = scaleCostProfile(baseProfile, {
    chemicals: 0.96,
    labor: 0.92,
    fuel: 0.94,
    transport: 0.88,
  });
  const mixedStrawPrice = Math.max(strawPricePerKg, 1.05);
  const mixedModel = simulatePlan({
    costProfile: mixedProfile,
    inputs: mixedInputs,
    pricePerTon,
    strawPricePerKg: mixedStrawPrice,
    varietyKey,
    yieldPotentialOverride: Math.max(yieldPotentialOverride ?? 0, (liveModel.yieldPotential ?? variety.potential) + 35),
  });

  return [
    makePlan({
      key: "cost",
      icon: "✂️",
      label: "Cost discipline",
      labelTh: "ลดต้นทุน",
      note: "Reduce controllable labor, fuel, transport, and chemical passes without changing market price.",
      noteTh: "ลดแรงงาน น้ำมัน ขนส่ง และรอบยาเท่าที่คุมได้ โดยไม่แตะราคาตลาด",
      currentProfit,
      model: costModel,
      payload: { inputs: costInputs, costProfile, strawPricePerKg, yieldPotentialOverride },
      targetProfit,
    }),
    makePlan({
      key: "yield",
      icon: "🌾",
      label: "Yield lift",
      labelTh: "เพิ่มผลผลิต",
      note: "Prioritize water reliability, timing, pest control, and balanced fertilizer.",
      noteTh: "เน้นน้ำที่เสถียร timing โรคแมลง และปุ๋ยสมดุลเพื่อดันผลผลิต",
      currentProfit,
      model: yieldModel,
      payload: {
        inputs: yieldInputs,
        costProfile: yieldProfile,
        strawPricePerKg,
        yieldPotentialOverride: Math.max(yieldPotentialOverride ?? 0, yieldPotential),
      },
      targetProfit,
    }),
    makePlan({
      key: "mixed",
      icon: "🧺",
      label: "Mixed survival",
      labelTh: "แผนผสม",
      note: "Combine moderate cost control, AWD/timing, and better straw market access.",
      noteTh: "ผสมลดต้นทุนระดับกลาง AWD/timing และตลาดฟางที่ดีขึ้น",
      currentProfit,
      model: mixedModel,
      payload: {
        inputs: mixedInputs,
        costProfile: mixedProfile,
        strawPricePerKg: mixedStrawPrice,
        yieldPotentialOverride: Math.max(yieldPotentialOverride ?? 0, (liveModel.yieldPotential ?? variety.potential) + 35),
      },
      targetProfit,
    }),
  ].sort((a, b) => b.model.profitPerRai - a.model.profitPerRai);
}

function makePlan({ currentProfit, icon, key, label, labelTh, model, note, noteTh, payload, targetProfit }) {
  return {
    key,
    icon,
    label,
    labelTh,
    note,
    noteTh,
    model,
    payload,
    profitDelta: model.profitPerRai - currentProfit,
    gapAfter: Math.max(0, targetProfit - model.profitPerRai),
    reachesTarget: model.profitPerRai >= targetProfit,
  };
}
