"use client";

import * as XLSX from "xlsx";
import type { Job } from "@/types/job.types";

const STATUS_LABELS: Record<string, string> = {
  wishlist: "Wishlist",
  applied: "Applied",
  online_test: "Online Test",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
};

const PRIORITY_LABELS: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

const WORK_ARR_LABELS: Record<string, string> = {
  wfh: "WFH",
  wfo: "WFO",
  hybrid: "Hybrid",
};

function formatDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatSalary(min?: string, max?: string): string {
  if (!min && !max) return "";
  if (min && max) return `${Number(min).toLocaleString("id-ID")} – ${Number(max).toLocaleString("id-ID")}`;
  if (min) return Number(min).toLocaleString("id-ID");
  return Number(max!).toLocaleString("id-ID");
}

export function exportJobsToExcel(jobs: Job[]) {
  const headers = [
    "No",
    "Company",
    "Position",
    "Status",
    "Priority",
    "Applied Date",
    "Salary Range",
    "Work",
    "Location",
    "Tags",
    "Job URL",
  ];

  // Sort by status order then by company name
  const statusOrder = ["wishlist", "applied", "online_test", "interview", "offer", "rejected"];
  const sorted = [...jobs].sort((a, b) => {
    const si = statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
    if (si !== 0) return si;
    return a.company.localeCompare(b.company);
  });

  const rows = sorted.map((job, idx) => [
    idx + 1,
    job.company,
    job.position,
    STATUS_LABELS[job.status] ?? job.status,
    PRIORITY_LABELS[job.priority] ?? job.priority,
    formatDate(job.appliedDate),
    formatSalary(job.salaryMin, job.salaryMax),
    WORK_ARR_LABELS[job.workArrangement ?? ""] ?? "",
    job.location ?? "",
    (job.tags ?? []).join(", "),
    job.jobUrl ?? "",
  ]);

  // Build workbook
  const wb = XLSX.utils.book_new();

  // Title rows
  const titleRow = ["Huntrrr — Job Tracker Export"];
  const dateRow = [`Exported on ${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })} • ${jobs.length} jobs`];
  const emptyRow: string[] = [];

  const wsData = [titleRow, dateRow, emptyRow, headers, ...rows];
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Merge title cell across all columns
  const colCount = headers.length;
  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: colCount - 1 } }, // Title row merge
    { s: { r: 1, c: 0 }, e: { r: 1, c: colCount - 1 } }, // Subtitle row merge
  ];

  // Column widths (wch = width in characters)
  ws["!cols"] = [
    { wch: 5 },   // No
    { wch: 22 },  // Company
    { wch: 24 },  // Position
    { wch: 14 },  // Status
    { wch: 10 },  // Priority
    { wch: 16 },  // Applied Date
    { wch: 24 },  // Salary Range
    { wch: 9 },   // Work
    { wch: 16 },  // Location
    { wch: 22 },  // Tags
    { wch: 45 },  // Job URL
  ];

  // Row heights
  ws["!rows"] = [
    { hpt: 28 },  // Title
    { hpt: 18 },  // Subtitle
    { hpt: 8 },   // Spacer
    { hpt: 22 },  // Header
    ...rows.map(() => ({ hpt: 20 })),
  ];

  XLSX.utils.book_append_sheet(wb, ws, "Jobs");

  // ── Summary sheet ──
  const statusCounts = statusOrder.map((s) => ({
    status: STATUS_LABELS[s] ?? s,
    count: jobs.filter((j) => j.status === s).length,
  }));

  const summaryData = [
    ["Job Summary"],
    [],
    ["Status", "Count"],
    ...statusCounts.map((sc) => [sc.status, sc.count]),
    [],
    ["Total", jobs.length],
  ];

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);

  wsSummary["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } },
  ];

  wsSummary["!cols"] = [
    { wch: 18 },
    { wch: 10 },
  ];

  wsSummary["!rows"] = [
    { hpt: 28 },
  ];

  XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");

  // Download
  const filename = `Huntrrr_Export_${new Date().toISOString().split("T")[0]}.xlsx`;
  XLSX.writeFile(wb, filename);
}
