"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const STATUS_COLORS: Record<string, string> = {
  wishlist: "#8B5CF6",
  applied: "#3B82F6",
  interview: "#F59E0B",
  offer: "#10B981",
  rejected: "#EF4444",
};

const STATUS_LABELS: Record<string, string> = {
  wishlist: "Wishlist",
  applied: "Applied",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
};

interface Props {
  byStatus: Record<string, number>;
  total: number;
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const data = payload[0];
  return (
    <div className="rounded-lg border border-border bg-(--bg-card) p-3 shadow-xl">
      <div className="flex items-center gap-2">
        <span
          className="h-3 w-3 rounded-full"
          style={{ background: data.payload.fill }}
        />
        <span className="text-sm text-(--text-primary)">{data.name}</span>
        <span className="text-sm font-semibold text-(--text-primary) ml-auto">
          {data.value}
        </span>
      </div>
    </div>
  );
}

export function StatusPieChart({ byStatus, total }: Props) {
  const data = Object.entries(byStatus)
    .filter(([_, count]) => count > 0)
    .map(([status, count]) => ({
      name: STATUS_LABELS[status] || status,
      value: count,
      fill: STATUS_COLORS[status] || "#666",
    }));

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-(--bg-card) p-6 h-full">
        <h3 className="font-syne text-lg text-(--text-primary) mb-4">
          Status Distribution
        </h3>
        <div className="flex items-center justify-center h-48 text-sm text-(--text-secondary)">
          No jobs yet
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-(--bg-card) p-6 h-full">
      <h3 className="font-syne text-lg text-(--text-primary) mb-4">
        Status Distribution
      </h3>
      <div className="relative">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
              animationEasing="ease-out"
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.fill} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold font-syne text-(--text-primary)">
            {total}
          </span>
          <span className="text-xs text-(--text-muted)">Total Apps</span>
        </div>
      </div>
      {/* Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: entry.fill }}
            />
            <span className="text-xs text-(--text-secondary)">
              {entry.name} ({entry.value})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
