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
  WHITE_RICE_SURVIVAL_PRESETS,
} from "../data/mockData.js";
import { FARMER_PROFILES } from "../data/planningData.js";
import { buildSurvivalPlans } from "../simulation/PlanEngine.js";
import { COST_ITEMS, buildAutoRecommendation, computeSimulation, fertilizerNutrients, neutralFieldCondition } from "../simulation/SimulationEngine.js";
import { buildCells, buildChannels, buildPlantVisuals, buildWeatherFx, gridForFarmSize } from "../simulation/fieldModel.js";
import { clamp } from "../utils/format.js";

function cloneInputs(inputs) {
  return {
    ...inputs,
    applications: inputs.applications.map((app) => ({ ...app })),
  };
}

export function useSimulation() {
  const defaultVarietyKey = "white";
  const defaultShowPanel = () => (typeof window === "undefined" ? true : window.innerWidth >= 1024);
  const [language, setLanguage] = useState("th");
  const [inputs, setInputs] = useState(() => cloneInputs(DEFAULT_INPUTS));
  const [phase, setPhase] = useState("setup");
  const [stageIndex, setStageIndex] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [showPanel, setShowPanel] = useState(defaultShowPanel);
  const [fieldStyle, setFieldStyleState] = useState("clumps");
  const [farmSize, setFarmSizeState] = useState(10);
  const [varietyKey, setVarietyKey] = useState(defaultVarietyKey);
  const [pricePerTon, setPricePerTonState] = useState(VARIETIES[defaultVarietyKey].salePricePerTon);
  const [strawPricePerKg, setStrawPricePerKgState] = useState(0.75);
  const [costOverrides, setCostOverrides] = useState({});
  const [costProfile, setCostProfile] = useState(null);
  const [yieldPotentialOverride, setYieldPotentialOverride] = useState(null);
  const [activeScenarioKey, setActiveScenarioKey] = useState("best");
  const [activeFarmSystemPresetKey, setActiveFarmSystemPresetKey] = useState(null);
  const [activeSurvivalPresetKey, setActiveSurvivalPresetKey] = useState(null);
  const [activeAutoRecommendation, setActiveAutoRecommendation] = useState(false);
  const [activeFarmerProfileKey, setActiveFarmerProfileKey] = useState(null);
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
    () => computeSimulation(inputs, { varietyKey, pricePerTon, strawPricePerKg, costOverrides, costProfile, yieldPotentialOverride }),
    [costOverrides, costProfile, inputs, pricePerTon, strawPricePerKg, varietyKey, yieldPotentialOverride],
  );
  const activeModel = runModel ?? liveModel;
  const score = liveModel;
  const autoRecommendation = useMemo(
    () => buildAutoRecommendation(inputs, varietyKey),
    [inputs, varietyKey],
  );
  const survivalPlans = useMemo(
    () =>
      buildSurvivalPlans({
        inputs,
        liveModel,
        pricePerTon,
        strawPricePerKg,
        varietyKey,
        yieldPotentialOverride,
      }),
    [inputs, liveModel, pricePerTon, strawPricePerKg, varietyKey, yieldPotentialOverride],
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

  const clearPresetSelection = useCallback(() => {
    setActiveScenarioKey(null);
    setActiveFarmSystemPresetKey(null);
    setActiveSurvivalPresetKey(null);
    setActiveAutoRecommendation(false);
  }, []);

  const updateInput = useCallback(
    (key, value) => {
      resetToSetup();
      clearPresetSelection();
      setInputs((current) => ({ ...current, [key]: value }));
    },
    [clearPresetSelection, resetToSetup],
  );

  const updateApplication = useCallback(
    (index, patch) => {
      resetToSetup();
      clearPresetSelection();
      setInputs((current) => ({
        ...current,
        applications: current.applications.map((app, appIndex) => (appIndex === index ? { ...app, ...patch } : app)),
      }));
    },
    [clearPresetSelection, resetToSetup],
  );

  const applyScenario = useCallback(
    (scenarioKey) => {
      resetToSetup();
      setCostOverrides({});
      setCostProfile(null);
      setYieldPotentialOverride(null);
      setActiveScenarioKey(scenarioKey);
      setActiveFarmSystemPresetKey(null);
      setActiveSurvivalPresetKey(null);
      setActiveAutoRecommendation(false);
      setActiveFarmerProfileKey(null);
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
      setCostProfile(null);
      setYieldPotentialOverride(null);
      setActiveScenarioKey(null);
      setActiveFarmSystemPresetKey(preset.key);
      setActiveSurvivalPresetKey(null);
      setActiveAutoRecommendation(false);
      setActiveFarmerProfileKey(null);
      setVarietyKey(preset.variety);
      setPricePerTonState(VARIETIES[preset.variety].salePricePerTon);
      setInputs(cloneInputs(preset.inputs));
    },
    [resetToSetup],
  );

  const applyWhiteRiceSurvivalPreset = useCallback(
    (presetKey) => {
      const preset = WHITE_RICE_SURVIVAL_PRESETS.find((item) => item.key === presetKey);
      if (!preset) return;

      resetToSetup();
      setVarietyKey("white");
      setPricePerTonState(preset.pricePerTon);
      setStrawPricePerKgState(preset.strawPricePerKg);
      setCostOverrides({});
      setCostProfile({
        ...preset.costProfile,
        fertilizerReferenceCost: fertilizerNutrients(preset.inputs.applications).cost,
      });
      setYieldPotentialOverride(preset.yieldPotential ?? null);
      setActiveScenarioKey(null);
      setActiveFarmSystemPresetKey(null);
      setActiveSurvivalPresetKey(preset.key);
      setActiveAutoRecommendation(false);
      setActiveFarmerProfileKey(null);
      setInputs(cloneInputs(preset.inputs));
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
      setCostProfile(null);
      setYieldPotentialOverride(null);
      clearPresetSelection();
      setActiveFarmerProfileKey(null);
      setInputs((current) => ({
        ...current,
        applications: next.defaultApps.map((app) => ({ ...app })),
      }));
    },
    [clearPresetSelection, resetToSetup, varietyKey],
  );

  const setFarmSize = useCallback((value) => {
    const next = clamp(Math.round(Number(value) || 1), 1, 500);
    setFarmSizeState(next);
  }, []);

  const setFieldStyle = useCallback((style) => setFieldStyleState(style), []);
  const toggleLanguage = useCallback(() => setLanguage((current) => (current === "th" ? "en" : "th")), []);
  const togglePanel = useCallback(() => setShowPanel((current) => !current), []);
  const closeSummary = useCallback(() => setShowSummary(false), []);

  const setPricePerTon = useCallback(
    (value) => {
      resetToSetup();
      clearPresetSelection();
      setPricePerTonState(clamp(Math.round((Number(value) || 1000) / 100) * 100, 1000, 99000));
    },
    [clearPresetSelection, resetToSetup],
  );

  const setStrawPricePerKg = useCallback(
    (value) => {
      resetToSetup();
      clearPresetSelection();
      const rounded = Math.round((Number(value) || 0) * 10) / 10;
      setStrawPricePerKgState(clamp(rounded, 0, 10));
    },
    [clearPresetSelection, resetToSetup],
  );

  const setCostItem = useCallback(
    (key, value) => {
      resetToSetup();
      clearPresetSelection();
      setCostProfile(null);
      const nextValue = clamp(Math.round(Number(value) || 0), 0, 999999);
      setCostOverrides((current) => ({ ...current, [key]: nextValue }));
    },
    [clearPresetSelection, resetToSetup],
  );

  const setTotalCostPerRai = useCallback(
    (value) => {
      resetToSetup();
      clearPresetSelection();
      setCostProfile(null);
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
    [clearPresetSelection, liveModel.costBreakdown, liveModel.costPerRai, resetToSetup],
  );

  const resetCosts = useCallback(() => {
    resetToSetup();
    setCostOverrides({});
    setCostProfile(null);
    setYieldPotentialOverride(null);
    setActiveFarmerProfileKey(null);
    clearPresetSelection();
  }, [clearPresetSelection, resetToSetup]);

  const resetConditions = useCallback(() => {
    resetToSetup();
    setFieldStyleState("clumps");
    setFarmSizeState(10);
    setVarietyKey(defaultVarietyKey);
    setPricePerTonState(VARIETIES[defaultVarietyKey].salePricePerTon);
    setStrawPricePerKgState(0.75);
    setCostOverrides({});
    setCostProfile(null);
    setYieldPotentialOverride(null);
    setActiveScenarioKey("best");
    setActiveFarmSystemPresetKey(null);
    setActiveSurvivalPresetKey(null);
    setActiveAutoRecommendation(false);
    setActiveFarmerProfileKey(null);
    setInputs(cloneInputs(DEFAULT_INPUTS));
  }, [resetToSetup]);

  const buildCompareSnapshot = useCallback(
    (slotIndex) => {
      const slotName = ["A", "B", "C"][slotIndex];
      const model = computeSimulation(inputs, { varietyKey, pricePerTon, strawPricePerKg, costOverrides, costProfile, yieldPotentialOverride });
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
        costProfile: costProfile ? { ...costProfile } : null,
        yieldPotentialOverride,
        activeScenarioKey,
        activeFarmSystemPresetKey,
        activeSurvivalPresetKey,
        activeAutoRecommendation,
        model,
      };
    },
    [
      activeAutoRecommendation,
      activeFarmSystemPresetKey,
      activeScenarioKey,
      activeSurvivalPresetKey,
      costOverrides,
      costProfile,
      inputs,
      pricePerTon,
      strawPricePerKg,
      varietyKey,
      yieldPotentialOverride,
    ],
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
      setStrawPricePerKgState(snapshot.strawPricePerKg ?? 0.75);
      setCostOverrides({ ...snapshot.costOverrides });
      setCostProfile(snapshot.costProfile ? { ...snapshot.costProfile } : null);
      setYieldPotentialOverride(snapshot.yieldPotentialOverride ?? null);
      setActiveScenarioKey(snapshot.activeScenarioKey ?? null);
      setActiveFarmSystemPresetKey(snapshot.activeFarmSystemPresetKey ?? null);
      setActiveSurvivalPresetKey(snapshot.activeSurvivalPresetKey ?? null);
      setActiveAutoRecommendation(Boolean(snapshot.activeAutoRecommendation));
      setInputs(cloneInputs(snapshot.inputs));
    },
    [compareSlots, resetToSetup],
  );

  const applyAutoRecommendation = useCallback(() => {
    resetToSetup();
    setCostOverrides({});
    setCostProfile(null);
    setYieldPotentialOverride(null);
    setActiveScenarioKey(null);
    setActiveFarmSystemPresetKey(null);
    setActiveSurvivalPresetKey(null);
    setActiveAutoRecommendation(true);
    setInputs((current) => ({
      ...current,
      applications: buildAutoRecommendation(current, varietyKey).applications.map((app) => ({ ...app })),
    }));
  }, [resetToSetup, varietyKey]);

  const applySurvivalPlan = useCallback(
    (planKey) => {
      const plan = survivalPlans.find((item) => item.key === planKey);
      if (!plan) return;

      resetToSetup();
      setCostOverrides({});
      setCostProfile({
        ...plan.payload.costProfile,
        fertilizerReferenceCost: fertilizerNutrients(plan.payload.inputs.applications).cost,
      });
      setStrawPricePerKgState(plan.payload.strawPricePerKg);
      setYieldPotentialOverride(plan.payload.yieldPotentialOverride ?? null);
      setActiveScenarioKey(null);
      setActiveFarmSystemPresetKey(null);
      setActiveSurvivalPresetKey(null);
      setActiveAutoRecommendation(false);
      setInputs(cloneInputs(plan.payload.inputs));
    },
    [resetToSetup, survivalPlans],
  );

  const applyFarmerProfile = useCallback(
    (profileKey) => {
      const profile = FARMER_PROFILES.find((item) => item.key === profileKey);
      if (!profile) return;

      resetToSetup();
      setCostOverrides({});
      setCostProfile({
        ...profile.costProfile,
        fertilizerReferenceCost: fertilizerNutrients(inputs.applications).cost,
      });
      setStrawPricePerKgState(profile.strawPricePerKg);
      setYieldPotentialOverride(Math.max(1, VARIETIES[varietyKey].potential + profile.yieldPotentialBoost));
      setActiveFarmerProfileKey(profile.key);
      clearPresetSelection();
      if (profile.inputPatch) {
        setInputs((current) => ({ ...current, ...profile.inputPatch }));
      }
    },
    [clearPresetSelection, inputs.applications, resetToSetup, varietyKey],
  );

  const runSimulation = useCallback(() => {
    if (phase === "running") return;
    clearTimers();
    const model = computeSimulation(inputs, { varietyKey, pricePerTon, strawPricePerKg, costOverrides, costProfile, yieldPotentialOverride });
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
  }, [clearTimers, costOverrides, costProfile, inputs, phase, pricePerTon, strawPricePerKg, varietyKey, yieldPotentialOverride]);

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
              : `${key} · ${FERTILIZER_FORMULAS[key].en}`,
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
    costProfile,
    yieldPotentialOverride,
    activeScenarioKey,
    activeFarmSystemPresetKey,
    activeSurvivalPresetKey,
    activeAutoRecommendation,
    activeFarmerProfileKey,
    compareSlots,
    liveModel,
    activeModel,
    score,
    field,
    nutrientTotals: totals,
    fertilizerStages: FERTILIZER_STAGES,
    formulaOptions,
    autoRecommendation,
    farmerProfiles: FARMER_PROFILES,
    survivalPlans,
    isRunning: phase === "running",
    setInput: updateInput,
    setApplication: updateApplication,
    applyScenario,
    applyFarmSystemPreset,
    applyWhiteRiceSurvivalPreset,
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
    resetConditions,
    saveCompareSlot,
    clearCompareSlot,
    loadCompareSlot,
    applyAutoRecommendation,
    applySurvivalPlan,
    applyFarmerProfile,
    runSimulation,
  };
}
