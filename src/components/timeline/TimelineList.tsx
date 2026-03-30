"use client";

import { format, isSameDay } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TimelineEventItem } from "./TimelineEvent";
import type { TimelineEvent } from "@/types/analytics.types";

interface Props {
  events: TimelineEvent[];
  selectedDay: Date | null;
}

export function TimelineList({ events, selectedDay }: Props) {
  const filtered = selectedDay
    ? events.filter((e) => isSameDay(new Date(e.timestamp), selectedDay))
    : events;

  const title = selectedDay
    ? `Events on ${format(selectedDay, "MMM d, yyyy")}`
    : "All Events This Month";

  return (
    <div className="rounded-xl border border-border bg-(--bg-card) p-4 md:p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-syne text-lg text-(--text-primary)">{title}</h3>
        <span className="text-xs text-(--text-muted)">
          {filtered.length} event{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-sm text-(--text-secondary)">
          {selectedDay
            ? "No events on this day"
            : "No events this month"}
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="pr-3">
            {filtered.map((event, i) => (
              <TimelineEventItem key={event._id} event={event} index={i} />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
