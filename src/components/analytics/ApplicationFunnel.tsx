"use client";

import { motion } from "framer-motion";
import type { FunnelStage } from "@/types/analytics.types";

const COLORS = ["#3B82F6", "#00D4FF", "#F59E0B", "#10B981"];

export function ApplicationFunnel({ funnel }: { funnel: FunnelStage[] }) {
  if (funnel.length === 0) {
    return (
      <div className="analytics-section rounded-xl border border-[rgba(60,90,140,0.5)] bg-(--bg-card) p-6">
        <h3 className="font-syne text-lg text-(--text-primary) mb-4">
          Application Funnel
        </h3>
        <div className="text-sm text-(--text-secondary) text-center py-8">
          No data yet — start applying to jobs!
        </div>
      </div>
    );
  }

  const maxCount = Math.max(...funnel.map((s) => s.count), 1);

  return (
    <div className="analytics-section rounded-xl border border-[rgba(60,90,140,0.5)] bg-(--bg-card) p-6">
      <h3 className="font-syne text-lg text-(--text-primary) mb-6">
        Application Funnel
      </h3>
      <div className="flex flex-col gap-3">
        {funnel.map((stage, i) => {
          const widthPercent = Math.max((stage.count / maxCount) * 100, 8);
          return (
            <motion.div
              key={stage.stage}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{
                delay: i * 0.15,
                duration: 0.5,
                ease: "easeOut",
              }}
              style={{ originX: 0 }}
              className="flex items-center gap-4"
            >
              <div className="w-24 shrink-0 text-sm text-(--text-secondary) text-right">
                {stage.stage}
              </div>
              <div className="flex-1 relative">
                <div
                  className="h-10 rounded-lg flex items-center px-4 relative overflow-hidden"
                  style={{
                    width: `${widthPercent}%`,
                    background: `linear-gradient(135deg, ${COLORS[i]}40, ${COLORS[i]}20)`,
                    border: `1px solid ${COLORS[i]}50`,
                  }}
                >
                  <span
                    className="text-sm font-semibold"
                    style={{ color: COLORS[i] }}
                  >
                    {stage.count}
                  </span>
                  <span className="ml-2 text-xs text-(--text-muted)">
                    ({stage.percentage}%)
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      {/* Conversion arrows */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-(--text-muted)">
        {funnel.slice(1).map((stage, i) => (
          <span key={stage.stage} className="flex items-center gap-1">
            <span>{funnel[i]?.stage}</span>
            <span>→</span>
            <span>
              {stage.stage} ({stage.percentage}%)
            </span>
            {i < funnel.length - 2 && <span className="mx-2">|</span>}
          </span>
        ))}
      </div>
    </div>
  );
}
