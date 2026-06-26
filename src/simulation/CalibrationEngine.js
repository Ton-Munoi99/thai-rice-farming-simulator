import { DEFAULT_INPUTS, SCENARIO_ENVIRONMENTS, VARIETIES } from "../data/mockData.js";
import { computeSimulation } from "./SimulationEngine.js";

function cloneInputs(inputs) {
  return {
    ...inputs,
    applications: inputs.applications.map((app) => ({ ...app })),
  };
}

const CALIBRATION_ANCHORS = [
  {
    key: "whiteBase",
    label: "White rice baseline",
    labelTh: "ข้าวขาวฐาน",
    varietyKey: "white",
    pricePerTon: 8000,
    strawPricePerKg: 0.75,
    inputs: DEFAULT_INPUTS,
    observed: { yieldKgPerRai: 520, costPerRai: 6100, collectableStrawKgPerRai: 360 },
  },
  {
    key: "whiteDry",
    label: "White rice drought stress",
    labelTh: "ข้าวขาวเสี่ยงแล้ง",
    varietyKey: "white",
    pricePerTon: 8000,
    strawPricePerKg: 0.6,
    inputs: {
      applications: VARIETIES.white.presets.drought,
      ...SCENARIO_ENVIRONMENTS.drought,
    },
    observed: { yieldKgPerRai: 390, costPerRai: 5750, collectableStrawKgPerRai: 290 },
  },
  {
    key: "whiteFlood",
    label: "Flood before harvest",
    labelTh: "น้ำท่วมก่อนเก็บเกี่ยว",
    varietyKey: "white",
    pricePerTon: 8000,
    strawPricePerKg: 0.45,
    inputs: {
      applications: VARIETIES.white.presets.flood,
      ...SCENARIO_ENVIRONMENTS.flood,
    },
    observed: { yieldKgPerRai: 360, costPerRai: 6500, collectableStrawKgPerRai: 170 },
  },
  {
    key: "homMaliBase",
    label: "Hom Mali rainfed baseline",
    labelTh: "หอมมะลิน้ำฝนฐาน",
    varietyKey: "jasmine",
    pricePerTon: 18000,
    strawPricePerKg: 0.75,
    inputs: {
      ...cloneInputs(DEFAULT_INPUTS),
      applications: VARIETIES.jasmine.defaultApps.map((app) => ({ ...app })),
      water: "Rainfed",
      groundwater: 22,
      weather: "Normal",
      managementTiming: 74,
    },
    observed: { yieldKgPerRai: 350, costPerRai: 5100, collectableStrawKgPerRai: 230 },
  },
];

function gap(modelValue, observedValue) {
  return Math.round(modelValue - observedValue);
}

export function buildCalibrationCases() {
  return CALIBRATION_ANCHORS.map((anchor) => {
    const model = computeSimulation(cloneInputs(anchor.inputs), {
      varietyKey: anchor.varietyKey,
      pricePerTon: anchor.pricePerTon,
      strawPricePerKg: anchor.strawPricePerKg,
    });

    return {
      ...anchor,
      model,
      gaps: {
        yieldKgPerRai: gap(model.estimatedYieldKgPerRai, anchor.observed.yieldKgPerRai),
        costPerRai: gap(model.costPerRai, anchor.observed.costPerRai),
        collectableStrawKgPerRai: gap(model.straw.collectableKgPerRai, anchor.observed.collectableStrawKgPerRai),
      },
    };
  });
}
