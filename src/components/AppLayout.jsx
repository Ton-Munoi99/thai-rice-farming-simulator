import { LANGUAGES, pickLang, t } from "../i18n.js";

export default function AppLayout({
  children,
  farmSize,
  fieldStyle,
  language,
  showPanel,
  score,
  variety,
  onFarmSize,
  onFieldStyle,
  onOpenExport,
  onOpenGuide,
  onOpenMethodology,
  onOpenWizard,
  onToggleLanguage,
  onTogglePanel,
}) {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-rice-bg text-rice-text">
      <header className="flex h-[58px] flex-none items-center justify-between gap-2 border-b border-[#284d43] bg-rice-dark px-3 text-white sm:gap-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-[32px] w-[32px] flex-none items-center justify-center rounded-lg bg-white/10 text-[18px] sm:h-[34px] sm:w-[34px] sm:text-[19px]">
            🌾
          </div>
          <div className="min-w-0 leading-tight">
            <div className="truncate text-[14px] font-bold tracking-[.2px] sm:text-[16px]">{t(language, "appTitle")}</div>
            <div className="hidden truncate text-[11px] opacity-85 sm:block">
              {t(language, "farmSubtitle")} - {variety.icon} {pickLang(language, variety.en, variety.name)}
            </div>
          </div>
        </div>

        <div className="flex flex-none items-center gap-[9px] overflow-x-auto">
          <div className="flex items-center gap-1.5 rounded-lg bg-white/10 py-1 pl-2 pr-2 sm:pl-[11px]">
            <span className="hidden text-[11px] opacity-90 sm:inline">{t(language, "farmSize")}</span>
            <HeaderStepButton onClick={() => onFarmSize(farmSize - 1)}>-</HeaderStepButton>
            <input
              aria-label="Farm size in rai"
              min="1"
              max="500"
              type="number"
              value={farmSize}
              onChange={(event) => onFarmSize(event.target.value)}
              className="h-7 w-11 rounded-md border-0 bg-[#fffdf7] px-1 text-center font-display text-[13px] font-bold text-rice-dark outline-none sm:w-12"
            />
            <HeaderStepButton onClick={() => onFarmSize(farmSize + 1)}>+</HeaderStepButton>
            <span className="hidden text-[11px] opacity-90 sm:inline">{t(language, "rai")}</span>
          </div>

          <div className="hidden gap-1 rounded-lg bg-white/10 p-1 lg:flex">
            <StyleButton active={fieldStyle === "clumps"} onClick={() => onFieldStyle("clumps")}>
              {t(language, "lushClumps")}
            </StyleButton>
            <StyleButton active={fieldStyle === "blades"} onClick={() => onFieldStyle("blades")}>
              {t(language, "fineBlades")}
            </StyleButton>
          </div>

          <HeaderActionButton onClick={onOpenMethodology}>{t(language, "methodologyShort")}</HeaderActionButton>
          <HeaderActionButton onClick={onOpenWizard}>{t(language, "goalWizardShort")}</HeaderActionButton>
          <HeaderActionButton onClick={onOpenExport}>{t(language, "exportShort")}</HeaderActionButton>
          <HeaderActionButton onClick={onOpenGuide}>{t(language, "guideShort")}</HeaderActionButton>

          <button
            type="button"
            onClick={onToggleLanguage}
            className="whitespace-nowrap rounded-lg bg-[#fffdf7] px-3 py-[7px] text-[12px] font-bold text-rice-dark transition hover:bg-white"
            aria-label={t(language, "language")}
          >
            {LANGUAGES[language]} / {language === "th" ? "EN" : "ไทย"}
          </button>

          <button
            type="button"
            onClick={onTogglePanel}
            className="whitespace-nowrap rounded-lg bg-white/10 px-3 py-[7px] text-[12px] font-semibold text-white transition hover:bg-white/20"
          >
            {showPanel ? t(language, "hidePanel") : t(language, "showPanel")}
          </button>
        </div>
      </header>

      <div className="relative flex min-h-0 flex-1">
        {children}
        {!showPanel ? (
          <button
            type="button"
            onClick={onTogglePanel}
            className="absolute right-4 top-[74px] z-20 flex items-center gap-[9px] rounded-lg border border-rice-card bg-[#fffdf7]/95 py-2 pl-[9px] pr-3.5 font-sans shadow-float backdrop-blur"
          >
            <span
              className="flex h-[31px] w-[31px] items-center justify-center rounded-full font-display text-[14px] font-bold text-white"
              style={{ backgroundColor: score.color }}
            >
              {score.growthScore}
            </span>
            <span className="text-left leading-tight">
              <b className="block text-[12px] text-rice-text">{t(language, "health")} {pickLang(language, score.label, score.labelTh)}</b>
              <span className="block text-[10px] text-[#7a8576]">{t(language, "openPanel")}</span>
            </span>
          </button>
        ) : null}
      </div>
    </div>
  );
}

function HeaderActionButton({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="whitespace-nowrap rounded-lg bg-white/10 px-3 py-[7px] text-[12px] font-semibold text-white transition hover:bg-white/20"
    >
      {children}
    </button>
  );
}

function HeaderStepButton({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-5 w-5 items-center justify-center rounded-md bg-[#fffdf7] p-0 text-[15px] font-bold leading-none text-rice-dark transition hover:bg-white"
    >
      {children}
    </button>
  );
}

function StyleButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md px-[11px] py-[5px] text-[11.5px] font-semibold transition ${
        active ? "bg-[#fffdf7] text-rice-dark" : "bg-transparent text-white/75 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}
