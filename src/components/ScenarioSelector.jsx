import { SCENARIOS } from "../data/mockData.js";
import { pickLang, t } from "../i18n.js";

export default function ScenarioSelector({ language, onSelect }) {
  return (
    <section>
      <div className="control-heading">{t(language, "presetScenarios")}</div>
      <div className="mt-[9px] grid grid-cols-2 gap-1.5">
        {SCENARIOS.map((scenario) => (
          <button
            type="button"
            key={scenario.key}
            onClick={() => onSelect(scenario.key)}
            className={`rounded-lg border border-rice-border bg-[#fffdf9] px-[9px] py-2 text-left text-[11px] font-semibold leading-tight text-[#3c473a] transition hover:border-rice-green hover:bg-[#f7faf4] ${
              scenario.wide ? "col-span-2" : ""
            }`}
          >
            {scenario.icon} {pickLang(language, scenario.name, scenario.th)}
          </button>
        ))}
      </div>
    </section>
  );
}
