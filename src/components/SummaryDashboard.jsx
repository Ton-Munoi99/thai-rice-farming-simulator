import { formatNumber, scoreColor, signedBaht } from "../utils/format.js";
import { pickLang, t } from "../i18n.js";
import { METRIC_QUALITY } from "../data/methodologyData.js";
import DataQualityBadge from "./DataQualityBadge.jsx";
import ExplanationPanel from "./ExplanationPanel.jsx";
import RecommendationPanel from "./RecommendationPanel.jsx";
import RiskContributionPanel from "./RiskContributionPanel.jsx";

export default function SummaryDashboard({ simulation }) {
  if (!simulation.showSummary) return null;

  const model = simulation.activeModel;
  const { language } = simulation;
  const profitPositive = model.profitPerRai >= 0;
  const totals = {
    riceRevenue: model.riceRevenuePerRai * simulation.farmSize,
    strawRevenue: model.straw.revenuePerRai * simulation.farmSize,
    revenue: model.revenuePerRai * simulation.farmSize,
    cost: model.costPerRai * simulation.farmSize,
    profit: model.profitPerRai * simulation.farmSize,
    strawKg: model.straw.collectableKgPerRai * simulation.farmSize,
  };
  const metrics = [
    [t(language, "estimatedYield"), `${formatNumber(model.estimatedYieldKgPerRai)} kg/rai`, "#c8901c", METRIC_QUALITY.yield],
    [t(language, "growthScore"), `${model.growthScore} / 100`, "#2f8f4e", METRIC_QUALITY.score],
    [t(language, "fertilizerEfficiency"), `${model.fertilizerEfficiency}%`, scoreColor(model.fertilizerEfficiency), METRIC_QUALITY.score],
    [t(language, "waterAdequacy"), `${model.waterAdequacy}%`, scoreColor(model.waterAdequacy), METRIC_QUALITY.score],
    [t(language, "pestDiseaseRisk"), `${model.pestDiseaseRisk}%`, model.pestDiseaseRisk <= 25 ? "#2f8f4e" : model.pestDiseaseRisk <= 50 ? "#e0a82e" : "#d2603a", METRIC_QUALITY.score],
    [t(language, "soilHealth"), `${model.soilHealth}%`, scoreColor(model.soilHealth), METRIC_QUALITY.score],
    [t(language, "productionCost"), `฿${formatNumber(model.costPerRai)}`, "#3c473a", METRIC_QUALITY.cost],
    [t(language, "revenue"), `฿${formatNumber(model.revenuePerRai)}`, "#3c473a", METRIC_QUALITY.revenue],
    [t(language, "financialRisk"), pickLang(language, model.financialRisk.level, model.financialRisk.levelTh), model.financialRisk.tone === "good" ? "#2f8f4e" : model.financialRisk.tone === "warning" ? "#e0a82e" : "#d2603a", METRIC_QUALITY.revenue],
    [t(language, "strawIncome"), `${formatNumber(model.straw.collectableKgPerRai)} kg/rai`, "#8a7040", METRIC_QUALITY.straw],
    [t(language, "surplusStraw"), `${formatNumber(model.straw.surplusKgPerRai)} kg/rai`, "#8a7040", METRIC_QUALITY.straw],
    [t(language, "strawRevenue"), `฿${formatNumber(model.straw.revenuePerRai)}`, "#8a7040", METRIC_QUALITY.straw],
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(37,42,38,.46)] p-6">
      <section className="max-h-[92vh] w-[920px] max-w-[96%] animate-fade-up overflow-y-auto rounded-xl bg-rice-panel shadow-modal">
        <header
          className="flex items-center justify-between rounded-t-xl border-b border-[#d8ddd2] bg-[#2f5d50] px-[26px] py-5 text-white"
        >
          <div>
            <div className="text-[11px] font-semibold tracking-[.5px] opacity-85">{t(language, "harvestSummary")}</div>
            <div className="mt-0.5 text-[24px] font-bold">{pickLang(language, model.verdict, model.verdictTh)}</div>
          </div>
          <div className="text-right">
            <div className="font-display text-[46px] font-bold leading-none">{formatNumber(model.estimatedYieldKgPerRai)}</div>
            <div className="text-[11px] opacity-90">kg/rai · {t(language, "growthScore")} {model.growthScore}/100</div>
          </div>
        </header>

        <div className="px-[26px] py-[22px]">
          <div className="grid grid-cols-2 gap-[11px] md:grid-cols-5">
            {metrics.map(([name, value, color, quality]) => (
              <div key={name} className="rounded-lg border border-rice-card bg-white px-[13px] py-3">
                <div className="flex items-center gap-1.5">
                  <div className="min-w-0 truncate text-[10px] leading-tight text-rice-faint">{name}</div>
                  <DataQualityBadge language={language} level={quality} compact />
                </div>
                <div className="mt-1 font-display text-[19px] font-bold" style={{ color }}>{value}</div>
              </div>
            ))}
          </div>

          <div className="mt-3.5 rounded-lg border border-[#d8ddd2] bg-[#fbfaf6] px-[18px] py-[15px]">
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <div>
                <div className="text-[12px] font-bold text-[#2f3b34]">{t(language, "farmTotals")}</div>
                <div className="text-[10px] text-rice-faint">{simulation.farmSize} {t(language, "rai")}</div>
              </div>
              <div className={`font-display text-[24px] font-bold ${totals.profit >= 0 ? "text-[#2f6b48]" : "text-[#a24b2b]"}`}>
                {signedBaht(totals.profit)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-5 gap-y-2 border-t border-[#ebe7dd] pt-2 md:grid-cols-4">
              <SummaryTotal label={t(language, "totalRevenue")} value={`฿${formatNumber(totals.revenue)}`} />
              <SummaryTotal label={t(language, "totalCost")} value={`฿${formatNumber(totals.cost)}`} />
              <SummaryTotal label={t(language, "riceTotal")} value={`฿${formatNumber(totals.riceRevenue)}`} />
              <SummaryTotal label={t(language, "strawTotal")} value={`฿${formatNumber(totals.strawRevenue)}`} />
            </div>
          </div>

          <div
            className={`mt-3.5 flex items-center justify-between rounded-lg px-[18px] py-[15px] text-white ${profitPositive ? "bg-[#2f6b48]" : "bg-[#a24b2b]"}`}
          >
            <div>
              <div className="text-[12px] opacity-90">{profitPositive ? t(language, "profit") : t(language, "loss")} {t(language, "perRai")}</div>
              <div className="mt-0.5 text-[11px] opacity-80">
                For {simulation.farmSize} rai: {signedBaht(model.profitPerRai * simulation.farmSize)}
              </div>
              <div className="mt-0.5 text-[10px] opacity-75">
                {t(language, "riceRevenue")} ฿{formatNumber(model.riceRevenuePerRai)} + {language === "th" ? "ฟาง" : "straw"} ฿{formatNumber(model.straw.revenuePerRai)}/{t(language, "rai")}
              </div>
            </div>
            <div className="font-display text-[30px] font-bold">{signedBaht(model.profitPerRai)}</div>
          </div>

          <div className="mt-3 flex items-center justify-between rounded-lg bg-[#2f5d50] px-[18px] py-[13px] text-white">
            <div>
              <div className="text-[12px] font-semibold opacity-95">🌍 {t(language, "carbonCredit")}</div>
              <div className="mt-0.5 text-[11px] opacity-80">
                -{model.carbon.co2Reduction.toFixed(2)} tCO₂e/rai vs flooding · ฿{model.carbon.carbonPrice}/t
              </div>
            </div>
            <div className="text-right">
              <div className="font-display text-[26px] font-bold">฿{formatNumber(model.carbon.creditPerRai * simulation.farmSize)}</div>
              <div className="text-[10px] opacity-85">-{(model.carbon.co2Reduction * simulation.farmSize).toFixed(1)} tCO₂e total</div>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-rice-card bg-white px-4 py-3">
            <ExplanationPanel language={language} model={model} compact />
          </div>

          <div className="mt-4 rounded-lg border border-rice-card bg-white px-4 py-3">
            <RiskContributionPanel language={language} model={model} compact />
          </div>

          <div className="mt-4">
            <RecommendationPanel language={language} risks={model.risks} actions={model.recommendedActions} compact />
          </div>

          <div className="mt-5 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={simulation.closeSummary}
              className="rounded-[11px] border border-[#cdd5c4] bg-white px-5 py-[11px] text-[13px] font-semibold text-[#3c473a] transition hover:bg-[#f8faf4]"
            >
              {t(language, "viewField")}
            </button>
            <button
              type="button"
              onClick={simulation.runSimulation}
              className="rounded-[11px] bg-rice-green px-[22px] py-[11px] text-[13px] font-bold text-white transition hover:bg-rice-dark"
            >
              ↻ {t(language, "runAgain")}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function SummaryTotal({ label, value }) {
  return (
    <div className="min-w-0">
      <div className="text-[9.5px] leading-tight text-rice-faint">{label}</div>
      <div className="mt-0.5 font-display text-[16px] font-bold text-[#2f3b34]">{value}</div>
    </div>
  );
}
