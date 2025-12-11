import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import "./WinRateDonut.css";

export function WinRateDonut({ wins, losses, label }) {
  const total = wins + losses;
  const winPercent = total > 0 ? (wins / total) * 100 : 0;

  const data = [
    { name: "Wins", value: wins, color: "#10b981" },
    { name: "Losses", value: losses, color: "#fee2e2" },
  ];

  return (
    <div className="win-rate-donut">
      <ResponsiveContainer width={70} height={70}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={22}
            outerRadius={32}
            paddingAngle={2}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="donut-labels">
        <span className="wins">{wins}</span>
        <span className="losses">{losses}</span>
      </div>
    </div>
  );
}
