import { format } from "date-fns";
import { useState, useRef, useEffect } from "react";
import {
  Settings,
  Filter,
  RefreshCw,
  DollarSign,
  Percent,
  ChevronUp,
  ChevronDown,
  Check,
} from "lucide-react";
import { DateRangePicker } from "../DateRangePicker";
import "./Header.css";

export function Header({
  title = "Dashboard",
  dateRange,
  setDateRange,
  setPresetDateRange,
  displayMode = "dollar",
  onDisplayModeChange,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <h1>{title}</h1>
      </div>

      <div className="header-right">
        <div className="currency-dropdown" ref={dropdownRef}>
          <button
            className="header-btn currency-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {displayMode === "dollar" ? (
              <DollarSign size={16} />
            ) : (
              <Percent size={16} />
            )}
            <ChevronUp
              size={14}
              className={`dropdown-chevron ${dropdownOpen ? "open" : ""}`}
            />
          </button>
          {dropdownOpen && (
            <div className="currency-dropdown-menu">
              <button
                className={`currency-option ${displayMode === "dollar" ? "active" : ""}`}
                onClick={() => {
                  onDisplayModeChange?.("dollar");
                  setDropdownOpen(false);
                }}
              >
                <DollarSign size={16} className="option-icon" />
                <span>Dollar</span>
                {displayMode === "dollar" && <Check size={16} className="check-icon" />}
              </button>
              <button
                className={`currency-option ${displayMode === "percentage" ? "active" : ""}`}
                onClick={() => {
                  onDisplayModeChange?.("percentage");
                  setDropdownOpen(false);
                }}
              >
                <Percent size={16} className="option-icon" />
                <span>Percentage</span>
                {displayMode === "percentage" && <Check size={16} className="check-icon" />}
              </button>
            </div>
          )}
        </div>

        <button className="header-btn filter-btn">
          <Filter size={16} />
          <span>Filters</span>
          <ChevronDown size={14} />
        </button>

        <DateRangePicker
          dateRange={dateRange}
          setDateRange={setDateRange}
          setPresetDateRange={setPresetDateRange}
        />

        <button className="header-btn account-btn">
          <div className="account-icon">📊</div>
          <span>Webull</span>
          <ChevronDown size={14} />
        </button>
      </div>
    </header>
  );
}

export function SubHeader({ lastImport, onRefresh }) {
  return (
    <div className="sub-header">
      <div className="import-info">
        <span>
          Last import:{" "}
          {lastImport ? format(lastImport, "MMMM d, yyyy h:mm a") : "Never"}
        </span>
        <button className="resync-btn" onClick={onRefresh}>
          <RefreshCw size={14} />
          Resync
        </button>
      </div>

      <div className="header-actions">
        <button className="start-day-btn">
          <span>☀️</span> Start my day
        </button>
        <button className="settings-btn">
          <Settings size={18} />
        </button>
      </div>
    </div>
  );
}
