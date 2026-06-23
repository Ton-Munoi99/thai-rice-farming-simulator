import { estimateStrawHarvest } from "./SimulationEngine.js";

function roundUp(value, step) {
  return Math.ceil(value / step) * step;
}

function revenueAtYield({ inputs, flags, quality, strawPricePerKg, pricePerTon, yieldKgPerRai }) {
  const straw = estimateStrawHarvest(inputs, yieldKgPerRai, { strawPricePerKg }, flags);
  const riceRevenue = Math.round(((yieldKgPerRai * pricePerTon) / 1000) * quality / 10) * 10;
  return riceRevenue + straw.revenuePerRai;
}

function findRequiredYield(targetRevenuePerRai, context) {
  for (let yieldKgPerRai = 100; yieldKgPerRai <= 1400; yieldKgPerRai += 5) {
    if (revenueAtYield({ ...context, yieldKgPerRai }) >= targetRevenuePerRai) {
      return roundUp(yieldKgPerRai, 5);
    }
  }
  return null;
}

export function buildDebtAnalysis({
  farmSize,
  inputs,
  model,
  pricePerTon,
  strawPricePerKg,
  annualInterestRate = 0.06,
  loanMonths = 6,
}) {
  const totalProfit = model.profitPerRai * farmSize;
  const totalCost = model.costPerRai * farmSize;
  const cashShortfall = Math.max(0, -totalProfit);
  const cashSurplus = Math.max(0, totalProfit);
  const interestCost = Math.round(cashShortfall * annualInterestRate * (loanMonths / 12));
  const debtDue = cashShortfall + interestCost;
  const debtDuePerRai = farmSize > 0 ? Math.round(debtDue / farmSize) : 0;
  const nextSeasonCashNeed = totalCost + debtDue;
  const targetProfitPerRai = debtDuePerRai;
  const targetRevenuePerRai = model.costPerRai + targetProfitPerRai;

  const context = {
    inputs,
    flags: model.flags,
    quality: model.quality,
    strawPricePerKg,
    pricePerTon,
  };
  const requiredYieldKgPerRai = cashShortfall > 0 ? findRequiredYield(targetRevenuePerRai, context) : model.estimatedYieldKgPerRai;
  const currentYieldStraw = estimateStrawHarvest(inputs, model.estimatedYieldKgPerRai, { strawPricePerKg }, model.flags);
  const requiredPricePerTon =
    cashShortfall > 0 && model.estimatedYieldKgPerRai > 0
      ? roundUp(
          Math.max(0, ((targetRevenuePerRai - currentYieldStraw.revenuePerRai) / model.estimatedYieldKgPerRai / Math.max(model.quality, 0.1)) * 1000),
          100,
        )
      : pricePerTon;

  const status =
    cashShortfall <= 0
      ? { level: "Cash positive", levelTh: "เงินสดเป็นบวก", tone: "good" }
      : debtDuePerRai <= 1000
        ? { level: "Manageable debt", levelTh: "หนี้พอจัดการได้", tone: "warning" }
        : { level: "Debt pressure", levelTh: "แรงกดดันหนี้สูง", tone: "danger" };

  return {
    annualInterestRate,
    loanMonths,
    totalProfit,
    totalCost,
    cashShortfall,
    cashSurplus,
    interestCost,
    debtDue,
    debtDuePerRai,
    nextSeasonCashNeed,
    targetProfitPerRai,
    targetRevenuePerRai,
    requiredYieldKgPerRai,
    requiredPricePerTon,
    status,
  };
}
