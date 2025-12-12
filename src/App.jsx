import { useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { Performance } from "./components/Performance";
import { Sidebar } from "./components/Sidebar";
import { useTradeData } from "./hooks/useTradeData";
import "./App.css";

function App() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const {
    trades,
    daySummary,
    dayPerformance,
    loading,
    metrics,
    dateRange,
    setDateRange,
    setPresetDateRange,
  } = useTradeData();

  return (
    <div className="app-layout">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <main className="main-content">
        {activeSection === "dashboard" && (
          <Dashboard
            trades={trades}
            daySummary={daySummary}
            dayPerformance={dayPerformance}
            loading={loading}
            metrics={metrics}
            dateRange={dateRange}
            setDateRange={setDateRange}
            setPresetDateRange={setPresetDateRange}
          />
        )}
        {activeSection === "performance" && (
          <Performance
            trades={trades}
            daySummary={daySummary}
            dayPerformance={dayPerformance}
            loading={loading}
            metrics={metrics}
            dateRange={dateRange}
            setDateRange={setDateRange}
            setPresetDateRange={setPresetDateRange}
          />
        )}
        {activeSection === "leaks" && (
          <div className="coming-soon">
            <h2>Where are the leaks?</h2>
            <p>Coming soon...</p>
          </div>
        )}
        {activeSection === "pushers" && (
          <div className="coming-soon">
            <h2>What are the pushers?</h2>
            <p>Coming soon...</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
