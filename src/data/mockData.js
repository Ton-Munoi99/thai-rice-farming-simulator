export const STAGES = [
  { name: "Land Preparation", th: "เตรียมดิน", desc: "puddling the paddy", icon: "🚜" },
  { name: "Germination / Seedling", th: "งอก-กล้า", desc: "young shoots emerge", icon: "🌱" },
  { name: "Tillering", th: "แตกกอ", desc: "plants split into tillers", icon: "🌿" },
  { name: "Panicle Initiation", th: "ตั้งท้อง", desc: "panicles form inside", icon: "🎋" },
  { name: "Flowering", th: "ออกดอก", desc: "florets open and pollinate", icon: "🌼" },
  { name: "Grain Filling", th: "เติมเมล็ด", desc: "grains swell with starch", icon: "🌾" },
  { name: "Harvest", th: "เก็บเกี่ยว", desc: "golden grain ready", icon: "🧺" },
];

export const GROWTH_FRACTIONS = [0, 0.16, 0.4, 0.58, 0.74, 0.9, 1];

export const FERTILIZER_FORMULAS = {
  None: { n: 0, p: 0, k: 0, price: 0, th: "ไม่ใส่" },
  "18-46-0": { n: 18, p: 46, k: 0, price: 30, th: "DAP รองพื้น P สูง" },
  "16-20-0": { n: 16, p: 20, k: 0, price: 26, th: "รองพื้น" },
  "16-16-8": { n: 16, p: 16, k: 8, price: 27, th: "สมดุล เร่งต้น" },
  "15-15-15": { n: 15, p: 15, k: 15, price: 28, th: "เสมอ สมดุล" },
  "20-10-10": { n: 20, p: 10, k: 10, price: 27, th: "เร่งต้น N สูง" },
  "46-0-0": { n: 46, p: 0, k: 0, price: 22, th: "ยูเรีย เร่ง N" },
  "21-0-0": { n: 21, p: 0, k: 0, price: 18, th: "แอมโมเนียมซัลเฟต" },
  "15-5-20": { n: 15, p: 5, k: 20, price: 26, th: "รับรวง K สูง" },
  "13-13-21": { n: 13, p: 13, k: 21, price: 28, th: "รับรวง K สูง" },
  "0-0-60": { n: 0, p: 0, k: 60, price: 26, th: "โพแทช K" },
};

export const FERTILIZER_STAGES = [
  {
    key: "Basal",
    en: "Basal / Land prep",
    th: "รองพื้น",
    when: "ก่อน-ขณะปักดำ",
    icon: "🌱",
    tip: "เน้น P สร้างราก",
    accent: "#2f8f4e",
  },
  {
    key: "Tillering",
    en: "Tillering",
    th: "แตกกอ",
    when: "อายุ ~20-25 วัน",
    icon: "🌿",
    tip: "เน้น N เร่งกอ",
    accent: "#3b9fd6",
  },
  {
    key: "Panicle",
    en: "Panicle / Booting",
    th: "ตั้งท้อง-รับรวง",
    when: "อายุ ~45-60 วัน",
    icon: "🌾",
    tip: "เน้น K เติมเมล็ด",
    accent: "#e0a82e",
  },
];

const whiteApps = [
  { stage: "Basal", formula: "16-20-0", rate: 30 },
  { stage: "Tillering", formula: "46-0-0", rate: 10 },
  { stage: "Panicle", formula: "0-0-60", rate: 8 },
];

const jasmineApps = [
  { stage: "Basal", formula: "16-20-0", rate: 25 },
  { stage: "Tillering", formula: "46-0-0", rate: 5 },
  { stage: "Panicle", formula: "0-0-60", rate: 5 },
];

export const VARIETIES = {
  white: {
    name: "ข้าวขาว",
    en: "White rice (RD)",
    icon: "🌾",
    potential: 600,
    idealN: 9,
    idealP: 4.5,
    idealK: 5,
    costs: { seed: 400, chemicals: 250, labor: 2200, rent: 1000, fuel: 500, transport: 300 },
    defaultApps: whiteApps,
    presets: {
      best: whiteApps,
      drought: [
        { stage: "Basal", formula: "16-20-0", rate: 20 },
        { stage: "Tillering", formula: "46-0-0", rate: 5 },
        { stage: "Panicle", formula: "None", rate: 0 },
      ],
      excess: [
        { stage: "Basal", formula: "16-16-8", rate: 35 },
        { stage: "Tillering", formula: "46-0-0", rate: 22 },
        { stage: "Panicle", formula: "46-0-0", rate: 18 },
      ],
      pest: whiteApps,
      flood: whiteApps,
    },
  },
  jasmine: {
    name: "หอมมะลิ",
    en: "Hom Mali (KDML105)",
    icon: "🌸",
    potential: 400,
    idealN: 6,
    idealP: 3.5,
    idealK: 4,
    costs: { seed: 800, chemicals: 150, labor: 1800, rent: 700, fuel: 300, transport: 250 },
    defaultApps: jasmineApps,
    presets: {
      best: jasmineApps,
      drought: [
        { stage: "Basal", formula: "16-20-0", rate: 15 },
        { stage: "Tillering", formula: "None", rate: 0 },
        { stage: "Panicle", formula: "None", rate: 0 },
      ],
      excess: [
        { stage: "Basal", formula: "16-16-8", rate: 30 },
        { stage: "Tillering", formula: "46-0-0", rate: 15 },
        { stage: "Panicle", formula: "46-0-0", rate: 12 },
      ],
      pest: jasmineApps,
      flood: jasmineApps,
    },
  },
};

export const SCENARIOS = [
  { key: "best", icon: "✅", name: "Best Practice", th: "ปลูกตามคำแนะนำ" },
  { key: "drought", icon: "☀️", name: "Drought Risk", th: "เสี่ยงแล้ง" },
  { key: "excess", icon: "💧", name: "Excess Fertilizer", th: "ปุ๋ยมากเกิน" },
  { key: "pest", icon: "🐛", name: "Pest Outbreak", th: "แมลงระบาด" },
  { key: "flood", icon: "🌧️", name: "Flooding Before Harvest", th: "น้ำท่วมก่อนเก็บเกี่ยว", wide: true },
];

export const FARM_SYSTEM_PRESETS = [
  {
    key: "wetBroadcast",
    icon: "🌊",
    name: "Wet-seeded",
    th: "นาหว่านน้ำตม",
    variety: "white",
    note: "วัชพืชสูงกว่า ต้องคุมต้นฤดู",
    inputs: {
      applications: [
        { stage: "Basal", formula: "16-20-0", rate: 30 },
        { stage: "Tillering", formula: "46-0-0", rate: 10 },
        { stage: "Panicle", formula: "0-0-60", rate: 8 },
      ],
      water: "Continuous Flooding",
      groundwater: 45,
      soil: "Medium Loam",
      pest: 20,
      disease: 22,
      weed: 38,
      weather: "Normal",
      managementTiming: 72,
    },
  },
  {
    key: "transplanted",
    icon: "🌱",
    name: "Transplanted",
    th: "นาดำ",
    variety: "white",
    note: "ตั้งตัวดี วัชพืชต่ำกว่า",
    inputs: {
      applications: whiteApps.map((app) => ({ ...app })),
      water: "Alternate Wet-Dry (AWD)",
      groundwater: 55,
      soil: "Rich Clay-Loam",
      pest: 12,
      disease: 10,
      weed: 16,
      weather: "Good Monsoon",
      managementTiming: 84,
    },
  },
  {
    key: "rainfed",
    icon: "☀️",
    name: "Rainfed",
    th: "นาน้ำฝน",
    variety: "white",
    note: "ลด N เมื่อเสี่ยงขาดน้ำ",
    inputs: {
      applications: [
        { stage: "Basal", formula: "16-20-0", rate: 18 },
        { stage: "Tillering", formula: "46-0-0", rate: 3 },
        { stage: "Panicle", formula: "None", rate: 0 },
      ],
      water: "Rainfed",
      groundwater: 12,
      soil: "Medium Loam",
      pest: 28,
      disease: 18,
      weed: 44,
      weather: "Drought",
      managementTiming: 60,
    },
  },
  {
    key: "irrigatedAwd",
    icon: "💧",
    name: "Irrigated AWD",
    th: "ชลประทาน/AWD",
    variety: "white",
    note: "น้ำคุมได้ ลด methane",
    inputs: {
      applications: [
        { stage: "Basal", formula: "16-20-0", rate: 27 },
        { stage: "Tillering", formula: "46-0-0", rate: 10 },
        { stage: "Panicle", formula: "0-0-60", rate: 8 },
      ],
      water: "Alternate Wet-Dry (AWD)",
      groundwater: 70,
      soil: "Rich Clay-Loam",
      pest: 10,
      disease: 8,
      weed: 12,
      weather: "Good Monsoon",
      managementTiming: 88,
    },
  },
  {
    key: "homMaliNortheast",
    icon: "🌸",
    name: "Hom Mali NE",
    th: "หอมมะลิอีสาน",
    variety: "jasmine",
    note: "นาน้ำฝน ใส่ N ระวัง",
    inputs: {
      applications: jasmineApps.map((app) => ({ ...app })),
      water: "Rainfed",
      groundwater: 18,
      soil: "Medium Loam",
      pest: 20,
      disease: 16,
      weed: 32,
      weather: "Normal",
      managementTiming: 74,
    },
    wide: true,
  },
];

export const SCENARIO_ENVIRONMENTS = {
  best: {
    water: "Alternate Wet-Dry (AWD)",
    groundwater: 55,
    soil: "Rich Clay-Loam",
    pest: 10,
    disease: 8,
    weed: 12,
    weather: "Good Monsoon",
    managementTiming: 82,
  },
  drought: {
    water: "Rainfed",
    groundwater: 18,
    soil: "Medium Loam",
    pest: 32,
    disease: 18,
    weed: 42,
    weather: "Drought",
    managementTiming: 62,
  },
  excess: {
    water: "Continuous Flooding",
    groundwater: 50,
    soil: "Medium Loam",
    pest: 30,
    disease: 42,
    weed: 28,
    weather: "Normal",
    managementTiming: 58,
  },
  pest: {
    water: "Alternate Wet-Dry (AWD)",
    groundwater: 50,
    soil: "Medium Loam",
    pest: 82,
    disease: 58,
    weed: 48,
    weather: "Normal",
    managementTiming: 55,
  },
  flood: {
    water: "Continuous Flooding",
    groundwater: 80,
    soil: "Rich Clay-Loam",
    pest: 24,
    disease: 46,
    weed: 24,
    weather: "Heavy Rain / Flood",
    managementTiming: 46,
  },
};

export const DEFAULT_INPUTS = {
  applications: whiteApps.map((app) => ({ ...app })),
  water: "Alternate Wet-Dry (AWD)",
  groundwater: 55,
  soil: "Rich Clay-Loam",
  pest: 10,
  disease: 8,
  weed: 12,
  weather: "Good Monsoon",
  managementTiming: 82,
};

export const SELECT_OPTIONS = {
  water: ["Rainfed", "Alternate Wet-Dry (AWD)", "Continuous Flooding"],
  soil: ["Poor / Sandy", "Medium Loam", "Rich Clay-Loam"],
  weather: ["Good Monsoon", "Normal", "Drought", "Heavy Rain / Flood"],
};
