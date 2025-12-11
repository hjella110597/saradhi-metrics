import { useTradeData } from "../../hooks/useTradeData";
import { Header, SubHeader } from "../Header";
import { MetricCard } from "../MetricCard";
import { WinRateDonut } from "../WinRateDonut";
import { ZellaScore } from "../ZellaScore";
import { ProgressTracker } from "../ProgressTracker";
import { CumulativePnLChart } from "../CumulativePnLChart";
import { DailyPnLChart } from "../DailyPnLChart";
import { RecentTrades } from "../RecentTrades";
import { AccountBalance } from "../AccountBalance";
import { Calendar } from "../Calendar";
import {
  TradeTimePerformance,
  TradeDurationPerformance,
} from "../PerformanceCharts";
import { DrawdownChart } from "../DrawdownChart";
import "./Dashboard.css";

export function Dashboard() {
  const {
    trades,
    loading,
    _error,
    lastImport,
    metrics,
    dateRange,
    setDateRange,
    setPresetDateRange,
    refetch,
    useMockData,
    setUseMockData,
  } = useTradeData();

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
        dateRange={dateRange}
        setDateRange={setDateRange}
        setPresetDateRange={setPresetDateRange}
      />

      <div className="subscription-banner">
        <span className="icon">$</span>
        <p>
          Your subscription is inactive. To continue journaling,{" "}
          <a href="#">activate your subscription now</a>.
        </p>
      </div>

      <SubHeader
        lastImport={lastImport}
        onRefresh={refetch}
        useMockData={useMockData}
        setUseMockData={setUseMockData}
      />

      <main className="dashboard-content">
        {/* Top Metrics Row */}
        <section className="metrics-row">
          <div className="metric-with-badge">
            <MetricCard
              title="Net P&L"
              value={metrics.netPnL}
              format="currency"
              subtitle={`${metrics.totalTrades} trades`}
            />
          </div>

          <div className="metric-with-donut">
            <MetricCard
              title="Trade win %"
              value={metrics.tradeWinPercent}
              format="percent"
              className="metric-donut-card"
            />
            <div className="donut-overlay">
              <WinRateDonut
                wins={metrics.winningTrades}
                losses={metrics.losingTrades}
              />
            </div>
          </div>

          <div className="metric-with-donut">
            <MetricCard
              title="Profit factor"
              value={
                metrics.profitFactor === Infinity ? 999 : metrics.profitFactor
              }
              format="ratio"
              className="metric-donut-card"
            />
            <div className="donut-overlay pf-donut">
              <div
                className="pf-ring"
                style={{
                  "--progress": Math.min(metrics.profitFactor / 3, 1),
                }}
              ></div>
            </div>
          </div>

          <div className="metric-with-donut">
            <MetricCard
              title="Day win %"
              value={metrics.dayWinPercent}
              format="percent"
              className="metric-donut-card"
            />
            <div className="donut-overlay">
              <WinRateDonut
                wins={metrics.winningDays}
                losses={metrics.totalDays - metrics.winningDays}
              />
            </div>
          </div>

          <div className="metric-avg-win-loss">
            <MetricCard
              title="Avg win/loss trade"
              value={metrics.avgWinLossRatio}
              format="ratio"
            />
            <div className="avg-bar">
              <div className="avg-win">
                <span>${metrics.avgWin.toFixed(1)}</span>
              </div>
              <div className="avg-loss">
                <span>-${metrics.avgLoss.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Dashboard Grid */}
        <section className="dashboard-grid">
          {/* Left Column */}
          <div className="grid-left">
            <ZellaScore metrics={metrics} />
            <DailyPnLChart trades={trades} />
          </div>

          {/* Center Column */}
          <div className="grid-center">
            <ProgressTracker trades={trades} dateRange={dateRange} />
            <RecentTrades trades={trades} />
          </div>

          {/* Right Column */}
          <div className="grid-right">
            <CumulativePnLChart trades={trades} />
            <AccountBalance trades={trades} />
            <DrawdownChart trades={trades} />
          </div>
        </section>

        {/* Calendar Section */}
        <section className="calendar-section-wrapper">
          <Calendar trades={trades} dateRange={dateRange} />
        </section>

        {/* Performance Charts */}
        <section className="performance-section">
          <TradeDurationPerformance trades={trades} />
          <TradeTimePerformance trades={trades} />
        </section>
      </main>
    </div>
  );
}
