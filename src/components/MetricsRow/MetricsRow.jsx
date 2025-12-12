import { useMemo } from "react";
import { Info } from "lucide-react";
import "./MetricsRow.css";

function GaugeChart({ value, max = 100, wins, losses }) {
  const percentage = Math.min(Math.max(value, 0), max) / max;
  const angle = percentage * 180;

  return (
    <div className="gauge-container">
      <svg viewBox="0 0 100 60" className="gauge-svg">
        <path
          d="M 10 50 A 40 40 0 0 1 90 50"
          fill="none"
          stroke="#fee2e2"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M 10 50 A 40 40 0 0 1 90 50"
          fill="none"
          stroke="#dcfce7"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${percentage * 126} 126`}
        />
        <line
          x1="50"
          y1="50"
          x2={50 + 30 * Math.cos((180 - angle) * Math.PI / 180)}
          y2={50 - 30 * Math.sin((180 - angle) * Math.PI / 180)}
          stroke="#1e293b"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="50" cy="50" r="4" fill="#1e293b" />
      </svg>
      {wins !== undefined && losses !== undefined && (
        <div className="gauge-labels">
          <span className="gauge-wins">{wins}</span>
          <span className="gauge-losses">{losses}</span>
        </div>
      )}
    </div>
  );
}

function RingChart({ value, max = 100 }) {
  const percentage = Math.min(Math.max(value, 0), max) / max;
  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference * (1 - percentage);

  return (
    <div className="ring-container">
      <svg viewBox="0 0 80 80" className="ring-svg">
        <circle
          cx="40"
          cy="40"
          r="36"
          fill="none"
          stroke="#fee2e2"
          strokeWidth="6"
        />
        <circle
          cx="40"
          cy="40"
          r="36"
          fill="none"
          stroke="#10b981"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 40 40)"
        />
      </svg>
    </div>
  );
}

function AvgWinLossBar({ avgWin, avgLoss }) {
  return (
    <div className="avg-bar-container">
      <div className="avg-bar-win">
        <span>${Math.abs(avgWin).toFixed(0)}</span>
      </div>
      <div className="avg-bar-loss">
        <span>-${Math.abs(avgLoss).toFixed(0)}</span>
      </div>
    </div>
  );
}

export function MetricsRow({ trades, daySummary, displayMode = "dollar" }) {
  const metrics = useMemo(() => {
    // Net P&L from day summary
    const netPnL = daySummary?.reduce((sum, d) => sum + (d.profitLoss || 0), 0) || 0;
    const netPnLPercent = daySummary?.reduce((sum, d) => sum + (d.profitLossPercent || 0), 0) || 0;

    // Trade win % from trades data
    const totalTrades = trades?.length || 0;
    const winningTrades = trades?.filter((t) => t.profitLoss > 0) || [];
    const losingTrades = trades?.filter((t) => t.profitLoss < 0) || [];
    const tradeWinRate = totalTrades > 0 ? (winningTrades.length / totalTrades) * 100 : 0;

    // Profit factor from trades
    const totalWins = winningTrades.reduce((sum, t) => sum + t.profitLoss, 0);
    const totalLosses = Math.abs(losingTrades.reduce((sum, t) => sum + t.profitLoss, 0));
    const profitFactor = totalLosses > 0 ? totalWins / totalLosses : 0;

    // Day win % from day summary
    const winningDays = daySummary?.filter((d) => d.profitLoss > 0).length || 0;
    const losingDays = daySummary?.filter((d) => d.profitLoss < 0).length || 0;
    const totalDays = winningDays + losingDays;
    const dayWinRate = totalDays > 0 ? (winningDays / totalDays) * 100 : 0;

    // Avg win/loss from trades
    const avgWin = winningTrades.length > 0 ? totalWins / winningTrades.length : 0;
    const avgLoss = losingTrades.length > 0 ? totalLosses / losingTrades.length : 0;
    const avgWinLossRatio = avgLoss > 0 ? avgWin / avgLoss : 0;

    return {
      netPnL,
      netPnLPercent,
      totalTrades,
      tradeWinRate,
      tradeWins: winningTrades.length,
      tradeLosses: losingTrades.length,
      profitFactor,
      dayWinRate,
      winningDays,
      losingDays,
      avgWinLossRatio,
      avgWin,
      avgLoss,
    };
  }, [trades, daySummary]);

  return (
    <div className="metrics-row">
      <div className="metric-card">
        <div className="metric-header">
          <span className="metric-title">Net P&L</span>
          <Info size={14} className="info-icon" />
          <span className="metric-badge">{metrics.totalTrades}</span>
        </div>
        <div className={`metric-value ${(displayMode === "dollar" ? metrics.netPnL : metrics.netPnLPercent) >= 0 ? "positive" : "negative"}`}>
          {displayMode === "dollar" ? (
            <>{metrics.netPnL >= 0 ? "" : "-"}${Math.abs(metrics.netPnL).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</>
          ) : (
            <>{metrics.netPnLPercent >= 0 ? "+" : ""}{metrics.netPnLPercent.toFixed(2)}%</>
          )}
        </div>
      </div>

      <div className="metric-card metric-with-gauge">
        <div className="metric-content">
          <div className="metric-header">
            <span className="metric-title">Trade win %</span>
            <Info size={14} className="info-icon" />
          </div>
          <div className="metric-value">{metrics.tradeWinRate.toFixed(2)}%</div>
        </div>
        <GaugeChart
          value={metrics.tradeWinRate}
          wins={metrics.tradeWins}
          losses={metrics.tradeLosses}
        />
      </div>

      <div className="metric-card metric-with-ring">
        <div className="metric-content">
          <div className="metric-header">
            <span className="metric-title">Profit factor</span>
            <Info size={14} className="info-icon" />
          </div>
          <div className="metric-value">{metrics.profitFactor.toFixed(2)}</div>
        </div>
        <RingChart value={Math.min(metrics.profitFactor * 50, 100)} />
      </div>

      <div className="metric-card metric-with-gauge">
        <div className="metric-content">
          <div className="metric-header">
            <span className="metric-title">Day win %</span>
            <Info size={14} className="info-icon" />
          </div>
          <div className="metric-value">{metrics.dayWinRate.toFixed(0)}%</div>
        </div>
        <GaugeChart
          value={metrics.dayWinRate}
          wins={metrics.winningDays}
          losses={metrics.losingDays}
        />
      </div>

      <div className="metric-card metric-with-bar">
        <div className="metric-content">
          <div className="metric-header">
            <span className="metric-title">Avg win/loss trade</span>
            <Info size={14} className="info-icon" />
          </div>
          <div className="metric-value">{metrics.avgWinLossRatio.toFixed(2)}</div>
        </div>
        <AvgWinLossBar avgWin={metrics.avgWin} avgLoss={metrics.avgLoss} />
      </div>
    </div>
  );
}
