import { useCallback, useState } from "react";
import AppLayout from "./components/AppLayout.jsx";
import ControlPanel from "./components/ControlPanel.jsx";
import ExportReportModal from "./components/ExportReportModal.jsx";
import GoalWizardModal from "./components/GoalWizardModal.jsx";
import GrowthTimeline from "./components/GrowthTimeline.jsx";
import MethodologyModal from "./components/MethodologyModal.jsx";
import OnboardingModal from "./components/OnboardingModal.jsx";
import RiceFieldAnimation from "./components/RiceFieldAnimation.jsx";
import ScorePanel from "./components/ScorePanel.jsx";
import SummaryDashboard from "./components/SummaryDashboard.jsx";
import { useSimulation } from "./hooks/useSimulation.js";

const ONBOARDING_KEY = "rice-simulator-onboarding-v1";
const VIEW_MODE_KEY = "rice-simulator-view-mode-v1";

export default function App() {
  const simulation = useSimulation();
  const [showMethodology, setShowMethodology] = useState(false);
  const [showExportReport, setShowExportReport] = useState(false);
  const [showGoalWizard, setShowGoalWizard] = useState(false);
  const [mobileTab, setMobileTab] = useState("field");
  const [viewMode, setViewMode] = useState(() => {
    if (typeof window === "undefined") return "simple";
    const stored = window.localStorage.getItem(VIEW_MODE_KEY);
    return stored === "advanced" ? "advanced" : "simple";
  });
  const [showOnboarding, setShowOnboarding] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(ONBOARDING_KEY) !== "done";
  });

  const closeOnboarding = useCallback(() => {
    window.localStorage.setItem(ONBOARDING_KEY, "done");
    setShowOnboarding(false);
  }, []);

  const changeViewMode = useCallback((mode) => {
    const nextMode = mode === "advanced" ? "advanced" : "simple";
    if (typeof window !== "undefined") {
      window.localStorage.setItem(VIEW_MODE_KEY, nextMode);
    }
    setViewMode(nextMode);
  }, []);

  return (
    <AppLayout
      farmSize={simulation.farmSize}
      fieldStyle={simulation.fieldStyle}
      language={simulation.language}
      mobileTab={mobileTab}
      showPanel={simulation.showPanel}
      score={simulation.score}
      variety={simulation.varietyInfo}
      viewMode={viewMode}
      onFarmSize={simulation.setFarmSize}
      onFieldStyle={simulation.setFieldStyle}
      onOpenExport={() => setShowExportReport(true)}
      onOpenGuide={() => setShowOnboarding(true)}
      onOpenMethodology={() => setShowMethodology(true)}
      onOpenWizard={() => setShowGoalWizard(true)}
      onSetMobileTab={setMobileTab}
      onToggleLanguage={simulation.toggleLanguage}
      onTogglePanel={simulation.togglePanel}
      onViewMode={changeViewMode}
    >
      <ControlPanel simulation={simulation} mobileActive={mobileTab === "controls"} viewMode={viewMode} />
      <main className={`${mobileTab === "field" ? "flex" : "hidden"} min-w-0 flex-1 flex-col bg-[#e8eadf] md:flex`}>
        <RiceFieldAnimation simulation={simulation} />
        <GrowthTimeline simulation={simulation} />
      </main>
      {simulation.showPanel || mobileTab === "results" || mobileTab === "plans" ? (
        <ScorePanel
          simulation={simulation}
          mobileActive={mobileTab === "results" || mobileTab === "plans"}
          mobileMode={mobileTab}
          viewMode={viewMode}
        />
      ) : null}
      <SummaryDashboard simulation={simulation} />
      {showMethodology ? <MethodologyModal simulation={simulation} onClose={() => setShowMethodology(false)} /> : null}
      {showExportReport ? <ExportReportModal simulation={simulation} onClose={() => setShowExportReport(false)} /> : null}
      {showGoalWizard ? <GoalWizardModal simulation={simulation} onClose={() => setShowGoalWizard(false)} /> : null}
      {showOnboarding ? <OnboardingModal language={simulation.language} onClose={closeOnboarding} /> : null}
    </AppLayout>
  );
}
