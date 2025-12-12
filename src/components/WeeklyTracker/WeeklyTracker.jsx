import { useMemo, useState } from "react";
import {
  format,
  startOfWeek,
  addDays,
  isSameDay,
  subWeeks,
  addWeeks,
} from "date-fns";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { parseDate } from "../../utils/dateUtils";
import "./WeeklyCategoryTracker.css";

const CATEGORIES = [
  { id: "premarket", label: "Premarket Routine" },
  { id: "structure", label: "Reading Market Structure" },
  { id: "focusList", label: "Planning Focus List" },
  { id: "entry", label: "Trade Entry" },
  { id: "management", label: "Trade Management" },
  { id: "psychology", label: "Psychology" },
];

export function WeeklyCategoryTracker({ data = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const weekStart = useMemo(
    () => startOfWeek(currentDate, { weekStartsOn: 1 }),
    [currentDate]
  );

  const weekDays = useMemo(() => {
    return Array.from({ length: 5 }).map((_, i) => addDays(weekStart, i));
  }, [weekStart]);

  const processedData = useMemo(() => {
    const getColor = (score) => {
      if (score === undefined || score === null) return "bg-none";
      if (score === 0) return "bg-0";
      return `bg-${score}`;
    };

    return CATEGORIES.map((cat) => {
      let totalScore = 0;
      let daysWithData = 0;

      const days = weekDays.map((day) => {
        const dayStr = format(day, "yyyy-MM-dd");
        const entry = data.find((d) => isSameDay(parseDate(d.date), day));
        const score = entry && entry.ratings ? entry.ratings[cat.id] : null;

        if (score !== null) {
          totalScore += score;
          daysWithData++;
        }

        return {
          date: dayStr,
          score: score,
          colorClass: getColor(score),
        };
      });

      return {
        ...cat,
        days,
        average:
          daysWithData > 0 ? (totalScore / daysWithData).toFixed(1) : "-",
      };
    });
  }, [data, weekDays]);

  const handlePrevWeek = () => setCurrentDate(subWeeks(currentDate, 1));
  const handleNextWeek = () => setCurrentDate(addWeeks(currentDate, 1));

  return (
    <div className="category-tracker-card">
      <div className="tracker-header">
        <div className="title-group">
          <h3>Weekly Performance</h3>
          <Info size={14} className="info-icon" />
        </div>

        <div className="week-nav">
          <button onClick={handlePrevWeek} className="nav-btn">
            <ChevronLeft size={16} />
          </button>
          <span className="current-week-label">
            {format(weekStart, "MMM d")} -{" "}
            {format(addDays(weekStart, 4), "MMM d")}
          </span>
          <button onClick={handleNextWeek} className="nav-btn">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="matrix-container">
        <div className="matrix-header-row">
          <div className="col-category">Category</div>
          {weekDays.map((day) => (
            <div key={day.toString()} className="col-day">
              <span className="day-name">{format(day, "EEE")}</span>
              <span className="day-date">{format(day, "d")}</span>
            </div>
          ))}
          <div className="col-avg">Avg</div>
        </div>

        <div className="matrix-body">
          {processedData.map((row) => (
            <div key={row.id} className="matrix-row">
              <div className="col-category row-label">{row.label}</div>

              {row.days.map((day, i) => (
                <div key={i} className="col-day">
                  <div
                    className={`score-cell ${day.colorClass}`}
                    title={`${row.label} on ${day.date}: ${day.score ?? "No Data"}`}
                  >
                    {day.score ?? "-"}
                  </div>
                </div>
              ))}

              <div className="col-avg row-avg">{row.average}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
