import { formatNumber, riskColor, scoreColor, signedBaht } from "../utils/format.js";
import CompareScenariosPanel from "./CompareScenariosPanel.jsx";
import ExplanationPanel from "./ExplanationPanel.jsx";
import RecommendationPanel from "./RecommendationPanel.jsx";

export default function ScorePanel({ simulation }) {
  const model = simulation.liveModel;
  const variety = simulation.varietyInfo;
  const circumference = 2 * Math.PI * 58;
  const profitPositive = model.profitPerRai >= 0;

  const indicators = [
    ["Fertilizer efficiency", "ประสิทธิภาพปุ๋ย", model.fertilizerEfficiency, scoreColor(model.fertilizerEfficiency), "%"],
    ["Water adequacy", "ความพอเพียงน้ำ", model.waterAdequacy, scoreColor(model.waterAdequacy), "%"],
    ["Pest & disease risk", "ความเสี่ยงศัตรูพืช", model.pestDiseaseRisk, riskColor(model.pestDiseaseRisk), "%"],
    ["Soil health", "สุขภาพดิน", model.soilHealth, scoreColor(model.soilHealth), "%"],
  ];

  return (
    <aside className="hidden w-[296px] flex-none flex-col overflow-y-auto border-l border-rice-border bg-rice-panel lg:flex">
      <div className="px-[17px] py-4">
        <div className="control-heading">Live health score</div>
        <div className="text-[10.5px] text-rice-faint">คะแนนสุขภาพข้าว (เรียลไทม์)</div>

        <section className="mt-2.5 flex flex-col items-center rounded-[15px] border border-rice-card bg-white pb-2.5 pt-3.5">
          <div className="relative h-[140px] w-[140px]">
            <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
              <circle cx="70" cy="70" r="58" fill="none" stroke="#eef1e7" strokeWidth="13" />
              <circle
                cx="70"
                cy="70"
                r="58"
                fill="none"
                stroke={model.color}
                strokeWidth="13"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - model.growthScore / 100)}
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="font-display text-[42px] font-bold leading-none" style={{ color: model.color }}>{model.growthScore}</div>
              <div className="mt-px text-[10px] text-rice-faint">/ 100</div>
            </div>
          </div>
          <div className="mt-1 text-[13px] font-bold" style={{ color: model.color }}>{model.label}</div>
          <div className="text-[11px] text-rice-faint">{model.labelTh}</div>
        </section>

        <section className="mt-[11px] flex items-center justify-between rounded-[14px] border border-[#f0e3bf] bg-gradient-to-br from-[#fff6e0] to-[#fffdf5] px-[15px] py-[13px]">
          <div>
            <div className="text-[11px] font-semibold text-[#9a8638]">Est. yield · ผลผลิต</div>
            <div className="text-[10px] text-[#b6ad8a]">kg / rai</div>
          </div>
          <div className="font-display text-[30px] font-bold text-rice-gold">{formatNumber(model.estimatedYieldKgPerRai)}</div>
        </section>

        <section className="mt-[9px] flex items-center justify-between gap-2 rounded-[12px] border border-rice-card bg-white px-[13px] py-2.5">
          <div className="leading-tight">
            <div className="text-[11px] font-semibold text-[#3c473a]">ราคาขาย · Sale price</div>
            <div className="text-[9.5px] text-rice-faint">฿ / ตัน (1,000 kg)</div>
          </div>
          <div className="flex items-center gap-[5px]">
            <SmallButton onClick={() => simulation.setPricePerTon(simulation.pricePerTon - 100)}>-</SmallButton>
            <input
              aria-label="Sale price per ton"
              value={simulation.pricePerTon}
              type="number"
              min="1000"
              max="99000"
              step="100"
              onChange={(event) => simulation.setPricePerTon(event.target.value)}
              className="w-[68px] rounded-lg border border-[#dde3d6] bg-white px-1 py-1 text-center font-display text-[13px] font-bold text-[#3c473a] outline-none"
            />
            <SmallButton onClick={() => simulation.setPricePerTon(simulation.pricePerTon + 100)}>+</SmallButton>
          </div>
        </section>

        <section className="mt-[13px] flex flex-col gap-[11px]">
          {indicators.map(([name, th, value, color, suffix]) => (
            <div key={name}>
              <div className="mb-1 flex items-baseline justify-between text-[11.5px]">
                <span className="text-[#3c473a]">{name} <span className="text-[10px] text-[#a4ad98]">{th}</span></span>
                <b className="font-display" style={{ color }}>{value}{suffix}</b>
              </div>
              <div className="h-[7px] overflow-hidden rounded-[7px] bg-[#eef1e7]">
                <div className="h-full rounded-[7px] transition-[width] duration-500" style={{ width: `${Math.max(value, 2)}%`, background: color }} />
              </div>
            </div>
          ))}
        </section>

        <ExplanationPanel model={model} />

        <section className="mt-3.5 rounded-[13px] border border-rice-card bg-white px-[13px] py-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[11px] font-bold text-[#3c473a]">ต้นทุน/ไร่ · Cost breakdown</div>
            <button
              type="button"
              onClick={simulation.resetCosts}
              className="rounded-md border border-[#dde3d6] bg-[#f8faf4] px-2 py-1 text-[9.5px] font-semibold text-rice-muted transition hover:bg-white"
            >
              Reset
            </button>
          </div>
          <div className="mb-2 text-[10px] text-rice-faint">{variety.icon} {variety.name} · editable per rai</div>
          {model.costBreakdown.map((item) => (
            <CostRow
              key={item.key}
              item={item}
              onChange={(value) => simulation.setCostItem(item.key, value)}
            />
          ))}
          <ChemicalProgramNote model={model} />
          <TotalCostRow value={model.costPerRai} onChange={simulation.setTotalCostPerRai} />
        </section>

        <section className="mt-[9px] grid grid-cols-2 gap-2">
          <div className="rounded-[11px] border border-rice-card bg-white px-[11px] py-2.5">
            <div className="text-[9.5px] text-rice-faint">Revenue · รายได้</div>
            <div className="font-display text-[15px] font-semibold text-[#3c473a]">฿{formatNumber(model.revenuePerRai)}</div>
            <div className="text-[9px] text-[#b6ad8a]">@฿{formatNumber(simulation.pricePerTon)}/ตัน</div>
          </div>
          <div
            className="rounded-[11px] px-[11px] py-2.5 text-white"
            style={{ background: profitPositive ? "linear-gradient(135deg,#2f8f4e,#6fae3f)" : "linear-gradient(135deg,#c2562f,#d2603a)" }}
          >
            <div className="text-[9.5px] opacity-90">{profitPositive ? "Profit" : "Loss"}</div>
            <div className="font-display text-[15px] font-bold">{signedBaht(model.profitPerRai)}</div>
            <div className="text-[9px] opacity-80">per rai</div>
          </div>
        </section>

        <CompareScenariosPanel simulation={simulation} />

        <CarbonCard simulation={simulation} />

        <section className="mt-3.5 rounded-[13px] border border-rice-card bg-white px-[13px] py-3">
          <RecommendationPanel risks={model.risks} actions={model.recommendedActions} />
        </section>
      </div>
    </aside>
  );
}

function SmallButton({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-[22px] w-[22px] rounded-[7px] border border-[#dde3d6] bg-[#f8faf4] p-0 text-[14px] font-bold leading-none text-[#3c473a] transition hover:bg-white"
    >
      {children}
    </button>
  );
}

function CostRow({ item, onChange }) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-[#f2f4ee] py-[5px] text-[10.5px] text-rice-muted">
      <span className="min-w-0 flex-1 leading-tight">
        {item.label}
        <span className={`ml-1 rounded px-1 py-0.5 text-[8px] font-semibold ${item.isOverridden ? "bg-[#fff2df] text-[#a66c18]" : "bg-[#eef5ea] text-[#5f755c]"}`}>
          {item.isOverridden ? "manual" : "auto"}
        </span>
      </span>
      <CostStepper value={item.value} step={50} onChange={onChange} />
    </div>
  );
}

function TotalCostRow({ value, onChange }) {
  return (
    <div className="mt-2 rounded-[10px] border border-[#d7e8cf] bg-[#f4faf2] px-2 py-2">
      <div className="mb-1 flex items-center justify-between gap-2 text-[12px] font-bold text-rice-dark">
        <span>รวมต้นทุน Total</span>
        <CostStepper value={value} step={100} onChange={onChange} strong />
      </div>
      <div className="text-[9px] leading-snug text-[#8a9686]">แก้ยอดรวมเพื่อปรับสัดส่วนต้นทุนย่อยทั้งหมดต่อไร่</div>
    </div>
  );
}

function ChemicalProgramNote({ model }) {
  if (!model.chemicalProgram?.items?.length) return null;

  return (
    <div className="mt-2 rounded-[10px] border border-[#f0e3bf] bg-[#fffaf0] px-2 py-2">
      <div className="mb-1 text-[9.5px] font-bold text-[#9a6e18]">Chemical/IPM assumption · สมมติฐานยา</div>
      <div className="flex flex-col gap-1">
        {model.chemicalProgram.items.slice(0, 3).map((item) => (
          <div key={`${item.en}-${item.cost}`} className="text-[9.5px] leading-snug text-[#8a7040]">
            {item.en}
            <span className="font-display font-semibold"> · ฿{formatNumber(item.cost)}</span>
            <div className="text-[#a89468]">{item.th}</div>
          </div>
        ))}
      </div>
      <div className="mt-1 text-[8.5px] leading-snug text-[#b19b70]">ใช้จริงควรพ่นเมื่อสำรวจพบ/ถึงระดับระบาด และใช้อัตราตามฉลาก</div>
    </div>
  );
}

function CostStepper({ value, onChange, step, strong = false }) {
  const next = (raw) => onChange(Math.max(0, Math.round(Number(raw) || 0)));

  return (
    <div className="flex flex-none items-center gap-1">
      <SmallButton onClick={() => next(value - step)}>-</SmallButton>
      <input
        aria-label="Cost per rai"
        type="number"
        min="0"
        step={step}
        value={Math.round(value)}
        onChange={(event) => next(event.target.value)}
        className={`w-[68px] rounded-lg border border-[#dde3d6] bg-white px-1 py-1 text-center font-display text-[12px] outline-none ${
          strong ? "font-bold text-rice-dark" : "font-semibold text-[#3c473a]"
        }`}
      />
      <SmallButton onClick={() => next(value + step)}>+</SmallButton>
    </div>
  );
}

function CarbonCard({ simulation }) {
  const model = simulation.liveModel;
  return (
    <section className="mt-3.5 rounded-[14px] border border-[#d7e8cf] bg-gradient-to-br from-[#ecf6ec] to-[#f4faf2] px-3.5 py-[13px]">
      <div className="mb-2.5 flex items-center gap-[7px]">
        <span className="text-[15px]">🌍</span>
        <div>
          <div className="text-[12.5px] font-bold text-[#2c5e36]">Carbon & CO₂e</div>
          <div className="text-[10px] text-rice-faint">คาร์บอน / ก๊าซเรือนกระจก</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <CarbonMetric label="Emissions · ปล่อย" value={model.carbon.co2PerRai.toFixed(2)} />
        <CarbonMetric label="Reduced · ลดได้" value={`-${model.carbon.co2Reduction.toFixed(2)}`} positive />
      </div>
      <div className="mt-2 flex items-center justify-between rounded-[11px] bg-gradient-to-br from-[#1f8a5b] to-[#2fae6e] px-3 py-2.5 text-white">
        <div className="leading-tight">
          <div className="text-[10.5px] opacity-90">Carbon credit · คาร์บอนเครดิต</div>
          <div className="text-[9px] opacity-80">vs continuous flooding · {simulation.farmSize} rai</div>
        </div>
        <div className="text-right">
          <div className="font-display text-[17px] font-bold">฿{formatNumber(model.carbon.creditPerRai * simulation.farmSize)}</div>
          <div className="text-[9px] opacity-85">฿{formatNumber(model.carbon.creditPerRai)}/rai</div>
        </div>
      </div>
      <div className="mt-1.5 text-[9px] leading-snug text-[#9aa394]">Rough est. @ ฿{model.carbon.carbonPrice}/tCO₂e (T-VER). AWD cuts methane ~45%.</div>
    </section>
  );
}

function CarbonMetric({ label, value, positive = false }) {
  return (
    <div className="rounded-[10px] border border-[#e0ebd9] bg-white px-2.5 py-2">
      <div className="text-[9.5px] text-rice-faint">{label}</div>
      <div className={`font-display text-[15px] font-bold ${positive ? "text-rice-green" : "text-[#3c473a]"}`}>
        {value}<span className="text-[9px] text-[#9aa394]"> t/rai</span>
      </div>
    </div>
  );
}
