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
import { format, parseISO } from "date-fns";
import { Info } from "lucide-react";
import "./CumulativePnLChart.css";

const CumulativeTooltip = ({ active, payload, label }) => {
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

export function CumulativePnLChart({ trades }) {
  const chartData = useMemo(() => {
    const dailyPnL = {};

    trades.forEach((trade) => {
      const day = trade.timestamp;
      dailyPnL[day] = (dailyPnL[day] || 0) + trade.profitLoss;
    });

    const sortedDays = Object.keys(dailyPnL).sort();

    // Use reduce to accumulate without reassignment
    const result = sortedDays.reduce((acc, date) => {
      const prevTotal = acc.length > 0 ? acc[acc.length - 1].cumulative : 0;
      const newTotal = prevTotal + dailyPnL[date];
      acc.push({
        date,
        cumulative: parseFloat(newTotal.toFixed(2)),
        displayDate: format(parseISO(date), "MM/dd/yy"),
      });
      return acc;
    }, []);

    return result;
  }, [trades]);

  const minValue = Math.min(...chartData.map((d) => d.cumulative), 0);
  const maxValue = Math.max(...chartData.map((d) => d.cumulative), 0);

  return (
    <div className="cumulative-pnl-chart">
      <div className="chart-header">
        <h3>Daily net cumulative P&L</h3>
        <Info size={14} className="info-icon" />
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart
            data={chartData}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <defs>
              <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />
            <XAxis
              dataKey="displayDate"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              interval="preserveStartEnd"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              tickFormatter={(value) => `$${value}`}
              domain={[minValue - 100, maxValue + 100]}
            />
            <Tooltip content={<CumulativeTooltip />} />
            <Area
              type="monotone"
              dataKey="cumulative"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#colorCumulative)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
