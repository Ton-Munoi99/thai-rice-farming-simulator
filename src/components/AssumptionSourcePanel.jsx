import { pickLang, t } from "../i18n.js";
import { formatNumber } from "../utils/format.js";

const SOURCE_LINKS = [
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

const LIMITATIONS = [
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

export default function AssumptionSourcePanel({ simulation }) {
  const { language, liveModel, varietyInfo, pricePerTon, strawPricePerKg } = simulation;

  const formulaRows = [
    {
      label: "Yield",
      th: "ผลผลิต",
      value: `${formatNumber(liveModel.estimatedYieldKgPerRai)} kg/rai`,
      text: "variety/system potential x (growthScore / 100)^1.25",
      textTh: "ศักยภาพพันธุ์/ระบบผลิต x (growthScore / 100)^1.25",
    },
    {
      label: "Rice revenue",
      th: "รายได้ข้าว",
      value: `฿${formatNumber(liveModel.riceRevenuePerRai)}/rai`,
      text: "yield x paddy price x moisture/quality factor",
      textTh: "ผลผลิต x ราคาข้าวเปลือก x ตัวปรับคุณภาพ/ความชื้น",
    },
    {
      label: "Straw",
      th: "ฟาง",
      value: `${formatNumber(liveModel.straw.collectableKgPerRai)} kg/rai`,
      text: "yield x RPR 1.169 x SAF 0.583 x collection factor",
      textTh: "ผลผลิต x RPR 1.169 x SAF 0.583 x ตัวปรับการเก็บขาย",
    },
    {
      label: "Debt",
      th: "หนี้",
      value: "6 mo @ 6%/yr",
      text: "shortfall plus interest, then offset by current cash surplus for next-crop cash need",
      textTh: "เงินขาดมือบวกดอก แล้วหักเงินสดเหลือก่อนคิดเงินกู้ใหม่รอบหน้า",
    },
  ];

  return (
    <details className="mt-3.5 rounded-lg border border-[#d8ddd2] bg-[#fbfaf6] px-[13px] py-3">
      <summary className="cursor-pointer list-none text-[11px] font-bold text-[#2f3b34]">
        <span>{t(language, "assumptionsSources")}</span>
        <span className="float-right text-[9px] font-semibold text-rice-faint">{t(language, "tapToOpen")}</span>
      </summary>

      <div className="mt-2 border-t border-[#ebe7dd] pt-2">
        <div className="grid grid-cols-2 gap-1.5">
          <MiniFact label={t(language, "salePrice")} value={`฿${formatNumber(pricePerTon)}/t`} />
          <MiniFact label={t(language, "strawPrice")} value={`฿${strawPricePerKg.toFixed(2)}/kg`} />
          <MiniFact label={t(language, "breakEvenYield")} value={`${formatNumber(liveModel.financialRisk.breakEvenYieldKgPerRai)} kg`} />
          <MiniFact label={pickLang(language, "Yield potential", "ศักยภาพผลผลิต")} value={`${formatNumber(liveModel.yieldPotential ?? varietyInfo.potential)} kg`} />
        </div>

        <SectionTitle>{t(language, "mainFormulas")}</SectionTitle>
        <div className="flex flex-col gap-1">
          {formulaRows.map((row) => (
            <div key={row.label} className="rounded-md bg-white/75 px-2 py-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[8.5px] font-bold text-[#3c473a]">{pickLang(language, row.label, row.th)}</span>
                <span className="font-display text-[9.5px] font-bold text-[#5f755c]">{row.value}</span>
              </div>
              <div className="mt-0.5 text-[8px] leading-snug text-rice-faint">{pickLang(language, row.text, row.textTh)}</div>
            </div>
          ))}
        </div>

        <SectionTitle>{t(language, "sourceReferences")}</SectionTitle>
        <div className="flex flex-col gap-1">
          {SOURCE_LINKS.map((source) => (
            <a
              key={source.href}
              href={source.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-[#ece7da] bg-white/75 px-2 py-1.5 text-[8.5px] leading-snug text-[#5e6b5b] transition hover:border-rice-green hover:text-rice-dark"
            >
              <span className="font-bold">{pickLang(language, source.label, source.th)}</span>
              <span className="block text-rice-faint">{pickLang(language, source.note, source.noteTh)}</span>
            </a>
          ))}
        </div>

        <SectionTitle>{t(language, "modelLimitations")}</SectionTitle>
        <div className="flex flex-col gap-1">
          {LIMITATIONS.map((item) => (
            <div key={item.en} className="rounded-md bg-white/60 px-2 py-1.5 text-[8.5px] leading-snug text-[#7b7569]">
              {pickLang(language, item.en, item.th)}
            </div>
          ))}
        </div>
      </div>
    </details>
  );
}

function MiniFact({ label, value }) {
  return (
    <div className="rounded-md bg-white/75 px-2 py-1.5">
      <div className="truncate text-[8px] text-rice-faint">{label}</div>
      <div className="font-display text-[10.5px] font-bold text-[#3c473a]">{value}</div>
    </div>
  );
}

function SectionTitle({ children }) {
  return <div className="mb-1 mt-2.5 text-[9.5px] font-bold text-[#3c473a]">{children}</div>;
}
