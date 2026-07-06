import { formatNumber } from "../utils/format.js";
import { pickLang, t } from "../i18n.js";

const toneStyles = {
  good: {
    dot: "bg-rice-green",
    bg: "bg-[#f1f8ee]",
    border: "border-[#d7e8cf]",
    text: "text-[#2c5e36]",
  },
  warning: {
    dot: "bg-rice-amber",
    bg: "bg-[#fffaf0]",
    border: "border-[#f0e3bf]",
    text: "text-[#8a7040]",
  },
  danger: {
    dot: "bg-rice-red",
    bg: "bg-[#fff5f0]",
    border: "border-[#f3ddd1]",
    text: "text-[#7a3c26]",
  },
};

export default function ExplanationPanel({ language, model, compact = false }) {
  const factors = compact
    ? [...model.explanations.scoreFactors.slice(0, 3), ...model.explanations.economics.filter((item) => item.key === "profit")]
    : [...model.explanations.scoreFactors.slice(0, 3), ...model.explanations.economics.slice(0, 3)];

  return (
    <section className={compact ? "" : "mt-3.5 rounded-[13px] border border-rice-card bg-white px-[13px] py-3"}>
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <div className="text-[11px] font-bold text-[#3c473a]">{t(language, "whyResult")}</div>
          <div className="mt-0.5 text-[9.5px] leading-snug text-rice-faint">
            {language === "th"
              ? model.explanations.summary
              : "Scores combine crop condition, water, fertilizer, threats, weather, timing, and farm economics."}
          </div>
        </div>
        <div className="rounded-[9px] bg-[#f4f7ef] px-2 py-1 text-right">
          <div className="font-display text-[13px] font-bold text-rice-dark">{formatNumber(model.estimatedYieldKgPerRai)}</div>
          <div className="text-[8px] text-rice-faint">kg/rai</div>
        </div>
      </div>

      <div className={`grid gap-2 ${compact ? "md:grid-cols-2" : ""}`}>
        {factors.map((factor) => (
          <ReasonCard key={factor.key} language={language} factor={factor} compact={compact} />
        ))}
      </div>
    </section>
  );
}

function ReasonCard({ language, factor, compact }) {
  const style = toneStyles[factor.tone] ?? toneStyles.warning;

  return (
    <div className={`rounded-[10px] border px-2.5 py-2 ${style.bg} ${style.border}`}>
      <div className="mb-1 flex items-center justify-between gap-2">
        <div className={`flex min-w-0 items-center gap-1.5 text-[10.5px] font-bold ${style.text}`}>
          <span className={`h-2 w-2 flex-none rounded-full ${style.dot}`} />
          <span className="truncate">{pickLang(language, factor.label, factor.th)}</span>
        </div>
        {Number.isFinite(factor.value) ? <span className="font-display text-[10.5px] font-bold text-[#3c473a]">{factor.value}</span> : null}
      </div>
      <div className={`${compact ? "text-[10.5px]" : "text-[9.5px]"} leading-snug text-[#52614f]`}>{factorText(language, factor)}</div>
    </div>
  );
}

function factorText(language, factor) {
  if (language === "th") return factor.text;

  const valueText = Number.isFinite(factor.value) ? ` (${factor.value})` : "";
  const textByKey = {
    fertilizer: `Nutrient balance and split timing affect crop vigor${valueText}.`,
    water: `Water management determines drought or flood stress${valueText}.`,
    pestDisease: `Pest, disease, and weed pressure reduce growth and raise chemical/IPM costs${valueText}.`,
    soilWeather: `Soil, weather, and timing set the growth baseline${valueText}.`,
    yield: "Yield is estimated from growth score and variety potential.",
    revenue: "Revenue is based on yield and the user-set market price, with only wet-harvest moisture reducing revenue.",
    cost: "Cost pressure comes from the largest editable cost items per rai.",
    chemicals: "Chemical/IPM cost increases when pest, disease, or weed pressure rises.",
    profit: "Profit equals revenue minus total cost per rai.",
  };

  return textByKey[factor.key] ?? factor.text;
}
