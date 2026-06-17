export default function RecommendationPanel({ risks, actions, compact = false }) {
  return (
    <div className={compact ? "grid gap-3 md:grid-cols-2" : "grid gap-3"}>
      <div>
        <div className="mb-2 text-[12px] font-bold text-[#c2562f]">
          ⚠️ Key risk factors <span className="font-normal text-[#a4ad98]">ปัจจัยเสี่ยง</span>
        </div>
        <div className="flex flex-col gap-[7px]">
          {risks.slice(0, 4).map((risk) => (
            <div key={risk.en} className="rounded-[10px] border border-[#f3ddd1] bg-[#fff5f0] px-[11px] py-[9px] text-[11.5px] text-[#7a3c26]">
              {risk.en}
              <div className="mt-px text-[10px] text-[#b08a78]">{risk.th}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 text-[12px] font-bold text-rice-green">
          ✅ Recommended actions <span className="font-normal text-[#a4ad98]">คำแนะนำ</span>
        </div>
        <div className="flex flex-col gap-[7px]">
          {actions.slice(0, 4).map((action) => (
            <div key={action.en} className="rounded-[10px] border border-[#d7e8cf] bg-[#f1f8ee] px-[11px] py-[9px] text-[11.5px] text-[#2c5e36]">
              {action.en}
              <div className="mt-px text-[10px] text-[#7ba384]">{action.th}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
