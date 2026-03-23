"use client";

import { memo, useState } from "react";
import { useRouter } from "next/navigation";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { motion } from "framer-motion";
import { MapPin, Pencil, Trash2, Sparkles, Clock, DollarSign, FileText, MoreHorizontal, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn, formatDate } from "@/lib/utils";
import type { Job, JobPriority, JobStatus } from "@/types/job.types";
import { differenceInDays } from "date-fns";

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
  onDelete: (job: Job) => void | Promise<void>;
}) {
  const router = useRouter();
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

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Deadline countdown
  const deadlineDays = job.deadline
    ? differenceInDays(new Date(job.deadline), new Date())
    : null;
  const showDeadline =
    deadlineDays !== null && deadlineDays >= 0 && deadlineDays <= 7;

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
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/jobs/${job._id}`);
            }}
            className="truncate text-[15px] font-semibold text-(--text-primary) hover:text-(--accent-cyan) transition-colors cursor-pointer text-left"
          >
            {job.company}
          </button>
          <div className="mt-0.5 truncate text-sm text-(--text-secondary)">
            {job.position}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger render={
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg-hover) opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            } />
            <DropdownMenuContent align="end" className="w-48 bg-[#192d4d] border-[rgba(60,90,140,0.6)]" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem
                className="cursor-pointer gap-2 hover:bg-(--bg-hover) selection:bg-(--bg-hover)"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `/cover-letter/${job._id}`;
                }}
              >
                <Sparkles className="h-4 w-4 text-[#0ea5e9]" />
                <span>Generate Cover Letter</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer gap-2 hover:bg-(--bg-hover)"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(job);
                }}
              >
                <Pencil className="h-4 w-4 text-(--text-secondary)" />
                <span>Edit Job</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[rgba(60,90,140,0.3)]" />
              <DropdownMenuItem
                className="cursor-pointer gap-2 text-red-400 focus:text-red-400 focus:bg-red-400/10 hover:bg-red-400/10 hover:text-red-400"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteDialog(true);
                }}
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete Job</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
          <span className="text-xs text-(--text-secondary) flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            {job.salary}
          </span>
        ) : null}

        {/* Deadline countdown chip */}
        {showDeadline && (
          <span
            className={cn(
              "inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full",
              deadlineDays <= 3
                ? "bg-[#EF444420] text-[#EF4444]"
                : "bg-[#F59E0B20] text-[#F59E0B]",
            )}
          >
            <Clock className="h-3 w-3" />
            {deadlineDays === 0 ? "Today!" : `${deadlineDays}d`}
          </span>
        )}

        {job.description ? (
          <span className="text-xs text-(--text-secondary) flex items-center gap-1 min-w-0 max-w-xs">
            <FileText className="h-3 w-3 shrink-0" />
            <span className="truncate">
              {job.description.substring(0, 50)}
              {job.description.length > 50 ? "..." : ""}
            </span>
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent 
          className="bg-[#192d4d] border-[rgba(60,90,140,0.6)] sm:max-w-[425px] z-[100]" 
          onClick={(e) => e.stopPropagation()}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-(--text-primary)">Delete Job</AlertDialogTitle>
            <AlertDialogDescription className="text-(--text-secondary)">
              Are you sure you want to delete this job from <span className="text-(--text-primary) font-medium">{job.company}</span>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[rgba(60,90,140,0.4)] text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg-hover) bg-transparent">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 px-4 py-2 rounded-md"
              disabled={isDeleting}
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDeleting(true);
                try {
                  await onDelete(job);
                  setShowDeleteDialog(false);
                } finally {
                  setIsDeleting(false);
                }
              }}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
});
