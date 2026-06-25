export const SOURCE_LINKS = [
  {
    label: "Rice-map",
    th: "Rice-map",
    href: "https://ton-munoi99.github.io/rice-map/",
    note: "RPR/SAF straw layer adapted for collectable straw.",
    noteTh: "ใช้แนวคิดชั้น RPR/SAF สำหรับฟางเก็บขายได้",
  },
  {
    label: "OAE Regional Office 4",
    th: "สศก. / สศท.4",
    href: "https://coaching.oae.go.th/%E0%B8%9F%E0%B8%B2%E0%B8%87%E0%B8%82%E0%B9%89%E0%B8%B2%E0%B8%A7-%E0%B8%A7%E0%B8%B1%E0%B8%AA%E0%B8%94%E0%B8%B8%E0%B9%80%E0%B8%AB%E0%B8%A5%E0%B8%B7%E0%B8%AD%E0%B9%83%E0%B8%8A%E0%B9%89/",
    note: "Straw baling, farm revenue, and collector price reference.",
    noteTh: "อ้างอิงรายได้ฟางอัดก้อน/ค่าจ้างอัด/ราคารับซื้อ",
  },
  {
    label: "OPS MOAC Roi Et PDF",
    th: "กษ. ร้อยเอ็ด PDF",
    href: "https://www.opsmoac.go.th/roiet-local_wisdom-files-461991791795",
    note: "Farm-lot straw buying and bale-price reference.",
    noteTh: "อ้างอิงซื้อเหมาไร่และราคาฟางอัดก้อน",
  },
  {
    label: "OCSC policy study PDF",
    th: "สำนักงาน ก.พ. PDF",
    href: "https://www.ocsc.go.th/is10233_%E0%B8%A8%E0%B8%A8%E0%B8%B4%E0%B8%98%E0%B8%A3-%E0%B8%8A%E0%B8%B2%E0%B8%8D%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B9%80%E0%B8%AA%E0%B8%A3%E0%B8%B4%E0%B8%90-_%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%AA%E0%B8%A3/",
    note: "Wide straw-value scenario reference.",
    noteTh: "อ้างอิงช่วงรายได้จากฟางแบบ scenario",
  },
  {
    label: "TGO Premium T-VER AWD",
    th: "อบก. Premium T-VER AWD",
    href: "https://ghgreduction.tgo.or.th/en/database-and-statistics/single-and-bundled-projects/item/6456-sustainable-rice-for-methane-reduction-by-alternate-wetting-and-drying-awd-in-suphan-buri-province.html",
    note: "AWD carbon-credit project context, not a guaranteed farmer income.",
    noteTh: "บริบทโครงการคาร์บอน AWD ไม่ใช่รายได้การันตีของชาวนา",
  },
];

export const MODEL_LIMITATIONS = [
  {
    en: "Yield is a planning estimate from score and production-system potential, not a certified agronomic forecast.",
    th: "ผลผลิตเป็นค่าประเมินเพื่อวางแผนจากคะแนนและศักยภาพระบบผลิต ไม่ใช่พยากรณ์ทางวิชาการที่รับรองแล้ว",
  },
  {
    en: "Paddy price is user-entered market price; the simulator only discounts revenue for wet/flood harvest quality.",
    th: "ราคาข้าวเปลือกเป็นราคาตลาดที่ผู้ใช้ตั้ง ระบบลดรายได้เฉพาะกรณีคุณภาพ/ความชื้นจากเก็บเกี่ยวเปียก",
  },
  {
    en: "Default costs are baseline scenarios and linked drivers; farmers can override all cost items manually.",
    th: "ต้นทุน default เป็นฐาน scenario และตัวขับต้นทุน ผู้ใช้ยังปรับต้นทุนย่อยเองได้ทั้งหมด",
  },
  {
    en: "Debt assumes a 6-month working-capital loan at 6% annual interest until real credit terms are added.",
    th: "หนี้ใช้สมมติฐานเงินกู้หมุน 6 เดือน ดอกเบี้ย 6% ต่อปี จนกว่าจะใส่เงื่อนไขสินเชื่อจริง",
  },
  {
    en: "Carbon credit is shown as a rough optional value and is not included in profit unless a real project contract exists.",
    th: "คาร์บอนเครดิตเป็นค่า optional แบบคร่าว ๆ และยังไม่รวมในกำไร เว้นแต่มีสัญญาโครงการจริง",
  },
];

export const DATA_QUALITY_LEVELS = {
  high: {
    en: "High",
    th: "สูง",
    tone: "green",
    description: "Uses a clear formula, explicit user input, or source-backed layer.",
    descriptionTh: "ใช้สูตรชัดเจน ค่าที่ผู้ใช้กรอกเอง หรือชั้นข้อมูลที่มีแหล่งอ้างอิง",
  },
  medium: {
    en: "Medium",
    th: "กลาง",
    tone: "amber",
    description: "Simulator estimate from linked assumptions and mock defaults.",
    descriptionTh: "เป็นค่าประเมินจาก simulator ที่ผูกกับสมมติฐานและ default mock",
  },
  low: {
    en: "Low",
    th: "ต่ำ",
    tone: "red",
    description: "Rough scenario placeholder; should be replaced by local field data later.",
    descriptionTh: "เป็น placeholder ระดับ scenario ควรแทนด้วยข้อมูลแปลงจริงภายหลัง",
  },
};

export const METRIC_QUALITY = {
  price: "high",
  farmSize: "high",
  straw: "high",
  revenue: "medium",
  cost: "medium",
  yield: "medium",
  score: "medium",
  debt: "low",
  carbon: "low",
};
