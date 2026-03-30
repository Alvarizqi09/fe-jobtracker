"use client";

import { motion } from "framer-motion";
import { CircleDot, Activity, FileText, Sparkles, PencilLine, Info } from "lucide-react";
import type { ActivityEvent } from "@/types/analytics.types";

const TYPE_CONFIG: Record<
  string,
  { icon: React.ElementType; color: string; label: string }
> = {
  created: { icon: CircleDot, color: "#3B82F6", label: "Created" },
  status_changed: { icon: Activity, color: "#F59E0B", label: "Status Changed" },
  note_added: { icon: FileText, color: "#8B5CF6", label: "Note Added" },
  cover_letter_generated: {
    icon: Sparkles,
    color: "#0EA5E9",
    label: "Cover Letter",
  },
  edited: { icon: PencilLine, color: "#9fb3dc", label: "Edited" },
};

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export function ActivityLog({ events }: { events: ActivityEvent[] }) {
  if (!events.length) {
    return (
      <div className="text-sm text-(--text-secondary) text-center py-8">
        No activity recorded yet
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {events.map((event, i) => {
        const config = TYPE_CONFIG[event.type] ?? {
          icon: Info,
          color: "#9fb3dc",
          label: event.type,
        };
        const Icon = config.icon;

        return (
          <motion.div
            key={event._id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04, duration: 0.25 }}
            className="relative flex gap-3 pb-5 last:pb-0"
          >
            {/* Connector line */}
            <div className="flex flex-col items-center">
              <div
                className="h-7 w-7 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: `${config.color}15`,
                  border: `1.5px solid ${config.color}`,
                  color: config.color,
                }}
              >
                <Icon className="h-3.5 w-3.5" />
              </div>
              {i < events.length - 1 && (
                <div className="flex-1 w-px bg-border mt-1" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-center gap-2">
                <span className="text-sm text-(--text-primary)">
                  {event.description}
                </span>
                <span className="text-xs text-(--text-muted) shrink-0">
                  · {timeAgo(event.timestamp)}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
