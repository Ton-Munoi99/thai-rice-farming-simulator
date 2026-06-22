import { formatNumber, riskColor, scoreColor, signedBaht } from "../utils/format.js";
import { COST_LABELS, pickLang, t } from "../i18n.js";
import CompareScenariosPanel from "./CompareScenariosPanel.jsx";
import ExplanationPanel from "./ExplanationPanel.jsx";
import RecommendationPanel from "./RecommendationPanel.jsx";

export default function ScorePanel({ simulation }) {
  const model = simulation.liveModel;
  const variety = simulation.varietyInfo;
  const { language } = simulation;
  const circumference = 2 * Math.PI * 58;
  const profitPositive = model.profitPerRai >= 0;
  const totals = {
    riceRevenue: model.riceRevenuePerRai * simulation.farmSize,
    strawRevenue: model.straw.revenuePerRai * simulation.farmSize,
    revenue: model.revenuePerRai * simulation.farmSize,
    cost: model.costPerRai * simulation.farmSize,
    profit: model.profitPerRai * simulation.farmSize,
    strawKg: model.straw.collectableKgPerRai * simulation.farmSize,
  };

  const indicators = [
    [t(language, "fertilizerEfficiency"), model.fertilizerEfficiency, scoreColor(model.fertilizerEfficiency), "%"],
    [t(language, "waterAdequacy"), model.waterAdequacy, scoreColor(model.waterAdequacy), "%"],
    [t(language, "pestDiseaseRisk"), model.pestDiseaseRisk, riskColor(model.pestDiseaseRisk), "%"],
    [t(language, "soilHealth"), model.soilHealth, scoreColor(model.soilHealth), "%"],
  ];

  return (
    <aside className="fixed bottom-24 right-3 top-[70px] z-40 flex w-[min(300px,calc(100vw-24px))] flex-none flex-col overflow-y-auto border border-rice-border bg-rice-panel shadow-float lg:static lg:z-auto lg:w-[296px] lg:border-y-0 lg:border-r-0 lg:shadow-none">
      <div className="px-[17px] py-4">
        <div className="control-heading">{t(language, "liveHealthScore")}</div>
        <div className="text-[10.5px] text-rice-faint">{t(language, "realTime")}</div>

        <section className="mt-2.5 flex flex-col items-center rounded-lg border border-rice-card bg-white pb-2.5 pt-3.5">
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
          <div className="mt-1 text-[13px] font-bold" style={{ color: model.color }}>{pickLang(language, model.label, model.labelTh)}</div>
        </section>

        <section className="mt-[11px] flex items-center justify-between rounded-lg border border-[#e6dcc8] bg-[#fffaf0] px-[15px] py-[13px]">
          <div>
            <div className="text-[11px] font-semibold text-[#9a8638]">{t(language, "estimatedYield")}</div>
            <div className="text-[10px] text-[#b6ad8a]">kg / {t(language, "rai")}</div>
          </div>
          <div className="font-display text-[30px] font-bold text-rice-gold">{formatNumber(model.estimatedYieldKgPerRai)}</div>
        </section>

        <section className="mt-[9px] flex items-center justify-between gap-2 rounded-lg border border-rice-card bg-white px-[13px] py-2.5">
          <div className="leading-tight">
            <div className="text-[11px] font-semibold text-[#3c473a]">{t(language, "salePrice")}</div>
            <div className="text-[9.5px] text-rice-faint">{t(language, "bahtPerTon")}</div>
          </div>
          <div className="flex items-center gap-[5px]">
            <SmallButton onClick={() => simulation.setPricePerTon(simulation.pricePerTon - 100)}>-</SmallButton>
            <input
              aria-label="Average paddy price per ton"
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

        <section className="mt-[9px] rounded-lg border border-[#d9e2d1] bg-[#f7faf4] px-[13px] py-2.5">
          <div className="mb-2 flex items-start justify-between gap-2">
            <div className="leading-tight">
              <div className="text-[11px] font-semibold text-[#3c473a]">{t(language, "strawIncome")}</div>
              <div className="text-[9.5px] text-rice-faint">{t(language, "strawReference")}</div>
            </div>
            <div className="text-right">
              <div className="font-display text-[17px] font-bold text-[#8a7040]">{formatNumber(model.straw.collectableKgPerRai)}</div>
              <div className="text-[8.5px] text-rice-faint">kg/{t(language, "rai")}</div>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="leading-tight">
              <div className="text-[10px] font-semibold text-[#5f755c]">{t(language, "strawPrice")}</div>
              <div className="text-[8.5px] text-rice-faint">
                RPR {model.straw.residueToPaddyRatio} · SAF {model.straw.surplusAvailabilityFactor} · {t(language, "collectionAdjusted")} {model.straw.collectionPercent}%
              </div>
            </div>
            <div className="flex items-center gap-[5px]">
              <SmallButton onClick={() => simulation.setStrawPricePerKg(simulation.strawPricePerKg - 0.1)}>-</SmallButton>
              <input
                aria-label="Straw price per kg"
                value={simulation.strawPricePerKg}
                type="number"
                min="0"
                max="10"
                step="0.1"
                onChange={(event) => simulation.setStrawPricePerKg(event.target.value)}
                className="w-[58px] rounded-lg border border-[#dde3d6] bg-white px-1 py-1 text-center font-display text-[12px] font-bold text-[#3c473a] outline-none"
              />
              <SmallButton onClick={() => simulation.setStrawPricePerKg(simulation.strawPricePerKg + 0.1)}>+</SmallButton>
            </div>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-1.5 border-t border-[#d9e2d1] pt-2 text-[8.5px] text-rice-faint">
            <div>
              <span className="block font-semibold text-[#5f755c]">{t(language, "totalStraw")}</span>
              {formatNumber(model.straw.totalResidueKgPerRai)} kg/{t(language, "rai")}
            </div>
            <div>
              <span className="block font-semibold text-[#5f755c]">{t(language, "surplusStraw")}</span>
              {formatNumber(model.straw.surplusKgPerRai)} kg/{t(language, "rai")}
            </div>
            <div>
              <span className="block font-semibold text-[#5f755c]">{t(language, "strawRevenue")}</span>
              ฿{formatNumber(model.straw.revenuePerRai)}
            </div>
          </div>
        </section>

        <section className="mt-[9px] rounded-lg border border-[#d8ddd2] bg-[#fbfaf6] px-[13px] py-3">
          <div className="mb-2 flex items-baseline justify-between">
            <div className="text-[11px] font-bold text-[#2f3b34]">{t(language, "farmTotals")}</div>
            <div className="text-[9px] text-rice-faint">{simulation.farmSize} {t(language, "rai")}</div>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-2 border-t border-[#ebe7dd] pt-2">
            <TotalMetric label={t(language, "totalRevenue")} value={`฿${formatNumber(totals.revenue)}`} tone="ink" />
            <TotalMetric label={t(language, "totalCost")} value={`฿${formatNumber(totals.cost)}`} tone="muted" />
            <TotalMetric label={t(language, "riceTotal")} value={`฿${formatNumber(totals.riceRevenue)}`} tone="muted" />
            <TotalMetric label={t(language, "strawTotal")} value={`฿${formatNumber(totals.strawRevenue)}`} tone="straw" />
          </div>
          <div className={`mt-2 rounded-md px-2.5 py-2 ${totals.profit >= 0 ? "bg-[#eef6ed] text-[#2f6b48]" : "bg-[#fbefeb] text-[#a24b2b]"}`}>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-semibold">{t(language, "totalProfit")}</span>
              <span className="font-display text-[14px] font-bold">{signedBaht(totals.profit)}</span>
            </div>
          </div>
        </section>

        <CostDriversCard language={language} model={model} />

        <section className="mt-[13px] flex flex-col gap-[11px]">
          {indicators.map(([name, value, color, suffix]) => (
            <div key={name}>
              <div className="mb-1 flex items-baseline justify-between text-[11.5px]">
                <span className="text-[#3c473a]">{name}</span>
                <b className="font-display" style={{ color }}>{value}{suffix}</b>
              </div>
              <div className="h-[7px] overflow-hidden rounded-[7px] bg-[#eef1e7]">
                <div className="h-full rounded-[7px] transition-[width] duration-500" style={{ width: `${Math.max(value, 2)}%`, background: color }} />
              </div>
            </div>
          ))}
        </section>

        <ExplanationPanel language={language} model={model} />

        <section className="mt-3.5 rounded-lg border border-rice-card bg-white px-[13px] py-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[11px] font-bold text-[#3c473a]">{t(language, "costBreakdown")}</div>
            <button
              type="button"
              onClick={simulation.resetCosts}
              className="rounded-md border border-[#dedbd0] bg-[#fbfaf6] px-2 py-1 text-[9.5px] font-semibold text-rice-muted transition hover:bg-white"
            >
              {t(language, "reset")}
            </button>
          </div>
          <div className="mb-2 text-[10px] text-rice-faint">{variety.icon} {pickLang(language, variety.en, variety.name)} · {t(language, "editablePerRai")}</div>
          {model.costBreakdown.map((item) => (
            <CostRow
              key={item.key}
              language={language}
              item={item}
              onChange={(value) => simulation.setCostItem(item.key, value)}
            />
          ))}
          <ChemicalProgramNote language={language} model={model} />
          <TotalCostRow language={language} value={model.costPerRai} onChange={simulation.setTotalCostPerRai} />
        </section>

        <section className="mt-[9px] grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-rice-card bg-white px-[11px] py-2.5">
            <div className="text-[9.5px] text-rice-faint">{t(language, "revenue")}</div>
            <div className="font-display text-[15px] font-semibold text-[#3c473a]">฿{formatNumber(model.revenuePerRai)}</div>
            <div className="text-[9px] text-[#b6ad8a]">
              {t(language, "riceRevenue")} ฿{formatNumber(model.riceRevenuePerRai)} + {language === "th" ? "ฟาง" : "straw"} ฿{formatNumber(model.straw.revenuePerRai)}
            </div>
          </div>
          <div className={`rounded-lg px-[11px] py-2.5 ${profitPositive ? "bg-[#2f6b48] text-white" : "bg-[#a24b2b] text-white"}`}>
            <div className="text-[9.5px] opacity-90">{profitPositive ? t(language, "profit") : t(language, "loss")}</div>
            <div className="font-display text-[15px] font-bold">{signedBaht(model.profitPerRai)}</div>
            <div className="text-[9px] opacity-80">{t(language, "perRai")}</div>
          </div>
        </section>

        <CompareScenariosPanel simulation={simulation} />

        <CarbonCard simulation={simulation} />

        <section className="mt-3.5 rounded-[13px] border border-rice-card bg-white px-[13px] py-3">
          <RecommendationPanel language={language} risks={model.risks} actions={model.recommendedActions} />
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
      className="h-[22px] w-[22px] rounded-md border border-[#dedbd0] bg-[#fbfaf6] p-0 text-[14px] font-bold leading-none text-[#3c473a] transition hover:bg-white"
    >
      {children}
    </button>
  );
}

function TotalMetric({ label, value, tone }) {
  const color = tone === "ink" ? "text-[#2f3b34]" : tone === "straw" ? "text-[#8a7040]" : "text-[#657066]";

  return (
    <div className="min-w-0">
      <div className="text-[8.5px] leading-tight text-rice-faint">{label}</div>
      <div className={`mt-0.5 font-display text-[13px] font-bold ${color}`}>{value}</div>
    </div>
  );
}

function CostDriversCard({ language, model }) {
  const drivers = model.costDrivers?.items ?? [];
  const visibleDrivers = [...drivers].sort((a, b) => b.amount - a.amount).slice(0, 6);

  return (
    <section className="mt-[9px] rounded-lg border border-[#e6dcc8] bg-[#fffaf0] px-[13px] py-2.5">
      <div className="flex items-start justify-between gap-2">
        <div className="leading-tight">
          <div className="text-[11px] font-bold text-[#3c473a]">{t(language, "linkedCostDrivers")}</div>
          <div className="text-[9.5px] text-rice-faint">{t(language, "autoCostImpact")}</div>
        </div>
        <div className="text-right">
          <div className="font-display text-[18px] font-bold text-[#a24b2b]">
            +฿{formatNumber(model.costDrivers?.total ?? 0)}
          </div>
          <div className="text-[8.5px] text-rice-faint">/{t(language, "rai")}</div>
        </div>
      </div>

      {visibleDrivers.length ? (
        <div className="mt-2 flex flex-col gap-1 border-t border-[#f0e3bf] pt-2">
          {visibleDrivers.map((item, index) => (
            <div key={`${item.itemKey}-${item.label}-${index}`} className="flex items-start justify-between gap-2 text-[9.3px] leading-snug">
              <span className="min-w-0 text-[#6d644f]">{pickLang(language, item.label, item.th)}</span>
              <span className={`flex-none font-display font-bold ${item.tone === "danger" ? "text-[#a24b2b]" : "text-[#8a7040]"}`}>
                +฿{formatNumber(item.amount)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-2 rounded-md bg-white/70 px-2 py-2 text-[9.5px] leading-snug text-[#6d7a68]">
          {language === "th" ? "ยังไม่มีต้นทุนเพิ่มจากความเสี่ยงแปลงในเงื่อนไขนี้" : "No extra condition-linked cost in this setup."}
        </div>
      )}

      <div className="mt-2 grid grid-cols-3 gap-1.5">
        {["labor", "fuel", "transport"].map((key) => {
          const value = model.costDrivers?.byItem?.[key] ?? 0;
          const label = COST_LABELS[key] ? pickLang(language, COST_LABELS[key].en, COST_LABELS[key].th) : key;
          return (
            <div key={key} className="rounded-md bg-white/70 px-2 py-1.5">
              <div className="truncate text-[8px] text-rice-faint">{label}</div>
              <div className="font-display text-[10.5px] font-bold text-[#7a4f2a]">+฿{formatNumber(value)}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-1.5 text-[8.5px] leading-snug text-[#9f8b62]">
        {t(language, "moistureNote")}
      </div>
    </section>
  );
}

function CostRow({ language, item, onChange }) {
  const label = COST_LABELS[item.key] ? pickLang(language, COST_LABELS[item.key].en, COST_LABELS[item.key].th) : item.label;

  return (
    <div className="flex items-center justify-between gap-2 border-b border-[#f2f4ee] py-[5px] text-[10.5px] text-rice-muted">
      <span className="min-w-0 flex-1 leading-tight">
        {label}
        <span className={`ml-1 rounded px-1 py-0.5 text-[8px] font-semibold ${item.isOverridden ? "bg-[#fff2df] text-[#a66c18]" : "bg-[#eef5ea] text-[#5f755c]"}`}>
          {item.isOverridden ? "manual" : "auto"}
        </span>
      </span>
      <CostStepper
        value={item.value}
        step={50}
        ariaLabel={`${label} ${language === "th" ? "ต่อไร่" : "cost per rai"}`}
        onChange={onChange}
      />
    </div>
  );
}
function TotalCostRow({ language, value, onChange }) {
  return (
    <div className="mt-2 rounded-lg border border-[#d9e2d1] bg-[#f7faf4] px-2 py-2">
      <div className="mb-1 flex items-center justify-between gap-2 text-[12px] font-bold text-rice-dark">
        <span>{language === "th" ? "รวมต้นทุน" : "Total cost"}</span>
        <CostStepper
          value={value}
          step={100}
          ariaLabel={language === "th" ? "รวมต้นทุนต่อไร่" : "Total cost per rai"}
          onChange={onChange}
          strong
        />
      </div>
      <div className="text-[9px] leading-snug text-[#8a9686]">
        {language === "th" ? "แก้ยอดรวมเพื่อปรับสัดส่วนต้นทุนย่อยทั้งหมดต่อไร่" : "Edit total to scale all cost items per rai."}
      </div>
    </div>
  );
}

function ChemicalProgramNote({ language, model }) {
  if (!model.chemicalProgram?.items?.length) return null;

  return (
    <div className="mt-2 rounded-[10px] border border-[#f0e3bf] bg-[#fffaf0] px-2 py-2">
      <div className="mb-1 text-[9.5px] font-bold text-[#9a6e18]">{language === "th" ? "สมมติฐานยา/IPM" : "Chemical/IPM assumption"}</div>
      <div className="flex flex-col gap-1">
        {model.chemicalProgram.items.slice(0, 3).map((item) => (
          <div key={`${item.en}-${item.cost}`} className="text-[9.5px] leading-snug text-[#8a7040]">
            {pickLang(language, item.en, item.th)}
            <span className="font-display font-semibold"> · ฿{formatNumber(item.cost)}</span>
          </div>
        ))}
      </div>
      <div className="mt-1 text-[8.5px] leading-snug text-[#b19b70]">
        {language === "th" ? "ใช้จริงควรพ่นเมื่อสำรวจพบ/ถึงระดับระบาด และใช้อัตราตามฉลาก" : "Use real products only after scouting/thresholds and follow label rates."}
      </div>
    </div>
  );
}

function CostStepper({ value, onChange, step, ariaLabel = "Cost per rai", strong = false }) {
  const next = (raw) => onChange(Math.max(0, Math.round(Number(raw) || 0)));

  return (
    <div className="flex flex-none items-center gap-1">
      <SmallButton onClick={() => next(value - step)}>-</SmallButton>
      <input
        aria-label={ariaLabel}
        type="number"
        min="0"
        step={step}
        value={Math.round(value)}
        onChange={(event) => next(event.target.value)}
        className={`w-[68px] rounded-lg border border-[#dedbd0] bg-white px-1 py-1 text-center font-display text-[12px] outline-none ${
          strong ? "font-bold text-rice-dark" : "font-semibold text-[#3c473a]"
        }`}
      />
      <SmallButton onClick={() => next(value + step)}>+</SmallButton>
    </div>
  );
}

function CarbonCard({ simulation }) {
  const model = simulation.liveModel;
  const { language } = simulation;
  return (
    <section className="mt-3.5 rounded-lg border border-[#d9e2d1] bg-[#f7faf4] px-3.5 py-[13px]">
      <div className="mb-2.5 flex items-center gap-[7px]">
        <span className="text-[15px]">🌍</span>
        <div>
          <div className="text-[12.5px] font-bold text-[#2c5e36]">{t(language, "carbon")}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <CarbonMetric label={t(language, "emissions")} value={model.carbon.co2PerRai.toFixed(2)} />
        <CarbonMetric label={t(language, "reduced")} value={`-${model.carbon.co2Reduction.toFixed(2)}`} positive />
      </div>
      <div className="mt-2 flex items-center justify-between rounded-lg bg-rice-dark px-3 py-2.5 text-white">
        <div className="leading-tight">
          <div className="text-[10.5px] opacity-90">{t(language, "carbonCredit")}</div>
          <div className="text-[9px] opacity-80">vs continuous flooding · {simulation.farmSize} {t(language, "rai")}</div>
        </div>
        <div className="text-right">
          <div className="font-display text-[17px] font-bold">฿{formatNumber(model.carbon.creditPerRai * simulation.farmSize)}</div>
          <div className="text-[9px] opacity-85">฿{formatNumber(model.carbon.creditPerRai)}/{t(language, "rai")}</div>
        </div>
      </div>
      <div className="mt-1.5 text-[9px] leading-snug text-[#9aa394]">
        {language === "th"
          ? `ประเมินคร่าว ๆ @ ฿${model.carbon.carbonPrice}/tCO₂e (T-VER). AWD ลด methane ประมาณ 45%.`
          : `Rough est. @ ฿${model.carbon.carbonPrice}/tCO₂e (T-VER). AWD cuts methane ~45%.`}
      </div>
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
