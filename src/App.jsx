import AppLayout from "./components/AppLayout.jsx";
import ControlPanel from "./components/ControlPanel.jsx";
import GrowthTimeline from "./components/GrowthTimeline.jsx";
import RiceFieldAnimation from "./components/RiceFieldAnimation.jsx";
import ScorePanel from "./components/ScorePanel.jsx";
import SummaryDashboard from "./components/SummaryDashboard.jsx";
import { useSimulation } from "./hooks/useSimulation.js";

export default function App() {
  const simulation = useSimulation();

  return (
    <AppLayout
      farmSize={simulation.farmSize}
      fieldStyle={simulation.fieldStyle}
      showPanel={simulation.showPanel}
      score={simulation.score}
      variety={simulation.varietyInfo}
      onFarmSize={simulation.setFarmSize}
      onFieldStyle={simulation.setFieldStyle}
      onTogglePanel={simulation.togglePanel}
    >
      <ControlPanel simulation={simulation} />
      <main className="flex min-w-0 flex-1 flex-col bg-[#dfe6d6]">
        <RiceFieldAnimation simulation={simulation} />
        <GrowthTimeline simulation={simulation} />
      </main>
      {simulation.showPanel ? <ScorePanel simulation={simulation} /> : null}
      <SummaryDashboard simulation={simulation} />
    </AppLayout>
  );
}
