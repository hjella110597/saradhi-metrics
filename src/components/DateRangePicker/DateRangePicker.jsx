import { useState, useRef, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";
import "./DateRangePicker.css";

export function DateRangePicker({
  dateRange,
  setDateRange,
  setPresetDateRange,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempStart, setTempStart] = useState(dateRange.start);
  const [tempEnd, setTempEnd] = useState(dateRange.end);
  const [leftMonth, setLeftMonth] = useState(dateRange.start);
  const [rightMonth, setRightMonth] = useState(dateRange.end);
  const [selecting, setSelecting] = useState("start");
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDateClick = (date) => {
    if (selecting === "start") {
      setTempStart(date);
      setTempEnd(date);
      setSelecting("end");
    } else {
      if (date < tempStart) {
        setTempEnd(tempStart);
        setTempStart(date);
      } else {
        setTempEnd(date);
      }
      setDateRange({
        start: tempStart,
        end: date >= tempStart ? date : tempStart,
      });
      setSelecting("start");
    }
  };

  const handlePreset = (preset) => {
    setPresetDateRange(preset);
    setIsOpen(false);
  };

  const clearFilter = () => {
    setPresetDateRange("ytd");
  };

  const renderMonth = (monthDate, setMonth) => {
    const start = startOfMonth(monthDate);
    const end = endOfMonth(monthDate);
    const days = eachDayOfInterval({ start, end });

    const startPadding = start.getDay();
    const paddedDays = [...Array(startPadding).fill(null), ...days];

    const weeks = [];
    for (let i = 0; i < paddedDays.length; i += 7) {
      weeks.push(paddedDays.slice(i, i + 7));
    }

    return (
      <div className="month-container">
        <div className="month-header">
          <button
            onClick={() => setMonth(subMonths(monthDate, 1))}
            className="nav-btn"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="month-selectors">
            <select
              value={monthDate.getMonth()}
              onChange={(e) =>
                setMonth(
                  new Date(monthDate.getFullYear(), parseInt(e.target.value), 1)
                )
              }
              className="month-select"
            >
              {[
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ].map((m, i) => (
                <option key={m} value={i}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={monthDate.getFullYear()}
              onChange={(e) =>
                setMonth(
                  new Date(parseInt(e.target.value), monthDate.getMonth(), 1)
                )
              }
              className="year-select"
            >
              {[2024, 2025, 2026].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setMonth(addMonths(monthDate, 1))}
            className="nav-btn"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="weekdays">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
            <span key={d} className="weekday">
              {d}
            </span>
          ))}
        </div>

        <div className="days-grid">
          {weeks.map((week, wi) => (
            <div key={wi} className="week">
              {week.map((day, di) => (
                <button
                  key={di}
                  className={`day ${!day ? "empty" : ""} ${day && isSameDay(day, tempStart) ? "selected start" : ""} ${day && isSameDay(day, tempEnd) ? "selected end" : ""} ${day && day > tempStart && day < tempEnd ? "in-range" : ""}`}
                  onClick={() => day && handleDateClick(day)}
                  disabled={!day}
                >
                  {day ? format(day, "d") : ""}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="date-range-picker" ref={ref}>
      <button className="picker-trigger" onClick={() => setIsOpen(!isOpen)}>
        <Calendar size={16} />
        <span>
          {format(dateRange.start, "MMM dd, yyyy")}-
          {format(dateRange.end, "MMM dd, yyyy")}
        </span>
        <X
          size={14}
          className="clear-btn"
          onClick={(e) => {
            e.stopPropagation();
            clearFilter();
          }}
        />
      </button>

      {isOpen && (
        <div className="picker-dropdown">
          <div className="calendars">
            <div className="calendar-section">
              <div className="date-display">
                {format(tempStart, "MMMM dd, yyyy")}
              </div>
              {renderMonth(leftMonth, setLeftMonth)}
            </div>

            <div className="arrow">→</div>

            <div className="calendar-section">
              <div className="date-display">
                {format(tempEnd, "MMMM dd, yyyy")}
              </div>
              {renderMonth(rightMonth, setRightMonth)}
            </div>
          </div>

          <div className="presets">
            <button onClick={() => handlePreset("today")}>Today</button>
            <button onClick={() => handlePreset("thisWeek")}>This week</button>
            <button onClick={() => handlePreset("thisMonth")}>
              This month
            </button>
            <button onClick={() => handlePreset("last30")}>Last 30 days</button>
            <button onClick={() => handlePreset("lastMonth")}>
              Last month
            </button>
            <button onClick={() => handlePreset("thisQuarter")}>
              This quarter
            </button>
            <button onClick={() => handlePreset("ytd")}>
              YTD (year to date)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
