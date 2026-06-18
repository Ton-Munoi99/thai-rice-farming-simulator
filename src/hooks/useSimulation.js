import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DEFAULT_INPUTS,
  FARM_SYSTEM_PRESETS,
  FERTILIZER_FORMULAS,
  FERTILIZER_STAGES,
  GROWTH_FRACTIONS,
  SCENARIO_ENVIRONMENTS,
  STAGES,
  VARIETIES,
} from "../data/mockData.js";
import { COST_ITEMS, buildAutoRecommendation, computeSimulation, fertilizerNutrients, neutralFieldCondition } from "../simulation/SimulationEngine.js";
import { buildCells, buildChannels, buildPlantVisuals, buildWeatherFx, gridForFarmSize } from "../simulation/fieldModel.js";
import { clamp } from "../utils/format.js";

export function useSimulation() {
  const defaultVarietyKey = "white";
  const defaultShowPanel = () => (typeof window === "undefined" ? true : window.innerWidth >= 1024);
  const [language, setLanguage] = useState("th");
  const [inputs, setInputs] = useState(DEFAULT_INPUTS);
  const [phase, setPhase] = useState("setup");
  const [stageIndex, setStageIndex] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [showPanel, setShowPanel] = useState(defaultShowPanel);
  const [fieldStyle, setFieldStyleState] = useState("clumps");
  const [farmSize, setFarmSizeState] = useState(10);
  const [varietyKey, setVarietyKey] = useState(defaultVarietyKey);
  const [pricePerTon, setPricePerTonState] = useState(VARIETIES[defaultVarietyKey].salePricePerTon);
  const [strawPricePerKg, setStrawPricePerKgState] = useState(1);
  const [costOverrides, setCostOverrides] = useState({});
  const [compareSlots, setCompareSlots] = useState([null, null, null]);
  const [runModel, setRunModel] = useState(null);
  const timers = useRef([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach((timer) => clearTimeout(timer));
    timers.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const varietyInfo = VARIETIES[varietyKey];
  const liveModel = useMemo(
    () => computeSimulation(inputs, { varietyKey, pricePerTon, strawPricePerKg, costOverrides }),
    [costOverrides, inputs, pricePerTon, strawPricePerKg, varietyKey],
  );
  const activeModel = runModel ?? liveModel;
  const score = liveModel;
  const autoRecommendation = useMemo(
    () => buildAutoRecommendation(inputs, varietyKey),
    [inputs, varietyKey],
  );

  const fieldGeometry = useMemo(() => {
    const grid = gridForFarmSize(farmSize);
    return buildCells(fieldStyle, grid.cols, grid.rows);
  }, [farmSize, fieldStyle]);

  const displayStageIndex = phase === "setup" ? 2 : stageIndex;
  const stageFraction = GROWTH_FRACTIONS[displayStageIndex];
  const fieldCondition = phase === "setup" ? neutralFieldCondition() : liveModel.condition;

  const field = useMemo(() => {
    const plants = buildPlantVisuals(fieldGeometry.cells, fieldCondition, stageFraction);
    const fx = buildWeatherFx(fieldCondition, fieldGeometry.sceneW, fieldGeometry.sceneH);
    const channels =
      inputs.water === "Alternate Wet-Dry (AWD)"
        ? buildChannels(fieldGeometry.cells, fieldGeometry.cols, fieldGeometry.rows)
        : [];

    return { ...fieldGeometry, plants, fx, channels, awd: inputs.water === "Alternate Wet-Dry (AWD)" };
  }, [fieldGeometry, fieldCondition, inputs.water, stageFraction]);

  const resetToSetup = useCallback(() => {
    clearTimers();
    setPhase("setup");
    setStageIndex(0);
    setShowSummary(false);
    setRunModel(null);
  }, [clearTimers]);

  const updateInput = useCallback(
    (key, value) => {
      resetToSetup();
      setInputs((current) => ({ ...current, [key]: value }));
    },
    [resetToSetup],
  );

  const updateApplication = useCallback(
    (index, patch) => {
      resetToSetup();
      setInputs((current) => ({
        ...current,
        applications: current.applications.map((app, appIndex) => (appIndex === index ? { ...app, ...patch } : app)),
      }));
    },
    [resetToSetup],
  );

  const applyScenario = useCallback(
    (scenarioKey) => {
      resetToSetup();
      setCostOverrides({});
      setInputs({
        applications: varietyInfo.presets[scenarioKey].map((app) => ({ ...app })),
        ...SCENARIO_ENVIRONMENTS[scenarioKey],
      });
    },
    [resetToSetup, varietyInfo],
  );

  const applyFarmSystemPreset = useCallback(
    (presetKey) => {
      const preset = FARM_SYSTEM_PRESETS.find((item) => item.key === presetKey);
      if (!preset) return;

      resetToSetup();
      setCostOverrides({});
      setVarietyKey(preset.variety);
      setPricePerTonState(VARIETIES[preset.variety].salePricePerTon);
      setInputs({
        ...preset.inputs,
        applications: preset.inputs.applications.map((app) => ({ ...app })),
      });
    },
    [resetToSetup],
  );

  const switchVariety = useCallback(
    (nextVariety) => {
      if (nextVariety === varietyKey) return;
      resetToSetup();
      const next = VARIETIES[nextVariety];
      setVarietyKey(nextVariety);
      setPricePerTonState(next.salePricePerTon);
      setCostOverrides({});
      setInputs((current) => ({
        ...current,
        applications: next.defaultApps.map((app) => ({ ...app })),
      }));
    },
    [resetToSetup, varietyKey],
  );

  const setFarmSize = useCallback((value) => {
    const next = clamp(Math.round(Number(value) || 1), 1, 500);
    setFarmSizeState(next);
  }, []);

  const setFieldStyle = useCallback((style) => setFieldStyleState(style), []);
  const toggleLanguage = useCallback(() => setLanguage((current) => (current === "th" ? "en" : "th")), []);
  const togglePanel = useCallback(() => setShowPanel((current) => !current), []);
  const closeSummary = useCallback(() => setShowSummary(false), []);

  const setPricePerTon = useCallback((value) => {
    setPricePerTonState(clamp(Math.round((Number(value) || 1000) / 100) * 100, 1000, 99000));
  }, []);

  const setStrawPricePerKg = useCallback((value) => {
    const rounded = Math.round((Number(value) || 0) * 10) / 10;
    setStrawPricePerKgState(clamp(rounded, 0, 10));
  }, []);

  const setCostItem = useCallback(
    (key, value) => {
      resetToSetup();
      const nextValue = clamp(Math.round(Number(value) || 0), 0, 999999);
      setCostOverrides((current) => ({ ...current, [key]: nextValue }));
    },
    [resetToSetup],
  );

  const setTotalCostPerRai = useCallback(
    (value) => {
      resetToSetup();
      const target = clamp(Math.round(Number(value) || 0), 0, 999999);
      const currentTotal = Math.max(1, liveModel.costPerRai);
      const scale = target / currentTotal;
      const scaled = {};
      let allocated = 0;

      liveModel.costBreakdown.forEach((item, index) => {
        const isLast = index === COST_ITEMS.length - 1;
        const nextValue = isLast ? Math.max(0, target - allocated) : Math.max(0, Math.round(item.value * scale));
        scaled[item.key] = nextValue;
        allocated += nextValue;
      });

      setCostOverrides(scaled);
    },
    [liveModel.costBreakdown, liveModel.costPerRai, resetToSetup],
  );

  const resetCosts = useCallback(() => {
    resetToSetup();
    setCostOverrides({});
  }, [resetToSetup]);

  const buildCompareSnapshot = useCallback(
    (slotIndex) => {
      const slotName = ["A", "B", "C"][slotIndex];
      const model = computeSimulation(inputs, { varietyKey, pricePerTon, strawPricePerKg, costOverrides });
      return {
        id: `${slotName}-${Date.now()}`,
        slot: slotName,
        savedAt: new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }),
        varietyKey,
        varietyName: VARIETIES[varietyKey].name,
        inputs: {
          ...inputs,
          applications: inputs.applications.map((app) => ({ ...app })),
        },
        pricePerTon,
        strawPricePerKg,
        costOverrides: { ...costOverrides },
        model,
      };
    },
    [costOverrides, inputs, pricePerTon, strawPricePerKg, varietyKey],
  );

  const saveCompareSlot = useCallback(
    (slotIndex) => {
      const snapshot = buildCompareSnapshot(slotIndex);
      setCompareSlots((current) => current.map((slot, index) => (index === slotIndex ? snapshot : slot)));
    },
    [buildCompareSnapshot],
  );

  const clearCompareSlot = useCallback((slotIndex) => {
    setCompareSlots((current) => current.map((slot, index) => (index === slotIndex ? null : slot)));
  }, []);

  const loadCompareSlot = useCallback(
    (slotIndex) => {
      const snapshot = compareSlots[slotIndex];
      if (!snapshot) return;

      resetToSetup();
      setVarietyKey(snapshot.varietyKey);
      setPricePerTonState(snapshot.pricePerTon);
      setStrawPricePerKgState(snapshot.strawPricePerKg ?? 1);
      setCostOverrides({ ...snapshot.costOverrides });
      setInputs({
        ...snapshot.inputs,
        applications: snapshot.inputs.applications.map((app) => ({ ...app })),
      });
    },
    [compareSlots, resetToSetup],
  );

  const applyAutoRecommendation = useCallback(() => {
    resetToSetup();
    setCostOverrides({});
    setInputs((current) => ({
      ...current,
      applications: buildAutoRecommendation(current, varietyKey).applications.map((app) => ({ ...app })),
    }));
  }, [resetToSetup, varietyKey]);

  const runSimulation = useCallback(() => {
    if (phase === "running") return;
    clearTimers();
    const model = computeSimulation(inputs, { varietyKey, pricePerTon, strawPricePerKg, costOverrides });
    setRunModel(model);
    setShowSummary(false);
    setPhase("running");
    setStageIndex(0);

    const stepMs = 1700;
    for (let index = 1; index <= 6; index += 1) {
      timers.current.push(setTimeout(() => setStageIndex(index), index * stepMs));
    }
    timers.current.push(
      setTimeout(() => {
        setPhase("done");
        setShowSummary(true);
      }, 6 * stepMs + 1100),
    );
  }, [clearTimers, costOverrides, inputs, phase, pricePerTon, strawPricePerKg, varietyKey]);

  const totals = useMemo(() => fertilizerNutrients(inputs.applications), [inputs.applications]);
  const formulaOptions = useMemo(
    () =>
      Object.keys(FERTILIZER_FORMULAS).map((key) => ({
        value: key,
        label:
          key === "None"
            ? language === "th"
              ? "- ไม่ใส่ปุ๋ย -"
              : "- No fertilizer -"
            : language === "th"
              ? `${key} · ${FERTILIZER_FORMULAS[key].th}`
              : `${key} · ${FERTILIZER_FORMULAS[key].n}-${FERTILIZER_FORMULAS[key].p}-${FERTILIZER_FORMULAS[key].k}`,
      })),
    [language],
  );

  return {
    language,
    inputs,
    phase,
    stageIndex,
    displayStageIndex,
    stage: STAGES[displayStageIndex],
    stages: STAGES,
    stageFraction,
    showSummary,
    showPanel,
    fieldStyle,
    farmSize,
    varietyKey,
    varietyInfo,
    pricePerTon,
    strawPricePerKg,
    costOverrides,
    compareSlots,
    liveModel,
    activeModel,
    score,
    field,
    nutrientTotals: totals,
    fertilizerStages: FERTILIZER_STAGES,
    formulaOptions,
    autoRecommendation,
    isRunning: phase === "running",
    setInput: updateInput,
    setApplication: updateApplication,
    applyScenario,
    applyFarmSystemPreset,
    switchVariety,
    setFarmSize,
    setFieldStyle,
    toggleLanguage,
    togglePanel,
    closeSummary,
    setPricePerTon,
    setStrawPricePerKg,
    setCostItem,
    setTotalCostPerRai,
    resetCosts,
    saveCompareSlot,
    clearCompareSlot,
    loadCompareSlot,
    applyAutoRecommendation,
    runSimulation,
  };
}
