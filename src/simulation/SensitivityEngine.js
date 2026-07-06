import { estimateStrawHarvest } from "./SimulationEngine.js";
import { clamp } from "../utils/format.js";

function roundTo(value, step) {
  return Math.round(value / step) * step;
}

function uniqueSorted(values) {
  return [...new Set(values.map((value) => Math.round(value)))].sort((a, b) => a - b);
}

function profitAt({ inputs, flags, quality, strawPricePerKg, yieldKgPerRai, pricePerTon, costPerRai }) {
  const straw = estimateStrawHarvest(inputs, yieldKgPerRai, { strawPricePerKg }, flags);
  const riceRevenue = Math.round((((yieldKgPerRai * pricePerTon) / 1000) * quality) / 10) * 10;
  const revenue = riceRevenue + straw.revenuePerRai;
  return {
    yieldKgPerRai,
    pricePerTon,
    costPerRai,
    riceRevenue,
    strawRevenue: straw.revenuePerRai,
    revenue,
    profit: revenue - costPerRai,
  };
}

export function buildSensitivityAnalysis({ inputs, model, pricePerTon, strawPricePerKg }) {
  const currentYield = model.estimatedYieldKgPerRai;
  const breakEvenYield = model.financialRisk.breakEvenYieldKgPerRai;
  const breakEvenPrice = model.financialRisk.breakEvenPricePerTon;
  const currentPrice = pricePerTon;
  const currentCost = model.costPerRai;

  const yieldRows = uniqueSorted([
    Math.max(100, roundTo(Math.min(currentYield, breakEvenYield) - 100, 25)),
    roundTo(currentYield, 25),
    roundTo(breakEvenYield, 25),
    roundTo(Math.max(currentYield, breakEvenYield) + 100, 25),
  ]);

  const priceColumns = uniqueSorted([
    clamp(roundTo(Math.min(currentPrice, breakEvenPrice) - 1000, 500), 1000, 99000),
    clamp(roundTo(currentPrice, 500), 1000, 99000),
    clamp(roundTo(breakEvenPrice, 500), 1000, 99000),
    clamp(roundTo(Math.max(currentPrice, breakEvenPrice) + 1000, 500), 1000, 99000),
  ]);

  const context = {
    inputs,
    flags: model.flags,
    quality: model.quality,
    strawPricePerKg,
  };

  const matrix = yieldRows.map((yieldKgPerRai) => ({
    yieldKgPerRai,
    cells: priceColumns.map((price) =>
      profitAt({
        ...context,
        yieldKgPerRai,
        pricePerTon: price,
        costPerRai: currentCost,
      }),
    ),
  }));

  const costLevels = [
    { key: "down", multiplier: 0.9, costPerRai: Math.round(currentCost * 0.9) },
    { key: "current", multiplier: 1, costPerRai: currentCost },
    { key: "up", multiplier: 1.1, costPerRai: Math.round(currentCost * 1.1) },
  ].map((level) => ({
    ...level,
    ...profitAt({
      ...context,
      yieldKgPerRai: currentYield,
      pricePerTon: currentPrice,
      costPerRai: level.costPerRai,
    }),
  }));

  return {
    priceColumns,
    matrix,
    costLevels,
    currentYield,
    currentPrice,
    currentCost,
    breakEvenYield,
    breakEvenPrice,
  };
}
