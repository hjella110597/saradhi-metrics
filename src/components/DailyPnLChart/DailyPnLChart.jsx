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
import { format, parseISO } from "date-fns";
import { Info } from "lucide-react";
import "./DailyPnLChart.css";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    return (
      <div className="chart-tooltip">
        <p className="tooltip-date">
          {format(parseISO(label), "MMM dd, yyyy")}
        </p>
        <p className={`tooltip-value ${value >= 0 ? "positive" : "negative"}`}>
          {value >= 0 ? "+" : ""}
          {value.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </p>
      </div>
    );
  }
  return null;
};

export function DailyPnLChart({ trades }) {
  const chartData = useMemo(() => {
    const dailyPnL = {};

    trades.forEach((trade) => {
      const day = trade.timestamp;
      dailyPnL[day] = (dailyPnL[day] || 0) + trade.profitLoss;
    });

    return Object.entries(dailyPnL)
      .map(([date, pnl]) => ({
        date,
        pnl: parseFloat(pnl.toFixed(2)),
        displayDate: format(parseISO(date), "MM/dd"),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [trades]);

  return (
    <div className="daily-pnl-chart">
      <div className="chart-header">
        <h3>Net daily P&L</h3>
        <Info size={14} className="info-icon" />
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
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
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              interval="preserveStartEnd"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="#e2e8f0" />
            <Bar dataKey="pnl" radius={[2, 2, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.pnl >= 0 ? "#10b981" : "#ef4444"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
