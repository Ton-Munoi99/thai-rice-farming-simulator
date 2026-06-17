import { FARM_SYSTEM_PRESETS } from "../data/mockData.js";

export default function FarmSystemSelector({ onSelect }) {
  return (
    <section className="mt-3.5">
      <div className="control-heading">Farm system presets</div>
      <div className="text-[10.5px] text-rice-faint">ระบบนา / พื้นที่ตัวอย่าง</div>
      <div className="mt-[9px] grid grid-cols-2 gap-1.5">
        {FARM_SYSTEM_PRESETS.map((preset) => (
          <button
            type="button"
            key={preset.key}
            onClick={() => onSelect(preset.key)}
            className={`rounded-[10px] border border-[#d7e8cf] bg-[#fbfdf8] px-[9px] py-2 text-left text-[11px] font-semibold leading-tight text-[#3c473a] transition hover:border-rice-green hover:bg-[#f1f8ee] ${
              preset.wide ? "col-span-2" : ""
            }`}
          >
            {preset.icon} {preset.name}
            <span className="mt-0.5 block text-[9px] font-normal text-rice-faint">{preset.th}</span>
            <span className="mt-1 block text-[8.5px] font-normal leading-snug text-[#7ba384]">{preset.note}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
