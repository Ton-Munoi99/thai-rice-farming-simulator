import { pickLang, t } from "../i18n.js";
import { formatNumber } from "../utils/format.js";
import { MODEL_LIMITATIONS, SOURCE_LINKS } from "../data/methodologyData.js";

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
          {MODEL_LIMITATIONS.map((item) => (
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
