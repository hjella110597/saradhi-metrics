import { useState } from "react";
import {
  LayoutDashboard,
  TrendingUp,
  AlertTriangle,
  Rocket,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "./Sidebar.css";

export function Sidebar({ activeSection, onSectionChange }) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "performance", label: "Performance", icon: TrendingUp },
    { id: "leaks", label: "Where are the leaks?", icon: AlertTriangle },
    { id: "pushers", label: "What are the pushers?", icon: Rocket },
  ];

  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">📊</span>
          {!isCollapsed && <span className="logo-text">Saradhi Metrics</span>}
        </div>
        <button
          className="collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`nav-item ${activeSection === item.id ? "active" : ""}`}
              onClick={() => onSectionChange(item.id)}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon size={20} />
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
