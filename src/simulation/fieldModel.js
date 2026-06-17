import { clamp } from "../utils/format.js";

const TILE_WIDTH = 70;
const TILE_HEIGHT = 35;
const SIDE_MARGIN = 160;
const PLANE_TOP = 165;
const BOTTOM_MARGIN = 92;

function seededRandom(seed) {
  const x = Math.sin(seed * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export function gridForFarmSize(rai) {
  const scale = Math.sqrt(Math.max(1, rai) / 10);
  return {
    cols: clamp(Math.round(9 * scale), 4, 20),
    rows: clamp(Math.round(7 * scale), 3, 15),
  };
}

export function buildCells(fieldStyle, cols, rows) {
  const raw = [];
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const isoX = ((col - row) * TILE_WIDTH) / 2;
      const isoY = ((col + row) * TILE_HEIGHT) / 2;
      minX = Math.min(minX, isoX);
      maxX = Math.max(maxX, isoX);
      minY = Math.min(minY, isoY);
      maxY = Math.max(maxY, isoY);
      raw.push({ col, row, isoX, isoY, sum: col + row });
    }
  }

  const plotW = maxX + TILE_WIDTH / 2 - (minX - TILE_WIDTH / 2);
  const plotH = maxY + TILE_HEIGHT / 2 - (minY - TILE_HEIGHT / 2);
  const baseMinX = minX - TILE_WIDTH / 2;
  const baseMinY = minY - TILE_HEIGHT / 2;
  const isFineBlade = fieldStyle === "blades";

  return {
    sceneW: Math.max(760, Math.round(plotW + SIDE_MARGIN * 2)),
    sceneH: Math.max(470, Math.round(PLANE_TOP + plotH + BOTTOM_MARGIN)),
    cols,
    rows,
    cells: raw.map((cell, index) => {
      const depth = cell.sum / Math.max(1, cols + rows - 2);
      const leafCount = isFineBlade ? 9 : 7;
      const leaves = Array.from({ length: leafCount }, (_, leafIndex) => {
        const centered = leafCount <= 1 ? 0 : leafIndex / (leafCount - 1) - 0.5;
        const jitter = seededRandom((index + 1) * 9 + leafIndex * 3.3);
        const side = leafIndex % 2 === 0 ? -1 : 1;
        return {
          rotation: centered * (isFineBlade ? 104 : 88) + (jitter - 0.5) * 18,
          length: (isFineBlade ? 48 : 42) + jitter * (isFineBlade ? 14 : 16) - Math.abs(centered) * 8,
          width: isFineBlade ? 2.2 + jitter * 1.2 : 4.6 + jitter * 2.1,
          x: side * (1.2 + jitter * 3.8) + centered * 2,
          brightness: jitter - 0.5,
        };
      });

      const swaySeed = seededRandom((index + 1) * 3.7);

      return {
        id: index,
        col: cell.col,
        row: cell.row,
        x: cell.isoX - baseMinX + SIDE_MARGIN,
        y: cell.isoY - baseMinY,
        z: cell.sum,
        depth,
        scale: 0.86 + depth * 0.32,
        tw: TILE_WIDTH,
        th: TILE_HEIGHT,
        soilTone: seededRandom((index + 1) * 5.1),
        damaged: seededRandom((index + 1) * 2.3),
        swayDur: 2.6 + swaySeed * 1.8,
        swayDelay: swaySeed * -2.5,
        swayName: index % 2 === 0 ? "sway" : "swayB",
        leaves,
        baseSpread: isFineBlade ? 19 + seededRandom((index + 1) * 6.7) * 7 : 23 + seededRandom((index + 1) * 6.7) * 9,
      };
    }),
  };
}

function leafColor(condition, ripe, jitter) {
  let h;
  let s;
  let l;
  const green = condition.greenness;

  if (green < 0) {
    h = 125 + green * 55;
    s = 58 + green * 6;
    l = 37 - green * 15;
  } else {
    h = 125 + green * 12;
    s = 58 + green * 9;
    l = 37 - green * 16;
  }

  if (condition.shortage) {
    s -= 24;
    h -= 14;
    l -= 2;
  }

  if (condition.flooded) {
    h -= 22;
    s -= 6;
    l += 4;
  }

  const gold = ripe * condition.goldenness;
  h += (45 - h) * gold;
  s += (72 - s) * gold * 0.9;
  l += (54 - l) * gold;

  if (ripe > 0.6 && condition.goldenness < 0.5) {
    const brown = 0.6 - condition.goldenness;
    h += (32 - h) * brown;
    s -= 12 * brown;
    l -= 6 * brown;
  }

  h += jitter * 7;
  s = clamp(s, 18, 80);
  l = clamp(l + jitter * 6, 12, 66);
  const l2 = clamp(l + 9, 16, 72);

  return `linear-gradient(to top, hsl(${h.toFixed(0)}, ${s.toFixed(0)}%, ${(l - 6).toFixed(
    0,
  )}%), hsl(${h.toFixed(0)}, ${s.toFixed(0)}%, ${l2.toFixed(0)}%))`;
}

export function buildPlantVisuals(cells, condition, stageFraction) {
  const showPlant = stageFraction > 0.02;
  const ripe = clamp((stageFraction - 0.55) / 0.45, 0, 1);

  return cells.map((cell) => {
    const damageThreshold = 1 - ((condition.pest * 0.5 + condition.disease * 0.5) / 100) * 0.55;
    const isDamaged = cell.damaged > damageThreshold && stageFraction > 0.3;
    const baseHeight = 76;
    const height = baseHeight * stageFraction * condition.vigor * cell.scale * (isDamaged ? 0.52 : 1);
    const lodging = condition.lodging ? 10 + cell.soilTone * 10 : 0;

    const soilHue = condition.shortage ? 30 : 28;
    const soilSat = condition.shortage ? 34 : condition.flooded ? 22 : 40;
    const soilLight = condition.shortage ? 40 + cell.soilTone * 8 : condition.flooded ? 30 + cell.soilTone * 6 : 30 + cell.soilTone * 7;

    const leafAmount = Math.min(
      cell.leaves.length,
      Math.max(1, Math.round(cell.leaves.length * (isDamaged ? 0.48 : 0.6 + condition.density * 0.5))),
    );

    const stageScale = clamp(stageFraction * 1.28, 0.18, 1.18);
    const leaves = cell.leaves.slice(0, leafAmount).map((leaf, leafIndex) => {
      const curl = condition.shortage ? 14 : 0;
      const leafHeight = clamp(leaf.length * stageScale * condition.vigor * cell.scale * (isDamaged ? 0.64 : 1), 8, height * 1.05);
      const leafWidth = leaf.width * clamp(0.72 + stageFraction * 0.5, 0.7, 1.15);
      const droop = stageFraction > 0.72 ? (stageFraction - 0.72) * 18 * (leaf.rotation > 0 ? 1 : -1) : 0;
      return {
        width: `${leafWidth.toFixed(1)}px`,
        height: `${leafHeight.toFixed(0)}px`,
        marginLeft: `${(-leafWidth / 2 + leaf.x).toFixed(1)}px`,
        opacity: clamp(0.62 + stageFraction * 0.42 - (isDamaged && leafIndex > leafAmount * 0.55 ? 0.25 : 0), 0.45, 1),
        background: leafColor(condition, ripe, leaf.brightness + (isDamaged ? -0.25 : 0)),
        transform: `rotate(${(leaf.rotation + droop + curl * (leaf.rotation > 0 ? 1 : -1)).toFixed(1)}deg)`,
      };
    });

    const showPanicle = stageFraction >= 0.7 && !isDamaged;
    const panGold = clamp((stageFraction - 0.7) / 0.3, 0, 1) * condition.goldenness;
    const panicleHue = panGold > 0.4 ? 45 : 95;
    const panicleSat = panGold > 0.4 ? 78 : 45;
    const panicleLight = panGold > 0.4 ? 58 - ripe * 8 : 46;

    return {
      ...cell,
      showPlant,
      soilStyle: {
        background: `linear-gradient(160deg, hsl(${soilHue}, ${soilSat}%, ${soilLight + 9}%), hsl(${soilHue}, ${soilSat}%, ${
          soilLight - 5
        }%) 68%, hsl(${soilHue}, ${soilSat}%, ${soilLight - 9}%))`,
        boxShadow: condition.flooded
          ? "inset 0 0 0 1px rgba(255,255,255,.12), inset 0 10px 16px rgba(83,157,193,.34)"
          : "inset 0 0 0 1px rgba(255,255,255,.08), inset 0 -8px 12px rgba(62,45,26,.18)",
      },
      growthStyle: {
        transform: `translate(-50%, ${(cell.th * 0.12).toFixed(0)}px) rotate(${lodging.toFixed(0)}deg)`,
      },
      swayStyle: {
        animation: `${cell.swayName} ${cell.swayDur.toFixed(2)}s ease-in-out ${cell.swayDelay.toFixed(2)}s infinite`,
      },
      clumpBaseStyle: {
        width: `${(cell.baseSpread * clamp(0.55 + stageFraction * 0.65, 0.55, 1.18) * condition.density).toFixed(0)}px`,
        height: `${(7 + stageFraction * 7).toFixed(0)}px`,
        opacity: clamp(0.55 + stageFraction * 0.35, 0.45, 0.9),
      },
      plantShadowStyle: {
        width: `${(cell.baseSpread * 1.45 * clamp(condition.density, 0.42, 1)).toFixed(0)}px`,
        height: `${(cell.th * 0.22).toFixed(0)}px`,
        opacity: clamp(0.08 + stageFraction * 0.18, 0.06, 0.24),
      },
      leaves,
      showPanicle,
      panicleStyle: showPanicle
        ? {
            bottom: `${(height * 0.68).toFixed(0)}px`,
            height: `${(20 + ripe * 16).toFixed(0)}px`,
            width: `${(4 + ripe * 1.2).toFixed(1)}px`,
            background: `linear-gradient(to bottom, hsl(${panicleHue}, ${panicleSat}%, ${
              panicleLight + 8
            }%), hsl(${panicleHue}, ${panicleSat}%, ${panicleLight - 6}%))`,
            transform: `rotate(${(10 + ripe * 25).toFixed(0)}deg)`,
            boxShadow: `0 0 0 1px hsl(${panicleHue}, ${panicleSat}%, ${panicleLight - 12}%), 5px 3px 0 -3px hsla(${panicleHue}, ${panicleSat}%, ${panicleLight - 10}%, .6)`,
          }
        : null,
    };
  });
}

export function buildChannels(cells, cols, rows) {
  const find = (col, row) => cells.find((cell) => cell.col === col && cell.row === row);
  const channels = [];
  const step = Math.max(1, Math.round(rows / 4));

  for (let row = 0; row < rows; row += step) {
    const start = find(0, row);
    const end = find(cols - 1, row);
    if (!start || !end) continue;

    const yOffset = start.th * 0.5;
    const x0 = start.x;
    const y0 = start.y + yOffset;
    const x1 = end.x;
    const y1 = end.y + yOffset;
    const dx = x1 - x0;
    const dy = y1 - y0;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

    channels.push({ x: x0, y: y0, length, angle });
  }

  return channels;
}

export function buildWeatherFx(condition, sceneW, sceneH) {
  const weather = condition.weather;
  const sky =
    weather === "Good Monsoon"
      ? "linear-gradient(180deg, #bfe3ff, #eaf7ef)"
      : weather === "Normal"
        ? "linear-gradient(180deg, #cfe9fb, #f0f8ef)"
        : weather === "Drought"
          ? "linear-gradient(180deg, #f4e6bd, #fbf2d8)"
          : "linear-gradient(180deg, #8ea4b6, #c2cdd4)";

  const sun =
    weather === "Heavy Rain / Flood"
      ? null
      : {
          size: weather === "Drought" ? 76 : weather === "Good Monsoon" ? 62 : 54,
          left: sceneW - (weather === "Drought" ? 198 : 190),
          disc: weather === "Drought" ? ["#ffd27a", "#ff9d3d"] : weather === "Good Monsoon" ? ["#ffe08a", "#ffc83d"] : ["#fff0b8", "#ffd969"],
          glow: weather === "Drought" ? "#ffe6a8" : weather === "Good Monsoon" ? "#fff4cf" : "#fffadf",
        };

  const cloudColor = weather === "Heavy Rain / Flood" ? "#7e8e9c" : weather === "Drought" ? "#efe2c2" : "#ffffff";
  const clouds = Array.from({ length: weather === "Heavy Rain / Flood" ? 3 : 2 }, (_, index) => ({
    top: 20 + index * 34 + index * 11,
    scale: 0.8 + index * 0.25,
    duration: 26 + index * 9,
    delay: index * -7,
    color: cloudColor,
    opacity: weather === "Drought" ? 0.55 : 0.85,
  }));

  const rain =
    weather === "Heavy Rain / Flood"
      ? Array.from({ length: Math.round(sceneW / 17) }, (_, index) => ({
          x: seededRandom(index * 1.7) * sceneW,
          height: 12 + seededRandom(index) * 8,
          duration: 0.6 + seededRandom(index * 0.9) * 0.5,
          delay: seededRandom(index * 2.3) * 1.2,
        }))
      : [];

  const yTop = 170;
  const yRange = Math.max(120, sceneH - 260);
  const insects =
    condition.pest > 30
      ? Array.from({ length: Math.min(14, Math.round(condition.pest / 9)) }, (_, index) => ({
          x: 120 + seededRandom(index * 3.1) * (sceneW - 240),
          y: yTop + seededRandom(index * 5.7) * yRange,
          path: (index % 4) + 1,
          duration: 3 + seededRandom(index) * 3,
          delay: index * -0.6,
        }))
      : [];

  const spots =
    condition.disease > 35
      ? Array.from({ length: Math.min(22, Math.round(condition.disease / 5)) }, (_, index) => ({
          x: 120 + seededRandom(index * 4.4) * (sceneW - 240),
          y: yTop + seededRandom(index * 6.1) * yRange,
          size: 4 + seededRandom(index * 2) * 4,
        }))
      : [];

  const showWater = condition.flooded || weather === "Heavy Rain / Flood";

  return { sky, sun, clouds, rain, insects, spots, showWater };
}
