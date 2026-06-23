import { useMemo } from "react";
import { pickLang, t } from "../i18n.js";
import { buildDebtAnalysis } from "../simulation/DebtEngine.js";
import { formatNumber, signedBaht } from "../utils/format.js";

function toneClasses(tone) {
  if (tone === "good") return "border-[#d7e8cf] bg-[#f4faf2] text-[#2f6b48]";
  if (tone === "warning") return "border-[#eadfbf] bg-[#fffaf0] text-[#8a641c]";
  return "border-[#ead5cd] bg-[#fff5f0] text-[#a24b2b]";
}

export default function DebtPanel({ simulation }) {
  const { language, farmSize, inputs, liveModel, pricePerTon, strawPricePerKg } = simulation;
  const debt = useMemo(
    () => buildDebtAnalysis({ farmSize, inputs, model: liveModel, pricePerTon, strawPricePerKg }),
    [farmSize, inputs, liveModel, pricePerTon, strawPricePerKg],
  );

  const hasDebt = debt.cashShortfall > 0;

  return (
    <section className={`mt-[9px] rounded-lg border px-[13px] py-3 ${toneClasses(debt.status.tone)}`}>
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <div className="text-[11px] font-bold text-[#2f3b34]">{t(language, "cashflowDebt")}</div>
          <div className="text-[9px] leading-snug text-rice-faint">{t(language, "cashflowDebtSub")}</div>
        </div>
        <div className="rounded-md bg-white/70 px-2 py-1 text-[8.5px] font-bold">
          {pickLang(language, debt.status.level, debt.status.levelTh)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        <DebtMetric
          label={hasDebt ? t(language, "cashShortfall") : t(language, "cashSurplus")}
          value={hasDebt ? `฿${formatNumber(debt.cashShortfall)}` : signedBaht(debt.cashSurplus)}
          sub={`${farmSize} ${t(language, "rai")}`}
        />
        <DebtMetric
          label={t(language, "debtDue")}
          value={`฿${formatNumber(debt.debtDue)}`}
          sub={`${debt.loanMonths} ${t(language, "months")} @ ${(debt.annualInterestRate * 100).toFixed(0)}%/yr`}
        />
      </div>

      <div className="mt-2 rounded-md border border-white/60 bg-white/65 px-2.5 py-2">
        <div className="mb-1 text-[9.5px] font-bold text-[#3c473a]">{t(language, "nextSeasonTarget")}</div>
        <div className="grid grid-cols-2 gap-1.5">
          <DebtMetric
            label={t(language, "targetProfit")}
            value={`฿${formatNumber(debt.targetProfitPerRai)}`}
            sub={t(language, "perRai")}
            compact
          />
          <DebtMetric
            label={t(language, "workingCapitalNeed")}
            value={`฿${formatNumber(debt.nextSeasonCashNeed)}`}
            sub={`${farmSize} ${t(language, "rai")}`}
            compact
          />
        </div>
        <div className="mt-2 grid grid-cols-2 gap-1.5 border-t border-black/5 pt-2">
          <DebtMetric
            label={t(language, "requiredYieldNext")}
            value={debt.requiredYieldKgPerRai ? `${formatNumber(debt.requiredYieldKgPerRai)} kg` : ">1,400 kg"}
            sub={t(language, "perRai")}
            compact
          />
          <DebtMetric
            label={t(language, "requiredPriceNext")}
            value={`฿${formatNumber(debt.requiredPricePerTon)}`}
            sub={t(language, "bahtPerTonShort")}
            compact
          />
        </div>
      </div>

      <div className="mt-1.5 text-[8.5px] leading-snug text-rice-faint">
        {hasDebt ? t(language, "debtNoteLoss") : t(language, "debtNoteProfit")}
      </div>
    </section>
  );
}

function DebtMetric({ label, value, sub, compact = false }) {
  return (
    <div className="min-w-0 rounded-md bg-white/70 px-2 py-1.5">
      <div className="truncate text-[8px] font-semibold text-rice-faint">{label}</div>
      <div className={`font-display font-bold text-[#3c473a] ${compact ? "text-[11px]" : "text-[13px]"}`}>{value}</div>
      <div className="truncate text-[7.5px] text-rice-faint">{sub}</div>
    </div>
  );
}
