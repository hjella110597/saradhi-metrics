import { useMemo } from "react";
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isSameMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import "./Calendar.css";

export function Calendar({ trades }) {
  const [currentMonth, setCurrentMonth] = useState(new Date("2025-03-01"));

  const calendarData = useMemo(() => {
    const dailyData = {};

    trades.forEach((trade) => {
      const day = trade.timestamp;
      if (!dailyData[day]) {
        dailyData[day] = { pnl: 0, trades: 0, wins: 0 };
      }
      dailyData[day].pnl += trade.profitLoss;
      dailyData[day].trades += 1;
      if (trade.profitLoss > 0) dailyData[day].wins += 1;
    });

    return dailyData;
  }, [trades]);

  const weeks = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    const days = eachDayOfInterval({ start, end });

    const weeksArray = [];
    let week = [];

    days.forEach((day) => {
      const dateStr = format(day, "yyyy-MM-dd");
      const data = calendarData[dateStr];

      week.push({
        date: day,
        dateStr,
        isCurrentMonth: isSameMonth(day, currentMonth),
        dayOfWeek: getDay(day),
        ...data,
      });

      if (week.length === 7) {
        weeksArray.push(week);
        week = [];
      }
    });

    if (week.length > 0) {
      weeksArray.push(week);
    }

    return weeksArray;
  }, [currentMonth, calendarData]);

  const weeklyStats = useMemo(() => {
    const stats = [];
    let weekNum = 1;

    weeks.forEach((week) => {
      const weekData = week.filter((d) => d.isCurrentMonth && d.trades > 0);
      if (weekData.length > 0 || week.some((d) => d.isCurrentMonth)) {
        const pnl = weekData.reduce((sum, d) => sum + (d.pnl || 0), 0);
        const days = weekData.length;
        stats.push({ week: weekNum++, pnl, days });
      }
    });

    return stats;
  }, [weeks]);

  const monthlyPnL = useMemo(() => {
    return Object.entries(calendarData)
      .filter(([date]) => isSameMonth(parseISO(date), currentMonth))
      .reduce((sum, [, data]) => sum + data.pnl, 0);
  }, [calendarData, currentMonth]);

  const tradingDays = useMemo(() => {
    return Object.entries(calendarData).filter(([date]) =>
      isSameMonth(parseISO(date), currentMonth)
    ).length;
  }, [calendarData, currentMonth]);

  return (
    <div className="calendar-section">
      <div className="calendar-container">
        <div className="calendar-header">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="nav-btn"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="month-label">
            {format(currentMonth, "MMMM yyyy")}
          </span>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="nav-btn"
          >
            <ChevronRight size={18} />
          </button>
          <button
            className="this-month-btn"
            onClick={() => setCurrentMonth(new Date("2025-12-01"))}
          >
            This month
          </button>
        </div>

        <div className="calendar-grid">
          <div className="weekday-header">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="weekday">
                {day}
              </div>
            ))}
          </div>

          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="week-row">
              {week.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className={`calendar-day ${!day.isCurrentMonth ? "other-month" : ""} ${day.trades > 0 ? (day.pnl >= 0 ? "positive" : "negative") : ""}`}
                >
                  <span className="day-number">{format(day.date, "d")}</span>
                  {day.trades > 0 && day.isCurrentMonth && (
                    <div className="day-stats">
                      <span
                        className={`day-pnl ${day.pnl >= 0 ? "positive" : "negative"}`}
                      >
                        {day.pnl >= 0 ? "" : "-"}${Math.abs(day.pnl).toFixed(0)}
                      </span>
                      <span className="day-trades">
                        {day.trades} trade{day.trades > 1 ? "s" : ""}
                      </span>
                      <span className="day-winrate">
                        {((day.wins / day.trades) * 100).toFixed(0)}%
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="monthly-stats">
          <span>Monthly stats:</span>
          <span
            className={`monthly-pnl ${monthlyPnL >= 0 ? "positive" : "negative"}`}
          >
            {monthlyPnL >= 0 ? "" : "-"}${Math.abs(monthlyPnL).toFixed(0)}
          </span>
          <span className="trading-days">{tradingDays} days</span>
        </div>
      </div>

      <div className="weekly-summary">
        {weeklyStats.map((stat, index) => (
          <div key={index} className="week-stat">
            <span className="week-label">Week {stat.week}</span>
            <span
              className={`week-pnl ${stat.pnl >= 0 ? "positive" : "negative"}`}
            >
              {stat.pnl >= 0 ? "" : "-"}${Math.abs(stat.pnl).toFixed(0)}
            </span>
            <span className="week-days">
              {stat.days} day{stat.days !== 1 ? "s" : ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
