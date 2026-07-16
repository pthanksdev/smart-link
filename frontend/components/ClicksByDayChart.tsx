"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ClicksByDayChartProps {
  data: Record<string, number>;
}

const axisStyle = { fill: "#9ca3af", fontSize: 12 };
const tooltipStyle = {
  backgroundColor: "rgba(15, 18, 34, 0.95)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "8px",
  color: "#e5e7eb",
};

export default function ClicksByDayChart({ data }: ClicksByDayChartProps) {
  const chartData = Object.entries(data).map(([date, clicks]) => ({
    date,
    clicks,
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-400">
        No click data yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
        <XAxis
          dataKey="date"
          tick={axisStyle}
          axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
          tickLine={{ stroke: "rgba(255,255,255,0.1)" }}
          tickFormatter={(v) => {
            const d = new Date(v);
            return `${d.getMonth() + 1}/${d.getDate()}`;
          }}
        />
        <YAxis
          allowDecimals={false}
          tick={axisStyle}
          axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
          tickLine={{ stroke: "rgba(255,255,255,0.1)" }}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          labelFormatter={(label) => `Date: ${label}`}
          formatter={(value: number) => [value, "Clicks"]}
        />
        <Bar dataKey="clicks" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  );
}
