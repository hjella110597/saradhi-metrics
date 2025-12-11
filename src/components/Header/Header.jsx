import { format } from "date-fns";
import {
  Settings,
  Filter,
  RefreshCw,
  DollarSign,
  ChevronDown,
} from "lucide-react";
import { DateRangePicker } from "../DateRangePicker";
import "./Header.css";

export function Header({ dateRange, setDateRange, setPresetDateRange }) {
  return (
    <header className="dashboard-header">
      <div className="header-left">
        <h1>Dashboard</h1>
      </div>

      <div className="header-right">
        <button className="header-btn currency-btn">
          <DollarSign size={16} />
          <ChevronDown size={14} />
        </button>

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

export function SubHeader({
  lastImport,
  onRefresh,
  useMockData,
  setUseMockData,
}) {
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

      <div className="data-source-toggle">
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={useMockData}
            onChange={(e) => setUseMockData(e.target.checked)}
          />
          <span>Use Demo Data</span>
        </label>
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
