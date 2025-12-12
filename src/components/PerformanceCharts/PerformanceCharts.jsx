import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  ZAxis,
} from "recharts";
import { useMemo } from "react";
import { Info, Settings } from "lucide-react";
import "./PerformanceCharts.css";

const TimeTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const hours = Math.floor(data.time);
    const minutes = Math.round((data.time - hours) * 60);
    return (
      <div className="scatter-tooltip">
        <p>{data.ticker}</p>
        <p>
          Time: {hours}:{minutes.toString().padStart(2, "0")}
        </p>
        <p className={data.isWin ? "positive" : "negative"}>
          P&L: ${data.pnl.toFixed(0)}
        </p>
      </div>
    );
  }
  return null;
};

const DurationTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const hours = Math.floor(data.duration / 60);
    const mins = data.duration % 60;
    return (
      <div className="scatter-tooltip">
        <p>{data.ticker}</p>
        <p>
          Duration: {hours > 0 ? `${hours}h ` : ""}
          {mins}m
        </p>
        <p className={data.isWin ? "positive" : "negative"}>
          P&L: ${data.pnl.toFixed(0)}
        </p>
      </div>
    );
  }
  return null;
};

// Extract time from formats like "12/12/2025 09:36:48 EST" or "09:36:48"
const extractTime = (timeStr) => {
  if (!timeStr || typeof timeStr !== "string") return null;

  // Match time pattern HH:MM:SS or HH:MM
  const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
  if (!timeMatch) return null;

  // Check if there's a date before the time (space followed by time)
  const hasDate =
    timeStr.includes(" ") && timeStr.indexOf(" ") < timeStr.indexOf(":");

  if (hasDate) {
    // Extract time part after the space
    const parts = timeStr.split(" ");
    const timePart = parts.find((p) => p.includes(":"));
    if (timePart) {
      const [hours, minutes] = timePart.split(":").map(Number);
      return { hours, minutes };
    }
  }

  // Direct time format
  const hours = parseInt(timeMatch[1]) || 0;
  const minutes = parseInt(timeMatch[2]) || 0;
  return { hours, minutes };
};

export function TradeTimePerformance({ trades }) {
  const chartData = useMemo(() => {
    return trades
      .filter(
        (trade) =>
          trade.buyTime &&
          typeof trade.buyTime === "string" &&
          trade.buyTime.includes(":")
      )
      .map((trade) => {
        const time = extractTime(trade.buyTime);
        if (!time) return null;

        const timeDecimal = time.hours + time.minutes / 60;

        return {
          time: timeDecimal,
          pnl: trade.profitLoss,
          ticker: trade.ticker,
          isWin: trade.profitLoss > 0,
        };
      })
      .filter((t) => t && !isNaN(t.time) && t.time >= 9 && t.time <= 16);
  }, [trades]);

  return (
    <div className="performance-chart">
      <div className="chart-header">
        <h3>Trade time performance</h3>
        <div className="chart-actions">
          <Info size={14} className="info-icon" />
          <Settings size={14} className="settings-icon" />
        </div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="98%" height={420}>
          <ScatterChart>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f1f5f9"
              verticalFill={["#f8fafc", "#e0e7ef"]}
            />
            <XAxis
              dataKey="time"
              type="number"
              domain={[8.5, 15]}
              ticks={[
                8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5,
                15,
              ]}
              tickFormatter={(v) => {
                const h = Math.floor(v);
                const m = Math.round((v - h) * 60);
                return `${h}:${m.toString().padStart(2, "0")}`;
              }}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#475569", fontWeight: 700 }}
            />
            <YAxis
              dataKey="pnl"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#475569", fontWeight: 700 }}
              tickFormatter={(v) => `$${v}`}
            />
            <ZAxis range={[30, 100]} />
            <Tooltip content={<TimeTooltip />} />
            <ReferenceLine y={0} stroke="#e2e8f0" />
            <Scatter data={chartData}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isWin ? "#10b981" : "#ef4444"}
                  fillOpacity={0.7}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function TradeDurationPerformance({ trades }) {
  const chartData = useMemo(() => {
    return trades
      .filter(
        (trade) =>
          trade.buyTime &&
          typeof trade.buyTime === "string" &&
          trade.buyTime.includes(":") &&
          trade.sellTime &&
          typeof trade.sellTime === "string" &&
          trade.sellTime.includes(":")
      )
      .map((trade) => {
        const buyTime = extractTime(trade.buyTime);
        const sellTime = extractTime(trade.sellTime);
        if (!buyTime || !sellTime) return null;

        const buyMinutes = buyTime.hours * 60 + buyTime.minutes;
        const sellMinutes = sellTime.hours * 60 + sellTime.minutes;
        const duration = Math.max(sellMinutes - buyMinutes, 1);

        return {
          duration,
          pnl: trade.profitLoss,
          ticker: trade.ticker,
          isWin: trade.profitLoss > 0,
        };
      })
      .filter(
        (t) => t && !isNaN(t.duration) && t.duration > 0 && t.duration < 600
      );
  }, [trades]);

  return (
    <div className="performance-chart">
      <div className="chart-header">
        <h3>Trade duration performance</h3>
        <Info size={14} className="info-icon" />
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="98%" height={420}>
          <ScatterChart>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f1f5f9"
              verticalFill={["#f8fafc", "#e0e7ef"]}
            />
            <XAxis
              dataKey="duration"
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#475569", fontWeight: 700 }}
              tickFormatter={(v) => {
                if (v < 60) return `${v}m`;
                const h = Math.floor(v / 60);
                const m = v % 60;
                return m > 0 ? `${h}h${m}m` : `${h}h`;
              }}
            />
            <YAxis
              dataKey="pnl"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#475569", fontWeight: 700 }}
              tickFormatter={(v) => `$${v}`}
            />
            <ZAxis range={[30, 100]} />
            <Tooltip content={<DurationTooltip />} />
            <ReferenceLine y={0} stroke="#e2e8f0" />
            <Scatter data={chartData}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isWin ? "#10b981" : "#ef4444"}
                  fillOpacity={0.7}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
