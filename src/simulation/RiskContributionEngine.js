import { COST_LABELS, pickLang } from "../i18n.js";

function makeItem({ action, actionTh, amount, detail, detailTh, icon, key, label, labelTh, tone }) {
  return { action, actionTh, amount: Math.max(0, Math.round(amount)), detail, detailTh, icon, key, label, labelTh, percent: 0, tone };
}

function normalize(items) {
  const active = items.filter((item) => item.amount > 0).sort((a, b) => b.amount - a.amount);
  const total = active.reduce((sum, item) => sum + item.amount, 0);

  if (total <= 0) {
    return [
      makeItem({
        key: "balanced",
        icon: "✓",
        label: "Balanced setup",
        labelTh: "สมดุลดี",
        detail: "No single pressure dominates this scenario.",
        detailTh: "ยังไม่มีแรงกดดันตัวใดเด่นผิดปกติในสถานการณ์นี้",
        action: "Keep monitoring price, water, and pests.",
        actionTh: "ติดตามราคา น้ำ และโรคแมลงต่อเนื่อง",
        amount: 1,
        tone: "good",
      }),
    ].map((item) => ({ ...item, percent: 100 }));
  }

  return active.slice(0, 6).map((item) => ({ ...item, percent: Math.round((item.amount / total) * 100) }));
}

export function buildRiskContributions(model, language = "th") {
  const topCost = [...model.costBreakdown].sort((a, b) => b.value - a.value)[0];
  const topCostName = topCost ? pickLang(language, COST_LABELS[topCost.key]?.en ?? topCost.label, COST_LABELS[topCost.key]?.th ?? topCost.th ?? topCost.label) : "";
  const riceRevenueGap = Math.max(0, model.costPerRai - model.riceRevenuePerRai);
  const totalProfitGap = Math.max(0, -model.profitPerRai);
  const costDriverPressure = model.costDrivers?.total ?? 0;
  const chemicalCost = model.costBreakdown.find((item) => item.key === "chemicals")?.value ?? 0;
  const waterPenalty = Math.max(0, 100 - model.waterAdequacy);
  const fertilizerPenalty = Math.max(0, 100 - model.fertilizerEfficiency);
  const threatPenalty = model.pestDiseaseRisk;
  const timingWeatherPenalty = Math.max(0, 100 - (model.weatherScore * 0.55 + model.timingScore * 0.45));
  const strawGap = Math.max(0, 300 - model.straw.revenuePerRai);

  return normalize([
    makeItem({
      key: "revenueGap",
      icon: "฿",
      label: "Rice revenue gap",
      labelTh: "รายได้ข้าวไม่พอ",
      detail: `Rice revenue is ${Math.round(model.riceRevenuePerRai).toLocaleString("en-US")} baht/rai versus cost ${Math.round(model.costPerRai).toLocaleString("en-US")} baht/rai.`,
      detailTh: `รายได้ข้าว ${Math.round(model.riceRevenuePerRai).toLocaleString("en-US")} บาท/ไร่ เทียบกับต้นทุน ${Math.round(model.costPerRai).toLocaleString("en-US")} บาท/ไร่`,
      action: "Raise yield, lower cost, or wait for a better market price.",
      actionTh: "ต้องดันผลผลิต ลดต้นทุน หรือรอราคาตลาดดีกว่านี้",
      amount: riceRevenueGap + totalProfitGap * 0.35,
      tone: "danger",
    }),
    makeItem({
      key: "costPressure",
      icon: "↧",
      label: "Cost pressure",
      labelTh: "ต้นทุนกดกำไร",
      detail: `Largest cost item is ${topCostName} at ${Math.round(topCost?.value ?? 0).toLocaleString("en-US")} baht/rai.`,
      detailTh: `ต้นทุนก้อนใหญ่สุดคือ ${topCostName} ${Math.round(topCost?.value ?? 0).toLocaleString("en-US")} บาท/ไร่`,
      action: "Review labor, machinery, rent, fuel, and transport first.",
      actionTh: "เช็คแรงงาน เครื่องจักร ค่าเช่า น้ำมัน และขนส่งก่อน",
      amount: Math.max(0, (topCost?.value ?? 0) - model.revenuePerRai * 0.25) + costDriverPressure,
      tone: "danger",
    }),
    makeItem({
      key: "threats",
      icon: "!",
      label: "Pest/disease/weed",
      labelTh: "โรคแมลงวัชพืช",
      detail: `Threat risk is ${model.pestDiseaseRisk}% and chemical/IPM cost is ${Math.round(chemicalCost).toLocaleString("en-US")} baht/rai.`,
      detailTh: `ความเสี่ยงโรคแมลง ${model.pestDiseaseRisk}% และค่ายา/IPM ${Math.round(chemicalCost).toLocaleString("en-US")} บาท/ไร่`,
      action: "Scout field, apply IPM, and avoid blanket spraying without thresholds.",
      actionTh: "สำรวจแปลง ใช้ IPM และหลีกเลี่ยงพ่นทั้งแปลงโดยไม่มี threshold",
      amount: threatPenalty * 12 + Math.max(0, chemicalCost - 250),
      tone: threatPenalty > 45 ? "danger" : "warning",
    }),
    makeItem({
      key: "water",
      icon: "~",
      label: "Water stress",
      labelTh: "น้ำกดผลผลิต",
      detail: `Water adequacy is ${model.waterAdequacy}%.`,
      detailTh: `ความพอเพียงน้ำอยู่ที่ ${model.waterAdequacy}%`,
      action: "Improve water timing, drainage, or drought backup before adding more fertilizer.",
      actionTh: "ปรับ timing น้ำ ระบายน้ำ หรือแผนสำรองแล้งก่อนเพิ่มปุ๋ย",
      amount: waterPenalty * 11,
      tone: waterPenalty > 35 ? "danger" : "warning",
    }),
    makeItem({
      key: "fertilizer",
      icon: "N",
      label: "Fertilizer efficiency",
      labelTh: "ประสิทธิภาพปุ๋ย",
      detail: `Fertilizer efficiency is ${model.fertilizerEfficiency}%.`,
      detailTh: `ประสิทธิภาพปุ๋ยอยู่ที่ ${model.fertilizerEfficiency}%`,
      action: "Balance N/P/K and split timing around tillering and panicle stages.",
      actionTh: "ปรับ N/P/K และแบ่งรอบใส่ช่วงแตกกอ/ตั้งท้องให้สมดุล",
      amount: fertilizerPenalty * 9,
      tone: fertilizerPenalty > 35 ? "danger" : "warning",
    }),
    makeItem({
      key: "timingWeather",
      icon: "⏱",
      label: "Timing & weather",
      labelTh: "เวลาและอากาศ",
      detail: `Weather score ${Math.round(model.weatherScore)}%, timing score ${Math.round(model.timingScore)}%.`,
      detailTh: `คะแนนอากาศ ${Math.round(model.weatherScore)}%, timing ${Math.round(model.timingScore)}%`,
      action: "Protect harvest window and schedule fertilizer/weed control earlier.",
      actionTh: "กันช่วงเก็บเกี่ยว และวางรอบปุ๋ย/วัชพืชให้เร็วขึ้น",
      amount: timingWeatherPenalty * 8,
      tone: timingWeatherPenalty > 35 ? "danger" : "warning",
    }),
    makeItem({
      key: "straw",
      icon: "S",
      label: "Low straw income",
      labelTh: "รายได้ฟางต่ำ",
      detail: `Straw revenue is ${Math.round(model.straw.revenuePerRai).toLocaleString("en-US")} baht/rai.`,
      detailTh: `รายได้ฟาง ${Math.round(model.straw.revenuePerRai).toLocaleString("en-US")} บาท/ไร่`,
      action: "Use straw as a side lever only when there is a real buyer or group sale.",
      actionTh: "ใช้ฟางเป็นตัวช่วยเฉพาะเมื่อมีผู้รับซื้อจริงหรือรวมกลุ่มขายได้",
      amount: strawGap,
      tone: "warning",
    }),
  ]);
}
