import { pickLang, t } from "../i18n.js";
import { formatNumber, signedBaht } from "../utils/format.js";

export default function AutoPlanPanel({ simulation }) {
  const { language, survivalPlans } = simulation;

  return (
    <section className="mt-[9px] rounded-lg border border-[#d8ddd2] bg-[#fbfaf6] px-[13px] py-3">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <div className="text-[11px] font-bold text-[#2f3b34]">{t(language, "autoPlanTitle")}</div>
          <div className="text-[9px] leading-snug text-rice-faint">{t(language, "autoPlanSub")}</div>
        </div>
        <div className="rounded-md bg-white px-2 py-1 text-[8.5px] font-bold text-[#5f755c]">{t(language, "actionable")}</div>
      </div>

      <div className="flex flex-col gap-2">
        {survivalPlans.map((plan) => (
          <PlanCard key={plan.key} language={language} onApply={() => simulation.applySurvivalPlan(plan.key)} plan={plan} />
        ))}
      </div>
    </section>
  );
}

function PlanCard({ language, onApply, plan }) {
  return (
    <div
      className={`rounded-lg border px-2.5 py-2 ${plan.reachesTarget ? "border-[#d7e8cf] bg-[#f4faf2]" : "border-[#eadfbf] bg-[#fffaf0]"}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[10.5px] font-bold text-[#2f3b34]">
            {plan.icon} {pickLang(language, plan.label, plan.labelTh)}
          </div>
          <div className="mt-0.5 text-[8.5px] leading-snug text-rice-muted">{pickLang(language, plan.note, plan.noteTh)}</div>
        </div>
        <button
          type="button"
          onClick={onApply}
          className="flex-none rounded-md bg-rice-green px-2 py-1 text-[9px] font-bold text-white transition hover:bg-rice-dark"
        >
          {t(language, "apply")}
        </button>
      </div>

      <div className="mt-2 grid grid-cols-3 gap-1.5">
        <Mini
          label={t(language, "profitPerRai")}
          value={signedBaht(plan.model.profitPerRai)}
          tone={plan.model.profitPerRai >= 0 ? "good" : "danger"}
        />
        <Mini label={t(language, "estimatedYield")} value={`${formatNumber(plan.model.estimatedYieldKgPerRai)} kg`} />
        <Mini label={t(language, "totalCost")} value={`฿${formatNumber(plan.model.costPerRai)}`} />
      </div>

      <div className="mt-1.5 flex items-center justify-between text-[8.5px] leading-tight">
        <span className="text-rice-faint">{t(language, "profitChange")}</span>
        <span className={`font-display font-bold ${plan.profitDelta >= 0 ? "text-[#2f6b48]" : "text-[#a24b2b]"}`}>
          {signedBaht(plan.profitDelta)}
        </span>
      </div>
    </div>
  );
}

function Mini({ label, tone = "muted", value }) {
  const color = tone === "good" ? "text-[#2f6b48]" : tone === "danger" ? "text-[#a24b2b]" : "text-[#3c473a]";

  return (
    <div className="rounded-md bg-white/75 px-2 py-1.5">
      <div className="truncate text-[8px] text-rice-faint">{label}</div>
      <div className={`font-display text-[10.5px] font-bold ${color}`}>{value}</div>
    </div>
  );
}
