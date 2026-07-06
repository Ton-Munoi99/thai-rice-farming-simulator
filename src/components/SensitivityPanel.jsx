import { useMemo } from "react";
import { pickLang, t } from "../i18n.js";
import { buildSensitivityAnalysis } from "../simulation/SensitivityEngine.js";
import { formatNumber, signedBaht } from "../utils/format.js";

const COST_LABELS = {
  down: { en: "Cost -10%", th: "ต้นทุน -10%" },
  current: { en: "Current cost", th: "ต้นทุนปัจจุบัน" },
  up: { en: "Cost +10%", th: "ต้นทุน +10%" },
};

function cellTone(profit) {
  if (profit >= 800) return "bg-[#e8f3e5] text-[#2f6b48]";
  if (profit >= 0) return "bg-[#f6f0dc] text-[#8a641c]";
  if (profit >= -1000) return "bg-[#fff1df] text-[#a25e22]";
  return "bg-[#fae8e1] text-[#a24b2b]";
}

function isNear(value, target, tolerance) {
  return Math.abs(value - target) <= tolerance;
}

export default function SensitivityPanel({ simulation }) {
  const { language, inputs, liveModel, pricePerTon, strawPricePerKg } = simulation;
  const analysis = useMemo(
    () => buildSensitivityAnalysis({ inputs, model: liveModel, pricePerTon, strawPricePerKg }),
    [inputs, liveModel, pricePerTon, strawPricePerKg],
  );

  return (
    <section className="mt-[9px] rounded-lg border border-[#d8ddd2] bg-[#fbfaf6] px-[13px] py-3">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <div className="text-[11px] font-bold text-[#2f3b34]">{t(language, "sensitivityTitle")}</div>
          <div className="text-[9px] leading-snug text-rice-faint">{t(language, "sensitivitySub")}</div>
        </div>
        <div className="rounded-md bg-white px-2 py-1 text-right">
          <div className="text-[8px] text-rice-faint">{t(language, "breakEvenPrice")}</div>
          <div className="font-display text-[11px] font-bold text-[#3c473a]">฿{formatNumber(analysis.breakEvenPrice)}</div>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border border-[#ebe7dd] bg-white">
        <div className="grid" style={{ gridTemplateColumns: `46px repeat(${analysis.priceColumns.length}, minmax(42px, 1fr))` }}>
          <div className="bg-[#f4f2ea] px-1.5 py-1 text-[8px] font-bold text-[#6b7468]">kg</div>
          {analysis.priceColumns.map((price) => (
            <div key={price} className="bg-[#f4f2ea] px-1 py-1 text-center text-[8px] font-bold text-[#6b7468]">
              ฿{formatNumber(price)}
            </div>
          ))}
          {analysis.matrix.map((row) => (
            <MatrixRow key={row.yieldKgPerRai} row={row} currentYield={analysis.currentYield} currentPrice={analysis.currentPrice} />
          ))}
        </div>
      </div>

      <div className="mt-1.5 flex items-center justify-between text-[8px] text-rice-faint">
        <span>{t(language, "profitPerRai")}</span>
        <span>{t(language, "includingStraw")}</span>
      </div>

      <div className="mt-2 border-t border-[#ebe7dd] pt-2">
        <div className="mb-1 text-[9.5px] font-bold text-[#3c473a]">{t(language, "costSensitivity")}</div>
        <div className="grid grid-cols-3 gap-1.5">
          {analysis.costLevels.map((item) => (
            <div key={item.key} className={`rounded-md px-2 py-1.5 ${cellTone(item.profit)}`}>
              <div className="truncate text-[8px] font-semibold">
                {pickLang(language, COST_LABELS[item.key].en, COST_LABELS[item.key].th)}
              </div>
              <div className="font-display text-[11px] font-bold">{signedBaht(item.profit)}</div>
              <div className="text-[7.5px] opacity-75">C ฿{formatNumber(item.costPerRai)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MatrixRow({ row, currentYield, currentPrice }) {
  return (
    <>
      <div
        className={`border-t border-[#f0eee6] px-1.5 py-1 text-[8px] font-bold ${isNear(row.yieldKgPerRai, currentYield, 12) ? "bg-[#eef6ed] text-[#2f6b48]" : "bg-white text-[#6b7468]"}`}
      >
        {formatNumber(row.yieldKgPerRai)}
      </div>
      {row.cells.map((cell) => {
        const current = isNear(cell.yieldKgPerRai, currentYield, 12) && isNear(cell.pricePerTon, currentPrice, 250);
        return (
          <div
            key={`${cell.yieldKgPerRai}-${cell.pricePerTon}`}
            className={`border-l border-t border-[#f0eee6] px-1 py-1 text-center font-display text-[8.5px] font-bold ${cellTone(cell.profit)} ${current ? "ring-1 ring-inset ring-[#2f6b48]" : ""}`}
            title={`Profit ${cell.profit}`}
          >
            {cell.profit >= 0 ? "+" : ""}
            {formatNumber(cell.profit)}
          </div>
        );
      })}
    </>
  );
}
