import { pickLang, t } from "../i18n.js";

export default function RecommendationPanel({ language, risks, actions, compact = false }) {
  return (
    <div className={compact ? "grid gap-3 md:grid-cols-2" : "grid gap-3"}>
      <div>
        <div className="mb-2 text-[12px] font-bold text-[#c2562f]">
          ⚠️ {t(language, "keyRisks")}
        </div>
        <div className="flex flex-col gap-[7px]">
          {risks.slice(0, 4).map((risk) => (
            <div key={risk.en} className="rounded-[10px] border border-[#f3ddd1] bg-[#fff5f0] px-[11px] py-[9px] text-[11.5px] text-[#7a3c26]">
              {pickLang(language, risk.en, risk.th)}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 text-[12px] font-bold text-rice-green">
          ✅ {t(language, "recommendedActions")}
        </div>
        <div className="flex flex-col gap-[7px]">
          {actions.slice(0, 4).map((action) => (
            <div key={action.en} className="rounded-[10px] border border-[#d7e8cf] bg-[#f1f8ee] px-[11px] py-[9px] text-[11.5px] text-[#2c5e36]">
              {pickLang(language, action.en, action.th)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
