import { pickLang, t } from "../i18n.js";

export default function RiceFieldAnimation({ simulation }) {
  const { field, stage, displayStageIndex, phase, liveModel, language } = simulation;

  return (
    <section className="relative min-h-0 flex-1 overflow-auto">
      <div className="flex min-h-full min-w-full items-center justify-center p-3">
        <div className="relative flex-none" style={{ width: field.sceneW, height: field.sceneH }}>
          <Sky fx={field.fx} />
          <RuralScenery />
          <Plot field={field} condition={liveModel.condition} />
          {phase !== "setup" ? <StageCaption language={language} stage={stage} index={displayStageIndex} /> : null}
          {field.awd ? (
            <Badge className="bottom-3.5 left-[84px] bg-[#217696]/95">
              💧 {language === "th" ? "ระบบน้ำ AWD · เปียกสลับแห้ง" : "AWD water system"}
            </Badge>
          ) : null}
          {phase === "setup" ? (
            <Badge className="bottom-3.5 right-4 bg-rice-text/85">
              <span className="inline-block h-2 w-2 rounded-full bg-rice-amber animate-shimmer" />
              {language === "th" ? "ปรับเงื่อนไข แล้วกด" : "Adjust conditions, then press"} <b>{t(language, "runSimulation")}</b>
            </Badge>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function Sky({ fx }) {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[18px] transition-colors duration-1000" style={{ background: fx.sky }}>
      {fx.sun ? (
        <>
          <div
            className="absolute z-0 animate-shimmer rounded-full"
            style={{
              left: fx.sun.left - 30,
              top: -4,
              width: 120,
              height: 120,
              background: `radial-gradient(circle, ${fx.sun.glow}aa, ${fx.sun.glow}00 70%)`,
            }}
          />
          <div
            className="absolute top-[26px] z-[1] rounded-full"
            style={{
              left: fx.sun.left,
              width: fx.sun.size,
              height: fx.sun.size,
              background: `radial-gradient(circle at 38% 38%, ${fx.sun.disc[0]}, ${fx.sun.disc[1]})`,
              boxShadow: `0 0 30px 8px ${fx.sun.disc[1]}55`,
            }}
          />
        </>
      ) : null}
      {fx.clouds.map((cloud, index) => (
        <div
          key={`cloud-${index}`}
          className="absolute left-[-120px] animate-drift rounded-[40px] blur-[1px]"
          style={{
            top: cloud.top,
            width: 120 * cloud.scale,
            height: 40 * cloud.scale,
            background: cloud.color,
            opacity: cloud.opacity,
            boxShadow: `${30 * cloud.scale}px 6px 0 -4px ${cloud.color}, ${-26 * cloud.scale}px 8px 0 -6px ${cloud.color}`,
            animationDuration: `${cloud.duration}s`,
            animationDelay: `${cloud.delay}s`,
          }}
        />
      ))}
      {fx.rain.map((drop, index) => (
        <div
          key={`rain-${index}`}
          className="absolute top-[-30px] w-0.5 animate-fall rounded-sm"
          style={{
            left: drop.x,
            height: drop.height,
            background: "linear-gradient(rgba(180,205,225,0), rgba(150,185,215,.8))",
            animationDuration: `${drop.duration}s`,
            animationDelay: `${drop.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

function RuralScenery() {
  return (
    <>
      <div className="absolute bottom-0 left-0 right-0 top-[165px] z-[1] overflow-hidden rounded-b-[18px] bg-gradient-to-b from-[#d6e3b6] via-[#c6da9f] to-[#b6d08c]" />
      <div className="absolute left-0 right-0 top-[150px] z-[1] h-[46px] overflow-hidden">
        {[
          ["2%", 150, 42, "#a3c47f"],
          ["18%", 120, 34, "#94ba6f"],
          ["34%", 170, 46, "#9ec078"],
          ["55%", 130, 36, "#8fb568"],
          ["70%", 160, 44, "#a3c47f"],
          ["88%", 120, 34, "#94ba6f"],
        ].map(([left, width, height, color]) => (
          <div key={left} className="absolute bottom-0 rounded-t-full" style={{ left, width, height, background: color }} />
        ))}
      </div>
      <Farmhouse />
      <Barn />
      <Palm />
      <Banana />
    </>
  );
}

function Farmhouse() {
  return (
    <div className="absolute left-[26px] top-[150px] z-[2] h-[98px] w-[118px]">
      <div className="absolute left-[7px] top-1.5 h-0 w-0 border-b-[32px] border-l-[52px] border-r-[52px] border-b-[#9a6a44] border-l-transparent border-r-transparent" />
      <div className="absolute left-0.5 top-9 h-1.5 w-[114px] rounded-sm bg-[#7c5132]" />
      <div className="absolute left-6 top-[42px] h-[34px] w-[70px] bg-gradient-to-b from-[#cda06d] to-[#b3814f]" />
      <div className="absolute left-[52px] top-[52px] h-6 w-[15px] bg-[#6e4628]" />
      <div className="absolute left-[31px] top-[50px] h-[11px] w-[13px] bg-[#7a5232] shadow-[inset_0_0_0_1px_rgba(255,255,255,.25)]" />
      <div className="absolute left-[30px] top-[76px] h-[18px] w-[5px] bg-[#6e4628]" />
      <div className="absolute left-[83px] top-[76px] h-[18px] w-[5px] bg-[#6e4628]" />
      <div className="absolute left-[124px] top-0 h-[78px] w-12">
        <div className="absolute left-5 top-10 h-9 w-[7px] bg-[#7a5232]" />
        <div className="absolute left-0 top-1 h-12 w-12 rounded-full bg-[radial-gradient(circle_at_38%_34%,#6fb05a,#3f8b46)]" />
      </div>
    </div>
  );
}

function Barn() {
  return (
    <div className="absolute right-6 top-[138px] z-[2] h-28 w-[130px]">
      <div className="absolute left-[11px] top-0.5 h-0 w-0 border-b-[38px] border-l-[54px] border-r-[54px] border-b-[#a23f22] border-l-transparent border-r-transparent" />
      <div className="absolute left-1.5 top-10 h-[7px] w-[118px] rounded-sm bg-[#7e3018]" />
      <div className="absolute left-5 top-[46px] h-10 w-[90px] bg-gradient-to-b from-[#caa46f] to-[#9f7a4a]" />
      <div className="absolute left-[55px] top-[58px] h-6 w-5 bg-[#6e4628]" />
      <div className="absolute left-[30px] top-[86px] h-[18px] w-1.5 bg-[#5f3d24]" />
      <div className="absolute left-[94px] top-[86px] h-[18px] w-1.5 bg-[#5f3d24]" />
    </div>
  );
}

function Palm() {
  return (
    <div className="absolute right-40 top-[120px] z-[2] h-24 w-[54px]">
      <div className="absolute left-6 top-[26px] h-16 w-[5px] origin-bottom -rotate-[5deg] bg-gradient-to-b from-[#8a6a44] to-[#6e4f30]" />
      {[
        [-34, 6, 20, "#3f8f4e"],
        [-8, 18, 14, "#46994f"],
        [18, 4, 16, "#46994f"],
        [36, 20, 18, "#3f8f4e"],
      ].map(([rotate, left, top, color]) => (
        <div
          key={`${rotate}-${left}`}
          className="absolute h-[9px] w-8 rounded-[70%_0_70%_0]"
          style={{ left, top, background: color, transform: `rotate(${rotate}deg)` }}
        />
      ))}
    </div>
  );
}

function Banana() {
  return (
    <div className="absolute bottom-1.5 left-0.5 z-[6] h-[92px] w-[70px]">
      <div className="absolute bottom-0 left-[30px] h-12 w-[7px] bg-gradient-to-b from-[#7fa050] to-[#5f7d38]" />
      <div className="absolute bottom-[34px] left-1.5 h-4 w-[54px] origin-right -rotate-[22deg] rounded-[60%_40%_50%_50%] bg-[#4d8f3f]" />
      <div className="absolute bottom-[46px] left-2 h-4 w-14 origin-left rotate-[14deg] rounded-[40%_60%_50%_50%] bg-[#3f8336]" />
      <div className="absolute bottom-[58px] left-0.5 h-[15px] w-[50px] origin-right -rotate-6 rounded-[60%_40%_50%_50%] bg-[#4d8f3f]" />
    </div>
  );
}

function Plot({ field, condition }) {
  const fx = field.fx;

  return (
    <div className="absolute bottom-0 left-0 right-0 top-[165px] z-[3]">
      <div className="absolute inset-0">
        <div className="absolute bottom-[8%] left-[2%] right-[2%] top-[2%] z-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(120,95,60,0),rgba(70,55,34,.16))]" />
        {field.channels.map((channel, index) => (
          <div
            key={`channel-${index}`}
            className="absolute z-[1] h-2 animate-flow rounded-[5px] bg-[linear-gradient(90deg,rgba(86,156,205,.9),rgba(130,195,230,.72),rgba(86,156,205,.9))] bg-[length:200%_100%] shadow-[inset_0_1px_2px_rgba(255,255,255,.45),0_1px_2px_rgba(0,0,0,.08)]"
            style={{
              left: channel.x,
              top: channel.y,
              width: channel.length,
              marginTop: -4,
              transform: `rotate(${channel.angle}deg)`,
              transformOrigin: "left center",
            }}
          />
        ))}
        {fx.showWater ? (
          <div className="absolute bottom-[14%] left-[8%] right-[8%] top-[2%] z-[2] animate-shimmer [clip-path:polygon(50%_0,100%_42%,50%_100%,0_42%)] bg-[linear-gradient(180deg,rgba(70,150,200,.50),rgba(50,120,175,.62))]" />
        ) : null}
        {field.plants.map((cell) => (
          <RiceCell key={cell.id} cell={cell} />
        ))}
        {field.fx.spots.map((spot, index) => (
          <div
            key={`spot-${index}`}
            className="absolute z-[85] rounded-full bg-[radial-gradient(circle,#8a5a1e,rgba(138,90,30,0))] opacity-80"
            style={{ left: spot.x, top: spot.y, width: spot.size, height: spot.size }}
          />
        ))}
        {field.fx.insects.map((insect, index) => (
          <div
            key={`insect-${index}`}
            className={`absolute z-[90] h-1.5 w-[9px] rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-[radial-gradient(circle_at_40%_40%,#5a3b1c,#2e1c0a)] shadow-[-4px_-1px_0_-2px_rgba(255,255,255,.5),4px_-1px_0_-2px_rgba(255,255,255,.5)] animate-bug-${insect.path}`}
            style={{
              left: insect.x,
              top: insect.y,
              animationDuration: `${insect.duration}s`,
              animationDelay: `${insect.delay}s`,
            }}
          />
        ))}
        <Pump show={condition.pumpActive} />
      </div>
    </div>
  );
}

function RiceCell({ cell }) {
  return (
    <div className="absolute h-0 w-0" style={{ left: cell.x, top: cell.y, zIndex: cell.z }}>
      <div
        className="absolute [clip-path:polygon(50%_0,100%_50%,50%_100%,0_50%)] transition-colors duration-1000"
        style={{
          left: -cell.tw / 2,
          top: -cell.th / 2,
          width: cell.tw,
          height: cell.th,
          ...cell.soilStyle,
        }}
      />
      {cell.showPlant ? (
        <div className="absolute left-0 top-0 h-0 w-0 origin-bottom transition-transform duration-[1500ms]" style={cell.growthStyle}>
          <div
            className="absolute left-1/2 top-[-2px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(35,30,18,.38),rgba(35,30,18,0)_70%)]"
            style={cell.plantShadowStyle}
          />
          <div className="absolute bottom-0 left-0 h-0 w-0 origin-bottom" style={cell.swayStyle}>
            <div
              className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 rounded-[50%] bg-[linear-gradient(180deg,rgba(72,126,54,.72),rgba(45,82,35,.9))] shadow-[inset_0_1px_0_rgba(255,255,255,.18)]"
              style={cell.clumpBaseStyle}
            />
            {cell.leaves.map((leaf, index) => (
              <div key={index} className="rice-leaf absolute bottom-0 left-1/2 origin-bottom" style={leaf} />
            ))}
            {cell.showPanicle ? (
              <div
                className="rice-panicle absolute left-1/2 origin-bottom rounded-[4px]"
                style={{ marginLeft: -2.5, ...cell.panicleStyle }}
              />
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Pump({ show }) {
  if (!show) return null;

  return (
    <>
      <div className="absolute left-[18px] top-2.5 z-[80] h-[52px] w-10">
        <div className="absolute bottom-0 left-1.5 h-[30px] w-6 rounded-[5px] bg-gradient-to-b from-rice-blue to-[#2877a8] shadow-[0_2px_6px_rgba(0,0,0,.25)]" />
        <div className="absolute left-6 top-3 h-1.5 w-[18px] rounded-[3px] bg-[#2877a8]" />
        {[0, 1, 2].map((drop) => (
          <div
            key={drop}
            className="absolute left-10 h-[7px] w-[5px] animate-droplet rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-[#5bb6e8]"
            style={{ top: 16 + drop * 2, animationDelay: `${drop * 0.26}s` }}
          />
        ))}
      </div>
      <div className="absolute left-[52px] top-[58px] z-[79] h-2.5 w-[120px] animate-wave rounded-[5px] bg-[linear-gradient(90deg,rgba(91,182,232,.85),rgba(91,182,232,.2))]" />
    </>
  );
}

function StageCaption({ language, stage, index }) {
  return (
    <div className="absolute left-[18px] top-3.5 z-[9] rounded-[11px] bg-white/85 px-[13px] py-2 shadow-soft backdrop-blur">
      <div className="text-[10px] font-bold tracking-[.5px] text-rice-green">STAGE {String(index + 1).padStart(2, "0")} / 07</div>
      <div className="text-[15px] font-bold leading-tight">{pickLang(language, stage.name, stage.th)}</div>
      {language === "en" ? <div className="text-[11px] text-[#7a8576]">{stage.desc}</div> : null}
    </div>
  );
}

function Badge({ children, className = "" }) {
  return (
    <div className={`absolute z-[9] flex items-center gap-2 rounded-[11px] px-3.5 py-2 text-[11.5px] text-white shadow-soft ${className}`}>
      {children}
    </div>
  );
}
