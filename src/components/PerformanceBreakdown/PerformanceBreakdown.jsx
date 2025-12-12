import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Info } from "lucide-react";
import "./PerformanceBreakdown.css";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="breakdown-tooltip">
        <p className="tooltip-label">{label}</p>
        <p className={`tooltip-pnl ${data.pnl >= 0 ? "positive" : "negative"}`}>
          {data.pnl >= 0 ? "+" : ""}${data.pnl.toFixed(0)}
        </p>
        <p className="tooltip-stats">
          {data.trades} trades | {data.winRate.toFixed(0)}% win rate
        </p>
      </div>
    );
  }
  return null;
};

function BreakdownChart({ data, title, dataKey = "name" }) {
  const maxPnL = Math.max(...data.map((d) => Math.abs(d.pnl)), 1);

  return (
    <div className="breakdown-card">
      <div className="breakdown-header">
        <h3>{title}</h3>
        <Info size={14} className="info-icon" />
      </div>

      {data.length === 0 ? (
        <div className="no-data">No data available</div>
      ) : (
        <div className="breakdown-chart">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 80, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#64748b" }}
                tickFormatter={(value) => `$${value}`}
                domain={[-maxPnL * 1.1, maxPnL * 1.1]}
              />
              <YAxis
                type="category"
                dataKey={dataKey}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#1e293b", fontWeight: 500 }}
                width={75}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
              <Bar dataKey="pnl" radius={[0, 4, 4, 0]} maxBarSize={24}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.pnl >= 0 ? "#10b981" : "#ef4444"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="breakdown-table">
        <div className="table-header">
          <span>Category</span>
          <span>Trades</span>
          <span>Win Rate</span>
          <span>P&L</span>
        </div>
        {data.map((row, index) => (
          <div key={index} className="table-row">
            <span className="category-name">{row.name}</span>
            <span>{row.trades}</span>
            <span>{row.winRate.toFixed(0)}%</span>
            <span className={row.pnl >= 0 ? "positive" : "negative"}>
              {row.pnl >= 0 ? "+" : ""}${row.pnl.toFixed(0)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Extract hour from time string like "12/12/2025 09:36:48 EST" or "09:36:48"
function extractHour(timeStr) {
  if (!timeStr || typeof timeStr !== "string") return null;
  const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
  if (!timeMatch) return null;

  const hasDate = timeStr.includes(" ") && timeStr.indexOf(" ") < timeStr.indexOf(":");
  if (hasDate) {
    const parts = timeStr.split(" ");
    const timePart = parts.find((p) => p.includes(":"));
    if (timePart) {
      return parseInt(timePart.split(":")[0]);
    }
  }
  return parseInt(timeMatch[1]);
}

function getTimeSlot(hour) {
  if (hour === null) return "Unknown";
  if (hour >= 9 && hour < 10) return "9:00-10:00";
  if (hour >= 10 && hour < 11) return "10:00-11:00";
  if (hour >= 11 && hour < 12) return "11:00-12:00";
  if (hour >= 12 && hour < 13) return "12:00-1:00";
  if (hour >= 13 && hour < 14) return "1:00-2:00";
  if (hour >= 14 && hour < 15) return "2:00-3:00";
  if (hour >= 15 && hour < 16) return "3:00-4:00";
  return "Other";
}

export function PerformanceBySetup({ trades }) {
  const data = useMemo(() => {
    const grouped = {};

    trades.forEach((trade) => {
      const setup = trade.setup || "Unknown";
      if (!grouped[setup]) {
        grouped[setup] = { trades: 0, wins: 0, pnl: 0 };
      }
      grouped[setup].trades++;
      if (trade.profitLoss > 0) grouped[setup].wins++;
      grouped[setup].pnl += trade.profitLoss;
    });

    return Object.entries(grouped)
      .map(([name, stats]) => ({
        name,
        trades: stats.trades,
        wins: stats.wins,
        winRate: stats.trades > 0 ? (stats.wins / stats.trades) * 100 : 0,
        pnl: stats.pnl,
      }))
      .sort((a, b) => b.pnl - a.pnl);
  }, [trades]);

  return <BreakdownChart data={data} title="Performance by Setup" />;
}

export function PerformanceByMarket({ trades }) {
  const data = useMemo(() => {
    const grouped = {};

    trades.forEach((trade) => {
      const market = trade.marketConditions || "Unknown";
      if (!grouped[market]) {
        grouped[market] = { trades: 0, wins: 0, pnl: 0 };
      }
      grouped[market].trades++;
      if (trade.profitLoss > 0) grouped[market].wins++;
      grouped[market].pnl += trade.profitLoss;
    });

    return Object.entries(grouped)
      .map(([name, stats]) => ({
        name,
        trades: stats.trades,
        wins: stats.wins,
        winRate: stats.trades > 0 ? (stats.wins / stats.trades) * 100 : 0,
        pnl: stats.pnl,
      }))
      .sort((a, b) => b.pnl - a.pnl);
  }, [trades]);

  return <BreakdownChart data={data} title="Performance by Market" />;
}

export function PerformanceByTime({ trades }) {
  const data = useMemo(() => {
    const grouped = {};

    trades.forEach((trade) => {
      const hour = extractHour(trade.buyTime);
      const timeSlot = getTimeSlot(hour);
      if (!grouped[timeSlot]) {
        grouped[timeSlot] = { trades: 0, wins: 0, pnl: 0 };
      }
      grouped[timeSlot].trades++;
      if (trade.profitLoss > 0) grouped[timeSlot].wins++;
      grouped[timeSlot].pnl += trade.profitLoss;
    });

    // Sort by time slot order
    const timeOrder = [
      "9:00-10:00",
      "10:00-11:00",
      "11:00-12:00",
      "12:00-1:00",
      "1:00-2:00",
      "2:00-3:00",
      "3:00-4:00",
      "Other",
      "Unknown",
    ];

    return Object.entries(grouped)
      .map(([name, stats]) => ({
        name,
        trades: stats.trades,
        wins: stats.wins,
        winRate: stats.trades > 0 ? (stats.wins / stats.trades) * 100 : 0,
        pnl: stats.pnl,
      }))
      .sort((a, b) => timeOrder.indexOf(a.name) - timeOrder.indexOf(b.name));
  }, [trades]);

  return <BreakdownChart data={data} title="Performance by Buy Time" />;
}

export function PerformanceByDirection({ trades }) {
  const data = useMemo(() => {
    const grouped = {};

    trades.forEach((trade) => {
      const direction = trade.optionType?.toUpperCase() || "Unknown";
      const normalizedDirection = direction.includes("CALL") ? "Call" :
                                   direction.includes("PUT") ? "Put" :
                                   direction;
      if (!grouped[normalizedDirection]) {
        grouped[normalizedDirection] = { trades: 0, wins: 0, pnl: 0 };
      }
      grouped[normalizedDirection].trades++;
      if (trade.profitLoss > 0) grouped[normalizedDirection].wins++;
      grouped[normalizedDirection].pnl += trade.profitLoss;
    });

    return Object.entries(grouped)
      .map(([name, stats]) => ({
        name,
        trades: stats.trades,
        wins: stats.wins,
        winRate: stats.trades > 0 ? (stats.wins / stats.trades) * 100 : 0,
        pnl: stats.pnl,
      }))
      .sort((a, b) => b.pnl - a.pnl);
  }, [trades]);

  return <BreakdownChart data={data} title="Performance by Direction (Call/Put)" />;
}
