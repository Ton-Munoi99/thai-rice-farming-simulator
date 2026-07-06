import { METRIC_QUALITY } from "../data/methodologyData.js";
import { MARKET_PRICE_SCENARIOS } from "../data/planningData.js";
import { pickLang, t } from "../i18n.js";
import { buildRiskContributions } from "../simulation/RiskContributionEngine.js";
import { formatNumber, signedBaht } from "../utils/format.js";
import DataQualityBadge, { DataQualityLegend } from "./DataQualityBadge.jsx";

export default function ExportReportModal({ onClose, simulation }) {
  const { farmSize, language, liveModel: model, pricePerTon, strawPricePerKg, varietyInfo } = simulation;
  const riskContributions = buildRiskContributions(model, language);
  const topPlan = simulation.survivalPlans[0];
  const decisionTone = model.profitPerRai >= 800 ? "go" : model.profitPerRai >= 0 ? "watch" : "stop";
  const generatedAt = new Date().toLocaleDateString(language === "th" ? "th-TH" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
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
    [
      model.profitPerRai >= 0 ? t(language, "profit") : t(language, "loss"),
      `${signedBaht(model.profitPerRai)}/${t(language, "rai")}`,
      METRIC_QUALITY.revenue,
    ],
    [t(language, "strawIncome"), `${formatNumber(model.straw.collectableKgPerRai)} kg/${t(language, "rai")}`, METRIC_QUALITY.straw],
    [t(language, "strawPrice"), `฿${strawPricePerKg.toFixed(2)}/${t(language, "kg")}`, METRIC_QUALITY.price],
    [t(language, "financialRisk"), pickLang(language, model.financialRisk.level, model.financialRisk.levelTh), "medium"],
  ];

  const copySummary = async () => {
    const text = buildPlainTextSummary({
      farmSize,
      language,
      model,
      pricePerTon,
      riskContributions,
      strawPricePerKg,
      topPlan,
      totals,
      varietyInfo,
    });
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
            <button
              type="button"
              onClick={copySummary}
              className="rounded-lg border border-[#dedbd0] bg-white px-3 py-2 text-[11px] font-bold text-rice-muted transition hover:bg-[#f8faf4]"
            >
              {t(language, "copySummary")}
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-lg bg-rice-green px-3 py-2 text-[11px] font-bold text-white transition hover:bg-rice-dark"
            >
              {t(language, "savePdf")}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#dedbd0] bg-white px-3 py-2 text-[11px] font-bold text-rice-muted transition hover:bg-[#f8faf4]"
            >
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
              <div className="mt-2 text-[9.5px] text-rice-faint">{generatedAt}</div>
            </div>
            <div
              className={`rounded-lg px-4 py-3 text-right ${totals.profit >= 0 ? "bg-[#edf6e9] text-[#2f6b48]" : "bg-[#fff0ea] text-[#a24b2b]"}`}
            >
              <div className="text-[10px] font-bold">{t(language, "totalProfit")}</div>
              <div className="font-display text-[25px] font-bold">{signedBaht(totals.profit)}</div>
              <div className="text-[9px]">
                {farmSize} {t(language, "rai")}
              </div>
            </div>
          </div>

          <section className="mt-4 grid gap-3 md:grid-cols-[1.25fr_.75fr]">
            <div
              className={`rounded-xl border px-4 py-4 ${
                decisionTone === "go"
                  ? "border-[#cfe4c9] bg-[#f2faf0]"
                  : decisionTone === "watch"
                    ? "border-[#eadfbf] bg-[#fffaf0]"
                    : "border-[#ead5cd] bg-[#fff5f0]"
              }`}
            >
              <div className="text-[11px] font-bold uppercase tracking-[.05em] text-rice-faint">{t(language, "decisionStatus")}</div>
              <div
                className={`mt-1 font-display text-[28px] font-bold leading-none ${
                  decisionTone === "go" ? "text-[#2f6b48]" : decisionTone === "watch" ? "text-[#8a641c]" : "text-[#a24b2b]"
                }`}
              >
                {t(language, decisionTone === "go" ? "reportGo" : decisionTone === "watch" ? "reportWatch" : "reportStop")}
              </div>
              <div className="mt-2 text-[11px] leading-relaxed text-[#4f5c50]">
                {model.profitPerRai >= 0
                  ? `${t(language, "profit")} ${signedBaht(model.profitPerRai)}/${t(language, "rai")} · ${t(language, "financialRisk")} ${pickLang(language, model.financialRisk.level, model.financialRisk.levelTh)}`
                  : `${t(language, "loss")} ${signedBaht(model.profitPerRai)}/${t(language, "rai")} · ${pickLang(language, riskContributions[0].action, riskContributions[0].actionTh)}`}
              </div>
            </div>

            <div className="rounded-xl border border-[#d8ddd2] bg-[#fbfaf6] px-4 py-4">
              <div className="text-[11px] font-bold text-[#2f3b34]">{t(language, "primaryPressure")}</div>
              <div className="mt-2 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate font-bold text-[#3c473a]">
                    {riskContributions[0].icon} {pickLang(language, riskContributions[0].label, riskContributions[0].labelTh)}
                  </div>
                  <div className="mt-1 text-[9.5px] leading-snug text-rice-faint">
                    {pickLang(language, riskContributions[0].detail, riskContributions[0].detailTh)}
                  </div>
                </div>
                <div className="font-display text-[28px] font-bold text-rice-red">{riskContributions[0].percent}%</div>
              </div>
            </div>
          </section>

          <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
            <ReportMetric label={t(language, "estimatedYield")} value={`${formatNumber(model.estimatedYieldKgPerRai)} kg/rai`} />
            <ReportMetric
              label={t(language, "breakEvenYield")}
              value={`${formatNumber(model.financialRisk.breakEvenYieldKgPerRai)} kg/rai`}
            />
            <ReportMetric label={t(language, "productionCost")} value={`฿${formatNumber(model.costPerRai)}/rai`} />
            <ReportMetric
              label={model.profitPerRai >= 0 ? t(language, "profit") : t(language, "loss")}
              value={`${signedBaht(model.profitPerRai)}/rai`}
              danger={model.profitPerRai < 0}
            />
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
              <ReportBar
                label={t(language, "totalRevenue")}
                value={totals.revenue}
                max={Math.max(totals.revenue, totals.cost, 1)}
                tone="green"
              />
              <ReportBar label={t(language, "totalCost")} value={totals.cost} max={Math.max(totals.revenue, totals.cost, 1)} tone="red" />
              <div
                className={`mt-3 rounded-lg px-3 py-2 text-[11px] font-bold ${
                  totals.profit >= 0 ? "bg-[#edf6e9] text-[#2f6b48]" : "bg-[#fff0ea] text-[#a24b2b]"
                }`}
              >
                {t(language, "reportVerdict")}: {totals.profit >= 0 ? t(language, "profit") : t(language, "loss")}{" "}
                {signedBaht(totals.profit)}
              </div>
            </section>

            <section className="rounded-lg border border-[#d8ddd2] bg-[#fbfaf6] px-4 py-3">
              <h3 className="text-[13px] font-bold text-[#2f3b34]">{t(language, "marketSensitivity")}</h3>
              <div className="mt-2 grid grid-cols-5 gap-1">
                {MARKET_PRICE_SCENARIOS.map((scenario) => {
                  const nextPrice = Math.max(1000, pricePerTon + scenario.change);
                  const riceRevenue = Math.round((((model.estimatedYieldKgPerRai * nextPrice) / 1000) * model.quality) / 10) * 10;
                  const profit = riceRevenue + model.straw.revenuePerRai - model.costPerRai;
                  return (
                    <div key={scenario.key} className="rounded-md bg-white/75 px-1.5 py-2 text-center">
                      <div className="text-[8px] font-bold text-rice-faint">{scenario.label}</div>
                      <div className={`font-display text-[10px] font-bold ${profit >= 0 ? "text-[#2f6b48]" : "text-[#a24b2b]"}`}>
                        {signedBaht(profit)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <section className="rounded-lg border border-[#d8ddd2] bg-[#fbfaf6] px-4 py-3">
              <h3 className="text-[13px] font-bold text-[#2f3b34]">{t(language, "riskContributionTitle")}</h3>
              <div className="mt-2 space-y-2">
                {riskContributions.slice(0, 4).map((item) => (
                  <ReportPressure key={item.key} item={item} language={language} />
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-[#d8ddd2] bg-[#fbfaf6] px-4 py-3">
              <h3 className="text-[13px] font-bold text-[#2f3b34]">{t(language, "costStructure")}</h3>
              <div className="mt-2 flex flex-col divide-y divide-[#ebe7dc]">
                {[...model.costBreakdown]
                  .sort((a, b) => b.value - a.value)
                  .slice(0, 5)
                  .map((item) => (
                    <div key={item.key} className="flex items-center justify-between gap-3 py-1.5 text-[10px]">
                      <span className="min-w-0 truncate text-rice-muted">{item.label}</span>
                      <span className="font-display font-bold text-[#2f3b34]">฿{formatNumber(item.value)}</span>
                    </div>
                  ))}
              </div>
              <div className="mt-2 rounded-lg bg-white/75 px-3 py-2 text-[9.5px] leading-snug text-rice-faint">
                {model.costDrivers.total > 0
                  ? `${t(language, "linkedCostDrivers")}: +฿${formatNumber(model.costDrivers.total)}/${t(language, "rai")}`
                  : t(language, "riskContributionSub")}
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
                  <div className="font-bold text-[#2f3b34]">
                    {plan.icon} {pickLang(language, plan.label, plan.labelTh)}
                  </div>
                  <div className="mt-1">
                    {t(language, "profitPerRai")}: {signedBaht(plan.model.profitPerRai)}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="mt-4 border-t border-[#ebe7dc] pt-3 text-[9.5px] leading-snug text-rice-faint">
            {t(language, "reportFooterNote")}
          </div>
        </article>
      </section>
    </div>
  );
}

function buildPlainTextSummary({
  farmSize,
  language,
  model,
  pricePerTon,
  riskContributions,
  strawPricePerKg,
  topPlan,
  totals,
  varietyInfo,
}) {
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
    `${t(language, "primaryPressure")}: ${pickLang(language, riskContributions[0].label, riskContributions[0].labelTh)} (${riskContributions[0].percent}%)`,
    `${t(language, "recommendedPath")}: ${topPlan ? `${pickLang(language, topPlan.label, topPlan.labelTh)} ${signedBaht(topPlan.model.profitPerRai)}/${t(language, "rai")}` : t(language, "notAvailable")}`,
  ].join("\n");
}

function ReportMetric({ danger = false, label, value }) {
  return (
    <div className="rounded-lg bg-white/75 px-3 py-2">
      <div className="text-[9px] leading-tight text-rice-faint">{label}</div>
      <div className={`mt-0.5 font-display text-[15px] font-bold ${danger ? "text-[#a24b2b]" : "text-[#2f3b34]"}`}>{value}</div>
    </div>
  );
}

function ReportPressure({ item, language }) {
  const color = item.tone === "danger" ? "bg-[#a24b2b]" : item.tone === "good" ? "bg-[#2f6b48]" : "bg-[#c6a15b]";

  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2 text-[10px]">
        <span className="min-w-0 truncate font-bold text-[#3c473a]">
          {item.icon} {pickLang(language, item.label, item.labelTh)}
        </span>
        <span className="font-display font-bold text-[#2f3b34]">{item.percent}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[#ebe7dc]">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.max(4, item.percent)}%` }} />
      </div>
      <div className="mt-1 text-[8.5px] leading-snug text-rice-faint">{pickLang(language, item.action, item.actionTh)}</div>
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
