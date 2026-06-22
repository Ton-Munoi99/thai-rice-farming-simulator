import { FERTILIZER_FORMULAS, SELECT_OPTIONS, WHITE_RICE_SURVIVAL_PRESETS } from "../data/mockData.js";
import { OPTION_LABELS, optionLabel, pickLang, t } from "../i18n.js";
import { clamp } from "../utils/format.js";
import FarmSystemSelector from "./FarmSystemSelector.jsx";
import ScenarioSelector from "./ScenarioSelector.jsx";

export default function ControlPanel({ simulation }) {
  const { inputs, setInput, setApplication, switchVariety, varietyKey, nutrientTotals, formulaOptions } = simulation;
  const { language } = simulation;

  return (
    <aside className="absolute bottom-24 left-0 top-0 z-30 flex w-[316px] flex-none flex-col border-r border-rice-border bg-rice-panel shadow-float md:relative md:bottom-auto md:top-auto md:z-auto md:shadow-none">
      <div className="flex-none px-4 pb-2 pt-3.5">
        <section className="mb-3.5">
          <div className="control-heading">{t(language, "riceVariety")}</div>
          <div className="mt-2 flex gap-[7px]">
            <VarietyButton active={varietyKey === "white"} onClick={() => switchVariety("white")}>
              🌾 {t(language, "whiteRice")}
            </VarietyButton>
            <VarietyButton active={varietyKey === "jasmine"} accent="gold" onClick={() => switchVariety("jasmine")}>
              🌸 {t(language, "homMali")}
            </VarietyButton>
          </div>
        </section>
        <ScenarioSelector language={language} onSelect={simulation.applyScenario} />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 pt-1.5">
        <WhiteRiceSurvivalPanel simulation={simulation} />
        <FarmSystemSelector language={language} onSelect={simulation.applyFarmSystemPreset} />
        <AutoRecommendationPanel language={language} recommendation={simulation.autoRecommendation} onApply={simulation.applyAutoRecommendation} />

        <FertilizerProgram
          language={language}
          applications={inputs.applications}
          stages={simulation.fertilizerStages}
          formulaOptions={formulaOptions}
          nutrientTotals={nutrientTotals}
          nutrientTargets={{
            N: simulation.varietyInfo.idealN,
            P: simulation.varietyInfo.idealP,
            K: simulation.varietyInfo.idealK,
          }}
          onChange={setApplication}
        />

        <ControlCard icon="💧" title={t(language, "waterManagement")}>
          <FieldLabel>{t(language, "irrigationMethod")}</FieldLabel>
          <Select language={language} value={inputs.water} onChange={(value) => setInput("water", value)} options={SELECT_OPTIONS.water} labels={OPTION_LABELS.water} />
          <Slider
            label={t(language, "groundwaterPump")}
            value={inputs.groundwater}
            accent="#3b9fd6"
            onChange={(value) => setInput("groundwater", value)}
          />
        </ControlCard>

        <ControlCard icon="🟤" title={t(language, "soilCondition")}>
          <Select language={language} value={inputs.soil} onChange={(value) => setInput("soil", value)} options={SELECT_OPTIONS.soil} labels={OPTION_LABELS.soil} />
        </ControlCard>

        <ControlCard icon="🐛" title={t(language, "threats")}>
          <Slider label={t(language, "pestOutbreak")} value={inputs.pest} accent="#c2562f" onChange={(value) => setInput("pest", value)} />
          <Slider label={t(language, "diseaseOutbreak")} value={inputs.disease} accent="#a0682f" onChange={(value) => setInput("disease", value)} />
          <Slider label={t(language, "weedPressure")} value={inputs.weed} accent="#7a8b3a" onChange={(value) => setInput("weed", value)} />
        </ControlCard>

        <ControlCard icon="⛅" title={t(language, "weatherScenario")}>
          <Select language={language} value={inputs.weather} onChange={(value) => setInput("weather", value)} options={SELECT_OPTIONS.weather} labels={OPTION_LABELS.weather} />
        </ControlCard>

        <ControlCard icon="⏱️" title={t(language, "managementTiming")}>
          <Slider
            label={t(language, "timingDiscipline")}
            value={inputs.managementTiming}
            accent="#2f8f4e"
            onChange={(value) => setInput("managementTiming", value)}
          />
        </ControlCard>
      </div>
    </aside>
  );
}

function WhiteRiceSurvivalPanel({ simulation }) {
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
    <section className="mt-3.5 rounded-lg border border-[#d8ddd2] bg-[#fbfaf6] px-3.5 py-[13px]">
      <div className="mb-2">
        <div className="text-[12.5px] font-bold text-rice-dark">{t(language, "whiteRiceSurvival")}</div>
        <div className="text-[10px] leading-snug text-rice-faint">{t(language, "whiteRiceSurvivalSub")}</div>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {WHITE_RICE_SURVIVAL_PRESETS.map((preset) => (
          <button
            key={preset.key}
            type="button"
            onClick={() => simulation.applyWhiteRiceSurvivalPreset(preset.key)}
            className={`rounded-lg border px-2 py-2 text-left transition hover:border-rice-green hover:bg-[#f2f7ef] ${
              simulation.activeSurvivalPresetKey === preset.key
                ? "border-rice-green bg-[#f2f7ef] shadow-soft"
                : "border-[#dedbd0] bg-white"
            }`}
          >
            <div className="flex items-center gap-1 text-[10.5px] font-bold text-[#3c473a]">
              <span>{preset.icon}</span>
              <span>{pickLang(language, preset.name, preset.th)}</span>
            </div>
            <div className="mt-1 text-[8.5px] leading-snug text-rice-faint">
              {pickLang(language, preset.noteEn, preset.note)}
            </div>
            <div className="mt-1 border-t border-[#eee9dc] pt-1 text-[8px] leading-snug text-[#8b7d59]">
              Y≥{preset.target.yield} · C≤฿{preset.target.cost.toLocaleString("en-US")} · P≥฿{preset.target.price.toLocaleString("en-US")}
            </div>
          </button>
        ))}
      </div>
      <div className="mt-2.5 rounded-md border border-[#e5e1d4] bg-white/70 px-2.5 py-2">
        <div className="mb-1 text-[9.5px] font-bold text-[#5f755c]">
          {t(language, "survivalLiveCheck")} · {pickLang(language, activePreset.name, activePreset.th)}
        </div>
        <SurvivalCheck language={language} label={t(language, "estimatedYield")} current={`${current.yield} kg/rai`} ok={current.yield >= target.yield} target={`≥${target.yield} kg/rai`} />
        <SurvivalCheck language={language} label={t(language, "productionCost")} current={`฿${current.cost.toLocaleString("en-US")}`} ok={current.cost <= target.cost} target={`≤฿${target.cost.toLocaleString("en-US")}`} />
        <SurvivalCheck language={language} label={t(language, "salePrice")} current={`฿${current.price.toLocaleString("en-US")}`} ok={current.price >= target.price} target={`≥฿${target.price.toLocaleString("en-US")}/t`} />
        <SurvivalCheck language={language} label={t(language, "strawPrice")} current={`฿${current.straw.toFixed(2)}/kg`} ok={current.straw >= target.straw} target={`≥฿${target.straw.toFixed(2)}/kg`} />
        <SurvivalCheck language={language} label={t(language, "profit")} current={`฿${current.profit.toLocaleString("en-US")}`} ok={current.profit >= 0} target="≥฿0" />
      </div>
      <div className="mt-1.5 text-[8.5px] leading-snug text-[#9a8a5d]">
        {t(language, "regionalYieldNote")}
      </div>
    </section>
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

function AutoRecommendationPanel({ language, recommendation, onApply }) {
  return (
    <section className="mt-[11px] rounded-lg border border-[#d9e2d1] bg-[#f7faf4] px-3.5 py-[13px]">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <div className="text-[12.5px] font-bold text-rice-dark">{t(language, "autoRecommendation")}</div>
          <div className="text-[10px] text-rice-faint">{t(language, "autoRecommendationSub")}</div>
        </div>
        <button
          type="button"
          onClick={onApply}
          className="rounded-md bg-rice-green px-3 py-1.5 text-[10.5px] font-bold text-white shadow-soft transition hover:bg-rice-dark"
        >
          {t(language, "apply")}
        </button>
      </div>

      <div className="border-t border-[#d9e2d1] pt-2">
        <div className="text-[11px] font-bold text-[#2c5e36]">{pickLang(language, recommendation.headline, recommendation.headlineTh)}</div>

        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {recommendation.applications.map((app) => (
            <div key={app.stage} className="text-center">
              <div className="text-[8.5px] font-semibold text-[#7a8576]">{app.stage}</div>
              <div className="font-display text-[10.5px] font-bold text-[#3c473a]">{app.formula}</div>
              <div className="text-[8.5px] text-rice-faint">{app.rate} kg/rai</div>
            </div>
          ))}
        </div>

        <div className="mt-2 flex justify-between border-t border-[#d9e2d1] pt-1.5 text-[9.5px] text-[#63715f]">
          <span>N {recommendation.nutrients.N.toFixed(1)}</span>
          <span>P₂O₅ {recommendation.nutrients.P.toFixed(1)}</span>
          <span>K₂O {recommendation.nutrients.K.toFixed(1)}</span>
        </div>

        <div className="mt-2 text-[9.5px] leading-snug text-[#697763]">
          {recommendation.reasons.slice(0, 2).map((reason) => (
            <div key={reason.en}>• {pickLang(language, reason.en, reason.th)}</div>
          ))}
        </div>
        <div className="mt-1 text-[9px] leading-snug text-[#9aa394]">
          {language === "th" ? "งบยา/IPM อัตโนมัติ" : "Chemical/IPM auto budget"}: ฿{Math.round(recommendation.chemicalProgram.cost).toLocaleString("en-US")}/rai
        </div>
      </div>
    </section>
  );
}

function FertilizerProgram({ language, applications, stages, formulaOptions, nutrientTotals, nutrientTargets, onChange }) {
  return (
    <ControlCard icon="🧪" title={t(language, "fertilizerProgram")}>
      <p className="mb-2.5 text-[10px] leading-snug text-rice-faint">{t(language, "fertilizerHint")}</p>
      {stages.map((stage, index) => {
        const app = applications[index];
        const formula = FERTILIZER_FORMULAS[app.formula] ?? FERTILIZER_FORMULAS.None;
        return (
          <div
            key={stage.key}
            className="mb-[9px] rounded-lg border border-[#ebe7dc] bg-[#fffdf9] px-[11px] py-2.5"
            style={{ borderLeft: `3px solid ${stage.accent}` }}
          >
            <div className="mb-[7px] flex items-center gap-1.5">
              <span className="text-[14px]">{stage.icon}</span>
              <div className="min-w-0 flex-1">
                <div className="text-[11.5px] font-bold text-[#3c473a]">
                  {pickLang(language, stage.en, stage.th)}
                </div>
                {language === "th" ? <div className="text-[9px] text-[#a4ad98]">{stage.when} · {stage.tip}</div> : null}
              </div>
            </div>
            <select
              value={app.formula}
              onChange={(event) => onChange(index, { formula: event.target.value })}
              className="control-select py-1.5 text-[11.5px]"
            >
              {formulaOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <Slider
              compact
              label={t(language, "rate")}
              suffix="kg/rai"
              value={app.rate}
              max={40}
              accent={stage.accent}
              onChange={(value) => onChange(index, { rate: value })}
            />
            <div className="mt-1 text-[9px] text-[#9aa394]">
              → N {((app.rate * formula.n) / 100).toFixed(1)} · P₂O₅ {((app.rate * formula.p) / 100).toFixed(1)} · K₂O{" "}
              {((app.rate * formula.k) / 100).toFixed(1)} kg/rai
            </div>
          </div>
        );
      })}
      <NutrientTotals language={language} totals={nutrientTotals} targets={nutrientTargets} />
    </ControlCard>
  );
}

function NutrientTotals({ language, totals, targets }) {
  const colorFor = (value, target) => {
    if (value < target * 0.55 || value > target * 1.7) return "#d2603a";
    if (value < target * 0.85 || value > target * 1.3) return "#e0a82e";
    return "#2f8f4e";
  };

  return (
    <div className="mt-1 rounded-lg border border-[#ebe7dc] bg-[#fbfaf6] px-3 py-2.5">
      <div className="mb-1.5 text-[10px] font-semibold text-[#7a8576]">{t(language, "totalNutrients")}</div>
      <div className="grid grid-cols-3 gap-[7px] text-center">
        {[
          ["N", totals.N, targets.N],
          ["P₂O₅", totals.P, targets.P],
          ["K₂O", totals.K, targets.K],
        ].map(([label, value, target]) => (
          <div key={label} className="px-1 py-1.5">
            <div className="text-[9px] text-rice-faint">{label}</div>
            <div className="font-display text-[14px] font-bold" style={{ color: colorFor(value, target) }}>
              {value.toFixed(1)}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-1.5 text-[9px] text-[#9aa394]">
        {t(language, "targetNutrients")} N≈{targets.N} · P≈{targets.P} · K≈{targets.K}
      </div>
    </div>
  );
}

function VarietyButton({ active, accent = "green", children, onClick }) {
  const activeClass = accent === "gold" ? "border-rice-gold bg-[#fff8ec] text-[#9a6e18]" : "border-rice-green bg-[#f1f6ef] text-rice-dark";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-lg border px-2 py-[9px] text-center text-[12px] font-semibold transition ${
        active ? `border-2 ${activeClass}` : "border-rice-border bg-white text-[#7a8576]"
      }`}
    >
      {children}
    </button>
  );
}

function ControlCard({ icon, title, children }) {
  return (
    <section className="mt-[11px] rounded-lg border border-rice-card bg-white px-3.5 py-[13px]">
      <div className="mb-2.5 flex items-center gap-[7px]">
        <span className="text-[15px]">{icon}</span>
        <div>
          <div className="text-[12.5px] font-bold">{title}</div>
        </div>
      </div>
      {children}
    </section>
  );
}

function FieldLabel({ children }) {
  return <label className="text-[10.5px] text-rice-muted">{children}</label>;
}

function Select({ language, value, options, labels = {}, onChange }) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value)} className="control-select mt-[5px]">
      {options.map((option) => (
        <option key={option} value={option}>{optionLabel(language, option, labels)}</option>
      ))}
    </select>
  );
}

function Slider({ label, value, onChange, accent, max = 100, suffix = "%", compact = false }) {
  const displayValue = suffix === "%" ? `${value}%` : `${value} ${suffix}`;

  return (
    <div className={compact ? "mt-2" : "mt-2.5"}>
      <div className="mb-[3px] flex justify-between text-[11px] text-rice-muted">
        <span>{label}</span>
        <b className="font-display" style={{ color: value > 45 && max === 100 ? accent : undefined }}>{displayValue}</b>
      </div>
      <input
        type="range"
        min="0"
        max={max}
        value={clamp(value, 0, max)}
        onChange={(event) => onChange(Number(event.target.value))}
        style={{ accentColor: accent }}
        className="w-full"
      />
    </div>
  );
}
