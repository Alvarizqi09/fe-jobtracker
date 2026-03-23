"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { MonthlyData } from "@/types/analytics.types";

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[rgba(60,90,140,0.6)] bg-(--bg-card) p-3 shadow-xl">
      <div className="text-sm font-semibold text-(--text-primary) mb-2">
        {label}
      </div>
      {payload.map((entry: any) => (
        <div
          key={entry.dataKey}
          className="flex items-center gap-2 text-xs py-0.5"
        >
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: entry.color }}
          />
          <span className="text-(--text-secondary) capitalize">
            {entry.dataKey}:
          </span>
          <span className="text-(--text-primary) font-medium">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export function MonthlyChart({ data }: { data: MonthlyData[] }) {
  if (!data.length) {
    return (
      <div className="rounded-xl border border-[rgba(60,90,140,0.5)] bg-(--bg-card) p-6 h-full">
        <h3 className="font-syne text-lg text-(--text-primary) mb-4">
          Monthly Applications
        </h3>
        <div className="flex items-center justify-center h-48 text-sm text-(--text-secondary)">
          No monthly data yet
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[rgba(60,90,140,0.5)] bg-(--bg-card) p-6 h-full">
      <h3 className="font-syne text-lg text-(--text-primary) mb-4">
        Monthly Applications
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 5, left: -10, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(60,90,140,0.2)"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            tick={{ fill: "#9fb3dc", fontSize: 12 }}
            axisLine={{ stroke: "rgba(60,90,140,0.3)" }}
            tickLine={false}
          />
          <YAxis
            width={35}
            allowDecimals={false}
            tick={{ fill: "#9fb3dc", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 12, color: "#9fb3dc" }}
            iconType="circle"
            iconSize={8}
          />
          <Bar
            dataKey="applied"
            name="Applied"
            fill="#3B82F6"
            radius={[4, 4, 0, 0]}
            animationDuration={800}
          />
          <Bar
            dataKey="interview"
            name="Interview"
            fill="#F59E0B"
            radius={[4, 4, 0, 0]}
            animationDuration={800}
          />
          <Bar
            dataKey="offer"
            name="Offer"
            fill="#10B981"
            radius={[4, 4, 0, 0]}
            animationDuration={800}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
