"use client";

import { Download, FileDown, FileJson, FileSpreadsheet } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { exportJobsToCSV } from "./ExportCSV";
import toast from "react-hot-toast";
import type { Job } from "@/types/job.types";

interface Props {
  jobs: Job[];
}

export function ExportMenu({ jobs }: Props) {
  const handleCSV = () => {
    exportJobsToCSV(jobs);
    toast.success("CSV exported");
  };

  const handleJSON = () => {
    const json = JSON.stringify(jobs, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `JobDeck_Export_${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("JSON exported");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-[rgba(60,90,140,0.4)] text-(--text-secondary)"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        }
      />
      <DropdownMenuContent
        align="end"
        className="bg-(--bg-card) border-[rgba(60,90,140,0.5)] text-(--text-primary)"
      >
        <DropdownMenuItem
          onClick={handleCSV}
          className="cursor-pointer focus:bg-(--bg-hover) gap-2"
        >
          <FileSpreadsheet className="h-4 w-4" />
          Export jobs as CSV
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleJSON}
          className="cursor-pointer focus:bg-(--bg-hover) gap-2"
        >
          <FileJson className="h-4 w-4" />
          Export data as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
