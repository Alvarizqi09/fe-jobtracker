"use client";

import { motion } from "framer-motion";

interface Props {
  answered: number;
  total: number;
}

export function PrepProgress({ answered, total }: Props) {
  const pct = total === 0 ? 0 : Math.round((answered / total) * 100);

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 rounded-full bg-[rgba(15,25,45,0.7)] overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background:
              pct === 100
                ? "var(--status-offer)"
                : "linear-gradient(90deg, var(--accent-cyan), var(--accent-blue))",
          }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      <span className="text-xs font-jetbrains text-(--text-muted) whitespace-nowrap">
        {answered}/{total} ({pct}%)
      </span>
    </div>
  );
}
