"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { differenceInDays, format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useJobStore } from "@/store/jobStore";

export function DeadlineAlert({ onFilter }: { onFilter?: () => void }) {
  const jobs = useJobStore((s) => s.jobs);

  const upcomingDeadlines = useMemo(() => {
    const now = new Date();
    return jobs
      .filter((j) => {
        if (!j.deadline) return false;
        const deadlineDate = new Date(j.deadline);
        const daysLeft = differenceInDays(deadlineDate, now);
        return daysLeft >= 0 && daysLeft <= 7;
      })
      .map((j) => ({
        ...j,
        daysLeft: differenceInDays(new Date(j.deadline!), now),
      }))
      .sort((a, b) => a.daysLeft - b.daysLeft);
  }, [jobs]);

  if (upcomingDeadlines.length === 0) return null;

  const urgentCount = upcomingDeadlines.filter((j) => j.daysLeft <= 3).length;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="rounded-xl border border-[#F59E0B40] bg-[#F59E0B10] p-4 mb-4"
      >
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-[#F59E0B20] flex items-center justify-center shrink-0">
            <AlertTriangle className="h-5 w-5 text-[#F59E0B]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#F59E0B]">
              ⚠️ {upcomingDeadlines.length} application
              {upcomingDeadlines.length !== 1 ? "s have" : " has"} deadline
              {upcomingDeadlines.length !== 1 ? "s" : ""} in the next 7 days
              {urgentCount > 0 && (
                <span className="text-[#EF4444]">
                  {" "}
                  ({urgentCount} within 3 days!)
                </span>
              )}
            </p>
            <div className="mt-1 flex flex-wrap gap-2">
              {upcomingDeadlines.slice(0, 3).map((j) => (
                <span
                  key={j._id}
                  className="text-xs text-(--text-secondary) bg-[#F59E0B10] rounded px-2 py-0.5"
                >
                  {j.company} · {j.daysLeft === 0 ? "Today" : `${j.daysLeft}d left`}
                </span>
              ))}
              {upcomingDeadlines.length > 3 && (
                <span className="text-xs text-(--text-muted)">
                  +{upcomingDeadlines.length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
