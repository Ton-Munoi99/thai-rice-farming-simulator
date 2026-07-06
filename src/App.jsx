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

export default function App() {
  const simulation = useSimulation();
  const [showMethodology, setShowMethodology] = useState(false);
  const [showExportReport, setShowExportReport] = useState(false);
  const [showGoalWizard, setShowGoalWizard] = useState(false);
  const [mobileTab, setMobileTab] = useState("field");
  const [showOnboarding, setShowOnboarding] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(ONBOARDING_KEY) !== "done";
  });

  const closeOnboarding = useCallback(() => {
    window.localStorage.setItem(ONBOARDING_KEY, "done");
    setShowOnboarding(false);
  }, []);

  return (
    <AppLayout
      farmSize={simulation.farmSize}
      language={simulation.language}
      mobileTab={mobileTab}
      showPanel={simulation.showPanel}
      score={simulation.score}
      variety={simulation.varietyInfo}
      onFarmSize={simulation.setFarmSize}
      onOpenExport={() => setShowExportReport(true)}
      onOpenMethodology={() => setShowMethodology(true)}
      onOpenWizard={() => setShowGoalWizard(true)}
      onSetMobileTab={setMobileTab}
      onToggleLanguage={simulation.toggleLanguage}
      onTogglePanel={simulation.togglePanel}
    >
      <ControlPanel simulation={simulation} mobileActive={mobileTab === "controls"} />
      <main className={`${mobileTab === "field" ? "flex" : "hidden"} min-w-0 flex-1 flex-col bg-[#e8eadf] md:flex`}>
        <RiceFieldAnimation simulation={simulation} />
        <GrowthTimeline simulation={simulation} />
      </main>
      {simulation.showPanel || mobileTab === "results" || mobileTab === "plans" ? (
        <ScorePanel simulation={simulation} mobileActive={mobileTab === "results" || mobileTab === "plans"} mobileMode={mobileTab} />
      ) : null}
      <SummaryDashboard simulation={simulation} />
      {showMethodology ? <MethodologyModal simulation={simulation} onClose={() => setShowMethodology(false)} /> : null}
      {showExportReport ? <ExportReportModal simulation={simulation} onClose={() => setShowExportReport(false)} /> : null}
      {showGoalWizard ? <GoalWizardModal simulation={simulation} onClose={() => setShowGoalWizard(false)} /> : null}
      {showOnboarding ? <OnboardingModal language={simulation.language} onClose={closeOnboarding} /> : null}
    </AppLayout>
  );
}
