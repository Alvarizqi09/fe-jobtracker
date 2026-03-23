"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { TagCount } from "@/types/analytics.types";

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[rgba(60,90,140,0.6)] bg-(--bg-card) p-3 shadow-xl">
      <div className="text-sm text-(--text-primary)">
        {payload[0].payload.tag}: <strong>{payload[0].value}</strong> jobs
      </div>
    </div>
  );
}

export function MostAppliedTags({ data }: { data: TagCount[] }) {
  if (!data.length) {
    return (
      <div className="rounded-xl border border-[rgba(60,90,140,0.5)] bg-(--bg-card) p-6 h-full">
        <h3 className="font-syne text-base text-(--text-primary) mb-4">
          Most Applied Tags
        </h3>
        <div className="flex items-center justify-center h-36 text-sm text-(--text-secondary)">
          No tags yet
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[rgba(60,90,140,0.5)] bg-(--bg-card) p-6 h-full">
      <h3 className="font-syne text-base text-(--text-primary) mb-4">
        Most Applied Tags
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
            dataKey="tag"
            width={100}
            tick={{ fill: "#9fb3dc", fontSize: 11 }}
            tickFormatter={(value: string) => value.length > 12 ? value.substring(0, 12) + "..." : value}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="count"
            fill="#8B5CF6"
            radius={[0, 6, 6, 0]}
            animationDuration={800}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
