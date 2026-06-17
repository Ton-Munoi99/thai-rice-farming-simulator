import { FERTILIZER_FORMULAS, SELECT_OPTIONS } from "../data/mockData.js";
import { clamp } from "../utils/format.js";
import FarmSystemSelector from "./FarmSystemSelector.jsx";
import ScenarioSelector from "./ScenarioSelector.jsx";

export default function ControlPanel({ simulation }) {
  const { inputs, setInput, setApplication, switchVariety, varietyKey, nutrientTotals, formulaOptions } = simulation;

  return (
    <aside className="absolute bottom-24 left-0 top-0 z-30 flex w-[316px] flex-none flex-col border-r border-rice-border bg-rice-panel shadow-float md:relative md:bottom-auto md:top-auto md:z-auto md:shadow-none">
      <div className="flex-none px-4 pb-2 pt-3.5">
        <section className="mb-3.5">
          <div className="control-heading">Rice variety · พันธุ์ข้าว</div>
          <div className="mt-2 flex gap-[7px]">
            <VarietyButton active={varietyKey === "white"} onClick={() => switchVariety("white")}>
              🌾 ข้าวขาว
              <span>White (RD)</span>
            </VarietyButton>
            <VarietyButton active={varietyKey === "jasmine"} accent="gold" onClick={() => switchVariety("jasmine")}>
              🌸 หอมมะลิ
              <span>Hom Mali</span>
            </VarietyButton>
          </div>
        </section>
        <ScenarioSelector onSelect={simulation.applyScenario} />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 pt-1.5">
        <FarmSystemSelector onSelect={simulation.applyFarmSystemPreset} />
        <AutoRecommendationPanel recommendation={simulation.autoRecommendation} onApply={simulation.applyAutoRecommendation} />

        <FertilizerProgram
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

        <ControlCard icon="💧" title="Water management" th="การจัดการน้ำ">
          <FieldLabel>Irrigation method <span>วิธีให้น้ำ</span></FieldLabel>
          <Select value={inputs.water} onChange={(value) => setInput("water", value)} options={SELECT_OPTIONS.water} labels={{
            Rainfed: "Rainfed / อาศัยน้ำฝน",
            "Alternate Wet-Dry (AWD)": "Alternate Wet-Dry (AWD) / เปียกสลับแห้ง",
            "Continuous Flooding": "Continuous Flooding / ขังน้ำตลอด",
          }} />
          <Slider
            label="Groundwater pump"
            th="น้ำบาดาล"
            value={inputs.groundwater}
            accent="#3b9fd6"
            onChange={(value) => setInput("groundwater", value)}
          />
        </ControlCard>

        <ControlCard icon="🟤" title="Soil condition" th="สภาพดิน">
          <Select value={inputs.soil} onChange={(value) => setInput("soil", value)} options={SELECT_OPTIONS.soil} labels={{
            "Poor / Sandy": "Poor / Sandy - ดินทรายเลว",
            "Medium Loam": "Medium Loam - ดินร่วนปานกลาง",
            "Rich Clay-Loam": "Rich Clay-Loam - ดินร่วนเหนียวดี",
          }} />
        </ControlCard>

        <ControlCard icon="🐛" title="Threats" th="ศัตรูพืช โรค วัชพืช">
          <Slider label="Pest outbreak" th="แมลง" value={inputs.pest} accent="#c2562f" onChange={(value) => setInput("pest", value)} />
          <Slider label="Disease outbreak" th="โรคพืช" value={inputs.disease} accent="#a0682f" onChange={(value) => setInput("disease", value)} />
          <Slider label="Weed pressure" th="วัชพืช" value={inputs.weed} accent="#7a8b3a" onChange={(value) => setInput("weed", value)} />
        </ControlCard>

        <ControlCard icon="⛅" title="Weather scenario" th="สภาพอากาศ">
          <Select value={inputs.weather} onChange={(value) => setInput("weather", value)} options={SELECT_OPTIONS.weather} labels={{
            "Good Monsoon": "Good Monsoon - มรสุมดี",
            Normal: "Normal - ปกติ",
            Drought: "Drought - ภัยแล้ง",
            "Heavy Rain / Flood": "Heavy Rain / Flood - ฝนหนัก/น้ำท่วม",
          }} />
        </ControlCard>

        <ControlCard icon="⏱️" title="Management timing" th="ความตรงเวลาในการจัดการ">
          <Slider
            label="Timing discipline"
            th="ใส่ปุ๋ย/จัดน้ำตรงเวลา"
            value={inputs.managementTiming}
            accent="#2f8f4e"
            onChange={(value) => setInput("managementTiming", value)}
          />
        </ControlCard>
      </div>
    </aside>
  );
}

function AutoRecommendationPanel({ recommendation, onApply }) {
  return (
    <section className="mt-[11px] rounded-[13px] border border-[#d7e8cf] bg-gradient-to-br from-[#eef8ee] to-white px-3.5 py-[13px]">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <div className="text-[12.5px] font-bold text-rice-dark">Auto recommendation</div>
          <div className="text-[10px] text-rice-faint">แนะนำสูตรจากเงื่อนไขปัจจุบัน</div>
        </div>
        <button
          type="button"
          onClick={onApply}
          className="rounded-[9px] bg-rice-green px-3 py-1.5 text-[10.5px] font-bold text-white shadow-[0_3px_8px_rgba(47,143,78,.22)] transition hover:bg-rice-dark"
        >
          Apply
        </button>
      </div>

      <div className="rounded-[10px] border border-[#dce9d5] bg-white px-2.5 py-2">
        <div className="text-[11px] font-bold text-[#2c5e36]">{recommendation.headline}</div>
        <div className="text-[10px] text-[#7ba384]">{recommendation.headlineTh}</div>

        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {recommendation.applications.map((app) => (
            <div key={app.stage} className="rounded-[8px] border border-[#edf1e8] bg-[#fbfcf8] px-1.5 py-1.5 text-center">
              <div className="text-[8.5px] font-semibold text-[#7a8576]">{app.stage}</div>
              <div className="font-display text-[10.5px] font-bold text-[#3c473a]">{app.formula}</div>
              <div className="text-[8.5px] text-rice-faint">{app.rate} kg/rai</div>
            </div>
          ))}
        </div>

        <div className="mt-2 flex justify-between rounded-[8px] bg-[#f4f7ef] px-2 py-1.5 text-[9.5px] text-[#63715f]">
          <span>N {recommendation.nutrients.N.toFixed(1)}</span>
          <span>P₂O₅ {recommendation.nutrients.P.toFixed(1)}</span>
          <span>K₂O {recommendation.nutrients.K.toFixed(1)}</span>
        </div>

        <div className="mt-2 text-[9.5px] leading-snug text-[#697763]">
          {recommendation.reasons.slice(0, 2).map((reason) => (
            <div key={reason.en}>• {reason.th}</div>
          ))}
        </div>
        <div className="mt-1 text-[9px] leading-snug text-[#9aa394]">
          Chemical/IPM auto budget: ฿{Math.round(recommendation.chemicalProgram.cost).toLocaleString("en-US")}/rai
        </div>
      </div>
    </section>
  );
}

function FertilizerProgram({ applications, stages, formulaOptions, nutrientTotals, nutrientTargets, onChange }) {
  return (
    <ControlCard icon="🧪" title="Fertilizer program" th="แผนใส่ปุ๋ยแบ่งช่วง">
      <p className="mb-2.5 text-[10px] leading-snug text-rice-faint">แบ่งใส่ตามระยะข้าว · เลือกสูตรและปริมาณได้ในแต่ละช่วง</p>
      {stages.map((stage, index) => {
        const app = applications[index];
        const formula = FERTILIZER_FORMULAS[app.formula] ?? FERTILIZER_FORMULAS.None;
        return (
          <div
            key={stage.key}
            className="mb-[9px] rounded-[11px] border border-[#ebefe4] bg-rice-panel px-[11px] py-2.5"
            style={{ borderLeft: `3px solid ${stage.accent}` }}
          >
            <div className="mb-[7px] flex items-center gap-1.5">
              <span className="text-[14px]">{stage.icon}</span>
              <div className="min-w-0 flex-1">
                <div className="text-[11.5px] font-bold text-[#3c473a]">
                  {stage.en} <span className="font-normal text-[#9aa394]">{stage.th}</span>
                </div>
                <div className="text-[9px] text-[#a4ad98]">{stage.when} · {stage.tip}</div>
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
              label="Rate"
              th="ปริมาณ"
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
      <NutrientTotals totals={nutrientTotals} targets={nutrientTargets} />
    </ControlCard>
  );
}

function NutrientTotals({ totals, targets }) {
  const colorFor = (value, target) => {
    if (value < target * 0.55 || value > target * 1.7) return "#d2603a";
    if (value < target * 0.85 || value > target * 1.3) return "#e0a82e";
    return "#2f8f4e";
  };

  return (
    <div className="mt-1 rounded-[10px] border border-[#e4ebda] bg-[#f4f7ef] px-3 py-2.5">
      <div className="mb-1.5 text-[10px] font-semibold text-[#7a8576]">Total nutrients · ธาตุอาหารรวม (kg/rai)</div>
      <div className="grid grid-cols-3 gap-[7px] text-center">
        {[
          ["N", totals.N, targets.N],
          ["P₂O₅", totals.P, targets.P],
          ["K₂O", totals.K, targets.K],
        ].map(([label, value, target]) => (
          <div key={label} className="rounded-[9px] border border-rice-card bg-white px-1 py-1.5">
            <div className="text-[9px] text-rice-faint">{label}</div>
            <div className="font-display text-[14px] font-bold" style={{ color: colorFor(value, target) }}>
              {value.toFixed(1)}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-1.5 text-[9px] text-[#9aa394]">
        เป้าหมายพันธุ์นี้ N≈{targets.N} · P≈{targets.P} · K≈{targets.K}
      </div>
    </div>
  );
}

function VarietyButton({ active, accent = "green", children, onClick }) {
  const activeClass = accent === "gold" ? "border-rice-gold bg-[#fff8ec] text-[#9a6e18]" : "border-rice-green bg-[#eef8ee] text-rice-dark";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-[10px] border px-2 py-[9px] text-center text-[12px] font-semibold transition ${
        active ? `border-2 ${activeClass}` : "border-rice-border bg-white text-[#7a8576]"
      }`}
    >
      {children}
    </button>
  );
}

function ControlCard({ icon, title, th, children }) {
  return (
    <section className="mt-[11px] rounded-[13px] border border-rice-card bg-white px-3.5 py-[13px]">
      <div className="mb-2.5 flex items-center gap-[7px]">
        <span className="text-[15px]">{icon}</span>
        <div>
          <div className="text-[12.5px] font-bold">{title}</div>
          <div className="text-[10px] text-rice-faint">{th}</div>
        </div>
      </div>
      {children}
    </section>
  );
}

function FieldLabel({ children }) {
  return <label className="text-[10.5px] text-rice-muted [&_span]:text-[#9aa394]">{children}</label>;
}

function Select({ value, options, labels = {}, onChange }) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value)} className="control-select mt-[5px]">
      {options.map((option) => (
        <option key={option} value={option}>{labels[option] ?? option}</option>
      ))}
    </select>
  );
}

function Slider({ label, th, value, onChange, accent, max = 100, suffix = "%", compact = false }) {
  const displayValue = suffix === "%" ? `${value}%` : `${value} ${suffix}`;

  return (
    <div className={compact ? "mt-2" : "mt-2.5"}>
      <div className="mb-[3px] flex justify-between text-[11px] text-rice-muted">
        <span>{label} <span className="text-[#9aa394]">{th}</span></span>
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
