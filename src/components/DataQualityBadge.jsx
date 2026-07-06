import { DATA_QUALITY_LEVELS } from "../data/methodologyData.js";
import { pickLang } from "../i18n.js";

export default function DataQualityBadge({ language, level = "medium", compact = false }) {
  const entry = DATA_QUALITY_LEVELS[level] ?? DATA_QUALITY_LEVELS.medium;
  const toneClass = {
    green: "border-[#cfe4c9] bg-[#edf6e9] text-[#2f6b48]",
    amber: "border-[#eadfbf] bg-[#fff8e6] text-[#8a641c]",
    red: "border-[#ead5cd] bg-[#fff0ea] text-[#a24b2b]",
  }[entry.tone];

  return (
    <span
      title={pickLang(language, entry.description, entry.descriptionTh)}
      className={`inline-flex items-center rounded border font-bold leading-none ${toneClass} ${
        compact ? "px-1 py-[2px] text-[7.5px]" : "px-1.5 py-[3px] text-[8px]"
      }`}
    >
      {pickLang(language, entry.en, entry.th)}
    </span>
  );
}

export function DataQualityLegend({ language }) {
  return (
    <div className="grid gap-1.5 md:grid-cols-3">
      {Object.entries(DATA_QUALITY_LEVELS).map(([level, entry]) => (
        <div key={level} className="rounded-lg border border-[#ebe7dc] bg-white/75 px-2.5 py-2">
          <div className="mb-1">
            <DataQualityBadge language={language} level={level} />
          </div>
          <div className="text-[9px] leading-snug text-rice-faint">{pickLang(language, entry.description, entry.descriptionTh)}</div>
        </div>
      ))}
    </div>
  );
}
