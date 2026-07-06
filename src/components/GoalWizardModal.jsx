import { useMemo, useState } from "react";
import { t } from "../i18n.js";

const targetOptions = [
  { key: 0, en: "Break even first", th: "คุ้มทุนก่อน", noteEn: "Focus on not losing cash.", noteTh: "เน้นไม่ให้ขาดทุนเงินสด" },
  { key: 1000, en: "+1,000 ฿/rai", th: "+1,000 บาท/ไร่", noteEn: "Balanced survival target.", noteTh: "เป้าหมายอยู่รอดแบบสมดุล" },
  {
    key: 1500,
    en: "+1,500 ฿/rai",
    th: "+1,500 บาท/ไร่",
    noteEn: "Needs stronger yield/cost discipline.",
    noteTh: "ต้องดันผลผลิตและคุมต้นทุนมากขึ้น",
  },
];

const waterOptions = [
  { key: "stable", en: "Stable water", th: "น้ำค่อนข้างเสถียร", noteEn: "Use AWD and good timing.", noteTh: "ใช้ AWD และ timing ดี" },
  { key: "limited", en: "Limited water", th: "น้ำจำกัด", noteEn: "Rainfed/drought-safe settings.", noteTh: "ตั้งค่าแบบนาน้ำฝน/เสี่ยงแล้ง" },
  {
    key: "floodRisk",
    en: "Flood risk",
    th: "เสี่ยงน้ำท่วม",
    noteEn: "Higher moisture and harvest risk.",
    noteTh: "เสี่ยงความชื้นและเก็บเกี่ยว",
  },
];

const strawOptions = [
  { key: "normal", en: "Normal straw buyer", th: "ตลาดฟางปกติ", noteEn: "0.75 ฿/kg default.", noteTh: "default 0.75 บาท/กก." },
  { key: "strong", en: "Good straw market", th: "ตลาดฟางดี", noteEn: "Group/direct sale assumption.", noteTh: "สมมติรวมกลุ่ม/ขายตรง" },
  { key: "weak", en: "Weak straw access", th: "ขายฟางยาก", noteEn: "Farm-lot or buyer collects.", noteTh: "ขายเหมาไร่/มีคนมาเก็บเอง" },
];

const costOptions = [
  {
    key: "standard",
    en: "Standard tenant",
    th: "เช่านาทั่วไป",
    noteEn: "Normal rent and hired machinery.",
    noteTh: "มีค่าเช่าและจ้างเครื่องจักร",
  },
  {
    key: "lowCost",
    en: "Own land/machinery",
    th: "มีนา/เครื่องจักรเอง",
    noteEn: "Lower rent and labor pressure.",
    noteTh: "ลดค่าเช่าและแรงงาน",
  },
  { key: "cashTight", en: "Cash-tight", th: "ทุนน้อย", noteEn: "Lower spend, higher field risk.", noteTh: "ลงทุนน้อยแต่เสี่ยงแปลงสูง" },
];

export default function GoalWizardModal({ simulation, onClose }) {
  const { language } = simulation;
  const [targetProfit, setTargetProfit] = useState(1000);
  const [waterAccess, setWaterAccess] = useState("stable");
  const [strawMarket, setStrawMarket] = useState("normal");
  const [costBase, setCostBase] = useState("standard");

  const recommendation = useMemo(() => {
    const notes = [];
    notes.push(targetProfit >= 1000 ? t(language, "wizardRecYield") : t(language, "wizardRecCost"));
    notes.push(waterAccess === "limited" ? t(language, "wizardRecWaterLimited") : t(language, "wizardRecWaterStable"));
    notes.push(strawMarket === "strong" ? t(language, "wizardRecStrawStrong") : t(language, "wizardRecStrawNormal"));
    notes.push(costBase === "lowCost" ? t(language, "wizardRecLowCost") : t(language, "wizardRecStandardCost"));
    return notes;
  }, [costBase, language, strawMarket, targetProfit, waterAccess]);

  const apply = () => {
    simulation.applyGoalWizardRecommendation({ costBase, strawMarket, targetProfit, waterAccess });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1e2f28]/55 px-3 py-5 backdrop-blur-sm">
      <section className="max-h-[92vh] w-full max-w-[760px] overflow-y-auto rounded-2xl border border-[#d8ddd2] bg-[#fffdf8] shadow-float">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[#ebe7dd] bg-[#fffdf8]/95 px-5 py-4 backdrop-blur">
          <div>
            <div className="text-[12px] font-bold uppercase tracking-[.08em] text-rice-green">{t(language, "goalWizardShort")}</div>
            <h2 className="font-display text-[24px] font-bold text-[#2f3b34]">{t(language, "goalWizardTitle")}</h2>
            <p className="mt-1 max-w-[560px] text-[12px] leading-relaxed text-rice-faint">{t(language, "goalWizardSub")}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#ded8cb] bg-white px-3 py-1.5 text-[11px] font-bold text-[#3c473a]"
          >
            {t(language, "close")}
          </button>
        </div>

        <div className="grid gap-4 px-5 py-5 md:grid-cols-[1fr_260px]">
          <div className="space-y-4">
            <WizardGroup title={t(language, "wizardTargetProfit")}>
              <OptionGrid language={language} options={targetOptions} value={targetProfit} onChange={setTargetProfit} />
            </WizardGroup>
            <WizardGroup title={t(language, "wizardWaterAccess")}>
              <OptionGrid language={language} options={waterOptions} value={waterAccess} onChange={setWaterAccess} />
            </WizardGroup>
            <WizardGroup title={t(language, "wizardStrawMarket")}>
              <OptionGrid language={language} options={strawOptions} value={strawMarket} onChange={setStrawMarket} />
            </WizardGroup>
            <WizardGroup title={t(language, "wizardCostBase")}>
              <OptionGrid language={language} options={costOptions} value={costBase} onChange={setCostBase} />
            </WizardGroup>
          </div>

          <aside className="rounded-xl border border-[#d7e8cf] bg-[#f4faf2] px-4 py-4">
            <div className="text-[12px] font-bold text-[#2f6b48]">{t(language, "wizardRecommendedSetup")}</div>
            <div className="mt-2 space-y-2">
              {recommendation.map((note) => (
                <div key={note} className="rounded-lg bg-white/85 px-3 py-2 text-[11px] leading-snug text-[#3c473a]">
                  {note}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={apply}
              className="mt-4 w-full rounded-lg bg-rice-green px-4 py-2.5 text-[12px] font-bold text-white shadow-sm transition hover:bg-[#257a42]"
            >
              {t(language, "wizardApply")}
            </button>
            <p className="mt-3 text-[10px] leading-relaxed text-rice-faint">{t(language, "wizardNote")}</p>
          </aside>
        </div>
      </section>
    </div>
  );
}

function WizardGroup({ children, title }) {
  return (
    <div>
      <div className="mb-2 text-[12px] font-bold text-[#3c473a]">{title}</div>
      {children}
    </div>
  );
}

function OptionGrid({ language, onChange, options, value }) {
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {options.map((option) => {
        const active = option.key === value;
        return (
          <button
            key={option.key}
            type="button"
            onClick={() => onChange(option.key)}
            className={`rounded-xl border px-3 py-3 text-left transition ${
              active
                ? "border-rice-green bg-[#eef8ee] text-[#244532] shadow-sm"
                : "border-[#ded8cb] bg-white text-[#3c473a] hover:border-[#bdd5b8]"
            }`}
          >
            <div className="text-[12px] font-bold">{language === "th" ? option.th : option.en}</div>
            <div className="mt-1 text-[10px] leading-snug text-rice-faint">{language === "th" ? option.noteTh : option.noteEn}</div>
          </button>
        );
      })}
    </div>
  );
}
