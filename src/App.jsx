import { useCallback, useState } from "react";
import AppLayout from "./components/AppLayout.jsx";
import ControlPanel from "./components/ControlPanel.jsx";
import ExportReportModal from "./components/ExportReportModal.jsx";
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
      fieldStyle={simulation.fieldStyle}
      language={simulation.language}
      showPanel={simulation.showPanel}
      score={simulation.score}
      variety={simulation.varietyInfo}
      onFarmSize={simulation.setFarmSize}
      onFieldStyle={simulation.setFieldStyle}
      onOpenExport={() => setShowExportReport(true)}
      onOpenGuide={() => setShowOnboarding(true)}
      onOpenMethodology={() => setShowMethodology(true)}
      onToggleLanguage={simulation.toggleLanguage}
      onTogglePanel={simulation.togglePanel}
    >
      <ControlPanel simulation={simulation} />
      <main className="flex min-w-0 flex-1 flex-col bg-[#e8eadf]">
        <RiceFieldAnimation simulation={simulation} />
        <GrowthTimeline simulation={simulation} />
      </main>
      {simulation.showPanel ? <ScorePanel simulation={simulation} /> : null}
      <SummaryDashboard simulation={simulation} />
      {showMethodology ? <MethodologyModal simulation={simulation} onClose={() => setShowMethodology(false)} /> : null}
      {showExportReport ? <ExportReportModal simulation={simulation} onClose={() => setShowExportReport(false)} /> : null}
      {showOnboarding ? <OnboardingModal language={simulation.language} onClose={closeOnboarding} /> : null}
    </AppLayout>
  );
}
