import { TrendingUp, TrendingDown, Info } from "lucide-react";
import "./MetricCard.css";

export function MetricCard({
  title,
  value,
  subtitle,
  format = "number",
  trend = null,
  icon = null,
  showInfo = true,
  className = "",
}) {
  const formatValue = () => {
    if (format === "currency") {
      const absValue = Math.abs(value);
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(absValue);
      return value < 0 ? `-${formatted}` : formatted;
    }
    if (format === "percent") {
      return `${value.toFixed(2)}%`;
    }
    if (format === "ratio") {
      return value.toFixed(2);
    }
    return value.toString();
  };

  const isPositive = value > 0;
  const isNegative = value < 0;
  const valueClass =
    format === "currency"
      ? isPositive
        ? "positive"
        : isNegative
          ? "negative"
          : ""
      : "";

  return (
    <div className={`metric-card ${className}`}>
      <div className="metric-header">
        <span className="metric-title">{title}</span>
        {showInfo && <Info size={14} className="info-icon" />}
      </div>
      <div className={`metric-value ${valueClass}`}>{formatValue()}</div>
      {subtitle && <div className="metric-subtitle">{subtitle}</div>}
      {trend !== null && (
        <div className={`metric-trend ${trend >= 0 ? "positive" : "negative"}`}>
          {trend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span>{Math.abs(trend).toFixed(1)}%</span>
        </div>
      )}
      {icon && <div className="metric-icon">{icon}</div>}
    </div>
  );
}
