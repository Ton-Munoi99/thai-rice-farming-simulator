import { FARM_SYSTEM_PRESETS } from "../data/mockData.js";
import { pickLang, t } from "../i18n.js";

export default function FarmSystemSelector({ activeKey, language, onSelect }) {
  return (
    <section className="mt-3.5">
      <div className="control-heading">{t(language, "farmSystemPresets")}</div>
      <div className="mt-[9px] grid grid-cols-2 gap-1.5">
        {FARM_SYSTEM_PRESETS.map((preset) => (
          <button
            type="button"
            key={preset.key}
            aria-pressed={activeKey === preset.key}
            onClick={() => onSelect(preset.key)}
            className={`rounded-lg border px-[9px] py-2 text-left text-[11px] font-semibold leading-tight transition ${
              activeKey === preset.key
                ? "border-rice-green bg-[#edf6e9] text-rice-dark shadow-soft ring-1 ring-rice-green/20"
                : "border-[#d9e2d1] bg-[#fffdf9] text-[#3c473a] hover:border-rice-green hover:bg-[#f7faf4]"
            } ${preset.wide ? "col-span-2" : ""}`}
          >
            <span className="flex items-start justify-between gap-1">
              <span>{preset.icon} {pickLang(language, preset.name, preset.th)}</span>
              {activeKey === preset.key ? <span className="text-[9px] text-rice-green">●</span> : null}
            </span>
            {language === "th" ? <span className="mt-1 block text-[8.5px] font-normal leading-snug text-[#7ba384]">{preset.note}</span> : null}
          </button>
        ))}
      </div>
    </section>
  );
}
