import { FARM_SYSTEM_PRESETS } from "../data/mockData.js";
import { pickLang, t } from "../i18n.js";

export default function FarmSystemSelector({ language, onSelect }) {
  return (
    <section className="mt-3.5">
      <div className="control-heading">{t(language, "farmSystemPresets")}</div>
      <div className="mt-[9px] grid grid-cols-2 gap-1.5">
        {FARM_SYSTEM_PRESETS.map((preset) => (
          <button
            type="button"
            key={preset.key}
            onClick={() => onSelect(preset.key)}
            className={`rounded-lg border border-[#d9e2d1] bg-[#fffdf9] px-[9px] py-2 text-left text-[11px] font-semibold leading-tight text-[#3c473a] transition hover:border-rice-green hover:bg-[#f7faf4] ${
              preset.wide ? "col-span-2" : ""
            }`}
          >
            {preset.icon} {pickLang(language, preset.name, preset.th)}
            {language === "th" ? <span className="mt-1 block text-[8.5px] font-normal leading-snug text-[#7ba384]">{preset.note}</span> : null}
          </button>
        ))}
      </div>
    </section>
  );
}
