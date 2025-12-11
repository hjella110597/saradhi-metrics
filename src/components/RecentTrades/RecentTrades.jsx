import { useState } from "react";
import { format, parseISO } from "date-fns";
import "./RecentTrades.css";

export function RecentTrades({ trades }) {
  const [activeTab, setActiveTab] = useState("recent");

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
        <div className="tabs">
          <button
            className={`tab ${activeTab === "recent" ? "active" : ""}`}
            onClick={() => setActiveTab("recent")}
          >
            Recent trades
          </button>
          <button
            className={`tab ${activeTab === "open" ? "active" : ""}`}
            onClick={() => setActiveTab("open")}
          >
            Open positions
          </button>
        </div>
      </div>

      <div className="trades-list">
        {activeTab === "recent" ? (
          sortedTrades.map((trade, index) => (
            <div key={trade.id || index} className="trade-row">
              <span className="trade-date">
                {format(parseISO(trade.timestamp), "MM/dd/yyyy")}
              </span>
              <span className="trade-ticker">{trade.ticker}</span>
              <span
                className={`trade-pnl ${trade.profitLoss >= 0 ? "positive" : "negative"}`}
              >
                {formatPnL(trade.profitLoss)}
              </span>
            </div>
          ))
        ) : (
          <div className="no-positions">No open positions</div>
        )}
      </div>

      <button className="view-more-btn">View More</button>
    </div>
  );
}
