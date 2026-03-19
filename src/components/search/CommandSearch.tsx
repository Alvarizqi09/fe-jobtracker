"use client";

import { useEffect, useState, useCallback, createElement } from "react";
import { useRouter } from "next/navigation";
import { Search, Star, Send, MessageSquare, Target, XCircle, Layout, BarChart, Calendar, Home, Sparkles, User, MapPin } from "lucide-react";
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

const STATUS_ICONS: Record<string, React.ElementType> = {
  wishlist: Star,
  applied: Send,
  interview: MessageSquare,
  offer: Target,
  rejected: XCircle,
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
                <div className="mr-2 flex items-center justify-center">
                  {STATUS_ICONS[job.status] ? createElement(STATUS_ICONS[job.status], { className: "h-4 w-4" }) : <MapPin className="h-4 w-4" />}
                </div>
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
            <Layout className="mr-2 h-4 w-4" />
            Go to Board
          </CommandItem>
          <CommandItem onSelect={() => navigate("/analytics")}>
            <BarChart className="mr-2 h-4 w-4" />
            Go to Analytics
          </CommandItem>
          <CommandItem onSelect={() => navigate("/timeline")}>
            <Calendar className="mr-2 h-4 w-4" />
            Go to Timeline
          </CommandItem>
          <CommandItem onSelect={() => navigate("/dashboard")}>
            <Home className="mr-2 h-4 w-4" />
            Go to Dashboard
          </CommandItem>
          <CommandItem onSelect={() => navigate("/cover-letter")}>
            <Sparkles className="mr-2 h-4 w-4" />
            Cover Letters
          </CommandItem>
          <CommandItem onSelect={() => navigate("/profile")}>
            <User className="mr-2 h-4 w-4" />
            Go to Profile
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
