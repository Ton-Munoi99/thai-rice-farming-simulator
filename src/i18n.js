export const LANGUAGES = {
  th: "ไทย",
  en: "English",
};

export function pickLang(language, en, th) {
  return language === "th" ? th : en;
}

export function labelPair(language, en, th) {
  return pickLang(language, en, th);
}

export function optionLabel(language, option, labels) {
  const value = labels[option];
  if (!value) return option;
  return typeof value === "string" ? value : pickLang(language, value.en, value.th);
}

export const TEXT = {
  appTitle: { en: "Wet-Season Rice Simulator", th: "จำลองการทำนาข้าวนาปี" },
  farmSubtitle: { en: "Wet-season paddy", th: "นาข้าวนาปี" },
  farmSize: { en: "Farm size", th: "พื้นที่นา" },
  rai: { en: "rai", th: "ไร่" },
  language: { en: "Language", th: "ภาษา" },
  lushClumps: { en: "Lush clumps", th: "กอข้าวแน่น" },
  fineBlades: { en: "Fine blades", th: "ใบเรียว" },
  hidePanel: { en: "Hide panel", th: "ซ่อนแผง" },
  showPanel: { en: "Show panel", th: "ดูแผง" },
  openPanel: { en: "Open data panel", th: "เปิดแผงข้อมูล" },
  health: { en: "Health", th: "สุขภาพ" },
  riceVariety: { en: "Rice variety", th: "พันธุ์ข้าว" },
  whiteRice: { en: "White rice (RD)", th: "ข้าวขาว" },
  homMali: { en: "Hom Mali", th: "หอมมะลิ" },
  presetScenarios: { en: "Preset scenarios", th: "สถานการณ์ตัวอย่าง" },
  farmSystemPresets: { en: "Farm system presets", th: "ระบบนา / พื้นที่ตัวอย่าง" },
  autoRecommendation: { en: "Auto recommendation", th: "แนะนำอัตโนมัติ" },
  autoRecommendationSub: { en: "Suggested defaults from current conditions", th: "แนะนำสูตรจากเงื่อนไขปัจจุบัน" },
  apply: { en: "Apply", th: "ใช้สูตรนี้" },
  fertilizerProgram: { en: "Fertilizer program", th: "แผนใส่ปุ๋ย" },
  fertilizerHint: { en: "Split applications by rice growth stage", th: "แบ่งใส่ตามระยะข้าว" },
  rate: { en: "Rate", th: "ปริมาณ" },
  totalNutrients: { en: "Total nutrients (kg/rai)", th: "ธาตุอาหารรวม (กก./ไร่)" },
  targetNutrients: { en: "Target for this variety", th: "เป้าหมายพันธุ์นี้" },
  waterManagement: { en: "Water management", th: "การจัดการน้ำ" },
  irrigationMethod: { en: "Irrigation method", th: "วิธีให้น้ำ" },
  groundwaterPump: { en: "Groundwater pump", th: "น้ำบาดาล" },
  soilCondition: { en: "Soil condition", th: "สภาพดิน" },
  threats: { en: "Threats", th: "ศัตรูพืช โรค วัชพืช" },
  pestOutbreak: { en: "Pest outbreak", th: "แมลงระบาด" },
  diseaseOutbreak: { en: "Disease outbreak", th: "โรคพืช" },
  weedPressure: { en: "Weed pressure", th: "วัชพืช" },
  weatherScenario: { en: "Weather scenario", th: "สภาพอากาศ" },
  managementTiming: { en: "Management timing", th: "ความตรงเวลาในการจัดการ" },
  timingDiscipline: { en: "Timing discipline", th: "จัดการตรงเวลา" },
  liveHealthScore: { en: "Live health score", th: "คะแนนสุขภาพข้าว" },
  realTime: { en: "Real-time estimate", th: "ประเมินเรียลไทม์" },
  estimatedYield: { en: "Estimated yield", th: "ผลผลิตคาดการณ์" },
  salePrice: { en: "Average paddy price", th: "ราคาข้าวเปลือกเฉลี่ย" },
  linkedCostDrivers: { en: "Linked cost drivers", th: "ต้นทุนที่เพิ่มจากเงื่อนไข" },
  autoCostImpact: { en: "Auto cost impact", th: "ผลกระทบต้นทุนอัตโนมัติ" },
  moistureNote: { en: "Rice price stays market-driven; only wet-harvest moisture can discount revenue.", th: "ราคาข้าวเป็นราคาตลาด; ระบบหักรายได้เฉพาะกรณีความชื้นจากเก็บเกี่ยวเปียก" },
  bahtPerTon: { en: "฿ / ton (1,000 kg)", th: "บาท / ตัน (1,000 กก.)" },
  strawIncome: { en: "Collectable straw", th: "ฟางเก็บขายได้" },
  strawPrice: { en: "Net straw price received by farmer", th: "ราคาฟางสุทธิที่ชาวนาได้รับ" },
  bahtPerKg: { en: "฿ / kg", th: "บาท / กก." },
  strawRevenue: { en: "Straw revenue", th: "รายได้ฟาง" },
  riceRevenue: { en: "Rice", th: "ข้าว" },
  strawReference: { en: "Rice-map method: paddy × RPR 1.169 × SAF 0.583, then harvest-condition adjustment.", th: "วิธี rice-map: ผลผลิตข้าวเปลือก × RPR 1.169 × SAF 0.583 แล้วปรับด้วยสภาพเก็บเกี่ยว" },
  totalStraw: { en: "Total straw", th: "ฟางทั้งหมด" },
  surplusStraw: { en: "Surplus straw", th: "ฟางเหลือใช้" },
  collectionAdjusted: { en: "condition-adjusted", th: "ปรับตามสภาพแปลง" },
  strawPriceGuide: {
    en: "Guide: farm-lot sale 0.25-0.45, farmer bales and sells 0.60-0.90, group/direct sale 0.90-1.20 ฿/kg. Retail/end-market 1.50+ is not a farmer-default price.",
    th: "แนวทางปรับ: ขายเหมาไร่/คนมาเก็บเอง 0.25-0.45, จ้างอัดแล้วขายทั่วไป 0.60-0.90, รวมกลุ่ม/ขายตรง 0.90-1.20 บาท/กก. ราคาปลายทาง 1.50+ ไม่ควรใช้เป็น default ชาวนา",
  },
  costBreakdown: { en: "Cost breakdown", th: "ต้นทุนต่อไร่" },
  editablePerRai: { en: "editable per rai", th: "ปรับได้ต่อไร่" },
  reset: { en: "Reset", th: "รีเซ็ต" },
  revenue: { en: "Revenue", th: "รายได้" },
  totalRevenue: { en: "Total revenue", th: "รายได้รวม" },
  totalCost: { en: "Total cost", th: "ค่าใช้จ่ายรวม" },
  totalProfit: { en: "Total profit", th: "กำไรรวม" },
  farmTotals: { en: "Farm totals", th: "รวมทั้งแปลง" },
  perRaiView: { en: "Per rai", th: "ต่อไร่" },
  riceTotal: { en: "Rice total", th: "รายได้ข้าวรวม" },
  strawTotal: { en: "Straw total", th: "รายได้ฟางรวม" },
  profit: { en: "Profit", th: "กำไร" },
  loss: { en: "Loss", th: "ขาดทุน" },
  perRai: { en: "per rai", th: "ต่อไร่" },
  runSimulation: { en: "Run Simulation", th: "จำลองการปลูก" },
  runAgain: { en: "Run Again", th: "จำลองใหม่" },
  running: { en: "Running...", th: "กำลังจำลอง..." },
  harvestSummary: { en: "Harvest Summary", th: "สรุปผลการเก็บเกี่ยว" },
  viewField: { en: "View field", th: "ดูแปลงนา" },
  growthScore: { en: "Growth score", th: "คะแนนการเติบโต" },
  fertilizerEfficiency: { en: "Fertilizer efficiency", th: "ประสิทธิภาพปุ๋ย" },
  waterAdequacy: { en: "Water adequacy", th: "ความพอเพียงน้ำ" },
  pestDiseaseRisk: { en: "Pest & disease risk", th: "ความเสี่ยงโรคแมลง" },
  soilHealth: { en: "Soil health", th: "สุขภาพดิน" },
  productionCost: { en: "Production cost", th: "ต้นทุนการผลิต" },
  whyResult: { en: "Why this result", th: "เหตุผลของผลลัพธ์" },
  keyRisks: { en: "Key risk factors", th: "ปัจจัยเสี่ยง" },
  recommendedActions: { en: "Recommended actions", th: "คำแนะนำ" },
  compareScenarios: { en: "Compare scenarios", th: "เปรียบเทียบสถานการณ์" },
  compareHint: { en: "Save A/B/C to compare yield, cost, profit, and risk", th: "บันทึก A/B/C เพื่อเทียบผลผลิต ต้นทุน กำไร และความเสี่ยง" },
  emptyCompare: { en: "Save the current setup to A/B/C to start comparing.", th: "ตั้งค่าปัจจุบัน แล้วกดบันทึก A/B/C เพื่อเริ่มเทียบ" },
  save: { en: "Save", th: "บันทึก" },
  load: { en: "Load", th: "โหลด" },
  clear: { en: "Clear", th: "ล้าง" },
  risk: { en: "Risk", th: "ความเสี่ยง" },
  cost: { en: "Cost", th: "ต้นทุน" },
  best: { en: "best", th: "ดีที่สุด" },
  carbon: { en: "Carbon & CO₂e", th: "คาร์บอน / ก๊าซเรือนกระจก" },
  emissions: { en: "Emissions", th: "ปล่อย" },
  reduced: { en: "Reduced", th: "ลดได้" },
  carbonCredit: { en: "Carbon credit", th: "คาร์บอนเครดิต" },
};

export const COST_LABELS = {
  seed: { en: "Seed", th: "เมล็ดพันธุ์" },
  fertilizer: { en: "Fertilizer", th: "ปุ๋ยเคมี" },
  chemicals: { en: "Chemicals", th: "สารเคมี/ยา" },
  labor: { en: "Labor + machinery", th: "แรงงาน+เครื่องจักร" },
  rent: { en: "Land rent", th: "ค่าเช่านา" },
  fuel: { en: "Fuel", th: "น้ำมันเชื้อเพลิง" },
  transport: { en: "Transport / other", th: "ขนส่ง/อื่นๆ" },
};

export function t(language, key) {
  const entry = TEXT[key];
  return entry ? pickLang(language, entry.en, entry.th) : key;
}

export const OPTION_LABELS = {
  water: {
    Rainfed: { en: "Rainfed", th: "อาศัยน้ำฝน" },
    "Alternate Wet-Dry (AWD)": { en: "Alternate Wet-Dry (AWD)", th: "เปียกสลับแห้ง (AWD)" },
    "Continuous Flooding": { en: "Continuous Flooding", th: "ขังน้ำตลอด" },
  },
  soil: {
    "Poor / Sandy": { en: "Poor / Sandy", th: "ดินทรายเลว" },
    "Medium Loam": { en: "Medium Loam", th: "ดินร่วนปานกลาง" },
    "Rich Clay-Loam": { en: "Rich Clay-Loam", th: "ดินร่วนเหนียวดี" },
  },
  weather: {
    "Good Monsoon": { en: "Good Monsoon", th: "มรสุมดี" },
    Normal: { en: "Normal", th: "ปกติ" },
    Drought: { en: "Drought", th: "ภัยแล้ง" },
    "Heavy Rain / Flood": { en: "Heavy Rain / Flood", th: "ฝนหนัก / น้ำท่วม" },
  },
};
