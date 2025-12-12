import { format } from "date-fns";
import { parseDate } from "../../utils/dateUtils";
import "./RecentTrades.css";

export function RecentTrades({ trades }) {
  const sortedTrades = [...trades]
    .sort(
      (a, b) =>
        b.timestamp.localeCompare(a.timestamp) ||
        b.sellTime.localeCompare(a.sellTime)
    )
    .slice(0, 20);

  const formatPnL = (value) => {
    const absValue = Math.abs(value);
    return value >= 0 ? `$${absValue.toFixed(0)}` : `-$${absValue.toFixed(0)}`;
  };

  return (
    <div className="recent-trades">
      <div className="trades-header">
        <h3>Recent trades</h3>
      </div>

      <div className="trades-list">
        {sortedTrades.map((trade, index) => (
          <div key={trade.id || index} className="trade-row">
            <span className="trade-date">
              {format(parseDate(trade.timestamp), "MM/dd/yyyy")}
            </span>
            <span className="trade-ticker">{trade.ticker}</span>
            <span
              className={`trade-pnl ${trade.profitLoss >= 0 ? "positive" : "negative"}`}
            >
              {formatPnL(trade.profitLoss)}
            </span>
          </div>
        ))}
      </div>

      <button className="view-more-btn">View More</button>
    </div>
  );
}
