import { useMemo, useState } from "react";
import { formatNumber, signedBaht } from "../utils/format.js";
import { pickLang, t } from "../i18n.js";

export default function ScenarioHistoryPanel({ simulation }) {
  const { language, scenarioHistory } = simulation;
  const [name, setName] = useState("");
  const placeholder = useMemo(() => `${t(language, "scenario")} ${scenarioHistory.length + 1}`, [language, scenarioHistory.length]);

  const saveCurrent = () => {
    simulation.saveScenarioHistory(name || placeholder);
    setName("");
  };

  return (
    <section className="mt-3.5 rounded-[13px] border border-rice-card bg-white px-[13px] py-3">
      <div className="mb-2">
        <div className="text-[11px] font-bold text-[#3c473a]">{t(language, "scenarioHistory")}</div>
        <div className="text-[9.5px] leading-snug text-rice-faint">{t(language, "scenarioHistorySub")}</div>
      </div>
      <div className="flex gap-1.5">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 rounded-md border border-[#ded8cb] bg-[#fffdf7] px-2 py-1.5 text-[10px] font-semibold text-[#3c473a] outline-none focus:border-rice-green"
        />
        <button
          type="button"
          onClick={saveCurrent}
          className="rounded-md bg-rice-green px-2.5 py-1.5 text-[9.5px] font-bold text-white transition hover:bg-[#257a42]"
        >
          {t(language, "save")}
        </button>
      </div>

      {scenarioHistory.length === 0 ? (
        <div className="mt-2 rounded-[10px] border border-dashed border-[#d7e0cf] bg-[#fbfcf8] px-3 py-3 text-center text-[10px] leading-snug text-rice-faint">
          {t(language, "scenarioHistoryEmpty")}
        </div>
      ) : (
        <div className="mt-2 space-y-1.5">
          {scenarioHistory.slice(0, 6).map((item) => (
            <HistoryRow
              key={item.id}
              item={item}
              language={language}
              onDelete={() => simulation.deleteScenarioHistory(item.id)}
              onLoad={() => simulation.loadScenarioHistory(item.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function HistoryRow({ item, language, onDelete, onLoad }) {
  const model = item.model;

  return (
    <div className="rounded-lg border border-[#edf1e8] bg-[#fbfaf6] px-2.5 py-2">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-[10px] font-bold text-[#3c473a]">{item.label}</div>
          <div className="text-[8.5px] text-rice-faint">
            {pickLang(language, item.varietyKey === "jasmine" ? "Hom Mali" : "White rice", item.varietyName)} · {item.savedAt}
          </div>
        </div>
        <div className={`font-display text-[11px] font-bold ${model.profitPerRai >= 0 ? "text-rice-green" : "text-rice-red"}`}>
          {signedBaht(model.profitPerRai)}
        </div>
      </div>
      <div className="mt-1.5 grid grid-cols-3 gap-1 text-[8.5px] text-rice-faint">
        <span>{formatNumber(model.estimatedYieldKgPerRai)} kg/rai</span>
        <span>฿{formatNumber(model.costPerRai)}</span>
        <span className="truncate">{pickLang(language, model.financialRisk.level, model.financialRisk.levelTh)}</span>
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
          onClick={onDelete}
          className="rounded-md border border-[#ead5cd] bg-white px-2 py-1 text-[9px] font-semibold text-[#a24b2b] transition hover:bg-[#fff5f0]"
        >
          {t(language, "delete")}
        </button>
      </div>
    </div>
  );
}
