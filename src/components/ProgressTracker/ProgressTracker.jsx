import { useMemo } from "react";
import { format, startOfYear, endOfYear, eachWeekOfInterval } from "date-fns";
import { Info } from "lucide-react";
import "./ProgressTracker.css";

export function ProgressTracker({ trades }) {
  const heatmapData = useMemo(() => {
    // Create a weekly grid for the year
    const year = 2025;
    const start = startOfYear(new Date(year, 0, 1));
    const end = endOfYear(new Date(year, 0, 1));

    const dailyPnL = {};
    trades.forEach((trade) => {
      dailyPnL[trade.timestamp] =
        (dailyPnL[trade.timestamp] || 0) + trade.profitLoss;
    });

    // Group by week and day of week
    const weeks = eachWeekOfInterval({ start, end });

    return weeks.map((weekStart, weekIndex) => {
      const weekDays = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + i);
        const dateStr = format(date, "yyyy-MM-dd");
        const pnl = dailyPnL[dateStr] || 0;
        const hasTrades = dailyPnL[dateStr] !== undefined;

        weekDays.push({
          date: dateStr,
          dayOfWeek: i,
          pnl,
          hasTrades,
          intensity: hasTrades ? Math.min(Math.abs(pnl) / 100, 4) : 0,
        });
      }
      return { weekIndex, days: weekDays };
    });
  }, [trades]);

  const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const todaysScore = useMemo(() => {
    const today = "2025-12-11";
    const todayTrades = trades.filter((t) => t.timestamp === today);
    const completed =
      todayTrades.length > 0 ? Math.min(todayTrades.length, 5) : 0;
    return { completed, total: 5 };
  }, [trades]);

  const getIntensityClass = (day) => {
    if (!day.hasTrades) return "empty";
    if (day.pnl > 200) return "high-positive";
    if (day.pnl > 50) return "medium-positive";
    if (day.pnl > 0) return "low-positive";
    if (day.pnl > -50) return "low-negative";
    if (day.pnl > -200) return "medium-negative";
    return "high-negative";
  };

  return (
    <div className="progress-tracker">
      <div className="tracker-header">
        <h3>Progress tracker</h3>
        <Info size={14} className="info-icon" />
        <a href="#" className="view-more">
          View more
        </a>
      </div>

      <div className="heatmap-container">
        <div className="month-labels">
          {months.map((month) => (
            <span key={month} className="month-label">
              {month}
            </span>
          ))}
        </div>

        <div className="heatmap-grid">
          <div className="day-labels">
            {days.map((day, i) => (
              <span key={day} className="day-label">
                {i % 2 === 1 ? day : ""}
              </span>
            ))}
          </div>

          <div className="weeks-grid">
            {heatmapData.slice(-26).map((week, weekIdx) => (
              <div key={weekIdx} className="week-column">
                {week.days.map((day, dayIdx) => (
                  <div
                    key={dayIdx}
                    className={`heatmap-cell ${getIntensityClass(day)}`}
                    title={
                      day.hasTrades
                        ? `${day.date}: $${day.pnl.toFixed(0)}`
                        : day.date
                    }
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="heatmap-legend">
          <span>Less</span>
          <div className="legend-cells">
            <div className="legend-cell empty"></div>
            <div className="legend-cell low-positive"></div>
            <div className="legend-cell medium-positive"></div>
            <div className="legend-cell high-positive"></div>
          </div>
          <span>More</span>
        </div>
      </div>

      <div className="todays-score">
        <div className="score-header">
          <span>Today's score</span>
          <Info size={14} className="info-icon" />
        </div>
        <div className="score-value">
          {todaysScore.completed}/{todaysScore.total}
        </div>
        <button className="checklist-btn">Daily checklist</button>
      </div>
    </div>
  );
}
