"use client";

import { memo } from "react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { motion } from "framer-motion";
import { MapPin, Pencil, Trash2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatDate } from "@/lib/utils";
import type { Job, JobPriority, JobStatus } from "@/types/job.types";

function priorityColor(priority: JobPriority): string {
  if (priority === "high") return "var(--priority-high)";
  if (priority === "medium") return "var(--priority-medium)";
  return "var(--priority-low)";
}

function statusAccentColor(status: JobStatus): string {
  const map: Record<JobStatus, string> = {
    wishlist: "#8B5CF6",
    applied: "#3B82F6",
    interview: "#F59E0B",
    offer: "#10B981",
    rejected: "#EF4444",
  };
  return map[status] ?? "#3B82F6";
}

export const JobCard = memo(function JobCard({
  job,
  onEdit,
  onDelete,
}: {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (job: Job) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: job._id,
    data: { type: "job", jobId: job._id },
  });

  const accentColor = statusAccentColor(job.status);

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      whileHover={{
        y: -2,
        boxShadow: `0 0 0 1px ${accentColor}66, 0 8px 24px rgba(0,0,0,0.45)`,
      }}
      className={cn(
        "group relative rounded-xl border border-[rgba(60,90,140,0.65)] overflow-hidden p-4 pl-5",
        "bg-[#192d4d]",
        "shadow-[0_2px_12px_rgba(0,0,0,0.5)]",
        "transition will-change-transform",
        isDragging && "ring-2 ring-(--accent-cyan) opacity-50",
      )}
      {...attributes}
      {...listeners}
    >
      {/* status accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-0.75"
        style={{ background: accentColor }}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-[15px] font-semibold text-(--text-primary)">
            {job.company}
          </div>
          <div className="mt-0.5 truncate text-sm text-(--text-secondary)">
            {job.position}
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
          <Button
            type="button"
            title="Generate Cover Letter"
            size="icon"
            variant="ghost"
            className="h-8 w-8 hover:bg-(--bg-hover)"
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `/cover-letter/${job._id}`;
            }}
          >
            <Sparkles className="h-4 w-4 text-[#0ea5e9]" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-8 w-8 hover:bg-(--bg-hover)"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(job);
            }}
          >
            <Pencil className="h-4 w-4 text-(--text-secondary)" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-8 w-8 hover:bg-(--bg-hover)"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(job);
            }}
          >
            <Trash2 className="h-4 w-4 text-(--status-rejected)" />
          </Button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge
          variant="secondary"
          className="bg-[rgba(15,25,45,0.7)] text-(--text-primary) border border-[rgba(60,90,140,0.6)]"
        >
          <span
            className="mr-2 inline-block h-2 w-2 rounded-full"
            style={{ background: priorityColor(job.priority) }}
          />
          {job.priority}
        </Badge>

        {job.appliedDate ? (
          <span className="font-jetbrains text-xs text-(--text-secondary)">
            {formatDate(job.appliedDate)}
          </span>
        ) : null}

        {job.salary ? (
          <span className="text-xs text-(--text-secondary)">
            <span className="mr-1">💰</span>
            {job.salary}
          </span>
        ) : null}

        {job.description ? (
          <span className="text-xs text-(--text-secondary) truncate max-w-xs">
            <span className="mr-1">📝</span>
            {job.description.substring(0, 50)}
            {job.description.length > 50 ? "..." : ""}
          </span>
        ) : null}
      </div>

      {job.tags && job.tags.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {job.tags.slice(0, 2).map((t) => (
            <span
              key={t}
              className="rounded-md border border-[rgba(60,90,140,0.6)] bg-[rgba(15,25,45,0.6)] px-2 py-1 text-xs text-(--text-secondary)"
            >
              {t}
            </span>
          ))}
          {job.tags.length > 2 ? (
            <span className="text-xs text-(--text-secondary)">
              +{job.tags.length - 2} more
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="mt-4 flex items-center justify-between">
        {job.location ? (
          <div className="flex items-center gap-1 text-xs text-(--text-secondary)">
            <MapPin className="h-4 w-4" />
            <span className="truncate max-w-45">{job.location}</span>
          </div>
        ) : (
          <div />
        )}
        <div className="font-jetbrains text-[10px] text-(--text-muted)">
          #{job._id.slice(-6)}
        </div>
      </div>
    </motion.div>
  );
});
