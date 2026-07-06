import { buildRiskContributions } from "../simulation/RiskContributionEngine.js";
import { formatNumber } from "../utils/format.js";
import { pickLang, t } from "../i18n.js";
import DataQualityBadge from "./DataQualityBadge.jsx";

const toneClasses = {
  good: {
    bar: "bg-rice-green",
    bg: "bg-[#f4faf2]",
    border: "border-[#d7e8cf]",
    text: "text-[#2f6b48]",
  },
  warning: {
    bar: "bg-rice-amber",
    bg: "bg-[#fffaf0]",
    border: "border-[#eadfbf]",
    text: "text-[#8a641c]",
  },
  danger: {
    bar: "bg-rice-red",
    bg: "bg-[#fff5f0]",
    border: "border-[#ead5cd]",
    text: "text-[#a24b2b]",
  },
};

export default function RiskContributionPanel({ compact = false, language, model }) {
  const contributions = buildRiskContributions(model, language);
  const top = contributions[0];

  return (
    <section className={compact ? "" : "mt-3.5 rounded-[13px] border border-rice-card bg-white px-[13px] py-3"}>
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <div className="text-[11px] font-bold text-[#3c473a]">{t(language, "riskContributionTitle")}</div>
          <div className="mt-0.5 text-[9.5px] leading-snug text-rice-faint">{t(language, "riskContributionSub")}</div>
        </div>
        <DataQualityBadge language={language} level="medium" compact />
      </div>

      <div className={`rounded-lg border px-3 py-2.5 ${toneClasses[top.tone]?.bg} ${toneClasses[top.tone]?.border}`}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className={`text-[11px] font-bold ${toneClasses[top.tone]?.text}`}>
              {top.icon} {pickLang(language, top.label, top.labelTh)}
            </div>
            <div className="mt-0.5 text-[9.5px] leading-snug text-rice-faint">{pickLang(language, top.action, top.actionTh)}</div>
          </div>
          <div className={`font-display text-[22px] font-bold leading-none ${toneClasses[top.tone]?.text}`}>{top.percent}%</div>
        </div>
      </div>

      <div className="mt-2 space-y-1.5">
        {contributions.map((item) => (
          <ContributionRow key={item.key} item={item} language={language} />
        ))}
      </div>
      <div className="mt-2 text-[8.5px] leading-snug text-rice-faint">
        {t(language, "riskContributionNote")} ฿{formatNumber(Math.max(0, -model.profitPerRai))}/{t(language, "rai")}
      </div>
    </section>
  );
}

function ContributionRow({ item, language }) {
  const tone = toneClasses[item.tone] ?? toneClasses.warning;

  return (
    <div className="rounded-lg border border-[#edf1e8] bg-[#fbfcf8] px-2.5 py-2">
      <div className="mb-1 flex items-center justify-between gap-2">
        <div className="min-w-0 text-[9.5px] font-bold text-[#3c473a]">
          <span className="mr-1 text-[9px] text-rice-faint">{item.icon}</span>
          <span className="truncate">{pickLang(language, item.label, item.labelTh)}</span>
        </div>
        <div className={`font-display text-[11px] font-bold ${tone.text}`}>{item.percent}%</div>
      </div>
      <div className="h-[7px] overflow-hidden rounded-full bg-[#edf1e8]">
        <div className={`h-full rounded-full ${tone.bar}`} style={{ width: `${Math.max(4, item.percent)}%` }} />
      </div>
      <div className="mt-1 text-[8.5px] leading-snug text-rice-faint">{pickLang(language, item.detail, item.detailTh)}</div>
    </div>
  );
}
