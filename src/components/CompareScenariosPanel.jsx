import { formatNumber, signedBaht } from "../utils/format.js";
import { pickLang, t } from "../i18n.js";

const slotNames = ["A", "B", "C"];

export default function CompareScenariosPanel({ simulation }) {
  const { language } = simulation;
  const savedSlots = simulation.compareSlots.filter(Boolean);
  const bestProfit = savedSlots.length
    ? Math.max(...savedSlots.map((slot) => slot.model.profitPerRai))
    : null;

  return (
    <section className="mt-3.5 rounded-[13px] border border-rice-card bg-white px-[13px] py-3">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <div className="text-[11px] font-bold text-[#3c473a]">{t(language, "compareScenarios")}</div>
          <div className="text-[9.5px] leading-snug text-rice-faint">{t(language, "compareHint")}</div>
        </div>
      </div>

      <div className="mb-2 grid grid-cols-3 gap-1.5">
        {slotNames.map((slot, index) => (
          <button
            key={slot}
            type="button"
            onClick={() => simulation.saveCompareSlot(index)}
            className="rounded-[9px] border border-[#d7e8cf] bg-[#f4faf2] px-2 py-1.5 text-[10px] font-bold text-rice-dark transition hover:border-rice-green hover:bg-[#eef8ee]"
          >
            {t(language, "save")} {slot}
          </button>
        ))}
      </div>

      {savedSlots.length === 0 ? (
        <div className="rounded-[10px] border border-dashed border-[#d7e0cf] bg-[#fbfcf8] px-3 py-3 text-center text-[10px] leading-snug text-rice-faint">
          {t(language, "emptyCompare")}
        </div>
      ) : (
        <div className="overflow-hidden rounded-[10px] border border-[#edf1e8]">
          <div className="grid grid-cols-[42px_1fr_1fr] bg-[#f4f7ef] px-2 py-1.5 text-[9px] font-bold text-[#5a6b58]">
            <span>Slot</span>
            <span>{t(language, "estimatedYield")} / {t(language, "risk")}</span>
            <span className="text-right">{t(language, "profit")}</span>
          </div>
          {simulation.compareSlots.map((slot, index) =>
            slot ? (
              <CompareRow
                key={slot.id}
                slot={slot}
                isBest={slot.model.profitPerRai === bestProfit}
                language={language}
                onLoad={() => simulation.loadCompareSlot(index)}
                onClear={() => simulation.clearCompareSlot(index)}
              />
            ) : null,
          )}
        </div>
      )}
    </section>
  );
}

function CompareRow({ language, slot, isBest, onLoad, onClear }) {
  const model = slot.model;
  const profitPositive = model.profitPerRai >= 0;

  return (
    <div className={`border-t border-[#edf1e8] px-2 py-2 ${isBest ? "bg-[#f1f8ee]" : "bg-white"}`}>
      <div className="grid grid-cols-[42px_1fr_1fr] items-start gap-1.5">
        <div>
          <div className={`flex h-7 w-7 items-center justify-center rounded-full font-display text-[13px] font-bold text-white ${isBest ? "bg-rice-green" : "bg-[#9aa394]"}`}>
            {slot.slot}
          </div>
        </div>
        <div className="min-w-0">
          <div className="truncate text-[10px] font-bold text-[#3c473a]">
            {pickLang(language, slot.varietyKey === "jasmine" ? "Hom Mali" : "White rice", slot.varietyName)} · {slot.savedAt}
          </div>
          <div className="mt-0.5 text-[9px] leading-snug text-rice-faint">
            {formatNumber(model.estimatedYieldKgPerRai)} kg/rai · {t(language, "risk")} {pickLang(language, model.riskLevel, model.riskLevelTh)}
          </div>
          <div className="mt-0.5 text-[8.5px] leading-snug text-[#9aa394]">
            {t(language, "cost")} ฿{formatNumber(model.costPerRai)} · {t(language, "revenue")} ฿{formatNumber(model.revenuePerRai)}
          </div>
        </div>
        <div className="text-right">
          <div className={`font-display text-[12px] font-bold ${profitPositive ? "text-rice-green" : "text-rice-red"}`}>
            {signedBaht(model.profitPerRai)}
          </div>
          {isBest ? <div className="text-[8px] font-bold text-rice-green">{t(language, "best")}</div> : null}
        </div>
      </div>
      <div className="mt-2 flex justify-end gap-1.5">
        <button
          type="button"
          onClick={onLoad}
          className="rounded-md border border-[#d7e8cf] bg-white px-2 py-1 text-[9px] font-semibold text-rice-dark transition hover:bg-[#f4faf2]"
        >
          {t(language, "load")}
        </button>
        <button
          type="button"
          onClick={onClear}
          className="rounded-md border border-[#ead5cd] bg-white px-2 py-1 text-[9px] font-semibold text-[#a24b2b] transition hover:bg-[#fff5f0]"
        >
          {t(language, "clear")}
        </button>
      </div>
    </div>
  );
}
