import { formatNumber, scoreColor, signedBaht } from "../utils/format.js";
import ExplanationPanel from "./ExplanationPanel.jsx";
import RecommendationPanel from "./RecommendationPanel.jsx";

export default function SummaryDashboard({ simulation }) {
  if (!simulation.showSummary) return null;

  const model = simulation.activeModel;
  const profitPositive = model.profitPerRai >= 0;
  const metrics = [
    ["Estimated yield", "ผลผลิต", `${formatNumber(model.estimatedYieldKgPerRai)} kg/rai`, "#c8901c"],
    ["Growth score", "คะแนนการเติบโต", `${model.growthScore} / 100`, "#2f8f4e"],
    ["Fertilizer efficiency", "ประสิทธิภาพปุ๋ย", `${model.fertilizerEfficiency}%`, scoreColor(model.fertilizerEfficiency)],
    ["Water adequacy", "ความพอเพียงน้ำ", `${model.waterAdequacy}%`, scoreColor(model.waterAdequacy)],
    ["Pest & disease risk", "ความเสี่ยงโรคแมลง", `${model.pestDiseaseRisk}%`, model.pestDiseaseRisk <= 25 ? "#2f8f4e" : model.pestDiseaseRisk <= 50 ? "#e0a82e" : "#d2603a"],
    ["Soil health", "สุขภาพดิน", `${model.soilHealth}%`, scoreColor(model.soilHealth)],
    ["Production cost", "ต้นทุน", `฿${formatNumber(model.costPerRai)}`, "#3c473a"],
    ["Revenue", "รายได้", `฿${formatNumber(model.revenuePerRai)}`, "#3c473a"],
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(20,30,22,.66)] p-6">
      <section className="max-h-[92vh] w-[880px] max-w-[96%] animate-fade-up overflow-y-auto rounded-[20px] bg-rice-panel shadow-modal">
        <header
          className="flex items-center justify-between rounded-t-[20px] px-[26px] py-5 text-white"
          style={{ background: `linear-gradient(120deg, ${model.headerGradient[0]}, ${model.headerGradient[1]})` }}
        >
          <div>
            <div className="text-[11px] font-semibold tracking-[.5px] opacity-85">HARVEST SUMMARY · สรุปผลการเก็บเกี่ยว</div>
            <div className="mt-0.5 text-[24px] font-bold">{model.verdict}</div>
            <div className="text-[12px] opacity-90">{model.verdictTh}</div>
          </div>
          <div className="text-right">
            <div className="font-display text-[46px] font-bold leading-none">{formatNumber(model.estimatedYieldKgPerRai)}</div>
            <div className="text-[11px] opacity-90">kg/rai · Growth {model.growthScore}/100</div>
          </div>
        </header>

        <div className="px-[26px] py-[22px]">
          <div className="grid grid-cols-2 gap-[11px] md:grid-cols-4">
            {metrics.map(([name, th, value, color]) => (
              <div key={name} className="rounded-[13px] border border-rice-card bg-white px-[13px] py-3">
                <div className="text-[10px] leading-tight text-rice-faint">
                  {name}
                  <br />
                  <span className="text-[#b3bba8]">{th}</span>
                </div>
                <div className="mt-1 font-display text-[19px] font-bold" style={{ color }}>{value}</div>
              </div>
            ))}
          </div>

          <div
            className="mt-3.5 flex items-center justify-between rounded-[14px] px-[18px] py-[15px] text-white"
            style={{
              background: profitPositive ? "linear-gradient(135deg,#2f8f4e,#6fae3f)" : "linear-gradient(135deg,#c2562f,#d2603a)",
            }}
          >
            <div>
              <div className="text-[12px] opacity-90">{profitPositive ? "Profit" : "Loss"} per rai · กำไร/ขาดทุนต่อไร่</div>
              <div className="mt-0.5 text-[11px] opacity-80">
                For {simulation.farmSize} rai: {signedBaht(model.profitPerRai * simulation.farmSize)}
              </div>
            </div>
            <div className="font-display text-[30px] font-bold">{signedBaht(model.profitPerRai)}</div>
          </div>

          <div className="mt-3 flex items-center justify-between rounded-[14px] bg-gradient-to-r from-[#1f8a5b] to-[#37b074] px-[18px] py-[13px] text-white">
            <div>
              <div className="text-[12px] font-semibold opacity-95">🌍 Carbon credit · คาร์บอนเครดิต</div>
              <div className="mt-0.5 text-[11px] opacity-80">
                -{model.carbon.co2Reduction.toFixed(2)} tCO₂e/rai vs flooding · ฿{model.carbon.carbonPrice}/t
              </div>
            </div>
            <div className="text-right">
              <div className="font-display text-[26px] font-bold">฿{formatNumber(model.carbon.creditPerRai * simulation.farmSize)}</div>
              <div className="text-[10px] opacity-85">-{(model.carbon.co2Reduction * simulation.farmSize).toFixed(1)} tCO₂e total</div>
            </div>
          </div>

          <div className="mt-4 rounded-[14px] border border-rice-card bg-white px-4 py-3">
            <ExplanationPanel model={model} compact />
          </div>

          <div className="mt-4">
            <RecommendationPanel risks={model.risks} actions={model.recommendedActions} compact />
          </div>

          <div className="mt-5 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={simulation.closeSummary}
              className="rounded-[11px] border border-[#cdd5c4] bg-white px-5 py-[11px] text-[13px] font-semibold text-[#3c473a] transition hover:bg-[#f8faf4]"
            >
              View field · ดูแปลงนา
            </button>
            <button
              type="button"
              onClick={simulation.runSimulation}
              className="rounded-[11px] bg-rice-green px-[22px] py-[11px] text-[13px] font-bold text-white transition hover:bg-rice-dark"
            >
              ↻ Run again · จำลองใหม่
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
