"use client";

import { useState, useCallback } from "react";
import { api } from "@/lib/api";
import type { TimelineEvent } from "@/types/analytics.types";

export function useTimeline() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(
    async (year: number, month: number): Promise<void> => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await api.get<{ events: TimelineEvent[] }>(
          "/analytics/timeline",
          { params: { year, month } },
        );
        setEvents(res.data.events);
      } catch (e: unknown) {
        setError(
          e instanceof Error ? e.message : "Failed to load timeline events",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const fetchJobActivity = useCallback(
    async (jobId: string): Promise<TimelineEvent[]> => {
      const res = await api.get<{ events: TimelineEvent[] }>(
        `/analytics/jobs/${jobId}/activity`,
      );
      return res.data.events;
    },
    [],
  );

  return { events, isLoading, error, fetchEvents, fetchJobActivity };
}
