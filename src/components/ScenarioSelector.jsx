import { SCENARIOS } from "../data/mockData.js";
import { pickLang, t } from "../i18n.js";

export default function ScenarioSelector({ activeKey, language, onClear, onSelect }) {
  return (
    <section>
      <div className="flex items-center justify-between gap-2">
        <div className="control-heading">{t(language, "presetScenarios")}</div>
        <button
          type="button"
          onClick={onClear}
          className="rounded-md border border-[#d8ddd2] bg-white px-2 py-1 text-[9.5px] font-bold text-rice-muted transition hover:border-[#b7c9b0] hover:bg-[#f7faf4] hover:text-rice-dark"
        >
          {t(language, "clearConditions")}
        </button>
      </div>
      <div className="mt-[9px] grid grid-cols-2 gap-1.5">
        {SCENARIOS.map((scenario) => (
          <PresetButton
            key={scenario.key}
            active={activeKey === scenario.key}
            wide={scenario.wide}
            onClick={() => onSelect(scenario.key)}
          >
            {scenario.icon} {pickLang(language, scenario.name, scenario.th)}
          </PresetButton>
        ))}
      </div>
    </section>
  );
}

function PresetButton({ active, children, onClick, wide }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-lg border px-[9px] py-2 text-left text-[11px] font-semibold leading-tight transition ${
        active
          ? "border-rice-green bg-[#edf6e9] text-rice-dark shadow-soft ring-1 ring-rice-green/20"
          : "border-rice-border bg-[#fffdf9] text-[#3c473a] hover:border-rice-green hover:bg-[#f7faf4]"
      } ${wide ? "col-span-2" : ""}`}
    >
      <span className="flex items-center justify-between gap-1">
        <span>{children}</span>
        {active ? <span className="text-[9px] text-rice-green">●</span> : null}
      </span>
    </button>
  );
}
