"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import { useJobStore } from "@/store/jobStore";

const STATUS_ICONS: Record<string, string> = {
  wishlist: "★",
  applied: "📤",
  interview: "💬",
  offer: "🎯",
  rejected: "✕",
};

export function CommandSearch() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const jobs = useJobStore((s) => s.jobs);

  // Global keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const navigate = useCallback(
    (path: string) => {
      setOpen(false);
      router.push(path);
    },
    [router],
  );

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search jobs, companies..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {/* Jobs */}
        {jobs.length > 0 && (
          <CommandGroup heading="Jobs">
            {jobs.slice(0, 8).map((job) => (
              <CommandItem
                key={job._id}
                value={`${job.company} ${job.position}`}
                onSelect={() => navigate(`/jobs/${job._id}`)}
              >
                <span className="mr-2">
                  {STATUS_ICONS[job.status] ?? "📌"}
                </span>
                <span className="flex-1 truncate">
                  {job.position}{" "}
                  <span className="text-(--text-muted)">@ {job.company}</span>
                </span>
                <span className="text-xs text-(--text-muted) capitalize ml-2">
                  {job.status}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        <CommandSeparator />

        {/* Navigation Actions */}
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => navigate("/board")}>
            <span className="mr-2">📋</span>
            Go to Board
          </CommandItem>
          <CommandItem onSelect={() => navigate("/analytics")}>
            <span className="mr-2">📊</span>
            Go to Analytics
          </CommandItem>
          <CommandItem onSelect={() => navigate("/timeline")}>
            <span className="mr-2">📅</span>
            Go to Timeline
          </CommandItem>
          <CommandItem onSelect={() => navigate("/dashboard")}>
            <span className="mr-2">🏠</span>
            Go to Dashboard
          </CommandItem>
          <CommandItem onSelect={() => navigate("/cover-letter")}>
            <span className="mr-2">✨</span>
            Cover Letters
          </CommandItem>
          <CommandItem onSelect={() => navigate("/profile")}>
            <span className="mr-2">👤</span>
            Go to Profile
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
