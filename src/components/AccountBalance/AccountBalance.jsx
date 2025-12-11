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
import { format, parseISO } from "date-fns";
import { Info } from "lucide-react";
import "./AccountBalance.css";

const BalanceTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    return (
      <div className="chart-tooltip">
        <p className="tooltip-date">
          {format(parseISO(label), "MMM dd, yyyy")}
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

export function AccountBalance({ trades, initialBalance = 1500 }) {
  const chartData = useMemo(() => {
    const dailyPnL = {};

    trades.forEach((trade) => {
      const day = trade.timestamp;
      dailyPnL[day] = (dailyPnL[day] || 0) + trade.profitLoss;
    });

    const sortedDays = Object.keys(dailyPnL).sort();

    // Use reduce to accumulate without reassignment
    const result = sortedDays.reduce((acc, date) => {
      const prevBalance =
        acc.length > 0 ? acc[acc.length - 1].balance : initialBalance;
      const newBalance = prevBalance + dailyPnL[date];
      acc.push({
        date,
        balance: parseFloat(newBalance.toFixed(2)),
        displayDate: format(parseISO(date), "MM/dd/yy"),
      });
      return acc;
    }, []);

    return result;
  }, [trades, initialBalance]);

  const deposits = 1300;

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
        <ResponsiveContainer width="100%" height={180}>
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
              tick={{ fontSize: 9, fill: "#94a3b8" }}
              interval="preserveStartEnd"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fill: "#94a3b8" }}
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
