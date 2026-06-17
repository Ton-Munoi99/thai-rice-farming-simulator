import { pickLang, t } from "../i18n.js";

export default function GrowthTimeline({ simulation }) {
  const { stages, stageIndex, phase, isRunning, runSimulation, language } = simulation;
  const progress = phase === "setup" ? 0 : (stageIndex / 6) * 100;

  return (
    <footer className="flex h-24 flex-none items-center gap-3.5 border-t border-rice-border bg-rice-panel px-[18px] py-[11px]">
      <button
        type="button"
        disabled={isRunning}
        onClick={runSimulation}
        className={`flex flex-none items-center gap-[9px] rounded-[13px] px-5 py-3 text-left font-sans text-[14px] font-bold text-white shadow-[0_4px_12px_rgba(47,143,78,.30)] transition ${
          isRunning ? "cursor-default bg-[#9aa394]" : "bg-gradient-to-br from-rice-dark to-rice-green hover:brightness-105"
        }`}
      >
        <span className="text-[15px]">{isRunning ? "⏳" : phase === "done" ? "↻" : "▶"}</span>
        <span className="leading-tight">
          {isRunning ? t(language, "running") : phase === "done" ? t(language, "runAgain") : t(language, "runSimulation")}
        </span>
      </button>

      <div className="relative min-w-[420px] flex-1 overflow-x-auto">
        <div className="relative z-[2] flex justify-between">
          {stages.map((stage, index) => {
            const active = index === stageIndex && phase !== "setup";
            const done = phase === "done" || index < stageIndex;
            const idle = phase === "setup" || (!active && !done);
            return (
              <div key={stage.name} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className={`flex h-[26px] w-[26px] items-center justify-center rounded-full border-2 text-[13px] transition ${
                    active
                      ? "border-rice-green bg-rice-green text-white shadow-[0_0_0_4px_rgba(47,143,78,.15)]"
                      : done
                        ? "border-transparent bg-[#bfe0c4] text-rice-green"
                        : "border-transparent bg-[#eef1e7] text-[#aab2a0]"
                  }`}
                >
                  {stage.icon}
                </div>
                <div
                  className={`max-w-[82px] text-center text-[9px] font-medium leading-tight ${
                    active ? "font-bold text-rice-green" : idle ? "text-[#8b9481]" : "text-rice-muted"
                  }`}
                >
                  {pickLang(language, stage.name.split(" / ")[0].replace(" Initiation", "").replace("Germination", "Seedling"), stage.th)}
                </div>
              </div>
            );
          })}
        </div>
        <div className="absolute left-3.5 right-3.5 top-[13px] z-[1] h-[3px] rounded-[3px] bg-[#e3e8dc]">
          <div
            className="h-full rounded-[3px] bg-gradient-to-r from-rice-green to-rice-mid transition-[width] duration-[1500ms]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </footer>
  );
}
