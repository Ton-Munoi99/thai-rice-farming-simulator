import { FERTILIZER_FORMULAS, VARIETIES } from "../data/mockData.js";
import { clamp } from "../utils/format.js";

export function fertilizerNutrients(applications) {
  const totals = { N: 0, P: 0, K: 0, rate: 0, cost: 0, byStage: {} };

  applications.forEach((application) => {
    const formula = FERTILIZER_FORMULAS[application.formula] ?? FERTILIZER_FORMULAS.None;
    const n = (application.rate * formula.n) / 100;
    const p = (application.rate * formula.p) / 100;
    const k = (application.rate * formula.k) / 100;

    totals.N += n;
    totals.P += p;
    totals.K += k;
    totals.rate += application.rate;
    totals.cost += application.rate * formula.price;
    totals.byStage[application.stage] = { n, p, k, rate: application.rate };
  });

  return totals;
}

export function neutralFieldCondition() {
  return {
    greenness: 0.04,
    vigor: 0.92,
    density: 0.78,
    lodging: false,
    shortage: false,
    flooded: false,
    pumpActive: false,
    pest: 8,
    disease: 6,
    weed: 10,
    goldenness: 0.72,
    weather: "Good Monsoon",
  };
}

export const COST_ITEMS = [
  { key: "seed", label: "เมล็ดพันธุ์ Seed" },
  { key: "fertilizer", label: "ปุ๋ยเคมี Fertilizer" },
  { key: "chemicals", label: "สารเคมี/ยา Chemicals" },
  { key: "labor", label: "แรงงาน+เครื่องจักร Labor" },
  { key: "rent", label: "ค่าเช่านา Rent" },
  { key: "fuel", label: "น้ำมันเชื้อเพลิง Fuel" },
  { key: "transport", label: "ขนส่ง/อื่นๆ Transport" },
];

export function estimateStrawHarvest(inputs, estimatedYieldKgPerRai, context, flags) {
  // Rice-map method: total rice straw = paddy production x RPR, then surplus straw = total straw x SAF.
  const residueToPaddyRatio = 1.169;
  const surplusAvailabilityFactor = 0.583;
  const totalResidueKgPerRai = Math.round(estimatedYieldKgPerRai * residueToPaddyRatio);
  const surplusKgPerRai = Math.round(totalResidueKgPerRai * surplusAvailabilityFactor);

  let collectionFactor = 1;
  if (inputs.weather === "Good Monsoon") collectionFactor += 0.03;
  if (inputs.weather === "Drought") collectionFactor -= 0.06;
  if (inputs.weather === "Heavy Rain / Flood") collectionFactor -= 0.25;
  if (flags.shortage) collectionFactor -= 0.08;
  if (flags.flooded) collectionFactor -= 0.16;
  if (flags.nExcess) collectionFactor -= 0.06;

  collectionFactor -= clamp((inputs.disease - 30) * 0.003, 0, 0.18);
  collectionFactor -= clamp((inputs.pest - 45) * 0.0015, 0, 0.08);
  collectionFactor -= clamp((inputs.weed - 35) * 0.002, 0, 0.12);
  collectionFactor -= clamp((72 - inputs.managementTiming) * 0.004, 0, 0.18);
  collectionFactor = clamp(collectionFactor, 0.42, 1);

  const collectableKgPerRai = Math.round(surplusKgPerRai * collectionFactor);
  const pricePerKg = clamp(Number(context.strawPricePerKg) || 0, 0, 10);
  const revenuePerRai = Math.round((collectableKgPerRai * pricePerKg) / 10) * 10;

  return {
    totalResidueKgPerRai,
    surplusKgPerRai,
    collectableKgPerRai,
    collectionFactor,
    collectionPercent: surplusKgPerRai > 0 ? Math.round((collectableKgPerRai / surplusKgPerRai) * 100) : 0,
    surplusPercent: Math.round(surplusAvailabilityFactor * 1000) / 10,
    residueToPaddyRatio,
    surplusAvailabilityFactor,
    pricePerKg,
    revenuePerRai,
    reference: {
      collectableRangeKgPerRai: [400, 500],
      residueToPaddyRatio,
      surplusAvailabilityFactor,
    },
  };
}

function estimateChemicalProgram(inputs, baseCost) {
  const items = [];
  let cost = baseCost;

  if (inputs.weed >= 25) {
    const weedCost = inputs.weed >= 65 ? 650 : inputs.weed >= 45 ? 450 : 280;
    cost += weedCost;
    items.push({
      en:
        inputs.weed >= 65
          ? "High weed pressure: herbicide plus follow-up weeding"
          : inputs.weed >= 45
            ? "Weed control: herbicide / follow-up weeding"
            : "Weed control: one early herbicide or weeding pass",
      th:
        inputs.weed >= 65
          ? "วัชพืชสูง: ยาคุม/ฆ่าหญ้าและกำจัดซ้ำ"
          : inputs.weed >= 45
            ? "คุมวัชพืชระดับกลาง-สูง: ยาคุม/ฆ่าหญ้า หรือกำจัดซ้ำ"
            : "คุมวัชพืชช่วงต้น 1 รอบ",
      cost: weedCost,
    });
  }

  if (inputs.pest >= 45) {
    const pestCost = inputs.pest >= 75 ? 700 : inputs.pest >= 60 ? 500 : 350;
    cost += pestCost;
    items.push({
      en:
        inputs.pest >= 75
          ? "Severe pest outbreak: IPM spray program and frequent scouting"
          : inputs.pest >= 60
            ? "Pest outbreak: targeted IPM spray and scouting"
            : "Pest watch: targeted control if economic threshold is reached",
      th:
        inputs.pest >= 75
          ? "แมลงระบาดหนัก: IPM และสำรวจถี่ขึ้น"
          : inputs.pest >= 60
            ? "แมลงระบาด: สำรวจและพ่นเฉพาะเป้าหมายตาม IPM"
            : "เฝ้าระวังแมลง: ควบคุมเมื่อถึงระดับระบาด",
      cost: pestCost,
    });
  }

  if (inputs.disease >= 40) {
    const diseaseCost = inputs.disease >= 65 ? 650 : inputs.disease >= 50 ? 450 : 300;
    cost += diseaseCost;
    items.push({
      en:
        inputs.disease >= 65
          ? "Severe disease pressure: disease-control program and monitoring"
          : inputs.disease >= 50
            ? "Disease outbreak: fungicide/bactericide program"
            : "Disease watch: one corrective disease-control pass",
      th:
        inputs.disease >= 65
          ? "โรคระบาดหนัก: คุมโรคและติดตามอาการต่อเนื่อง"
          : inputs.disease >= 50
            ? "โรคระบาด: คุมโรคตามอาการและฉลากสาร"
            : "เฝ้าระวังโรค: คุมโรคเฉพาะเมื่อพบอาการ",
      cost: diseaseCost,
    });
  }

  if (items.length === 0) {
    items.push({
      en: "No routine pesticide assumed; budget covers scouting/seed treatment only",
      th: "ไม่ตั้งพ่นยาประจำ เผื่องบสำรวจแปลง/คลุกเมล็ดเท่านั้น",
      cost: baseCost,
    });
  }

  return { cost, items, isAuto: true };
}

export function buildAutoRecommendation(inputs, varietyKey) {
  const variety = VARIETIES[varietyKey];
  const isJasmine = varietyKey === "jasmine";
  const diseasePressure = inputs.disease >= 40 || inputs.weather === "Heavy Rain / Flood";
  const pestPressure = inputs.pest >= 45;
  const weedPressure = inputs.weed >= 40;
  const droughtRisk = inputs.weather === "Drought" || (inputs.water === "Rainfed" && inputs.groundwater < 35);
  const poorSoil = inputs.soil === "Poor / Sandy";
  const richSoil = inputs.soil === "Rich Clay-Loam";

  let basalRate = isJasmine ? 25 : 30;
  let tilleringRate = isJasmine ? 5 : 10;
  let panicleRate = isJasmine ? 5 : 8;

  if (poorSoil) {
    basalRate += isJasmine ? 2 : 5;
    panicleRate += 2;
  }

  if (richSoil) {
    basalRate -= isJasmine ? 2 : 3;
  }

  if (droughtRisk) {
    basalRate -= isJasmine ? 7 : 10;
    tilleringRate -= isJasmine ? 5 : 5;
    panicleRate -= 3;
  }

  if (diseasePressure || pestPressure) {
    tilleringRate -= isJasmine ? 2 : 3;
    panicleRate += 2;
  }

  if (inputs.managementTiming < 55) {
    tilleringRate -= 2;
  }

  basalRate = clamp(Math.round(basalRate), isJasmine ? 12 : 15, isJasmine ? 30 : 35);
  tilleringRate = clamp(Math.round(tilleringRate), 0, isJasmine ? 8 : 12);
  panicleRate = clamp(Math.round(panicleRate), 0, 10);

  const applications = [
    { stage: "Basal", formula: poorSoil || diseasePressure ? "16-16-8" : "16-20-0", rate: basalRate },
    { stage: "Tillering", formula: tilleringRate > 0 ? "46-0-0" : "None", rate: tilleringRate },
    { stage: "Panicle", formula: panicleRate > 0 ? "0-0-60" : "None", rate: panicleRate },
  ];

  const recommendedInputs = { ...inputs, applications };
  const nutrients = fertilizerNutrients(applications);
  const chemicalProgram = estimateChemicalProgram(recommendedInputs, variety.costs.chemicals);
  const reasons = [];

  reasons.push({
    en: `${variety.en}: base plan targets about N ${variety.idealN}, P₂O₅ ${variety.idealP}, K₂O ${variety.idealK} kg/rai`,
    th: `ใช้เป้าหมายธาตุอาหารตามพันธุ์ ${variety.name}`,
  });

  if (poorSoil)
    reasons.push({
      en: "Poor sandy soil: slightly stronger basal fertilizer and K support",
      th: "ดินทราย/ดินเลว: เพิ่มรองพื้นและเสริม K เล็กน้อย",
    });
  if (richSoil)
    reasons.push({ en: "Rich clay-loam: avoid over-applying basal fertilizer", th: "ดินดี: ลดรองพื้นเล็กน้อยไม่ให้เกินจำเป็น" });
  if (droughtRisk)
    reasons.push({
      en: "Drought/rainfed risk: reduce N intensity to avoid wasted input under water stress",
      th: "เสี่ยงแล้ง/น้ำฝน: ลด N เพื่อไม่ให้ต้นทุนสูญเปล่าเมื่อขาดน้ำ",
    });
  if (diseasePressure)
    reasons.push({
      en: "Disease/flood pressure: avoid late N and keep K support for stronger plants",
      th: "เสี่ยงโรค/น้ำท่วม: ลด N ช่วงหลังและเสริม K ให้ต้นแข็งแรง",
    });
  if (pestPressure || weedPressure)
    reasons.push({
      en: "Pest/weed pressure: IPM/weed-control budget is linked to chemical cost",
      th: "แมลง/วัชพืชสูง: งบ IPM/ยาเชื่อมกับต้นทุน Chemicals อัตโนมัติ",
    });

  return {
    applications,
    nutrients,
    chemicalProgram,
    reasons,
    headline: droughtRisk
      ? "Conservative drought plan"
      : diseasePressure || pestPressure || weedPressure
        ? "Risk-adjusted protection plan"
        : "Balanced best-practice plan",
    headlineTh: droughtRisk
      ? "แผนประคองเมื่อเสี่ยงแล้ง"
      : diseasePressure || pestPressure || weedPressure
        ? "แผนปรับตามความเสี่ยงโรคแมลง"
        : "แผนสมดุลตามคำแนะนำ",
  };
}

function buildCostBreakdown(variety, nutrients, inputs, overrides = {}, context = {}) {
  const chemicalProgram = estimateChemicalProgram(inputs, variety.costs.chemicals);
  const profile = context.costProfile ?? {};
  const fertilizerCost =
    Number.isFinite(profile.fertilizer) && Number.isFinite(profile.fertilizerReferenceCost) && profile.fertilizerReferenceCost > 0
      ? Math.round(nutrients.cost * (profile.fertilizer / profile.fertilizerReferenceCost))
      : Math.round(nutrients.cost);
  const chemicalCost = Number.isFinite(profile.chemicals)
    ? Math.max(0, chemicalProgram.cost + Math.round(profile.chemicals - variety.costs.chemicals))
    : chemicalProgram.cost;
  const drivers = [];
  const addCost = (itemKey, amount, label, th, tone = "warning") => {
    if (amount <= 0) return;
    drivers.push({ itemKey, amount: Math.round(amount), label, th, tone });
  };

  if (inputs.soil === "Poor / Sandy") {
    addCost("transport", 450, "Soil amendment / organic matter", "ปรับปรุงดินทราย: ปุ๋ยอินทรีย์/ขนย้ายวัสดุ", "warning");
    addCost("labor", 180, "Extra soil preparation", "เตรียมดินเพิ่มเพราะดินทราย/ดินเลว", "warning");
  }

  if (inputs.water === "Continuous Flooding") {
    addCost("fuel", 120, "Continuous flooding water handling", "ขังน้ำตลอด: ค่าน้ำมัน/จัดการน้ำเพิ่ม", "warning");
  }
  if (context.pumpActive) {
    addCost("fuel", 180 + inputs.groundwater * 3, "Groundwater pumping", "สูบน้ำบาดาล: น้ำมัน/พลังงานเพิ่ม", "warning");
    addCost("labor", 80, "Pump monitoring", "ค่าแรงเฝ้าเครื่องสูบน้ำ", "warning");
  }
  if (inputs.water === "Rainfed" && inputs.groundwater < 20 && inputs.weather === "Drought") {
    addCost("transport", 220, "Emergency water sourcing", "นาน้ำฝนแล้ง: ค่าน้ำ/ขนส่งน้ำฉุกเฉิน", "danger");
  }

  if (inputs.weed >= 65) {
    addCost("labor", 350, "Heavy follow-up weeding", "วัชพืชสูง: ค่าแรงกำจัดซ้ำ", "danger");
  } else if (inputs.weed >= 45) {
    addCost("labor", 180, "Follow-up weeding", "วัชพืชปานกลาง-สูง: ค่าแรงกำจัดเพิ่ม", "warning");
  } else if (inputs.weed >= 25) {
    addCost("labor", 80, "Early weed check", "เฝ้าระวัง/กำจัดวัชพืชช่วงต้น", "warning");
  }

  if (inputs.pest >= 60) addCost("labor", 90, "Extra pest scouting", "แมลงระบาด: ค่าแรงสำรวจแปลงเพิ่ม", "warning");
  if (inputs.disease >= 50) addCost("labor", 90, "Extra disease monitoring", "โรคระบาด: ค่าแรงติดตามอาการเพิ่ม", "warning");

  if (inputs.weather === "Drought") {
    addCost("fuel", 180, "Drought water operations", "ภัยแล้ง: ค่าน้ำมันจัดการน้ำเพิ่ม", "danger");
  }
  if (inputs.weather === "Heavy Rain / Flood") {
    addCost("labor", 320, "Drainage and flood recovery labor", "ฝนหนัก/น้ำท่วม: ค่าแรงระบายน้ำและฟื้นแปลง", "danger");
    addCost("fuel", 180, "Drainage pump fuel", "ฝนหนัก/น้ำท่วม: น้ำมันสูบ/ระบายน้ำ", "danger");
    addCost("transport", 180, "Wet harvest handling / drying", "เก็บเกี่ยวชื้น: ขนส่ง/ตาก/จัดการหลังเก็บเกี่ยวเพิ่ม", "danger");
  }

  if (inputs.managementTiming < 55) {
    addCost("labor", 250, "Late operation catch-up labor", "จัดการช้า: ค่าแรงเร่งงาน/แก้ปัญหาเพิ่ม", "danger");
    addCost("fuel", 120, "Late operation machinery fuel", "จัดการช้า: ค่าเครื่องจักร/น้ำมันเพิ่ม", "danger");
  } else if (inputs.managementTiming < 70) {
    addCost("labor", 120, "Moderate timing delay labor", "เวลาจัดการค่อนข้างช้า: ค่าแรงเพิ่ม", "warning");
  }

  const driverTotals = drivers.reduce((totals, driver) => {
    totals[driver.itemKey] = (totals[driver.itemKey] ?? 0) + driver.amount;
    return totals;
  }, {});
  const defaults = {
    seed: Number.isFinite(profile.seed) ? profile.seed : variety.costs.seed,
    fertilizer: fertilizerCost,
    chemicals: chemicalCost,
    labor: (Number.isFinite(profile.labor) ? profile.labor : variety.costs.labor) + (driverTotals.labor ?? 0),
    rent: Number.isFinite(profile.rent) ? profile.rent : variety.costs.rent,
    fuel: (Number.isFinite(profile.fuel) ? profile.fuel : variety.costs.fuel) + (driverTotals.fuel ?? 0),
    transport: (Number.isFinite(profile.transport) ? profile.transport : variety.costs.transport) + (driverTotals.transport ?? 0),
  };

  const breakdown = COST_ITEMS.map((item) => {
    const override = overrides[item.key];
    const value = Number.isFinite(override) ? clamp(Math.round(override), 0, 999999) : defaults[item.key];
    return { ...item, value, defaultValue: defaults[item.key], isOverridden: Number.isFinite(override) };
  });

  return {
    breakdown,
    chemicalProgram,
    costDrivers: {
      items: drivers,
      total: drivers.reduce((sum, driver) => sum + driver.amount, 0),
      byItem: driverTotals,
    },
  };
}

function buildFinancialRisk({
  profitPerRai,
  revenuePerRai,
  costPerRai,
  riceRevenuePerRai,
  estimatedYieldKgPerRai,
  pricePerTon,
  quality,
  strawRevenuePerRai,
}) {
  const netCostAfterStraw = Math.max(0, costPerRai - strawRevenuePerRai);
  const ricePricePerKg = Math.max(0.1, (pricePerTon / 1000) * quality);
  const breakEvenYieldKgPerRai = Math.ceil(netCostAfterStraw / ricePricePerKg);
  const breakEvenPricePerTon =
    estimatedYieldKgPerRai > 0 ? Math.ceil((netCostAfterStraw / estimatedYieldKgPerRai / Math.max(quality, 0.1)) * 10) * 100 : 0;
  const margin = revenuePerRai > 0 ? profitPerRai / revenuePerRai : -1;
  const riceOnlyGap = riceRevenuePerRai - costPerRai;

  if (profitPerRai >= 800 && margin >= 0.12) {
    return {
      level: "Low",
      levelTh: "การเงินเสี่ยงต่ำ",
      tone: "good",
      breakEvenYieldKgPerRai,
      breakEvenPricePerTon,
      margin,
      riceOnlyGap,
    };
  }
  if (profitPerRai >= 0) {
    return {
      level: "Watch",
      levelTh: "พอรอด/ต้องเฝ้าระวัง",
      tone: "warning",
      breakEvenYieldKgPerRai,
      breakEvenPricePerTon,
      margin,
      riceOnlyGap,
    };
  }
  if (profitPerRai >= -1000) {
    return {
      level: "High",
      levelTh: "การเงินเสี่ยงสูง",
      tone: "danger",
      breakEvenYieldKgPerRai,
      breakEvenPricePerTon,
      margin,
      riceOnlyGap,
    };
  }
  return {
    level: "Severe",
    levelTh: "เสี่ยงขาดทุนหนัก",
    tone: "danger",
    breakEvenYieldKgPerRai,
    breakEvenPricePerTon,
    margin,
    riceOnlyGap,
  };
}

function scoreTone(value, inverse = false) {
  const good = inverse ? value <= 25 : value >= 75;
  const fair = inverse ? value <= 50 : value >= 55;
  if (good) return "good";
  if (fair) return "warning";
  return "danger";
}

function buildExplanations({
  inputs,
  nutrients,
  fertilizerScore,
  waterScore,
  soilScore,
  pestDiseaseScore,
  weatherScore,
  timingScore,
  growthScore,
  estimatedYieldKgPerRai,
  yieldPotential,
  revenuePerRai,
  riceRevenuePerRai,
  costPerRai,
  profitPerRai,
  costBreakdown,
  chemicalProgram,
  flags,
  quality,
}) {
  const topScoreFactors = [
    {
      key: "fertilizer",
      label: "Fertilizer",
      th: "ปุ๋ย",
      value: Math.round(fertilizerScore),
      tone: scoreTone(fertilizerScore),
      text:
        fertilizerScore >= 75
          ? `N/P₂O₅/K₂O รวม ${nutrients.N.toFixed(1)}/${nutrients.P.toFixed(1)}/${nutrients.K.toFixed(1)} kg/rai ใกล้เป้าหมายพันธุ์นี้`
          : flags.nExcess
            ? `N รวม ${nutrients.N.toFixed(1)} kg/rai สูง เสี่ยงต้นอ่อน โรค และล้ม`
            : `ธาตุอาหารยังไม่สมดุล: N/P₂O₅/K₂O ${nutrients.N.toFixed(1)}/${nutrients.P.toFixed(1)}/${nutrients.K.toFixed(1)} kg/rai`,
    },
    {
      key: "water",
      label: "Water",
      th: "น้ำ",
      value: Math.round(waterScore),
      tone: scoreTone(waterScore),
      text: flags.flooded
        ? "น้ำมาก/ขังสูง ทำให้รากอ่อนแอและเพิ่มความเสี่ยงโรค"
        : flags.shortage
          ? "น้ำไม่พอ เกิด drought stress และการแตกกอลดลง"
          : `${inputs.water} ทำให้น้ำอยู่ในช่วงใช้งานได้`,
    },
    {
      key: "pestDisease",
      label: "Pest & disease",
      th: "โรคแมลงวัชพืช",
      value: Math.round(100 - pestDiseaseScore),
      tone: scoreTone(100 - pestDiseaseScore, true),
      text:
        100 - pestDiseaseScore > 45
          ? `แรงกดดันสูง: pest ${inputs.pest}% / disease ${inputs.disease}% / weed ${inputs.weed}% ลดคะแนนและเพิ่มต้นทุนยา`
          : `แรงกดดันต่ำถึงปานกลาง: pest ${inputs.pest}% / disease ${inputs.disease}% / weed ${inputs.weed}%`,
    },
    {
      key: "soilWeather",
      label: "Soil & weather",
      th: "ดินและอากาศ",
      value: Math.round((soilScore + weatherScore + timingScore) / 3),
      tone: scoreTone((soilScore + weatherScore + timingScore) / 3),
      text: `${inputs.soil}, ${inputs.weather}, timing ${Math.round(timingScore)}% ร่วมกันกำหนดพื้นฐานการเติบโต`,
    },
  ].sort((a, b) => {
    const severity = { danger: 0, warning: 1, good: 2 };
    return severity[a.tone] - severity[b.tone] || a.value - b.value;
  });

  const chemicalCost = costBreakdown.find((item) => item.key === "chemicals")?.value ?? 0;
  const fertilizerCost = costBreakdown.find((item) => item.key === "fertilizer")?.value ?? 0;
  const biggestCost = [...costBreakdown].sort((a, b) => b.value - a.value)[0];
  const economics = [
    {
      key: "yield",
      label: "Yield driver",
      th: "ตัวขับผลผลิต",
      tone: growthScore >= 60 ? "good" : growthScore >= 45 ? "warning" : "danger",
      text: `Growth ${growthScore}/100 แปลงเป็นผลผลิตประมาณ ${estimatedYieldKgPerRai} kg/rai จากศักยภาพระบบผลิต ${yieldPotential} kg/rai`,
    },
    {
      key: "revenue",
      label: "Revenue",
      th: "รายได้",
      tone: revenuePerRai >= costPerRai ? "good" : "warning",
      text: `รายได้ข้าว ${Math.round(riceRevenuePerRai).toLocaleString("en-US")} baht/rai จากราคาตลาดที่ผู้ใช้ตั้ง และปรับเฉพาะความชื้น (${Math.round(
        quality * 100,
      )}%)`,
    },
    {
      key: "cost",
      label: "Cost pressure",
      th: "แรงกดดันต้นทุน",
      tone: costPerRai <= revenuePerRai ? "good" : "danger",
      text: `ต้นทุนรวม ${Math.round(costPerRai).toLocaleString("en-US")} baht/rai; รายการใหญ่สุดคือ ${biggestCost.label} ${Math.round(
        biggestCost.value,
      ).toLocaleString("en-US")} baht`,
    },
    {
      key: "chemicals",
      label: "Chemical/IPM",
      th: "ยา/IPM",
      tone: chemicalCost > 1000 ? "danger" : chemicalCost > 500 ? "warning" : "good",
      text: `ต้นทุนยา ${Math.round(chemicalCost).toLocaleString("en-US")} baht/rai จาก ${chemicalProgram.items
        .map((item) => item.th)
        .slice(0, 2)
        .join(" + ")}`,
    },
    {
      key: "profit",
      label: profitPerRai >= 0 ? "Profit" : "Loss",
      th: profitPerRai >= 0 ? "กำไร" : "ขาดทุน",
      tone: profitPerRai >= 0 ? "good" : "danger",
      text: `${profitPerRai >= 0 ? "กำไร" : "ขาดทุน"} ${Math.abs(Math.round(profitPerRai)).toLocaleString(
        "en-US",
      )} baht/rai = revenue - total cost`,
    },
  ];

  const summary =
    profitPerRai >= 0
      ? `ผลลัพธ์ดีเพราะ growth ${growthScore}/100 และต้นทุนยังต่ำกว่ารายได้`
      : `ผลลัพธ์ขาดทุนเพราะรายได้ ${Math.round(revenuePerRai).toLocaleString("en-US")} baht/rai ต่ำกว่าต้นทุน ${Math.round(
          costPerRai,
        ).toLocaleString("en-US")} baht/rai`;

  return {
    summary,
    scoreFactors: topScoreFactors,
    economics,
    costLinks: {
      fertilizerCost,
      chemicalCost,
      biggestCostKey: biggestCost.key,
      biggestCostLabel: biggestCost.label,
    },
  };
}

export function scoreMeta(growth) {
  if (growth >= 78) {
    return {
      label: "Excellent",
      labelTh: "ดีเยี่ยม",
      riskLevel: "Low",
      riskLevelTh: "เสี่ยงต่ำ",
      color: "#2f8f4e",
      verdict: "Excellent harvest - golden and full",
      verdictTh: "เก็บเกี่ยวดีเยี่ยม ข้าวทองอิ่มเมล็ด",
      headerGradient: ["#1d6b39", "#2f8f4e"],
      condition: "Excellent",
    };
  }

  if (growth >= 60) {
    return {
      label: "Good",
      labelTh: "ดี",
      riskLevel: "Moderate",
      riskLevelTh: "เสี่ยงปานกลาง",
      color: "#6fae3f",
      verdict: "Good harvest",
      verdictTh: "ผลผลิตดี",
      headerGradient: ["#3f7d3e", "#6fae3f"],
      condition: "Good",
    };
  }

  if (growth >= 45) {
    return {
      label: "Fair",
      labelTh: "พอใช้",
      riskLevel: "High",
      riskLevelTh: "เสี่ยงสูง",
      color: "#e0a82e",
      verdict: "Fair harvest - room to improve",
      verdictTh: "ผลผลิตพอใช้ ยังพัฒนาได้",
      headerGradient: ["#b07d1d", "#e0a82e"],
      condition: "Moderate",
    };
  }

  return {
    label: "Poor",
    labelTh: "เสี่ยง",
    riskLevel: "Severe",
    riskLevelTh: "เสี่ยงรุนแรง",
    color: "#d2603a",
    verdict: "Poor harvest - high losses",
    verdictTh: "ผลผลิตต่ำ เสียหายมาก",
    headerGradient: ["#a23f22", "#d2603a"],
    condition: "Poor",
  };
}

export function computeSimulation(inputs, context) {
  const variety = VARIETIES[context.varietyKey];
  const nutrients = fertilizerNutrients(inputs.applications);
  const Nt = nutrients.N;
  const Pt = nutrients.P;
  const Kt = nutrients.K;

  const adequacy = (amount, target) => {
    if (amount <= target) return clamp(100 - ((target - amount) / target) * 115, 0, 100);
    return clamp(100 - ((amount - target) / target) * 65, 0, 100);
  };

  const nutrientScore = 0.5 * adequacy(Nt, variety.idealN) + 0.22 * adequacy(Pt, variety.idealP) + 0.28 * adequacy(Kt, variety.idealK);

  const basal = nutrients.byStage.Basal ?? {};
  const tillering = nutrients.byStage.Tillering ?? {};
  const panicle = nutrients.byStage.Panicle ?? {};

  let nutrientTiming = 64;
  if ((tillering.n ?? 0) >= 2.5) nutrientTiming += 14;
  else if ((tillering.n ?? 0) >= 1) nutrientTiming += 6;
  if ((panicle.k ?? 0) >= 2.5) nutrientTiming += 12;
  else if ((panicle.k ?? 0) >= 1) nutrientTiming += 5;
  if ((basal.p ?? 0) >= 1.5) nutrientTiming += 10;
  if ((panicle.n ?? 0) > 5) nutrientTiming -= 16;
  nutrientTiming = clamp(nutrientTiming, 10, 100);

  const fertilizerScore = clamp(0.68 * nutrientScore + 0.32 * nutrientTiming, 0, 100);
  const nDeficient = Nt < variety.idealN * 0.58;
  const nExcess = Nt > variety.idealN * 1.55 || (panicle.n ?? 0) > 5;

  const baseWater = {
    "Good Monsoon": 70,
    Normal: 58,
    Drought: 24,
    "Heavy Rain / Flood": 108,
  }[inputs.weather];
  const irrigationAdjustment = inputs.water === "Continuous Flooding" ? 20 : inputs.water === "Rainfed" ? -4 : 0;
  const groundwaterSupport = inputs.weather === "Drought" ? inputs.groundwater * 0.62 : inputs.groundwater * 0.2;
  const effectiveWater = baseWater + irrigationAdjustment + groundwaterSupport;
  const idealLow = inputs.water === "Alternate Wet-Dry (AWD)" ? 47 : 57;
  const idealHigh = 84;

  let waterScore;
  if (effectiveWater < idealLow) waterScore = clamp(100 - (idealLow - effectiveWater) * 1.9, 0, 100);
  else if (effectiveWater > idealHigh) waterScore = clamp(100 - (effectiveWater - idealHigh) * 1.7, 0, 100);
  else waterScore = clamp(92 - Math.abs(effectiveWater - 66) / 2.2, 62, 100);

  const shortage = effectiveWater < 46;
  const flooded = effectiveWater > 98;
  const pumpActive = inputs.groundwater > 25 && (inputs.weather === "Drought" || effectiveWater < 60) && !flooded;

  const soilScore = {
    "Poor / Sandy": 46,
    "Medium Loam": 72,
    "Rich Clay-Loam": 92,
  }[inputs.soil];

  const pestDiseaseScore = clamp(100 - (inputs.pest * 0.42 + inputs.disease * 0.34 + inputs.weed * 0.24), 0, 100);

  let weatherScore = {
    "Good Monsoon": 90,
    Normal: 76,
    Drought: 46,
    "Heavy Rain / Flood": 50,
  }[inputs.weather];
  if (inputs.weather === "Drought" && pumpActive) weatherScore = clamp(weatherScore + inputs.groundwater * 0.24, 0, 80);

  let timingScore = inputs.managementTiming;
  if (inputs.weather === "Heavy Rain / Flood") timingScore -= 14;
  if (inputs.weather === "Drought") timingScore -= 8;
  timingScore = clamp(timingScore, 30, 96);

  const growthScore = Math.round(
    0.22 * fertilizerScore + 0.22 * waterScore + 0.15 * soilScore + 0.18 * pestDiseaseScore + 0.13 * weatherScore + 0.1 * timingScore,
  );

  const flags = { nDeficient, nExcess, shortage, flooded };
  let quality = 1;
  if (flooded || inputs.weather === "Heavy Rain / Flood") quality -= 0.06;
  if (timingScore < 55) quality -= 0.03;
  quality = clamp(quality, 0.88, 1);

  const yieldPotential = Math.max(1, context.yieldPotentialOverride ?? variety.potential);
  const estimatedYieldKgPerRai = Math.round(yieldPotential * Math.pow(growthScore / 100, 1.25));
  const straw = estimateStrawHarvest(inputs, estimatedYieldKgPerRai, context, flags);
  const {
    breakdown: costBreakdown,
    chemicalProgram,
    costDrivers,
  } = buildCostBreakdown(variety, nutrients, inputs, context.costOverrides, {
    flags,
    pumpActive,
    estimatedYieldKgPerRai,
    costProfile: context.costProfile,
  });
  const costPerRai = costBreakdown.reduce((sum, item) => sum + item.value, 0);
  const riceRevenuePerRai = Math.round((((estimatedYieldKgPerRai * context.pricePerTon) / 1000) * quality) / 10) * 10;
  const revenuePerRai = riceRevenuePerRai + straw.revenuePerRai;
  const profitPerRai = revenuePerRai - costPerRai;
  const financialRisk = buildFinancialRisk({
    profitPerRai,
    revenuePerRai,
    costPerRai,
    riceRevenuePerRai,
    estimatedYieldKgPerRai,
    pricePerTon: context.pricePerTon,
    quality,
    strawRevenuePerRai: straw.revenuePerRai,
  });

  const condition = {
    greenness: nDeficient ? -0.75 : nExcess ? 0.9 : clamp((Nt - variety.idealN) / 10, -0.3, 0.35),
    vigor: clamp(0.5 + growthScore / 170, 0.45, 1.12),
    density: clamp(0.45 + fertilizerScore / 260 + soilScore / 430, 0.4, 1),
    lodging: nExcess && growthScore > 48,
    shortage,
    flooded,
    pumpActive,
    pest: inputs.pest,
    disease: inputs.disease,
    weed: inputs.weed,
    goldenness: clamp(growthScore / 100, 0.25, 1),
    weather: inputs.weather,
  };

  const risks = [];
  const actions = [];
  if (nDeficient) {
    risks.push({ en: "Nitrogen deficiency - pale, slow growth", th: "ขาดไนโตรเจน ใบเหลือง โตช้า" });
    actions.push({ en: "Top-dress urea (46-0-0) at tillering", th: "ใส่ปุ๋ยยูเรียเสริมช่วงแตกกอ" });
  }
  if (nExcess) {
    risks.push({ en: "Excess nitrogen - lodging risk, soft dark growth", th: "ไนโตรเจนเกิน เสี่ยงล้ม ต้นอ่อน" });
    actions.push({ en: "Reduce N, split doses, add potassium (K)", th: "ลดไนโตรเจน แบ่งใส่ เพิ่มโพแทสเซียม" });
  }
  if (shortage) {
    risks.push({ en: "Water shortage - drought stress, curled leaves", th: "ขาดน้ำ ใบม้วน เครียดแล้ง" });
    actions.push({ en: "Activate groundwater pump / use AWD", th: "สูบน้ำบาดาล / ทำนาเปียกสลับแห้ง" });
  }
  if (flooded) {
    risks.push({ en: "Flooding - submerged roots, yellowing", th: "น้ำท่วม รากแช่น้ำ ใบเหลือง" });
    actions.push({ en: "Drain field and improve outflow before harvest", th: "ระบายน้ำก่อนเก็บเกี่ยว" });
  }
  if (inputs.pest > 45) {
    risks.push({ en: "Pest outbreak - leaf and stem damage", th: "แมลงระบาด ทำลายใบและลำต้น" });
    actions.push({ en: "Scout fields, apply IPM / targeted control", th: "สำรวจแปลง ใช้ IPM ควบคุมเฉพาะจุด" });
  }
  if (inputs.disease > 40) {
    risks.push({ en: "Disease outbreak - leaf spots / blast", th: "โรคระบาด ใบจุด/ไหม้" });
    actions.push({ en: "Apply fungicide, widen spacing for airflow", th: "พ่นสารกันรา เพิ่มระยะปลูกให้อากาศถ่ายเท" });
  }
  if (inputs.weed > 40) {
    risks.push({ en: "High weed pressure - nutrient competition", th: "วัชพืชมาก แย่งธาตุอาหาร" });
    actions.push({ en: "Early weeding / pre-emergent herbicide", th: "กำจัดวัชพืชแต่เนิ่นๆ" });
  }
  if (soilScore < 55) {
    risks.push({ en: "Poor sandy soil - low fertility and water-holding", th: "ดินทรายเลว ธาตุอาหารต่ำ" });
    actions.push({ en: "Add compost / organic matter and green manure", th: "ใส่ปุ๋ยหมัก อินทรียวัตถุ ปุ๋ยพืชสด" });
  }
  if (Kt < variety.idealK * 0.7) {
    risks.push({ en: "Low potassium - weak grain filling and lodging", th: "โพแทสเซียมต่ำ เมล็ดไม่เต็ม เสี่ยงล้ม" });
    actions.push({ en: "Add K at panicle stage (15-5-20 / 0-0-60)", th: "เพิ่มโพแทสเซียมช่วงตั้งท้อง (15-5-20/0-0-60)" });
  }
  if ((basal.p ?? 0) < 1) {
    risks.push({ en: "No phosphorus at basal - poor early rooting", th: "ไม่ใส่ฟอสฟอรัสรองพื้น รากตั้งตัวช้า" });
    actions.push({ en: "Apply P early (18-46-0 / 16-20-0) at land prep", th: "ใส่ฟอสฟอรัสช่วงรองพื้น (18-46-0/16-20-0)" });
  }
  if (risks.length === 0) {
    risks.push({ en: "No major risks - a well-balanced plan", th: "ไม่มีความเสี่ยงสำคัญ วางแผนสมดุลดี" });
    actions.push({ en: "Maintain practice; monitor weather and pests weekly", th: "รักษาแนวทาง ติดตามอากาศและศัตรูพืชรายสัปดาห์" });
  }

  const methodFactor = {
    "Continuous Flooding": 1,
    "Alternate Wet-Dry (AWD)": 0.55,
    Rainfed: 0.66,
  }[inputs.water];
  const baseFlood = 1.35;
  const fertilizerN2O = Nt * 0.012;
  let co2PerRai = baseFlood * methodFactor + fertilizerN2O;
  if (inputs.weather === "Heavy Rain / Flood") co2PerRai += baseFlood * methodFactor * 0.12;
  if (inputs.weather === "Drought") co2PerRai -= baseFlood * methodFactor * 0.1;
  co2PerRai = clamp(co2PerRai, 0.2, 3);
  const co2Baseline = baseFlood + fertilizerN2O;
  const co2Reduction = Math.max(0, co2Baseline - co2PerRai);
  const carbonPrice = 300;
  const creditPerRai = Math.round(co2Reduction * carbonPrice);
  const meta = scoreMeta(growthScore);

  return {
    ...meta,
    growthScore,
    fertilizerScore,
    waterScore,
    soilScore,
    pestDiseaseScore,
    weatherScore,
    timingScore,
    fertilizerEfficiency: Math.round(fertilizerScore),
    waterAdequacy: Math.round(waterScore),
    soilHealth: Math.round(soilScore),
    pestDiseaseRisk: Math.round(100 - pestDiseaseScore),
    estimatedYieldKgPerRai,
    yieldPotential,
    costBreakdown,
    chemicalProgram,
    costDrivers,
    costPerRai,
    revenuePerRai,
    riceRevenuePerRai,
    profitPerRai,
    financialRisk,
    straw,
    quality,
    nutrients,
    nutrientTotals: { N: Nt, P: Pt, K: Kt },
    condition,
    risks,
    recommendedActions: actions,
    carbon: { co2PerRai, co2Baseline, co2Reduction, carbonPrice, creditPerRai, methodFactor },
    explanations: buildExplanations({
      inputs,
      nutrients,
      fertilizerScore,
      waterScore,
      soilScore,
      pestDiseaseScore,
      weatherScore,
      timingScore,
      growthScore,
      estimatedYieldKgPerRai,
      yieldPotential,
      revenuePerRai,
      riceRevenuePerRai,
      costPerRai,
      profitPerRai,
      costBreakdown,
      chemicalProgram,
      flags,
      quality,
    }),
    flags,
  };
}
