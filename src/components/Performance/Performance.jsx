import { Header } from "../Header";
import { ZellaScore } from "../ZellaScore";
import { WeeklyCategoryTracker } from "../WeeklyTracker";
import { RecentTrades } from "../RecentTrades";
import {
  TradeTimePerformance,
  TradeDurationPerformance,
} from "../PerformanceCharts";
import {
  PerformanceBySetup,
  PerformanceByMarket,
  PerformanceByTime,
  PerformanceByDirection,
} from "../PerformanceBreakdown";
import "./Performance.css";

export function Performance({
  trades,
  dayPerformance,
  loading,
  metrics,
  dateRange,
  setDateRange,
  setPresetDateRange,
}) {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading trading data...</p>
      </div>
    );
  }

  return (
    <div className="performance-page">
      <Header
        title="Performance"
        dateRange={dateRange}
        setDateRange={setDateRange}
        setPresetDateRange={setPresetDateRange}
      />

      <main className="performance-content">
        <section className="performance-top-row-3">
          <ZellaScore metrics={metrics} />
          <WeeklyCategoryTracker data={dayPerformance} />
          <RecentTrades trades={trades} />
        </section>

        <section className="performance-charts-row">
          <TradeTimePerformance trades={trades} />
          <TradeDurationPerformance trades={trades} />
        </section>

        <section className="performance-breakdown-row">
          <PerformanceBySetup trades={trades} />
          <PerformanceByMarket trades={trades} />
        </section>

        <section className="performance-breakdown-row">
          <PerformanceByTime trades={trades} />
          <PerformanceByDirection trades={trades} />
        </section>
      </main>
    </div>
  );
}
