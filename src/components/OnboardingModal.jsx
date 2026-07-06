import { t } from "../i18n.js";

export default function OnboardingModal({ language, onClose }) {
  const steps = [
    {
      icon: "🌾",
      title: t(language, "onboardingStepVariety"),
      body: t(language, "onboardingStepVarietyBody"),
    },
    {
      icon: "✅",
      title: t(language, "onboardingStepPreset"),
      body: t(language, "onboardingStepPresetBody"),
    },
    {
      icon: "🧮",
      title: t(language, "onboardingStepAdjust"),
      body: t(language, "onboardingStepAdjustBody"),
    },
  ];

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(37,42,38,.46)] p-4">
      <section className="max-h-[92vh] w-[640px] max-w-[96vw] animate-fade-up overflow-y-auto rounded-xl bg-rice-panel shadow-modal">
        <header className="border-b border-[#d8ddd2] px-5 py-4">
          <div className="text-[11px] font-bold uppercase tracking-[.5px] text-rice-faint">{t(language, "quickStart")}</div>
          <h2 className="mt-0.5 text-[24px] font-bold leading-tight text-[#2f3b34]">{t(language, "onboardingTitle")}</h2>
          <p className="mt-1 text-[11px] leading-snug text-rice-muted">{t(language, "onboardingIntro")}</p>
        </header>

        <div className="grid gap-2 px-5 py-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="rounded-lg border border-[#d8ddd2] bg-[#fffdf7] px-3 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[18px] shadow-soft">{step.icon}</div>
              <div className="mt-3 text-[12px] font-bold text-[#2f3b34]">
                {index + 1}. {step.title}
              </div>
              <div className="mt-1 text-[10px] leading-snug text-rice-muted">{step.body}</div>
            </div>
          ))}
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-[#d8ddd2] px-5 py-4">
          <div className="text-[9.5px] leading-snug text-rice-faint">{t(language, "onboardingNote")}</div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-rice-green px-4 py-2.5 text-[12px] font-bold text-white transition hover:bg-rice-dark"
          >
            {t(language, "startUsing")}
          </button>
        </footer>
      </section>
    </div>
  );
}
