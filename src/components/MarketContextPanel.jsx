import { MARKET_PRICE_SCENARIOS } from "../data/planningData.js";
import { t } from "../i18n.js";
import { formatNumber, signedBaht } from "../utils/format.js";

export default function MarketContextPanel({ simulation }) {
  const { farmSize, language, liveModel: model, pricePerTon } = simulation;
  const riceKg = Math.max(0, model.estimatedYieldKgPerRai);
  const quality = model.quality ?? 1;

  return (
    <section className="mt-[9px] rounded-lg border border-[#e6dcc8] bg-[#fffaf0] px-[13px] py-2.5">
      <div className="mb-2">
        <div className="text-[11px] font-bold text-[#3c473a]">{t(language, "marketContext")}</div>
        <div className="text-[9px] leading-snug text-rice-faint">{t(language, "marketContextSub")}</div>
      </div>

      <div className="grid grid-cols-5 gap-1">
        {MARKET_PRICE_SCENARIOS.map((scenario) => {
          const nextPrice = Math.max(1000, pricePerTon + scenario.change);
          const riceRevenue = Math.round((((riceKg * nextPrice) / 1000) * quality) / 10) * 10;
          const profit = riceRevenue + model.straw.revenuePerRai - model.costPerRai;
          return (
            <div
              key={scenario.key}
              className={`rounded-md px-1.5 py-1.5 text-center ${
                scenario.change === 0
                  ? "bg-[#eef6ed] text-[#2f6b48]"
                  : profit >= 0
                    ? "bg-white text-[#3c473a]"
                    : "bg-[#fff3ea] text-[#a24b2b]"
              }`}
            >
              <div className="text-[7.5px] font-bold">{scenario.label}</div>
              <div className="font-display text-[9px] font-bold">{signedBaht(profit)}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-2 grid grid-cols-2 gap-1.5 border-t border-[#eadfbf] pt-2">
        <div className="rounded-md bg-white/70 px-2 py-1.5">
          <div className="text-[8px] text-rice-faint">{t(language, "qualityFactor")}</div>
          <div className="font-display text-[11px] font-bold text-[#3c473a]">{Math.round(quality * 100)}%</div>
        </div>
        <div className="rounded-md bg-white/70 px-2 py-1.5">
          <div className="text-[8px] text-rice-faint">{t(language, "farmImpact")}</div>
          <div className="font-display text-[11px] font-bold text-[#3c473a]">
            ฿{formatNumber(Math.round((riceKg * 500 * quality * farmSize) / 1000))}
          </div>
        </div>
      </div>
    </section>
  );
}
