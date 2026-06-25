import { METRIC_QUALITY } from "../data/methodologyData.js";
import { MARKET_PRICE_SCENARIOS } from "../data/planningData.js";
import { pickLang, t } from "../i18n.js";
import { formatNumber, signedBaht } from "../utils/format.js";
import DataQualityBadge, { DataQualityLegend } from "./DataQualityBadge.jsx";

export default function ExportReportModal({ onClose, simulation }) {
  const { farmSize, language, liveModel: model, pricePerTon, strawPricePerKg, varietyInfo } = simulation;
  const totals = {
    riceRevenue: model.riceRevenuePerRai * farmSize,
    strawRevenue: model.straw.revenuePerRai * farmSize,
    revenue: model.revenuePerRai * farmSize,
    cost: model.costPerRai * farmSize,
    profit: model.profitPerRai * farmSize,
  };
  const rows = [
    [t(language, "riceVariety"), `${varietyInfo.icon} ${pickLang(language, varietyInfo.en, varietyInfo.name)}`, "high"],
    [t(language, "farmSize"), `${farmSize} ${t(language, "rai")}`, METRIC_QUALITY.farmSize],
    [t(language, "estimatedYield"), `${formatNumber(model.estimatedYieldKgPerRai)} kg/${t(language, "rai")}`, METRIC_QUALITY.yield],
    [t(language, "salePrice"), `฿${formatNumber(pricePerTon)}/${t(language, "ton")}`, METRIC_QUALITY.price],
    [t(language, "productionCost"), `฿${formatNumber(model.costPerRai)}/${t(language, "rai")}`, METRIC_QUALITY.cost],
    [t(language, "revenue"), `฿${formatNumber(model.revenuePerRai)}/${t(language, "rai")}`, METRIC_QUALITY.revenue],
    [model.profitPerRai >= 0 ? t(language, "profit") : t(language, "loss"), `${signedBaht(model.profitPerRai)}/${t(language, "rai")}`, METRIC_QUALITY.revenue],
    [t(language, "strawIncome"), `${formatNumber(model.straw.collectableKgPerRai)} kg/${t(language, "rai")}`, METRIC_QUALITY.straw],
    [t(language, "strawPrice"), `฿${strawPricePerKg.toFixed(2)}/${t(language, "kg")}`, METRIC_QUALITY.price],
    [t(language, "financialRisk"), pickLang(language, model.financialRisk.level, model.financialRisk.levelTh), "medium"],
  ];

  const copySummary = async () => {
    const text = buildPlainTextSummary({ farmSize, language, model, pricePerTon, strawPricePerKg, totals, varietyInfo });
    await navigator.clipboard?.writeText(text);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(37,42,38,.46)] p-4">
      <section className="max-h-[92vh] w-[820px] max-w-[96vw] animate-fade-up overflow-y-auto rounded-xl bg-rice-panel shadow-modal">
        <header className="no-print sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-[#d8ddd2] bg-[#fffdf7]/95 px-5 py-4 backdrop-blur">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[.5px] text-rice-faint">{t(language, "exportReport")}</div>
            <div className="text-[21px] font-bold text-[#2f3b34]">{t(language, "scenarioReport")}</div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={copySummary} className="rounded-lg border border-[#dedbd0] bg-white px-3 py-2 text-[11px] font-bold text-rice-muted transition hover:bg-[#f8faf4]">
              {t(language, "copySummary")}
            </button>
            <button type="button" onClick={() => window.print()} className="rounded-lg bg-rice-green px-3 py-2 text-[11px] font-bold text-white transition hover:bg-rice-dark">
              {t(language, "savePdf")}
            </button>
            <button type="button" onClick={onClose} className="rounded-lg border border-[#dedbd0] bg-white px-3 py-2 text-[11px] font-bold text-rice-muted transition hover:bg-[#f8faf4]">
              {t(language, "close")}
            </button>
          </div>
        </header>

        <article className="printable-report px-5 py-5">
          <div className="flex items-start justify-between gap-4 border-b border-[#ebe7dc] pb-4">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[.5px] text-rice-faint">{t(language, "appTitle")}</div>
              <h2 className="mt-1 text-[25px] font-bold leading-tight text-[#2f3b34]">{t(language, "scenarioReport")}</h2>
              <p className="mt-1 text-[11px] leading-snug text-rice-muted">{t(language, "exportReportSub")}</p>
            </div>
            <div className={`rounded-lg px-4 py-3 text-right ${totals.profit >= 0 ? "bg-[#edf6e9] text-[#2f6b48]" : "bg-[#fff0ea] text-[#a24b2b]"}`}>
              <div className="text-[10px] font-bold">{t(language, "totalProfit")}</div>
              <div className="font-display text-[25px] font-bold">{signedBaht(totals.profit)}</div>
              <div className="text-[9px]">{farmSize} {t(language, "rai")}</div>
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <section className="rounded-lg border border-[#d8ddd2] bg-[#fbfaf6] px-4 py-3">
              <h3 className="text-[13px] font-bold text-[#2f3b34]">{t(language, "keyNumbers")}</h3>
              <div className="mt-2 flex flex-col divide-y divide-[#ebe7dc]">
                {rows.map(([label, value, quality]) => (
                  <div key={label} className="flex items-center justify-between gap-3 py-2">
                    <div className="flex min-w-0 items-center gap-1.5">
                      <span className="truncate text-[10px] text-rice-muted">{label}</span>
                      <DataQualityBadge language={language} level={quality} compact />
                    </div>
                    <div className="font-display text-[12px] font-bold text-[#2f3b34]">{value}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-[#d8ddd2] bg-[#fbfaf6] px-4 py-3">
              <h3 className="text-[13px] font-bold text-[#2f3b34]">{t(language, "farmTotals")}</h3>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <ReportMetric label={t(language, "totalRevenue")} value={`฿${formatNumber(totals.revenue)}`} />
                <ReportMetric label={t(language, "totalCost")} value={`฿${formatNumber(totals.cost)}`} />
                <ReportMetric label={t(language, "riceTotal")} value={`฿${formatNumber(totals.riceRevenue)}`} />
                <ReportMetric label={t(language, "strawTotal")} value={`฿${formatNumber(totals.strawRevenue)}`} />
              </div>
              <div className="mt-3 rounded-lg bg-white/70 px-3 py-2 text-[10px] leading-snug text-rice-muted">
                {t(language, "exportReportNote")}
              </div>
            </section>
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <section className="rounded-lg border border-[#d8ddd2] bg-[#fbfaf6] px-4 py-3">
              <h3 className="text-[13px] font-bold text-[#2f3b34]">{t(language, "reportChart")}</h3>
              <ReportBar label={t(language, "totalRevenue")} value={totals.revenue} max={Math.max(totals.revenue, totals.cost, 1)} tone="green" />
              <ReportBar label={t(language, "totalCost")} value={totals.cost} max={Math.max(totals.revenue, totals.cost, 1)} tone="red" />
              <div className={`mt-3 rounded-lg px-3 py-2 text-[11px] font-bold ${
                totals.profit >= 0 ? "bg-[#edf6e9] text-[#2f6b48]" : "bg-[#fff0ea] text-[#a24b2b]"
              }`}>
                {t(language, "reportVerdict")}: {totals.profit >= 0 ? t(language, "profit") : t(language, "loss")} {signedBaht(totals.profit)}
              </div>
            </section>

            <section className="rounded-lg border border-[#d8ddd2] bg-[#fbfaf6] px-4 py-3">
              <h3 className="text-[13px] font-bold text-[#2f3b34]">{t(language, "marketSensitivity")}</h3>
              <div className="mt-2 grid grid-cols-5 gap-1">
                {MARKET_PRICE_SCENARIOS.map((scenario) => {
                  const nextPrice = Math.max(1000, pricePerTon + scenario.change);
                  const riceRevenue = Math.round(((model.estimatedYieldKgPerRai * nextPrice) / 1000) * model.quality / 10) * 10;
                  const profit = riceRevenue + model.straw.revenuePerRai - model.costPerRai;
                  return (
                    <div key={scenario.key} className="rounded-md bg-white/75 px-1.5 py-2 text-center">
                      <div className="text-[8px] font-bold text-rice-faint">{scenario.label}</div>
                      <div className={`font-display text-[10px] font-bold ${profit >= 0 ? "text-[#2f6b48]" : "text-[#a24b2b]"}`}>{signedBaht(profit)}</div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          <section className="mt-3 rounded-lg border border-[#d8ddd2] bg-[#fbfaf6] px-4 py-3">
            <h3 className="text-[13px] font-bold text-[#2f3b34]">{t(language, "dataQualityTitle")}</h3>
            <div className="mt-2">
              <DataQualityLegend language={language} />
            </div>
          </section>

          <section className="mt-3 rounded-lg border border-[#d8ddd2] bg-[#fbfaf6] px-4 py-3">
            <h3 className="text-[13px] font-bold text-[#2f3b34]">{t(language, "recommendedActions")}</h3>
            <div className="mt-2 grid gap-2 md:grid-cols-2">
              {model.recommendedActions.slice(0, 4).map((action) => (
                <div key={action.en} className="rounded-md bg-white/75 px-3 py-2 text-[10px] leading-snug text-[#5e6b5b]">
                  {pickLang(language, action.en, action.th)}
                </div>
              ))}
            </div>
          </section>

          <section className="mt-3 rounded-lg border border-[#d8ddd2] bg-[#fbfaf6] px-4 py-3">
            <h3 className="text-[13px] font-bold text-[#2f3b34]">{t(language, "suggestedPlans")}</h3>
            <div className="mt-2 grid gap-2 md:grid-cols-3">
              {simulation.survivalPlans.slice(0, 3).map((plan) => (
                <div key={plan.key} className="rounded-md bg-white/75 px-3 py-2 text-[10px] leading-snug text-[#5e6b5b]">
                  <div className="font-bold text-[#2f3b34]">{plan.icon} {pickLang(language, plan.label, plan.labelTh)}</div>
                  <div className="mt-1">{t(language, "profitPerRai")}: {signedBaht(plan.model.profitPerRai)}</div>
                </div>
              ))}
            </div>
          </section>
        </article>
      </section>
    </div>
  );
}

function buildPlainTextSummary({ farmSize, language, model, pricePerTon, strawPricePerKg, totals, varietyInfo }) {
  return [
    t(language, "scenarioReport"),
    `${t(language, "riceVariety")}: ${pickLang(language, varietyInfo.en, varietyInfo.name)}`,
    `${t(language, "farmSize")}: ${farmSize} ${t(language, "rai")}`,
    `${t(language, "estimatedYield")}: ${formatNumber(model.estimatedYieldKgPerRai)} kg/${t(language, "rai")}`,
    `${t(language, "salePrice")}: ฿${formatNumber(pricePerTon)}/${t(language, "ton")}`,
    `${t(language, "strawPrice")}: ฿${strawPricePerKg.toFixed(2)}/${t(language, "kg")}`,
    `${t(language, "totalRevenue")}: ฿${formatNumber(totals.revenue)}`,
    `${t(language, "totalCost")}: ฿${formatNumber(totals.cost)}`,
    `${t(language, "totalProfit")}: ${signedBaht(totals.profit)}`,
  ].join("\n");
}

function ReportMetric({ label, value }) {
  return (
    <div className="rounded-lg bg-white/75 px-3 py-2">
      <div className="text-[9px] leading-tight text-rice-faint">{label}</div>
      <div className="mt-0.5 font-display text-[15px] font-bold text-[#2f3b34]">{value}</div>
    </div>
  );
}

function ReportBar({ label, max, tone, value }) {
  const color = tone === "green" ? "bg-[#2f6b48]" : "bg-[#a24b2b]";
  const width = `${Math.max(4, Math.min(100, (value / max) * 100))}%`;

  return (
    <div className="mt-3">
      <div className="mb-1 flex items-center justify-between text-[10px] text-rice-muted">
        <span>{label}</span>
        <span className="font-display font-bold text-[#2f3b34]">฿{formatNumber(value)}</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-[#ebe7dc]">
        <div className={`h-full rounded-full ${color}`} style={{ width }} />
      </div>
    </div>
  );
}
