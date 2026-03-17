"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import gsap from "gsap";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { KanbanColumn as KanbanColumnType, Job } from "@/types/job.types";
import { JobCard } from "./JobCard";

export function KanbanColumn({
  column,
  icon,
  isDropTarget,
  onAdd,
  onEdit,
  onDelete,
}: {
  column: KanbanColumnType;
  icon: string;
  isDropTarget: boolean;
  onAdd: (statusId: KanbanColumnType["id"]) => void;
  onEdit: (job: Job) => void;
  onDelete: (job: Job) => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { setNodeRef } = useDroppable({ id: `col:${column.id}` });

  useLayoutEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    // kill any leftover tweens from previous mount
    gsap.killTweensOf(el);
    gsap.fromTo(
      el,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
    );
    return () => {
      gsap.killTweensOf(el);
      // ensure element is fully visible in case cleanup fires mid-animation
      gsap.set(el, { opacity: 1, y: 0 });
    };
  }, []);

  const jobIds = useMemo(() => column.jobs.map((j) => j._id), [column.jobs]);

  return (
    <div ref={ref} className="kanban-col w-[320px] shrink-0 h-full min-h-0">
      <div
        ref={(node) => {
          setNodeRef(node);
        }}
        className={cn(
          "h-full rounded-2xl border border-border flex flex-col",
          "bg-[linear-gradient(180deg,rgba(12,20,36,0.95)_0%,rgba(10,16,30,0.95)_100%)]",
          "shadow-[0_0_0_1px_rgba(38,58,88,0.35),0_18px_60px_rgba(0,0,0,0.35)]",
          isDropTarget &&
            "drop-target border-(--border-bright) shadow-[0_0_24px_var(--accent-glow)]",
        )}
      >
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-(--bg-card)">
                <span className="text-base">{icon}</span>
              </span>
              <div className="min-w-0">
                <div className="font-syne text-sm tracking-wide text-(--text-primary) flex items-center gap-2">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ background: column.color }}
                  />
                  <span className="truncate">{column.title}</span>
                </div>
                <div className="mt-0.5 text-xs text-(--text-secondary)">
                  Drag, drop, iterate
                </div>
              </div>
            </div>
            <motion.div
              key={column.jobs.length}
              initial={{ scale: 0.9, opacity: 0.6 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 420, damping: 28 }}
            >
              <Badge className="bg-(--bg-card) border border-border text-(--text-primary)">
                {column.jobs.length}
              </Badge>
            </motion.div>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3">
            <SortableContext
              items={jobIds}
              strategy={verticalListSortingStrategy}
            >
              <motion.div
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: {
                    transition: { staggerChildren: 0.06 },
                  },
                }}
                className="space-y-3"
              >
                {column.jobs.map((job) => (
                  <motion.div
                    key={job._id}
                    variants={{
                      hidden: { opacity: 0, y: 8 },
                      show: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.25 }}
                  >
                    <JobCard job={job} onEdit={onEdit} onDelete={onDelete} />
                  </motion.div>
                ))}
              </motion.div>
            </SortableContext>
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border shrink-0">
          <Button
            type="button"
            className="w-full bg-(--bg-card) border border-border text-(--text-primary) hover:bg-(--bg-hover)"
            onClick={() => onAdd(column.id)}
          >
            Add Job
          </Button>
        </div>
      </div>
    </div>
  );
}
