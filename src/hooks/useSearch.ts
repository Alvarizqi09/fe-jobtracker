"use client";

import { useState, useMemo, useCallback } from "react";
import { useJobStore } from "@/store/jobStore";
import type { Job, JobStatus, JobPriority } from "@/types/job.types";
import type { SearchFilters } from "@/types/analytics.types";

const defaultFilters: SearchFilters = {
  query: "",
  status: [],
  priority: [],
  tags: [],
  dateRange: null,
  location: "",
};

export function useSearch() {
  const jobs = useJobStore((s) => s.jobs);
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Text query
      if (filters.query) {
        const q = filters.query.toLowerCase();
        if (
          !job.company.toLowerCase().includes(q) &&
          !job.position.toLowerCase().includes(q)
        )
          return false;
      }

      // Status filter
      if (
        filters.status.length > 0 &&
        !filters.status.includes(job.status)
      )
        return false;

      // Priority filter
      if (
        filters.priority.length > 0 &&
        !filters.priority.includes(job.priority)
      )
        return false;

      // Tags filter
      if (
        filters.tags.length > 0 &&
        !filters.tags.some((t) => job.tags?.includes(t))
      )
        return false;

      // Date range
      if (filters.dateRange) {
        const appliedDate = job.appliedDate
          ? new Date(job.appliedDate)
          : new Date(job.createdAt);
        const from = new Date(filters.dateRange.from);
        const to = new Date(filters.dateRange.to);
        if (appliedDate < from || appliedDate > to) return false;
      }

      // Location
      if (filters.location) {
        const loc = filters.location.toLowerCase();
        if (!job.location?.toLowerCase().includes(loc)) return false;
      }

      return true;
    });
  }, [jobs, filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.query) count++;
    if (filters.status.length > 0) count++;
    if (filters.priority.length > 0) count++;
    if (filters.tags.length > 0) count++;
    if (filters.dateRange) count++;
    if (filters.location) count++;
    return count;
  }, [filters]);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    for (const job of jobs) {
      if (job.tags) {
        for (const t of job.tags) tagSet.add(t);
      }
    }
    return Array.from(tagSet).sort();
  }, [jobs]);

  const updateFilter = useCallback(
    <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return {
    filters,
    setFilters,
    filteredJobs,
    activeFilterCount,
    allTags,
    updateFilter,
    clearFilters,
  };
}
