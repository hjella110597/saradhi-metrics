import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import { useMemo } from "react";
import { format } from "date-fns";
import { Info } from "lucide-react";
import { parseDate } from "../../utils/dateUtils";
import "./DailyPnLChart.css";

const CustomTooltip = ({ active, payload, displayMode }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const value = displayMode === "dollar" ? data.pnl : data.pnlPercent;
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

export function DailyPnLChart({ daySummary, displayMode = "dollar" }) {
  const chartData = useMemo(() => {
    if (!daySummary || daySummary.length === 0) return [];

    return daySummary
      .filter((day) => day.date)
      .map((day) => ({
        date: day.date,
        pnl: parseFloat(day.profitLoss.toFixed(2)),
        pnlPercent: parseFloat(day.profitLossPercent.toFixed(2)),
        displayDate: format(parseDate(day.date), "MM/dd/yy"),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [daySummary]);

  const dataKey = displayMode === "dollar" ? "pnl" : "pnlPercent";

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
    <div className="daily-pnl-chart">
      <div className="chart-header">
        <h3>Net daily P&L</h3>
        <Info size={14} className="info-icon" />
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, bottom: 0, left: -20 }}
            barCategoryGap="20%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />
            <XAxis
              dataKey="displayDate"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#475569", fontWeight: 700 }}
              ticks={customTicks}
              interval={0}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#475569", fontWeight: 700 }}
              tickFormatter={(value) =>
                displayMode === "dollar" ? `$${value}` : `${value}%`
              }
            />
            <Tooltip
              content={<CustomTooltip displayMode={displayMode} />}
              cursor={{ fill: "#f1f5f9", opacity: 0.5 }}
            />
            <ReferenceLine y={0} stroke="#cbd5e1" strokeWidth={1} />

            <Bar dataKey={dataKey} maxBarSize={16}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry[dataKey] >= 0 ? "#10b981" : "#ef4444"}
                  radius={entry[dataKey] >= 0 ? [3, 3, 0, 0] : [0, 0, 3, 3]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
