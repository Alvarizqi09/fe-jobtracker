"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import toast from "react-hot-toast";
import type { Job, JobStatus, TestType } from "@/types/job.types";
import { useJobs } from "@/hooks/useJobs";
import { useSearch } from "@/hooks/useSearch";
import { useDragDrop } from "@/hooks/useDragDrop";
import { useJobStore } from "@/store/jobStore";
import { KanbanColumn } from "./KanbanColumn";
import { JobCard } from "./JobCard";
import { AddJobModal } from "./AddJobModal";
import { FilterBar } from "@/components/search/FilterBar";
import { Star, Send, ClipboardCheck, MessageSquare, Target, XCircle } from "lucide-react";

export const KANBAN_COLUMNS: {
  id: JobStatus;
  title: string;
  color: string;
  icon: React.ElementType;
}[] = [
  { id: "wishlist", title: "Wishlist", color: "#8B5CF6", icon: Star },
  { id: "applied", title: "Applied", color: "#3B82F6", icon: Send },
  { id: "online_test", title: "Test", color: "#06B6D4", icon: ClipboardCheck },
  { id: "interview", title: "Interview", color: "#F59E0B", icon: MessageSquare },
  { id: "offer", title: "Offer", color: "#10B981", icon: Target },
  { id: "rejected", title: "Rejected", color: "#EF4444", icon: XCircle },
];

function getColumnIdFromOverId(overId: string): JobStatus | null {
  if (overId.startsWith("col:")) return overId.replace("col:", "") as JobStatus;
  return null;
}

export function KanbanBoard() {
  const { fetchJobs, createJob, updateJob, updateJobStatus, deleteJob } =
    useJobs();
  const getByStatus = useJobStore((s) => s.getByStatus);
  const setJobs = useJobStore((s) => s.setJobs);
  const jobs = useJobStore((s) => s.jobs);

  const {
    filters,
    filteredJobs,
    activeFilterCount,
    allTags,
    updateFilter,
    clearFilters,
  } = useSearch();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );
  const { state, handlers } = useDragDrop();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [modalStatus, setModalStatus] = useState<JobStatus>("wishlist");
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  // Test type picker state (shown when dragging to "Test" column)
  const [testTypePickerJob, setTestTypePickerJob] = useState<{
    jobId: string;
    nextJobs: Job[];
    previousJobs: Job[];
    status: JobStatus;
    order: number;
  } | null>(null);

  useEffect(() => {
    fetchJobs().catch(() => {
      toast.error("Failed to load jobs");
    });
  }, [fetchJobs]);

  // Build columns from filtered jobs when filters active, or all jobs when not
  const columns = useMemo(() => {
    const sourceJobs = activeFilterCount > 0 ? filteredJobs : jobs;
    return KANBAN_COLUMNS.map((c) => {
      const colJobs = sourceJobs
        .filter((j) => j.status === c.id)
        .sort((a, b) => a.order - b.order);
      return {
        id: c.id,
        title: c.title,
        color: c.color,
        jobs: colJobs,
        icon: c.icon,
      };
    });
  }, [activeFilterCount, filteredJobs, jobs]);

  const onAdd = (status: JobStatus) => {
    setModalMode("create");
    setModalStatus(status);
    setEditingJob(null);
    setModalOpen(true);
  };

  const onEdit = (job: Job) => {
    setModalMode("edit");
    setModalStatus(job.status);
    setEditingJob(job);
    setModalOpen(true);
  };

  const onDelete = async (job: Job) => {
    try {
      await deleteJob(job._id);
      toast.success("Job deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleDragEnd = async (event: DragEndEvent): Promise<void> => {
    handlers.onDragEnd(event);
    const activeId = String(event.active.id);
    const overId = event.over?.id ? String(event.over.id) : null;
    if (!overId) return;

    const activeJob = jobs.find((j) => j._id === activeId);
    if (!activeJob) return;

    const overColumnId =
      getColumnIdFromOverId(overId) ??
      jobs.find((j) => j._id === overId)?.status ??
      null;
    if (!overColumnId) return;

    const targetJobs = jobs
      .filter((j) => j.status === overColumnId && j._id !== activeId)
      .sort((a, b) => a.order - b.order);
    let newIndex = targetJobs.length;
    if (!overId.startsWith("col:")) {
      const overIndex = targetJobs.findIndex((j) => j._id === overId);
      if (overIndex >= 0) newIndex = overIndex;
    }

    const movedList = arrayMove(
      [activeJob, ...targetJobs],
      0,
      Math.min(newIndex, targetJobs.length),
    ).map((j, idx) => ({ ...j, status: overColumnId, order: idx }));

    const nextActive = movedList.find((j) => j._id === activeId);
    if (!nextActive) return;

    const previousJobs = jobs;
    const nextJobs = previousJobs.map((j) => {
      const replacement = movedList.find((m) => m._id === j._id);
      return replacement ?? j;
    });
    setJobs(nextJobs);

    // If moving to online_test, show test type picker
    if (overColumnId === "online_test" && activeJob.status !== "online_test") {
      setTestTypePickerJob({
        jobId: activeId,
        nextJobs,
        previousJobs,
        status: nextActive.status,
        order: nextActive.order,
      });
      return; // Don't save yet — wait for test type selection
    }

    try {
      await updateJobStatus(activeId, {
        status: nextActive.status,
        order: nextActive.order,
      });
    } catch {
      setJobs(previousJobs);
      toast.error("Move failed — reverted");
    }
  };

  const confirmTestType = async (testType: TestType) => {
    if (!testTypePickerJob) return;
    const { jobId, previousJobs, status, order } = testTypePickerJob;
    try {
      await updateJobStatus(jobId, { status, order });
      await updateJob(jobId, { testType });
      setTestTypePickerJob(null);
    } catch {
      setJobs(previousJobs);
      setTestTypePickerJob(null);
      toast.error("Move failed — reverted");
    }
  };

  const cancelTestTypePicker = () => {
    if (testTypePickerJob) {
      setJobs(testTypePickerJob.previousJobs);
      setTestTypePickerJob(null);
    }
  };

  return (
    <div className="h-full min-h-0 p-4 md:p-6 flex flex-col overflow-hidden">
      <div className="mb-4 flex items-end justify-between gap-3 shrink-0">
        <div>
          <div className="font-syne text-2xl text-(--text-primary) tracking-tight">
            Kanban Board
          </div>
          <div className="text-sm text-(--text-secondary)">
            Track every opportunity with intent.
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="mb-4 shrink-0">
        <FilterBar
          filters={filters}
          onFilterChange={updateFilter}
          onClear={clearFilters}
          activeFilterCount={activeFilterCount}
          allTags={allTags}
          totalJobs={jobs.length}
          filteredCount={filteredJobs.length}
        />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handlers.onDragStart}
        onDragOver={handlers.onDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 min-h-0 flex gap-3 sm:gap-4 overflow-x-auto overflow-y-hidden pb-4 snap-x snap-mandatory sm:snap-none">
          {columns.map((col) => (
            <KanbanColumn
              key={col.id}
              column={{
                id: col.id,
                title: col.title,
                color: col.color,
                jobs: col.jobs,
              }}
              icon={col.icon}
              isDropTarget={state.overColumnId === col.id}
              onAdd={onAdd}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>

        <DragOverlay>
          {state.activeJob ? (
            <div style={{ transform: "scale(1.05) rotate(-2deg)" }}>
              <JobCard
                job={state.activeJob}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <AddJobModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={modalMode}
        initialStatus={modalStatus}
        job={editingJob}
        onCreate={async (dto) => {
          await createJob(dto);
        }}
        onUpdate={async (id, dto) => {
          await updateJob(id, dto);
        }}
      />

      {/* Test Type Picker Dialog */}
      {testTypePickerJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm mx-4 rounded-xl border border-border bg-(--bg-card) shadow-2xl p-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="h-8 w-8 rounded-lg bg-[#06B6D415] flex items-center justify-center">
                <ClipboardCheck className="h-4 w-4 text-[#06B6D4]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-(--text-primary)">Jenis Test</h3>
                <p className="text-xs text-(--text-secondary)">Pilih jenis test untuk job ini</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {([
                { value: "online_test", label: "Online Test", emoji: "💻" },
                { value: "psikotest", label: "Psikotest", emoji: "🧠" },
                { value: "intelligence", label: "Intelligence", emoji: "📊" },
                { value: "technical", label: "Technical", emoji: "⚙️" },
                { value: "assessment", label: "Assessment", emoji: "📋" },
                { value: "other", label: "Other", emoji: "📝" },
              ] as const).map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => confirmTestType(t.value)}
                  className="flex items-center gap-2.5 rounded-lg border border-border bg-(--bg-secondary) px-3 py-2.5 text-sm text-(--text-primary) hover:border-[#06B6D4]/50 hover:bg-[#06B6D4]/5 transition-all"
                >
                  <span className="text-base">{t.emoji}</span>
                  {t.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={cancelTestTypePicker}
              className="mt-3 w-full rounded-lg border border-border px-3 py-2 text-xs text-(--text-muted) hover:bg-(--bg-hover) transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
