import { MODEL_LIMITATIONS, SOURCE_LINKS } from "../data/methodologyData.js";
import { pickLang, t } from "../i18n.js";
import { formatNumber } from "../utils/format.js";
import { DataQualityLegend } from "./DataQualityBadge.jsx";

export default function MethodologyModal({ onClose, simulation }) {
  const { language, liveModel, pricePerTon, strawPricePerKg, varietyInfo } = simulation;
  const formulaRows = buildFormulaRows({ language, liveModel, pricePerTon, strawPricePerKg, varietyInfo });

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(37,42,38,.46)] p-4">
      <section className="max-h-[92vh] w-[860px] max-w-[96vw] animate-fade-up overflow-y-auto rounded-xl bg-rice-panel shadow-modal">
        <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[#d8ddd2] bg-[#fffdf7]/95 px-5 py-4 backdrop-blur">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[.5px] text-rice-faint">{t(language, "methodologyEyebrow")}</div>
            <h2 className="mt-0.5 text-[22px] font-bold leading-tight text-[#2f3b34]">{t(language, "methodologyTitle")}</h2>
            <p className="mt-1 max-w-[620px] text-[11px] leading-snug text-rice-muted">{t(language, "methodologyIntro")}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg border border-[#dedbd0] bg-white px-3 py-2 text-[11px] font-bold text-rice-muted transition hover:bg-[#f8faf4]">
            {t(language, "close")}
          </button>
        </header>

        <div className="grid gap-3 px-5 py-4 md:grid-cols-[1.15fr_.85fr]">
          <section className="rounded-lg border border-[#d8ddd2] bg-[#fbfaf6] px-4 py-3">
            <SectionTitle>{t(language, "mainFormulas")}</SectionTitle>
            <div className="mt-2 flex flex-col gap-2">
              {formulaRows.map((row) => (
                <div key={row.label} className="rounded-lg border border-[#ebe7dc] bg-white px-3 py-2.5">
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="text-[12px] font-bold text-[#2f3b34]">{row.label}</div>
                    <div className="font-display text-[13px] font-bold text-[#5f755c]">{row.value}</div>
                  </div>
                  <div className="mt-1 text-[10px] leading-snug text-rice-muted">{row.formula}</div>
                  <div className="mt-1 text-[9px] leading-snug text-rice-faint">{row.note}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-[#d8ddd2] bg-[#fbfaf6] px-4 py-3">
            <SectionTitle>{t(language, "dataQualityTitle")}</SectionTitle>
            <p className="mt-1 text-[10px] leading-snug text-rice-muted">{t(language, "dataQualityIntro")}</p>
            <div className="mt-2">
              <DataQualityLegend language={language} />
            </div>

            <SectionTitle className="mt-4">{t(language, "modelLimitations")}</SectionTitle>
            <div className="mt-2 flex flex-col gap-1.5">
              {MODEL_LIMITATIONS.map((item) => (
                <div key={item.en} className="rounded-md bg-white/70 px-2.5 py-2 text-[9.5px] leading-snug text-[#716f66]">
                  {pickLang(language, item.en, item.th)}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-[#d8ddd2] bg-[#fbfaf6] px-4 py-3 md:col-span-2">
            <SectionTitle>{t(language, "sourceReferences")}</SectionTitle>
            <div className="mt-2 grid gap-2 md:grid-cols-2">
              {SOURCE_LINKS.map((source) => (
                <a
                  key={source.href}
                  href={source.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-[#ebe7dc] bg-white px-3 py-2 text-[10px] leading-snug text-[#5e6b5b] transition hover:border-rice-green hover:text-rice-dark"
                >
                  <span className="font-bold">{pickLang(language, source.label, source.th)}</span>
                  <span className="mt-0.5 block text-rice-faint">{pickLang(language, source.note, source.noteTh)}</span>
                </a>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

function buildFormulaRows({ language, liveModel, pricePerTon, strawPricePerKg, varietyInfo }) {
  return [
    {
      label: pickLang(language, "Yield estimate", "ผลผลิตคาดการณ์"),
      value: `${formatNumber(liveModel.estimatedYieldKgPerRai)} kg/rai`,
      formula: pickLang(
        language,
        "production potential x (growth score / 100)^1.25",
        "ศักยภาพผลผลิต x (คะแนนเติบโต / 100)^1.25",
      ),
      note: pickLang(
        language,
        `Current potential is ${formatNumber(liveModel.yieldPotential ?? varietyInfo.potential)} kg/rai. Growth score links fertilizer, water, soil, threats, weather, and timing.`,
        `ศักยภาพปัจจุบัน ${formatNumber(liveModel.yieldPotential ?? varietyInfo.potential)} กก./ไร่ คะแนนเติบโตผูกปุ๋ย น้ำ ดิน โรคแมลง อากาศ และ timing`,
      ),
    },
    {
      label: pickLang(language, "Rice revenue", "รายได้ข้าว"),
      value: `฿${formatNumber(liveModel.riceRevenuePerRai)}/rai`,
      formula: pickLang(language, "yield x paddy price x quality/moisture factor", "ผลผลิต x ราคาข้าวเปลือก x ตัวปรับคุณภาพ/ความชื้น"),
      note: pickLang(
        language,
        `Paddy price is user input at ฿${formatNumber(pricePerTon)}/ton. The model only applies a quality discount for wet/flood harvest conditions.`,
        `ราคาข้าวเป็นค่าที่ผู้ใช้ตั้ง ฿${formatNumber(pricePerTon)}/ตัน ระบบหักเฉพาะคุณภาพ/ความชื้นจากเก็บเกี่ยวเปียกหรือน้ำท่วม`,
      ),
    },
    {
      label: pickLang(language, "Collectable straw", "ฟางเก็บขายได้"),
      value: `${formatNumber(liveModel.straw.collectableKgPerRai)} kg/rai`,
      formula: pickLang(language, "yield x RPR 1.169 x SAF 0.583 x collection factor", "ผลผลิต x RPR 1.169 x SAF 0.583 x ตัวปรับการเก็บขาย"),
      note: pickLang(
        language,
        `Straw revenue uses farmer net straw price at ฿${strawPricePerKg.toFixed(2)}/kg and is capped at surplus straw.`,
        `รายได้ฟางใช้ราคาสุทธิที่ชาวนาได้รับ ฿${strawPricePerKg.toFixed(2)}/กก. และ cap ไม่ให้เกินฟางเหลือใช้`,
      ),
    },
    {
      label: pickLang(language, "Linked cost", "ต้นทุนที่เชื่อมเงื่อนไข"),
      value: `฿${formatNumber(liveModel.costPerRai)}/rai`,
      formula: pickLang(language, "baseline cost + condition-linked drivers + manual overrides", "ต้นทุนฐาน + ตัวขับต้นทุนตามเงื่อนไข + ค่าที่ผู้ใช้แก้เอง"),
      note: pickLang(
        language,
        "Pest, disease, weed, water shortage, flooding, fuel, and labor pressure can raise cost automatically.",
        "แมลง โรค วัชพืช ขาดน้ำ น้ำท่วม น้ำมัน และแรงงาน สามารถดันต้นทุนขึ้นอัตโนมัติ",
      ),
    },
    {
      label: pickLang(language, "Profit / loss", "กำไร / ขาดทุน"),
      value: `${liveModel.profitPerRai >= 0 ? "+" : "-"}฿${formatNumber(Math.abs(liveModel.profitPerRai))}/rai`,
      formula: pickLang(language, "rice revenue + straw revenue - total cost", "รายได้ข้าว + รายได้ฟาง - ต้นทุนรวม"),
      note: pickLang(
        language,
        "Farm totals multiply per-rai values by farm size. Carbon is shown separately and is not included in profit.",
        "ยอดรวมทั้งแปลงเอาค่าต่อไร่คูณพื้นที่ คาร์บอนแสดงแยกและยังไม่รวมในกำไร",
      ),
    },
  ];
}

function SectionTitle({ children, className = "" }) {
  return <h3 className={`text-[12px] font-bold text-[#2f3b34] ${className}`}>{children}</h3>;
}
