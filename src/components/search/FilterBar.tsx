"use client";

import { useState } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FilterChip } from "./FilterChip";
import type { SearchFilters } from "@/types/analytics.types";
import type { JobPriority, JobStatus } from "@/types/job.types";

const STATUSES: { value: JobStatus; label: string }[] = [
  { value: "wishlist", label: "Wishlist" },
  { value: "applied", label: "Applied" },
  { value: "interview", label: "Interview" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
];

const PRIORITIES: { value: JobPriority; label: string; color: string }[] = [
  { value: "high", label: "High", color: "#EF4444" },
  { value: "medium", label: "Medium", color: "#F59E0B" },
  { value: "low", label: "Low", color: "#10B981" },
];

interface Props {
  filters: SearchFilters;
  onFilterChange: <K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K],
  ) => void;
  onClear: () => void;
  activeFilterCount: number;
  allTags: string[];
  totalJobs: number;
  filteredCount: number;
}

export function FilterBar({
  filters,
  onFilterChange,
  onClear,
  activeFilterCount,
  allTags,
  totalJobs,
  filteredCount,
}: Props) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[140px] sm:min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-(--text-muted)" />
          <Input
            placeholder="Search by company or position..."
            value={filters.query}
            onChange={(e) => onFilterChange("query", e.target.value)}
            className="pl-9 h-9 bg-(--bg-secondary) border-border text-(--text-primary) placeholder:text-(--text-muted) text-sm"
          />
          {filters.query && (
            <button
              type="button"
              onClick={() => onFilterChange("query", "")}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-(--bg-hover)"
            >
              <X className="h-3 w-3 text-(--text-muted)" />
            </button>
          )}
        </div>

        {/* Priority Filter */}
        <Popover>
          <PopoverTrigger
            render={
              <Button
                variant="ghost"
                size="sm"
                className={`h-9 text-sm border border-border ${
                  filters.priority.length > 0
                    ? "bg-[rgba(0,212,255,0.1)] border-(--accent-cyan) text-(--accent-cyan)"
                    : "text-(--text-secondary) hover:bg-(--bg-hover)"
                }`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5" />
                Priority
                {filters.priority.length > 0 && (
                  <span className="ml-1.5 text-xs bg-(--accent-cyan)/20 px-1.5 rounded-full">
                    {filters.priority.length}
                  </span>
                )}
              </Button>
            }
          />
          <PopoverContent
            align="start"
            className="w-44 p-2 bg-(--bg-card) border-border"
          >
            {PRIORITIES.map((p) => {
              const checked = filters.priority.includes(p.value);
              return (
                <label
                  key={p.value}
                  className="flex items-center gap-2.5 px-2 py-1.5 rounded hover:bg-(--bg-hover) cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {
                      const next = checked
                        ? filters.priority.filter((v) => v !== p.value)
                        : [...filters.priority, p.value];
                      onFilterChange("priority", next);
                    }}
                    className="accent-[var(--accent-cyan)]"
                  />
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: p.color }}
                  />
                  <span className="text-sm text-(--text-primary)">{p.label}</span>
                </label>
              );
            })}
          </PopoverContent>
        </Popover>

        {/* Tags Filter */}
        {allTags.length > 0 && (
          <Popover>
            <PopoverTrigger
              render={
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-9 text-sm border border-border ${
                    filters.tags.length > 0
                      ? "bg-[rgba(0,212,255,0.1)] border-(--accent-cyan) text-(--accent-cyan)"
                      : "text-(--text-secondary) hover:bg-(--bg-hover)"
                  }`}
                >
                  Tags
                  {filters.tags.length > 0 && (
                    <span className="ml-1.5 text-xs bg-(--accent-cyan)/20 px-1.5 rounded-full">
                      {filters.tags.length}
                    </span>
                  )}
                </Button>
              }
            />
            <PopoverContent
              align="start"
              className="w-52 p-2 bg-(--bg-card) border-border max-h-60 overflow-y-auto"
            >
              {allTags.map((tag) => {
                const checked = filters.tags.includes(tag);
                return (
                  <label
                    key={tag}
                    className="flex items-center gap-2.5 px-2 py-1.5 rounded hover:bg-(--bg-hover) cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        const next = checked
                          ? filters.tags.filter((t) => t !== tag)
                          : [...filters.tags, tag];
                        onFilterChange("tags", next);
                      }}
                      className="accent-[var(--accent-cyan)]"
                    />
                    <span className="text-sm text-(--text-primary) truncate">
                      {tag}
                    </span>
                  </label>
                );
              })}
            </PopoverContent>
          </Popover>
        )}

        {/* Clear */}
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-9 text-sm text-(--text-muted) hover:text-(--status-rejected) hover:bg-(--bg-hover)"
            onClick={onClear}
          >
            <X className="h-3.5 w-3.5 mr-1" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Active chips + result count */}
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {filters.priority.map((p) => (
            <FilterChip
              key={`p-${p}`}
              label={`Priority: ${p}`}
              onRemove={() =>
                onFilterChange(
                  "priority",
                  filters.priority.filter((v) => v !== p),
                )
              }
            />
          ))}
          {filters.tags.map((t) => (
            <FilterChip
              key={`t-${t}`}
              label={t}
              onRemove={() =>
                onFilterChange(
                  "tags",
                  filters.tags.filter((v) => v !== t),
                )
              }
            />
          ))}
          <span className="text-xs text-(--text-muted) ml-1">
            Showing {filteredCount} of {totalJobs} jobs
          </span>
        </div>
      )}
    </div>
  );
}
