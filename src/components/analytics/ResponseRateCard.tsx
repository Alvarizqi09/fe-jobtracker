"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  ReferenceLine,
} from "recharts";
import type { MonthlyData } from "@/types/analytics.types";

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-(--bg-card) p-3 shadow-xl">
      <div className="text-xs text-(--text-secondary) mb-1">{label}</div>
      <div className="text-sm font-semibold text-(--text-primary)">
        {payload[0].value}% response rate
      </div>
    </div>
  );
}

export function ResponseRateCard({ data }: { data: MonthlyData[] }) {
  // Compute response rate per month (non-applied / total per month)
  const chartData = data.map((m) => {
    const total = m.applied + m.interview + m.offer + m.rejected;
    const responded = m.interview + m.offer + m.rejected;
    const rate = total > 0 ? Math.round((responded / total) * 100) : 0;
    return { month: m.month, rate };
  });

  if (chartData.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-(--bg-card) p-6 h-full">
        <h3 className="font-syne text-base text-(--text-primary) mb-4">
          Response Rate Trend
        </h3>
        <div className="flex items-center justify-center h-36 text-sm text-(--text-secondary)">
          No trend data yet
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-(--bg-card) p-6 h-full">
      <h3 className="font-syne text-base text-(--text-primary) mb-4">
        Response Rate Trend
      </h3>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart
          data={chartData}
          margin={{ top: 5, right: 15, left: -15, bottom: 5 }}
        >
          <defs>
            <linearGradient id="responseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00D4FF" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#00D4FF" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="month"
            tick={{ fill: "#9fb3dc", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            width={40}
            domain={[0, 100]}
            tick={{ fill: "#9fb3dc", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            y={20}
            stroke="#F59E0B"
            strokeDasharray="4 4"
            strokeOpacity={0.5}
            label={{
              value: "Industry avg",
              position: "insideTopLeft",
              fill: "#F59E0B",
              fontSize: 10,
            }}
          />
          <Area
            type="monotone"
            dataKey="rate"
            stroke="#00D4FF"
            strokeWidth={2}
            fill="url(#responseGrad)"
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
