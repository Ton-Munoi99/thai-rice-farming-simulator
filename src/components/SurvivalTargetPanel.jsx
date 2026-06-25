import { useMemo, useState } from "react";
import { pickLang, t } from "../i18n.js";
import { clamp, formatNumber, signedBaht } from "../utils/format.js";

const DEFAULT_TARGET_PROFIT = 1000;
const DIRECT_MARKET_STRAW_PRICE = 1.2;

export default function SurvivalTargetPanel({ simulation }) {
  const { farmSize, language, liveModel: model, pricePerTon, strawPricePerKg, varietyInfo } = simulation;
  const [targetProfit, setTargetProfit] = useState(DEFAULT_TARGET_PROFIT);

  const analysis = useMemo(
    () => buildSurvivalTargetAnalysis({ farmSize, model, pricePerTon, strawPricePerKg, targetProfit, varietyInfo }),
    [farmSize, model, pricePerTon, strawPricePerKg, targetProfit, varietyInfo],
  );

  const updateTarget = (nextValue) => {
    const parsed = Number(nextValue);
    setTargetProfit(clamp(Number.isFinite(parsed) ? Math.round(parsed) : 0, -5000, 20000));
  };

  return (
    <section className="mt-[9px] rounded-lg border border-[#d9e2d1] bg-[#f7faf4] px-[13px] py-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[11px] font-bold text-[#2f3b34]">{t(language, "survivalTargetMode")}</div>
          <div className="mt-0.5 text-[9.5px] leading-snug text-rice-faint">{t(language, "survivalTargetSub")}</div>
        </div>
        <div className="flex flex-none items-center gap-[5px]">
          <StepButton onClick={() => updateTarget(targetProfit - 500)}>-</StepButton>
          <input
            aria-label="Target profit per rai"
            value={targetProfit}
            type="number"
            min="-5000"
            max="20000"
            step="100"
            onChange={(event) => updateTarget(event.target.value)}
            className="w-[64px] rounded-lg border border-[#dde3d6] bg-white px-1 py-1 text-center font-display text-[12px] font-bold text-[#3c473a] outline-none"
          />
          <StepButton onClick={() => updateTarget(targetProfit + 500)}>+</StepButton>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-1.5">
        <MiniMetric label={t(language, "targetProfitPerRai")} value={signedBaht(targetProfit)} />
        <MiniMetric
          label={analysis.gap > 0 ? t(language, "gapToTarget") : t(language, "targetReached")}
          value={analysis.gap > 0 ? signedBaht(-analysis.gap) : signedBaht(model.profitPerRai - targetProfit)}
          tone={analysis.gap > 0 ? "danger" : "good"}
        />
      </div>

      <div className="mt-2 grid grid-cols-2 gap-1.5">
        <TargetCard
          label={t(language, "yieldNeeded")}
          value={`${formatNumber(analysis.targetYieldKgPerRai)} kg`}
          detail={`${analysis.extraYieldKgPerRai > 0 ? "+" : ""}${formatNumber(analysis.extraYieldKgPerRai)} kg/${t(language, "rai")}`}
          tone={analysis.yieldFeasible ? "good" : "warning"}
        />
        <TargetCard
          label={t(language, "costNeeded")}
          value={`฿${formatNumber(analysis.targetCostPerRai)}`}
          detail={`${t(language, "cutCostBy")} ฿${formatNumber(analysis.requiredCostCutPerRai)}/${t(language, "rai")}`}
          tone={analysis.costFeasible ? "good" : "warning"}
        />
        <TargetCard
          label={t(language, "priceNeeded")}
          value={`฿${formatNumber(analysis.targetPricePerTon)}`}
          detail={`${analysis.requiredPriceIncreasePerTon > 0 ? "+" : ""}฿${formatNumber(analysis.requiredPriceIncreasePerTon)}/${t(language, "ton")}`}
          tone={analysis.priceFeasible ? "good" : "warning"}
        />
        <TargetCard
          label={t(language, "strawCanHelp")}
          value={`${formatNumber(analysis.strawCoverPercent)}%`}
          detail={
            analysis.targetStrawPricePerKg
              ? `฿${analysis.targetStrawPricePerKg.toFixed(2)}/${t(language, "kg")}`
              : t(language, "notAvailable")
          }
          tone={analysis.strawCoverPercent >= 35 || analysis.gap <= 0 ? "good" : "warning"}
        />
      </div>

      <div className={`mt-2 rounded-md px-2 py-2 text-[9.3px] leading-snug ${
        analysis.gap > 0 ? "bg-[#fffaf0] text-[#755d2c]" : "bg-[#eef6ed] text-[#2f6b48]"
      }`}>
        <span className="font-bold">{t(language, "recommendedPath")}: </span>
        {pickLang(language, analysis.recommendation.en, analysis.recommendation.th)}
      </div>

      <div className="mt-1.5 text-[8.4px] leading-snug text-[#8f978a]">
        {t(language, "survivalTargetNote")}
      </div>
    </section>
  );
}

function buildSurvivalTargetAnalysis({ farmSize, model, pricePerTon, strawPricePerKg, targetProfit, varietyInfo }) {
  const currentYield = Math.max(0, model.estimatedYieldKgPerRai ?? 0);
  const currentProfit = model.profitPerRai ?? 0;
  const gap = Math.max(0, targetProfit - currentProfit);
  const revenuePerKg = currentYield > 0
    ? Math.max(0.1, (model.revenuePerRai ?? 0) / currentYield)
    : Math.max(0.1, pricePerTon / 1000);
  const extraYieldKgPerRai = gap > 0 ? Math.ceil(gap / revenuePerKg) : 0;
  const targetYieldKgPerRai = currentYield + extraYieldKgPerRai;

  const requiredCostCutPerRai = Math.min(model.costPerRai ?? 0, gap);
  const targetCostPerRai = Math.max(0, (model.costPerRai ?? 0) - gap);
  const requiredPriceIncreasePerTon = currentYield > 0 && gap > 0 ? Math.ceil((gap / currentYield) * 1000) : 0;
  const targetPricePerTon = pricePerTon + requiredPriceIncreasePerTon;

  const collectableStrawKg = Math.max(0, model.straw?.collectableKgPerRai ?? 0);
  const targetStrawPricePerKg = collectableStrawKg > 0 && gap > 0
    ? strawPricePerKg + gap / collectableStrawKg
    : strawPricePerKg;
  const extraStrawAtDirectMarket = collectableStrawKg * Math.max(0, DIRECT_MARKET_STRAW_PRICE - strawPricePerKg);
  const strawCoverPercent = gap > 0 ? clamp(Math.round((extraStrawAtDirectMarket / gap) * 100), 0, 100) : 100;

  const productionPotential = Math.max(model.yieldPotential ?? varietyInfo?.potential ?? currentYield, 1);
  const yieldFeasible = targetYieldKgPerRai <= productionPotential * 1.08;
  const costFeasible = gap <= 900;
  const priceFeasible = requiredPriceIncreasePerTon <= Math.max(900, pricePerTon * 0.12);
  const recommendation = buildRecommendation({ costFeasible, gap, priceFeasible, strawCoverPercent, targetProfit, yieldFeasible });

  return {
    farmGap: gap * farmSize,
    gap,
    extraYieldKgPerRai,
    targetYieldKgPerRai,
    requiredCostCutPerRai,
    targetCostPerRai,
    requiredPriceIncreasePerTon,
    targetPricePerTon,
    targetStrawPricePerKg,
    strawCoverPercent,
    yieldFeasible,
    costFeasible,
    priceFeasible,
    recommendation,
  };
}

function buildRecommendation({ costFeasible, gap, priceFeasible, strawCoverPercent, targetProfit, yieldFeasible }) {
  if (gap <= 0) {
    return {
      en: `Already above the target profit of ${signedBaht(targetProfit)}/rai. Keep monitoring cost and moisture before harvest.`,
      th: `ถึงเป้ากำไร ${signedBaht(targetProfit)}/ไร่แล้ว คุมต้นทุนและความชื้นก่อนขายต่อไป`,
    };
  }

  if (costFeasible) {
    return {
      en: "The shortest path is cost control: reduce discretionary labor, fuel, transport, or chemical passes first.",
      th: "ทางสั้นสุดคือคุมต้นทุนก่อน ลดรอบแรงงาน น้ำมัน ขนส่ง หรือรอบยาเท่าที่ไม่กระทบผลผลิต",
    };
  }

  if (yieldFeasible && strawCoverPercent >= 25) {
    return {
      en: "Use a mixed plan: lift yield with timing and water control, then use collectable straw to close part of the gap.",
      th: "ควรใช้แผนผสม เพิ่มผลผลิตด้วยน้ำและ timing แล้วให้รายได้ฟางช่วยปิด gap บางส่วน",
    };
  }

  if (yieldFeasible) {
    return {
      en: "Yield improvement is still realistic. Prioritize water, nutrient balance, and pest scouting before chasing price.",
      th: "ยังพอพึ่งการเพิ่มผลผลิตได้ ให้เน้นน้ำ สมดุลปุ๋ย และสำรวจโรคแมลงก่อนหวังราคาตลาด",
    };
  }

  if (priceFeasible) {
    return {
      en: "The target depends on selling terms. Watch moisture, timing, and buyer options because market price is mostly external.",
      th: "เป้าหมายเริ่มพึ่งเงื่อนไขการขาย ต้องคุมความชื้น เวลาเกี่ยว และทางเลือกผู้รับซื้อ เพราะราคาตลาดอยู่นอกแปลง",
    };
  }

  return {
    en: "This target is hard under current conditions. Reset the case around lower cost, higher-yield system, or added off-field income.",
    th: "เป้านี้ยากภายใต้เงื่อนไขปัจจุบัน ควรปรับกรณีใหม่ให้ต้นทุนต่ำลง ระบบผลผลิตสูงขึ้น หรือมีรายได้เสริมจากนอกแปลง",
  };
}

function StepButton({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-[22px] w-[22px] rounded-md border border-[#dedbd0] bg-[#fbfaf6] p-0 text-[14px] font-bold leading-none text-[#3c473a] transition hover:bg-white"
    >
      {children}
    </button>
  );
}

function MiniMetric({ label, tone = "muted", value }) {
  const toneClass = tone === "good" ? "text-[#2f6b48]" : tone === "danger" ? "text-[#a24b2b]" : "text-[#3c473a]";

  return (
    <div className="rounded-md bg-white/75 px-2 py-1.5">
      <div className="text-[8.5px] leading-tight text-rice-faint">{label}</div>
      <div className={`mt-0.5 font-display text-[13px] font-bold ${toneClass}`}>{value}</div>
    </div>
  );
}

function TargetCard({ detail, label, tone, value }) {
  const toneClass = tone === "good" ? "border-[#d7e8cf] bg-white text-[#2f6b48]" : "border-[#eadfbf] bg-[#fffdf6] text-[#8a641c]";

  return (
    <div className={`rounded-md border px-2 py-1.5 ${toneClass}`}>
      <div className="text-[8.5px] font-semibold leading-tight">{label}</div>
      <div className="mt-0.5 font-display text-[13px] font-bold">{value}</div>
      <div className="mt-0.5 text-[8px] leading-tight opacity-75">{detail}</div>
    </div>
  );
}
