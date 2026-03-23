"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";
import type { SalaryRange } from "@/types/analytics.types";

const SALARY_COLORS = ["#3B82F6", "#00D4FF", "#8B5CF6", "#F59E0B", "#10B981"];

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[rgba(60,90,140,0.6)] bg-(--bg-card) p-3 shadow-xl">
      <div className="text-sm text-(--text-primary)">
        {payload[0].payload.range}: <strong>{payload[0].value}</strong> jobs
      </div>
    </div>
  );
}

export function SalaryRangeChart({ data }: { data: SalaryRange[] }) {
  if (!data.length) {
    return (
      <div className="rounded-xl border border-[rgba(60,90,140,0.5)] bg-(--bg-card) p-6 h-full">
        <h3 className="font-syne text-base text-(--text-primary) mb-4">
          Salary Distribution
        </h3>
        <div className="flex items-center justify-center h-36 text-sm text-(--text-secondary)">
          No salary data
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[rgba(60,90,140,0.5)] bg-(--bg-card) p-6 h-full">
      <h3 className="font-syne text-base text-(--text-primary) mb-4">
        Salary Distribution
      </h3>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <XAxis
            type="number"
            allowDecimals={false}
            tick={{ fill: "#9fb3dc", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="range"
            width={75}
            tick={{ fill: "#9fb3dc", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" radius={[0, 6, 6, 0]} animationDuration={800}>
            {data.map((_, i) => (
              <Cell key={i} fill={SALARY_COLORS[i % SALARY_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
