import { pickLang, t } from "../i18n.js";
import DataQualityBadge from "./DataQualityBadge.jsx";

const guardrails = [
  {
    key: "fertilizer",
    icon: "🌱",
    level: "medium",
    title: "Fertilizer plan",
    titleTh: "สูตรปุ๋ย",
    body: "Use as a planning suggestion. Soil test, local variety response, and field history should override the default.",
    bodyTh: "ใช้เป็นข้อเสนอเพื่อวางแผน ควรให้ผลตรวจดิน พันธุ์ในพื้นที่ และประวัติแปลงจริงมาก่อน default",
  },
  {
    key: "chemicals",
    icon: "🛡️",
    level: "medium",
    title: "Chemical/IPM cost",
    titleTh: "ค่ายา/IPM",
    body: "Higher pest, disease, or weed pressure increases chemical cost, but actual spraying should follow scouting and label guidance.",
    bodyTh: "แรงกดดันโรคแมลงวัชพืชสูงขึ้นจะดันค่ายา แต่การฉีดจริงควรดูการสำรวจแปลงและฉลากยา",
  },
  {
    key: "finance",
    icon: "฿",
    level: "medium",
    title: "Finance result",
    titleTh: "ผลการเงิน",
    body: "Profit is linked to user price, cost, yield, and straw settings. Market price is not forecast by the simulator.",
    bodyTh: "กำไรผูกกับราคา ต้นทุน ผลผลิต และฟางที่ผู้ใช้ตั้ง ระบบไม่ได้พยากรณ์ราคาตลาด",
  },
  {
    key: "carbon",
    icon: "🌍",
    level: "low",
    title: "Carbon value",
    titleTh: "มูลค่าคาร์บอน",
    body: "Carbon is a rough optional layer and should not be counted as income without a real project contract.",
    bodyTh: "คาร์บอนเป็นชั้นข้อมูลคร่าว ๆ ไม่ควรนับเป็นรายได้ถ้าไม่มีสัญญาโครงการจริง",
  },
];

export default function DecisionGuardrailPanel({ simulation }) {
  const { language } = simulation;

  return (
    <section className="mt-3.5 rounded-[13px] border border-[#eadfbf] bg-[#fffaf0] px-[13px] py-3">
      <div className="mb-2">
        <div className="text-[11px] font-bold text-[#3c473a]">{t(language, "decisionGuardrails")}</div>
        <div className="text-[9.5px] leading-snug text-rice-faint">{t(language, "decisionGuardrailsSub")}</div>
      </div>
      <div className="space-y-1.5">
        {guardrails.map((item) => (
          <div key={item.key} className="rounded-lg border border-[#efe3c8] bg-white/70 px-2.5 py-2">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-[#3c473a]">
                  <span className="mr-1">{item.icon}</span>
                  {pickLang(language, item.title, item.titleTh)}
                </div>
                <div className="mt-0.5 text-[9px] leading-snug text-rice-faint">
                  {pickLang(language, item.body, item.bodyTh)}
                </div>
              </div>
              <DataQualityBadge language={language} level={item.level} compact />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
