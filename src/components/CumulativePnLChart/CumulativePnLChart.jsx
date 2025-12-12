import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { useMemo } from "react";
import { format } from "date-fns";
import { Info } from "lucide-react";
import { parseDate } from "../../utils/dateUtils";
import "./CumulativePnLChart.css";

const CumulativeTooltip = ({ active, payload, displayMode }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const value = displayMode === "dollar" ? data.cumulative : data.cumulativePercent;
    const date = data.date;
    return (
      <div className="chart-tooltip">
        <p className="tooltip-date">
          {format(parseDate(date), "MMM dd, yyyy")}
        </p>
        <p className={`tooltip-value ${value >= 0 ? "positive" : "negative"}`}>
          {value >= 0 ? "+" : ""}
          {displayMode === "dollar"
            ? value.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })
            : `${value.toFixed(2)}%`}
        </p>
      </div>
    );
  }
  return null;
};

export function CumulativePnLChart({ daySummary, displayMode = "dollar" }) {
  const chartData = useMemo(() => {
    if (!daySummary || daySummary.length === 0) return [];

    const sortedDays = daySummary
      .filter((day) => day.date)
      .sort((a, b) => a.date.localeCompare(b.date));

    return sortedDays.reduce((acc, day) => {
      const prevTotal = acc.length > 0 ? acc[acc.length - 1].cumulative : 0;
      const prevTotalPercent = acc.length > 0 ? acc[acc.length - 1].cumulativePercent : 0;
      const newTotal = prevTotal + day.profitLoss;
      const newTotalPercent = prevTotalPercent + day.profitLossPercent;
      acc.push({
        date: day.date,
        cumulative: parseFloat(newTotal.toFixed(2)),
        cumulativePercent: parseFloat(newTotalPercent.toFixed(2)),
        displayDate: format(parseDate(day.date), "MM/dd/yy"),
      });
      return acc;
    }, []);
  }, [daySummary]);

  const dataKey = displayMode === "dollar" ? "cumulative" : "cumulativePercent";

  const minValue =
    chartData.length > 0
      ? Math.min(...chartData.map((d) => d[dataKey]), 0)
      : 0;
  const maxValue =
    chartData.length > 0
      ? Math.max(...chartData.map((d) => d[dataKey]), 0)
      : 0;

  const gradientOffset = () => {
    if (maxValue <= 0) return 0;
    if (minValue >= 0) return 1;
    return maxValue / (maxValue - minValue);
  };

  const off = gradientOffset();

  const customTicks = useMemo(() => {
    if (!chartData || chartData.length === 0) return [];
    const indices = [
      0,
      Math.floor((chartData.length - 1) * 0.33),
      Math.floor((chartData.length - 1) * 0.66),
      chartData.length - 1,
    ];
    return Array.from(new Set(indices.map((i) => chartData[i].displayDate)));
  }, [chartData]);

  return (
    <div className="cumulative-pnl-chart">
      <div className="chart-header">
        <h3>Daily net cumulative P&L</h3>
        <Info size={14} className="info-icon" />
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, bottom: 20, left: 10 }}
          >
            <defs>
              <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset={off} stopColor="#10b981" stopOpacity={0.15} />
                <stop offset={off} stopColor="#10b981" stopOpacity={0} />
                <stop offset={off} stopColor="#ef4444" stopOpacity={0} />
                <stop offset={off} stopColor="#ef4444" stopOpacity={0.25} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e2e8f0"
            />
            <XAxis
              dataKey="displayDate"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#64748b", fontWeight: 700 }}
              ticks={customTicks}
              interval={0}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#475569", fontWeight: 700 }}
              tickFormatter={(value) =>
                displayMode === "dollar" ? `$${Math.round(value)}` : `${value.toFixed(1)}%`
              }
              domain={[minValue * 1.1, maxValue * 1.1]}
              width={55}
            />
            <Tooltip
              content={<CumulativeTooltip displayMode={displayMode} />}
              cursor={{
                stroke: "#94a3b8",
                strokeWidth: 1,
                strokeDasharray: "3 3",
              }}
            />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#splitColor)"
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
