import { SCENARIOS } from "../data/mockData.js";

export default function ScenarioSelector({ onSelect }) {
  return (
    <section>
      <div className="control-heading">Preset scenarios</div>
      <div className="text-[10.5px] text-rice-faint">สถานการณ์ตัวอย่าง</div>
      <div className="mt-[9px] grid grid-cols-2 gap-1.5">
        {SCENARIOS.map((scenario) => (
          <button
            type="button"
            key={scenario.key}
            onClick={() => onSelect(scenario.key)}
            className={`rounded-[10px] border border-rice-border bg-white px-[9px] py-2 text-left text-[11px] font-semibold leading-tight text-[#3c473a] transition hover:border-rice-green hover:bg-[#f4faf2] ${
              scenario.wide ? "col-span-2" : ""
            }`}
          >
            {scenario.icon} {scenario.name}
            <span className="mt-0.5 block text-[9px] font-normal text-rice-faint">{scenario.th}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
