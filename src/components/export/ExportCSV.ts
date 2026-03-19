"use client";

import type { Job } from "@/types/job.types";

export function exportJobsToCSV(jobs: Job[]) {
  const headers = [
    "Company",
    "Position",
    "Status",
    "Priority",
    "Applied Date",
    "Salary",
    "Location",
    "Job URL",
    "Tags",
    "Deadline",
  ];

  const rows = jobs.map((job) => [
    job.company,
    job.position,
    job.status,
    job.priority,
    job.appliedDate
      ? new Date(job.appliedDate).toLocaleDateString()
      : "",
    job.salary ?? "",
    job.location ?? "",
    job.jobUrl ?? "",
    (job.tags ?? []).join("; "),
    job.deadline
      ? new Date(job.deadline).toLocaleDateString()
      : "",
  ]);

  const csvContent = [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
    )
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `JobDeck_Export_${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
