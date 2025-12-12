import { useState } from "react";
import { Header } from "../Header";
import { MetricsRow } from "../MetricsRow";
import { CumulativePnLChart } from "../CumulativePnLChart";
import { DailyPnLChart } from "../DailyPnLChart";
import { AccountBalance } from "../AccountBalance";
import { Calendar } from "../Calendar";
import "./Dashboard.css";

export function Dashboard({
  trades,
  daySummary,
  loading,
  dateRange,
  setDateRange,
  setPresetDateRange,
}) {
  const [displayMode, setDisplayMode] = useState("dollar");

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading trading data...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Header
        title="Dashboard"
        dateRange={dateRange}
        setDateRange={setDateRange}
        setPresetDateRange={setPresetDateRange}
        displayMode={displayMode}
        onDisplayModeChange={setDisplayMode}
      />

      <main className="dashboard-content">
        <MetricsRow trades={trades} daySummary={daySummary} displayMode={displayMode} />

        <section className="dashboard-grid-simple">
          <div className="dashboard-row-3">
            <CumulativePnLChart daySummary={daySummary} displayMode={displayMode} />
            <DailyPnLChart daySummary={daySummary} displayMode={displayMode} />
            <AccountBalance daySummary={daySummary} />
          </div>
          <div className="dashboard-row-full">
            <Calendar daySummary={daySummary} displayMode={displayMode} />
          </div>
        </section>
      </main>
    </div>
  );
}
