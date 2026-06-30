import { useEffect, useMemo, useState } from "react";
import { FARM_SYSTEM_PRESETS, SCENARIOS, WHITE_RICE_SURVIVAL_PRESETS } from "../data/mockData.js";
import { pickLang, t } from "../i18n.js";

const TABS = [
  { key: "scenario", labelKey: "scenarioTab" },
  { key: "farm", labelKey: "farmSystemTab" },
  { key: "survival", labelKey: "survivalTab" },
];

const DETAIL_TABS = [
  { key: "farm", labelKey: "farmSystemTab" },
  { key: "survival", labelKey: "survivalTab" },
];

export default function PresetLibrary({ compact = false, simulation }) {
  const { language } = simulation;
  const activeSource = useMemo(() => getActiveSource(simulation), [simulation]);
  const [activeTab, setActiveTab] = useState(activeSource.tab);

  useEffect(() => {
    if (activeSource.tab !== "manual") {
      setActiveTab(activeSource.tab);
    }
  }, [activeSource.tab]);

  if (compact) {
    return (
      <section className="rounded-lg border border-[#d8ddd2] bg-[#fbfaf6] px-3.5 py-[13px]">
        <div className="mb-2.5 flex items-start justify-between gap-2">
          <div>
            <div className="text-[12.5px] font-bold text-rice-dark">{t(language, "quickScenarios")}</div>
            <div className="text-[10px] leading-snug text-rice-faint">{t(language, "quickScenariosSub")}</div>
          </div>
          <button
            type="button"
            onClick={simulation.resetConditions}
            className="flex-none rounded-md border border-[#d8ddd2] bg-white px-2 py-1 text-[9.5px] font-bold text-rice-muted transition hover:border-[#b7c9b0] hover:bg-[#f7faf4] hover:text-rice-dark"
          >
            {t(language, "clearConditions")}
          </button>
        </div>
        <ScenarioGrid simulation={simulation} />
        <details className="mt-2 rounded-lg border border-[#e5e1d4] bg-white/70 px-2.5 py-2">
          <summary className="cursor-pointer list-none text-[10.5px] font-bold text-[#3c473a]">
            <span>{t(language, "advancedPresets")}</span>
            <span className="float-right text-[9px] text-rice-faint">▾</span>
          </summary>
          <div className="mt-2 border-t border-[#ebe7dd] pt-2">
            <div className="mb-2 grid grid-cols-2 rounded-lg bg-[#ece8dc] p-1">
              {DETAIL_TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`rounded-md px-1.5 py-1.5 text-[9.5px] font-bold transition ${
                    activeTab === tab.key ? "bg-white text-rice-dark shadow-sm" : "text-[#7c8378] hover:text-rice-dark"
                  }`}
                >
                  {t(language, tab.labelKey)}
                </button>
              ))}
            </div>
            {activeTab === "farm" ? <FarmGrid simulation={simulation} /> : null}
            {activeTab === "survival" ? <SurvivalGrid simulation={simulation} /> : null}
          </div>
        </details>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-[#d8ddd2] bg-[#fbfaf6] px-3.5 py-[13px]">
      <div className="mb-2.5 flex items-start justify-between gap-2">
        <div>
          <div className="text-[12.5px] font-bold text-rice-dark">{t(language, "presetLibrary")}</div>
          <div className="text-[10px] leading-snug text-rice-faint">{t(language, "presetLibrarySub")}</div>
        </div>
        <button
          type="button"
          onClick={simulation.resetConditions}
          className="flex-none rounded-md border border-[#d8ddd2] bg-white px-2 py-1 text-[9.5px] font-bold text-rice-muted transition hover:border-[#b7c9b0] hover:bg-[#f7faf4] hover:text-rice-dark"
        >
          {t(language, "clearConditions")}
        </button>
      </div>

      <div className="mb-2 rounded-md border border-[#e4e1d6] bg-white/75 px-2.5 py-2">
        <div className="text-[8.5px] font-semibold uppercase tracking-[.4px] text-rice-faint">{t(language, "currentSetup")}</div>
        <div className="mt-0.5 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="truncate text-[11px] font-bold text-[#3c473a]">{activeSource.label}</div>
            <div className="text-[8.5px] text-rice-faint">{activeSource.note}</div>
          </div>
          <span className={`flex-none rounded px-1.5 py-0.5 text-[8px] font-bold ${activeSource.tone}`}>
            {activeSource.badge}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 rounded-lg bg-[#ece8dc] p-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-md px-1.5 py-1.5 text-[9.5px] font-bold transition ${
              activeTab === tab.key ? "bg-white text-rice-dark shadow-sm" : "text-[#7c8378] hover:text-rice-dark"
            }`}
          >
            {t(language, tab.labelKey)}
          </button>
        ))}
      </div>

      <div className="mt-2">
        {activeTab === "scenario" ? <ScenarioGrid simulation={simulation} /> : null}
        {activeTab === "farm" ? <FarmGrid simulation={simulation} /> : null}
        {activeTab === "survival" ? <SurvivalGrid simulation={simulation} /> : null}
      </div>
    </section>
  );
}

function ScenarioGrid({ simulation }) {
  const { language } = simulation;

  return (
    <div className="grid grid-cols-2 gap-1.5">
      {SCENARIOS.map((scenario) => (
        <PresetButton
          key={scenario.key}
          active={simulation.activeScenarioKey === scenario.key}
          wide={scenario.wide}
          onClick={() => simulation.applyScenario(scenario.key)}
        >
          {scenario.icon} {pickLang(language, scenario.name, scenario.th)}
        </PresetButton>
      ))}
    </div>
  );
}

function FarmGrid({ simulation }) {
  const { language } = simulation;

  return (
    <div className="grid grid-cols-2 gap-1.5">
      {FARM_SYSTEM_PRESETS.map((preset) => (
        <PresetButton
          key={preset.key}
          active={simulation.activeFarmSystemPresetKey === preset.key}
          wide={preset.wide}
          onClick={() => simulation.applyFarmSystemPreset(preset.key)}
        >
          <span>{preset.icon} {pickLang(language, preset.name, preset.th)}</span>
          {language === "th" ? <span className="mt-1 block text-[8.5px] font-normal leading-snug text-[#7ba384]">{preset.note}</span> : null}
        </PresetButton>
      ))}
    </div>
  );
}

function SurvivalGrid({ simulation }) {
  const { language, liveModel } = simulation;
  const activePreset =
    WHITE_RICE_SURVIVAL_PRESETS.find((preset) => preset.key === simulation.activeSurvivalPresetKey) ??
    WHITE_RICE_SURVIVAL_PRESETS.find((preset) => preset.key === "breakEven");
  const target = activePreset.target;
  const current = {
    yield: liveModel.estimatedYieldKgPerRai,
    cost: liveModel.costPerRai,
    price: simulation.pricePerTon,
    straw: simulation.strawPricePerKg,
    profit: liveModel.profitPerRai,
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-1.5">
        {WHITE_RICE_SURVIVAL_PRESETS.map((preset) => (
          <PresetButton
            key={preset.key}
            active={simulation.activeSurvivalPresetKey === preset.key}
            onClick={() => simulation.applyWhiteRiceSurvivalPreset(preset.key)}
          >
            <span>{preset.icon} {pickLang(language, preset.name, preset.th)}</span>
            <span className="mt-1 block text-[8.5px] font-normal leading-snug text-rice-faint">
              {pickLang(language, preset.noteEn, preset.note)}
            </span>
            <span className="mt-1 block border-t border-[#eee9dc] pt-1 text-[8px] font-normal leading-snug text-[#8b7d59]">
              Y&gt;={preset.target.yield} · C&lt;=฿{preset.target.cost.toLocaleString("en-US")} · P&gt;=฿{preset.target.price.toLocaleString("en-US")}
            </span>
          </PresetButton>
        ))}
      </div>
      <div className="mt-2.5 rounded-md border border-[#e5e1d4] bg-white/70 px-2.5 py-2">
        <div className="mb-1 text-[9.5px] font-bold text-[#5f755c]">
          {t(language, "survivalLiveCheck")} · {pickLang(language, activePreset.name, activePreset.th)}
        </div>
        <SurvivalCheck label={t(language, "estimatedYield")} current={`${current.yield} kg/rai`} ok={current.yield >= target.yield} target={`>=${target.yield} kg/rai`} />
        <SurvivalCheck label={t(language, "productionCost")} current={`฿${current.cost.toLocaleString("en-US")}`} ok={current.cost <= target.cost} target={`<=฿${target.cost.toLocaleString("en-US")}`} />
        <SurvivalCheck label={t(language, "salePrice")} current={`฿${current.price.toLocaleString("en-US")}`} ok={current.price >= target.price} target={`>=฿${target.price.toLocaleString("en-US")}/t`} />
        <SurvivalCheck label={t(language, "strawPrice")} current={`฿${current.straw.toFixed(2)}/kg`} ok={current.straw >= target.straw} target={`>=฿${target.straw.toFixed(2)}/kg`} />
        <SurvivalCheck label={t(language, "profit")} current={`฿${current.profit.toLocaleString("en-US")}`} ok={current.profit >= 0} target=">=฿0" />
      </div>
      <div className="mt-1.5 text-[8.5px] leading-snug text-[#9a8a5d]">
        {t(language, "regionalYieldNote")}
      </div>
    </>
  );
}

function PresetButton({ active, children, onClick, wide }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-lg border px-[9px] py-2 text-left text-[11px] font-semibold leading-tight transition ${
        active
          ? "border-rice-green bg-[#edf6e9] text-rice-dark shadow-soft ring-1 ring-rice-green/20"
          : "border-[#dedbd0] bg-white text-[#3c473a] hover:border-rice-green hover:bg-[#f7faf4]"
      } ${wide ? "col-span-2" : ""}`}
    >
      <span className="flex items-start justify-between gap-1">
        <span className="min-w-0 flex-1">{children}</span>
        {active ? <span className="text-[9px] text-rice-green">●</span> : null}
      </span>
    </button>
  );
}

function SurvivalCheck({ label, current, target, ok }) {
  return (
    <div className="flex items-center justify-between gap-2 border-t border-[#eee9dc] py-1 first:border-t-0">
      <div className="min-w-0">
        <div className="truncate text-[8.5px] font-semibold text-[#687461]">{label}</div>
        <div className="text-[8px] text-rice-faint">{current} / {target}</div>
      </div>
      <div className={`rounded px-1.5 py-0.5 text-[8px] font-bold ${ok ? "bg-[#e5f2e6] text-[#2f6b48]" : "bg-[#fff1df] text-[#a25e22]"}`}>
        {ok ? "OK" : "GAP"}
      </div>
    </div>
  );
}

function getActiveSource(simulation) {
  const { language } = simulation;

  if (simulation.activeScenarioKey) {
    const scenario = SCENARIOS.find((item) => item.key === simulation.activeScenarioKey);
    if (scenario) {
      return {
        tab: "scenario",
        label: `${scenario.icon} ${pickLang(language, scenario.name, scenario.th)}`,
        note: t(language, "scenarioPresetNote"),
        badge: t(language, "scenarioTab"),
        tone: "bg-[#e5f2e6] text-[#2f6b48]",
      };
    }
  }

  if (simulation.activeFarmSystemPresetKey) {
    const preset = FARM_SYSTEM_PRESETS.find((item) => item.key === simulation.activeFarmSystemPresetKey);
    if (preset) {
      return {
        tab: "farm",
        label: `${preset.icon} ${pickLang(language, preset.name, preset.th)}`,
        note: t(language, "farmPresetNote"),
        badge: t(language, "farmSystemTab"),
        tone: "bg-[#e5f2e6] text-[#2f6b48]",
      };
    }
  }

  if (simulation.activeSurvivalPresetKey) {
    const preset = WHITE_RICE_SURVIVAL_PRESETS.find((item) => item.key === simulation.activeSurvivalPresetKey);
    if (preset) {
      return {
        tab: "survival",
        label: `${preset.icon} ${pickLang(language, preset.name, preset.th)}`,
        note: t(language, "survivalPresetNote"),
        badge: t(language, "survivalTab"),
        tone: "bg-[#e5f2e6] text-[#2f6b48]",
      };
    }
  }

  if (simulation.activeAutoRecommendation) {
    return {
      tab: "manual",
      label: t(language, "autoRecommendation"),
      note: t(language, "autoRecommendationStatus"),
      badge: t(language, "applied"),
      tone: "bg-[#e5f2e6] text-[#2f6b48]",
    };
  }

  return {
    tab: "manual",
    label: t(language, "editedManually"),
    note: t(language, "editedManuallyNote"),
    badge: t(language, "manualMode"),
    tone: "bg-[#f4eadc] text-[#9a6a24]",
  };
}
