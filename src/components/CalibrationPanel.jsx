import { buildCalibrationCases } from "../simulation/CalibrationEngine.js";
import { formatNumber, signedBaht } from "../utils/format.js";
import { pickLang, t } from "../i18n.js";
import DataQualityBadge from "./DataQualityBadge.jsx";

const calibrationCases = buildCalibrationCases();

export default function CalibrationPanel({ simulation }) {
  const { language } = simulation;

  return (
    <section className="mt-3.5 rounded-[13px] border border-rice-card bg-white px-[13px] py-3">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <div className="text-[11px] font-bold text-[#3c473a]">{t(language, "calibrationTitle")}</div>
          <div className="text-[9.5px] leading-snug text-rice-faint">{t(language, "calibrationSub")}</div>
        </div>
        <DataQualityBadge language={language} level="low" compact />
      </div>
      <div className="space-y-1.5">
        {calibrationCases.map((item) => (
          <CalibrationRow key={item.key} item={item} language={language} />
        ))}
      </div>
      <div className="mt-2 rounded-lg bg-[#fbfaf6] px-2.5 py-2 text-[9px] leading-snug text-rice-faint">
        {t(language, "calibrationNote")}
      </div>
    </section>
  );
}

function CalibrationRow({ item, language }) {
  const yieldGood = Math.abs(item.gaps.yieldKgPerRai) <= 60;
  const costGood = Math.abs(item.gaps.costPerRai) <= 600;

  return (
    <div className="rounded-lg border border-[#edf1e8] bg-[#fbfcf8] px-2.5 py-2">
      <div className="mb-1 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-[10px] font-bold text-[#3c473a]">{pickLang(language, item.label, item.labelTh)}</div>
          <div className="text-[8.5px] text-rice-faint">
            {item.pricePerTon.toLocaleString("en-US")} ฿/t · {item.strawPricePerKg} ฿/kg
          </div>
        </div>
        <div className="text-right text-[8.5px] text-rice-faint">
          {pickLang(language, "model - anchor", "model - ค่าอ้างอิง")}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        <MetricGap
          label={t(language, "estimatedYield")}
          value={`${formatNumber(item.model.estimatedYieldKgPerRai)} / ${formatNumber(item.observed.yieldKgPerRai)}`}
          gap={`${item.gaps.yieldKgPerRai >= 0 ? "+" : ""}${formatNumber(item.gaps.yieldKgPerRai)} kg`}
          good={yieldGood}
        />
        <MetricGap
          label={t(language, "cost")}
          value={`฿${formatNumber(item.model.costPerRai)} / ฿${formatNumber(item.observed.costPerRai)}`}
          gap={signedBaht(item.gaps.costPerRai)}
          good={costGood}
        />
        <MetricGap
          label={t(language, "strawIncome")}
          value={`${formatNumber(item.model.straw.collectableKgPerRai)} / ${formatNumber(item.observed.collectableStrawKgPerRai)}`}
          gap={`${item.gaps.collectableStrawKgPerRai >= 0 ? "+" : ""}${formatNumber(item.gaps.collectableStrawKgPerRai)} kg`}
          good={Math.abs(item.gaps.collectableStrawKgPerRai) <= 50}
        />
      </div>
    </div>
  );
}

function MetricGap({ gap, good, label, value }) {
  return (
    <div className="rounded-md bg-white px-1.5 py-1.5">
      <div className="truncate text-[8px] text-rice-faint">{label}</div>
      <div className="truncate font-display text-[9px] font-bold text-[#3c473a]">{value}</div>
      <div className={`text-[8px] font-bold ${good ? "text-rice-green" : "text-[#a24b2b]"}`}>{gap}</div>
    </div>
  );
}
