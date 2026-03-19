"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ExternalLink,
  Pencil,
  Trash2,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Job, JobPriority, JobStatus } from "@/types/job.types";

const STATUS_CONFIG: Record<
  JobStatus,
  { label: string; color: string; bg: string }
> = {
  wishlist: { label: "Wishlist", color: "#8B5CF6", bg: "#8B5CF620" },
  applied: { label: "Applied", color: "#3B82F6", bg: "#3B82F620" },
  interview: { label: "Interview", color: "#F59E0B", bg: "#F59E0B20" },
  offer: { label: "Offer", color: "#10B981", bg: "#10B98120" },
  rejected: { label: "Rejected", color: "#EF4444", bg: "#EF444420" },
};

const PRIORITY_CONFIG: Record<
  JobPriority,
  { label: string; color: string }
> = {
  low: { label: "Low", color: "#10B981" },
  medium: { label: "Medium", color: "#F59E0B" },
  high: { label: "High", color: "#EF4444" },
};

interface Props {
  job: Job;
  onEdit: () => void;
  onDelete: () => void;
}

export function JobDetailHeader({ job, onEdit, onDelete }: Props) {
  const router = useRouter();
  const statusConfig = STATUS_CONFIG[job.status];
  const priorityConfig = PRIORITY_CONFIG[job.priority];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl border border-[rgba(60,90,140,0.5)] bg-(--bg-card) p-5 md:p-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-(--text-secondary) hover:bg-(--bg-hover) shrink-0 mt-1"
            onClick={() => router.push("/board")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="min-w-0">
            <h1 className="font-syne text-2xl md:text-3xl text-(--text-primary) tracking-tight">
              {job.company}
            </h1>
            <p className="text-lg text-(--text-secondary) mt-0.5">
              {job.position}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge
                className="text-xs font-medium border-0"
                style={{
                  background: statusConfig.bg,
                  color: statusConfig.color,
                }}
              >
                {statusConfig.label}
              </Badge>
              <Badge
                variant="secondary"
                className="bg-[rgba(15,25,45,0.7)] text-(--text-primary) border border-[rgba(60,90,140,0.6)]"
              >
                <span
                  className="mr-1.5 inline-block h-2 w-2 rounded-full"
                  style={{ background: priorityConfig.color }}
                />
                {priorityConfig.label} Priority
              </Badge>
              {job.location && (
                <span className="text-xs text-(--text-secondary)">
                  📍 {job.location}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {job.jobUrl && (
            <Button
              variant="ghost"
              size="sm"
              className="text-(--text-secondary) hover:bg-(--bg-hover)"
              onClick={() => window.open(job.jobUrl, "_blank")}
            >
              <ExternalLink className="h-4 w-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Job URL</span>
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="text-[#0ea5e9] hover:bg-[#0ea5e910]"
            onClick={() =>
              router.push(`/cover-letter/${job._id}`)
            }
          >
            <Sparkles className="h-4 w-4 sm:mr-1.5" />
            <span className="hidden sm:inline">Cover Letter</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:bg-(--bg-hover)"
            onClick={onEdit}
          >
            <Pencil className="h-4 w-4 text-(--text-secondary)" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:bg-[#EF444410]"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4 text-(--status-rejected)" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
