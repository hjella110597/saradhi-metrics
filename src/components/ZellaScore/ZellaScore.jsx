import { useMemo } from "react";
import { Info } from "lucide-react";
import "./ZellaScore.css";

export function ZellaScore({ metrics }) {
  const scores = useMemo(() => {
    // Calculate individual component scores (0-100 scale)
    const winRate = Math.min(metrics.tradeWinPercent, 100);
    const profitFactor = Math.min((metrics.profitFactor / 3) * 100, 100); // 3.0+ is excellent
    const consistency = Math.min((metrics.dayWinPercent / 100) * 100, 100);
    const avgWinLoss = Math.min((metrics.avgWinLossRatio / 3) * 100, 100); // 3.0+ is excellent
    const maxDrawdown = Math.max(100 - (metrics.maxDrawdown / 1000) * 100, 0); // Lower is better
    const recoveryFactor =
      metrics.totalLoss > 0
        ? Math.min((metrics.netPnL / metrics.maxDrawdown) * 50, 100)
        : 50;

    return {
      winPercent: winRate,
      profitFactor: profitFactor,
      consistency: consistency,
      avgWinLoss: avgWinLoss,
      maxDrawdown: maxDrawdown,
      recoveryFactor: Math.max(recoveryFactor, 0),
    };
  }, [metrics]);

  const overallScore = useMemo(() => {
    const values = Object.values(scores);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    return Math.round(avg);
  }, [scores]);

  const getScoreColor = (score) => {
    if (score >= 70) return "#10b981";
    if (score >= 40) return "#f59e0b";
    return "#ef4444";
  };

  const radarPoints = useMemo(() => {
    const centerX = 100;
    const centerY = 100;
    const maxRadius = 70;

    const labels = [
      { key: "winPercent", label: "Win %", angle: -90 },
      { key: "profitFactor", label: "Profit factor", angle: -30 },
      { key: "avgWinLoss", label: "Avg win/loss", angle: 30 },
      { key: "recoveryFactor", label: "Recovery factor", angle: 90 },
      { key: "maxDrawdown", label: "Max drawdown", angle: 150 },
      { key: "consistency", label: "Consistency", angle: 210 },
    ];

    return labels.map(({ key, label, angle }) => {
      const rad = (angle * Math.PI) / 180;
      const value = scores[key] / 100;
      const radius = value * maxRadius;

      return {
        key,
        label,
        x: centerX + radius * Math.cos(rad),
        y: centerY + radius * Math.sin(rad),
        labelX: centerX + (maxRadius + 25) * Math.cos(rad),
        labelY: centerY + (maxRadius + 25) * Math.sin(rad),
        value: scores[key],
      };
    });
  }, [scores]);

  return (
    <div className="zella-score">
      <div className="score-header">
        <h3>Zella score</h3>
        <Info size={14} className="info-icon" />
      </div>

      <div className="radar-chart">
        <svg viewBox="0 0 200 200" className="radar-svg">
          {[0.25, 0.5, 0.75, 1].map((scale, i) => (
            <polygon
              key={i}
              points={radarPoints
                .map((p) => {
                  const centerX = 100;
                  const centerY = 100;
                  const angle = Math.atan2(p.y - centerY, p.x - centerX);
                  const radius = 70 * scale;
                  return `${centerX + radius * Math.cos(angle)},${centerY + radius * Math.sin(angle)}`;
                })
                .join(" ")}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="1"
            />
          ))}

          {radarPoints.map((p, i) => (
            <line
              key={i}
              x1="100"
              y1="100"
              x2={
                100 +
                70 * Math.cos(([-90, -30, 30, 90, 150, 210][i] * Math.PI) / 180)
              }
              y2={
                100 +
                70 * Math.sin(([-90, -30, 30, 90, 150, 210][i] * Math.PI) / 180)
              }
              stroke="#e2e8f0"
              strokeWidth="1"
            />
          ))}

          <polygon
            points={radarPoints.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="rgba(99, 102, 241, 0.2)"
            stroke="#6366f1"
            strokeWidth="2"
          />

          {radarPoints.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="4" fill="#6366f1" />
          ))}
        </svg>

        <div className="radar-labels">
          {radarPoints.map((p, i) => (
            <span key={i} className={`radar-label radar-label-${i}`}>
              {p.label}
            </span>
          ))}
        </div>
      </div>

      <div className="overall-score">
        <div className="score-label">Your Zella Score</div>
        <div className="score-inline">
          <div
            className="score-value"
            style={{ color: getScoreColor(overallScore) }}
          >
            {overallScore}
          </div>
          <div className="score-divider"></div>
          <div className="score-bar-container">
            <div className="score-bar">
              <div
                className="score-bar-fill"
                style={{
                  width: `${overallScore}%`,
                  background: `linear-gradient(to right, #ef4444, #f59e0b ${40}%, #10b981 ${70}%)`,
                }}
              />
              <div
                className="score-marker"
                style={{ left: `${overallScore}%` }}
              />
            </div>
            <div className="score-scale">
              <span>0</span>
              <span>20</span>
              <span>40</span>
              <span>60</span>
              <span>80</span>
              <span>100</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
