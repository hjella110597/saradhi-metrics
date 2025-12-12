import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine,
} from "recharts";
import { useMemo } from "react";
import { format } from "date-fns";
import { Info } from "lucide-react";
import { parseDate } from "../../utils/dateUtils";
import "./AccountBalance.css";

const BalanceTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const date = payload[0].payload.date;
    return (
      <div className="chart-tooltip">
        <p className="tooltip-date">
          {format(parseDate(date), "MMM dd, yyyy")}
        </p>
        <p className="tooltip-value">
          Balance:{" "}
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

export function AccountBalance({ daySummary }) {
  const chartData = useMemo(() => {
    if (!daySummary || daySummary.length === 0) return [];

    const sortedDays = daySummary
      .filter((day) => day.date)
      .sort((a, b) => a.date.localeCompare(b.date));

    return sortedDays.map((day) => ({
      date: day.date,
      balance: parseFloat((day.endBalance || 0).toFixed(2)),
      displayDate: format(parseDate(day.date), "MM/dd/yy"),
    }));
  }, [daySummary]);

  // Get the starting balance from the first day for the deposit reference line
  const deposits = useMemo(() => {
    if (!daySummary || daySummary.length === 0) return 0;
    const sortedDays = daySummary
      .filter((day) => day.date)
      .sort((a, b) => a.date.localeCompare(b.date));
    return sortedDays[0]?.startBalance || 0;
  }, [daySummary]);

  return (
    <div className="account-balance">
      <div className="chart-header">
        <h3>Account balance</h3>
        <Info size={14} className="info-icon" />
      </div>

      <div className="legend">
        <div className="legend-item">
          <span className="legend-dot balance"></span>
          <span>Account Balance</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot deposits"></span>
          <span>Deposits / Withdrawals</span>
        </div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
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
              tick={{ fontSize: 11, fill: "#475569", fontWeight: 700 }}
              interval="preserveStartEnd"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#475569", fontWeight: 700 }}
              tickFormatter={(value) => `$${value}`}
              width={50}
            />
            <Tooltip content={<BalanceTooltip />} />
            <ReferenceLine
              y={deposits}
              stroke="#ef4444"
              strokeDasharray="5 5"
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#colorBalance)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
