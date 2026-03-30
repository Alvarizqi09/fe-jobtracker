"use client";

import { motion } from "framer-motion";
import { CircleDot, Activity, FileText, Sparkles, PencilLine, Info } from "lucide-react";
import type { TimelineEvent } from "@/types/analytics.types";

const TYPE_CONFIG: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  created: { icon: CircleDot, color: "#3B82F6", label: "Applied" },
  status_changed: { icon: Activity, color: "#F59E0B", label: "Status Changed" },
  note_added: { icon: FileText, color: "#8B5CF6", label: "Note Added" },
  cover_letter_generated: { icon: Sparkles, color: "#8B5CF6", label: "Cover Letter" },
  edited: { icon: PencilLine, color: "#9fb3dc", label: "Edited" },
};

export function TimelineEventItem({
  event,
  index,
}: {
  event: TimelineEvent;
  index: number;
}) {
  const config = TYPE_CONFIG[event.type] ?? {
    icon: Info,
    color: "#9fb3dc",
    label: event.type,
  };
  const Icon = config.icon;

  // Check if newValue is "offer" for celebration
  const isOffer = event.newValue === "offer";

  const timeStr = new Date(event.timestamp).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateStr = new Date(event.timestamp).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="relative flex gap-4 pb-6 last:pb-0"
    >
      {/* Timeline line */}
      <div className="flex flex-col items-center">
        <div
          className="h-8 w-8 rounded-full flex items-center justify-center shrink-0"
          style={{
            background: `${config.color}20`,
            border: `2px solid ${config.color}`,
            color: config.color,
          }}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 w-px bg-border mt-2" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{
              background: `${config.color}15`,
              color: config.color,
            }}
          >
            {config.label}
          </span>
          <span className="text-xs text-(--text-muted)">
            {dateStr} · {timeStr}
          </span>
        </div>
        <p className="mt-1 text-sm text-(--text-primary) flex items-center gap-1">
          {event.description}
          {isOffer && <Sparkles className="h-4 w-4 text-[#F59E0B]" />}
        </p>
        <p className="text-xs text-(--text-secondary) mt-0.5">
          {event.position} at{" "}
          <span className="text-(--text-primary)">{event.company}</span>
        </p>
      </div>
    </motion.div>
  );
}
