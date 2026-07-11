import { LANGUAGES, pickLang, t } from "../i18n.js";

export default function AppLayout({
  children,
  farmSize,
  hideMobileNav = false,
  language,
  mobileTab,
  showPanel,
  score,
  variety,
  onFarmSize,
  onOpenExport,
  onOpenMethodology,
  onOpenWizard,
  onSetMobileTab,
  onToggleLanguage,
  onTogglePanel,
}) {
  const mobileTabs = [
    { key: "field", icon: "田", label: t(language, "mobileField") },
    { key: "controls", icon: "⚙", label: t(language, "mobileControls") },
    { key: "results", icon: "↗", label: t(language, "mobileResults") },
    { key: "plans", icon: "✓", label: t(language, "mobilePlans") },
    { key: "method", icon: "?", label: t(language, "mobileMethod"), action: onOpenMethodology },
  ];

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-rice-bg text-rice-text">
      <header className="flex h-[58px] flex-none items-center justify-between gap-2 border-b border-[#284d43] bg-rice-dark px-3 text-white sm:gap-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-[32px] w-[32px] flex-none items-center justify-center rounded-lg bg-white/10 text-[18px] sm:h-[34px] sm:w-[34px] sm:text-[19px]">
            🌾
          </div>
          <div className="hidden min-w-0 leading-tight sm:block">
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

          <HeaderActionButton className="hidden md:block" onClick={onOpenMethodology}>
            {t(language, "methodologyShort")}
          </HeaderActionButton>
          <HeaderActionButton className="hidden md:block" onClick={onOpenWizard}>
            {t(language, "goalWizardShort")}
          </HeaderActionButton>
          <HeaderActionButton onClick={onOpenExport}>{t(language, "exportShort")}</HeaderActionButton>

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
            className="hidden whitespace-nowrap rounded-lg bg-white/10 px-3 py-[7px] text-[12px] font-semibold text-white transition hover:bg-white/20 md:block"
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
              <b className="block text-[12px] text-rice-text">
                {t(language, "health")} {pickLang(language, score.label, score.labelTh)}
              </b>
              <span className="block text-[10px] text-[#7a8576]">{t(language, "openPanel")}</span>
            </span>
          </button>
        ) : null}
      </div>

      {!hideMobileNav ? (
        <nav className="fixed bottom-0 left-0 right-0 z-[70] grid grid-cols-5 border-t border-[#d8ddd2] bg-[#fffdf7]/96 px-1.5 py-1.5 shadow-[0_-8px_20px_rgba(47,54,48,.12)] backdrop-blur md:hidden">
          {mobileTabs.map((tab) => {
            const active = mobileTab === tab.key;
            const handleClick = () => {
              if (tab.action) tab.action();
              else onSetMobileTab(tab.key);
            };

            return (
              <button
                key={tab.key}
                type="button"
                onClick={handleClick}
                className={`flex min-w-0 flex-col items-center justify-center rounded-lg px-1 py-1.5 text-[9px] font-bold transition ${
                  active ? "bg-[#edf6e9] text-rice-dark ring-1 ring-rice-green/20" : "text-[#768171] hover:bg-[#f5f3ea]"
                }`}
              >
                <span className="font-display text-[14px] leading-none">{tab.icon}</span>
                <span className="mt-0.5 max-w-full truncate">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      ) : null}
    </div>
  );
}

function HeaderActionButton({ children, className = "", onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`whitespace-nowrap rounded-lg bg-white/10 px-3 py-[7px] text-[12px] font-semibold text-white transition hover:bg-white/20 ${className}`}
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
