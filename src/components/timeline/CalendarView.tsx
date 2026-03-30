"use client";

import { useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TimelineEvent } from "@/types/analytics.types";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const TYPE_COLORS: Record<string, string> = {
  created: "#3B82F6",
  status_changed: "#F59E0B",
  note_added: "#8B5CF6",
  cover_letter_generated: "#8B5CF6",
  edited: "#9fb3dc",
};

interface Props {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  selectedDay: Date | null;
  onSelectDay: (day: Date) => void;
  events: TimelineEvent[];
}

export function CalendarView({
  currentDate,
  onDateChange,
  selectedDay,
  onSelectDay,
  events,
}: Props) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = getDay(monthStart);

  // map day -> events
  const eventsByDay = useMemo(() => {
    const map = new Map<string, TimelineEvent[]>();
    for (const ev of events) {
      const key = format(new Date(ev.timestamp), "yyyy-MM-dd");
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(ev);
    }
    return map;
  }, [events]);

  return (
    <div className="rounded-xl border border-border bg-(--bg-card) p-4 md:p-5">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-(--text-secondary) hover:bg-(--bg-hover)"
          onClick={() => onDateChange(subMonths(currentDate, 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="font-syne text-lg text-(--text-primary)">
          {format(currentDate, "MMMM yyyy")}
        </h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-(--text-secondary) hover:bg-(--bg-hover)"
          onClick={() => onDateChange(addMonths(currentDate, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="text-center text-xs text-(--text-muted) py-1 font-medium"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells before month start */}
        {Array.from({ length: startDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="h-10" />
        ))}
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const dayEvents = eventsByDay.get(key) ?? [];
          const isSelected = selectedDay && isSameDay(day, selectedDay);
          const today = isToday(day);

          // Get unique event types for dots
          const uniqueTypes = [...new Set(dayEvents.map((e) => e.type))];

          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectDay(day)}
              className={`
                h-10 rounded-lg text-xs font-medium transition-all relative
                flex flex-col items-center justify-center gap-0.5
                ${isSelected
                  ? "bg-(--accent-cyan)/20 text-(--accent-cyan) ring-1 ring-(--accent-cyan)"
                  : today
                    ? "bg-(--bg-hover) text-(--accent-cyan) ring-1 ring-(--accent-cyan)/30"
                    : "text-(--text-secondary) hover:bg-(--bg-hover)"
                }
              `}
            >
              <span>{format(day, "d")}</span>
              {uniqueTypes.length > 0 && (
                <div className="flex gap-0.5">
                  {uniqueTypes.slice(0, 3).map((type) => (
                    <span
                      key={type}
                      className="h-1.5 w-1.5 rounded-full"
                      style={{
                        background: TYPE_COLORS[type] ?? "#9fb3dc",
                      }}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
