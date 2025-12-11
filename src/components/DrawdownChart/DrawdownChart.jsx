import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { useMemo } from "react";
import { format, parseISO } from "date-fns";
import { Info } from "lucide-react";
import "./DrawdownChart.css";

const DrawdownTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    return (
      <div className="chart-tooltip">
        <p className="tooltip-date">
          {format(parseISO(label), "MMM dd, yyyy")}
        </p>
        <p className="tooltip-value negative">Drawdown: ${value.toFixed(0)}</p>
      </div>
    );
  }
  return null;
};

export function DrawdownChart({ trades }) {
  const chartData = useMemo(() => {
    const dailyPnL = {};

    trades.forEach((trade) => {
      const day = trade.timestamp;
      dailyPnL[day] = (dailyPnL[day] || 0) + trade.profitLoss;
    });

    const sortedDays = Object.keys(dailyPnL).sort();

    // Use reduce to accumulate without reassignment
    const result = sortedDays.reduce((acc, date) => {
      const prevTotal = acc.length > 0 ? acc[acc.length - 1].runningTotal : 0;
      const prevPeak = acc.length > 0 ? acc[acc.length - 1].runningPeak : 0;
      const newTotal = prevTotal + dailyPnL[date];
      const newPeak = Math.max(prevPeak, newTotal);
      const drawdown = newTotal - newPeak;

      acc.push({
        date,
        runningTotal: newTotal,
        runningPeak: newPeak,
        drawdown: parseFloat(drawdown.toFixed(2)),
        displayDate: format(parseISO(date), "MM/dd/yy"),
      });
      return acc;
    }, []);

    return result;
  }, [trades]);

  const maxDrawdown = Math.min(...chartData.map((d) => d.drawdown), 0);

  return (
    <div className="drawdown-chart">
      <div className="chart-header">
        <h3>Drawdown</h3>
        <Info size={14} className="info-icon" />
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <defs>
              <linearGradient id="colorDrawdown" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
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
              tick={{ fontSize: 9, fill: "#94a3b8" }}
              interval="preserveStartEnd"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fill: "#94a3b8" }}
              tickFormatter={(value) => `$${value}`}
              domain={[maxDrawdown * 1.1, 0]}
              width={50}
            />
            <Tooltip content={<DrawdownTooltip />} />
            <ReferenceLine y={0} stroke="#e2e8f0" />
            <Area
              type="monotone"
              dataKey="drawdown"
              stroke="#ef4444"
              strokeWidth={2}
              fill="url(#colorDrawdown)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
