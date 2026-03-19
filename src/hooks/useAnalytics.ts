"use client";

import { useState, useCallback } from "react";
import { api } from "@/lib/api";
import type {
  JobStats,
  FunnelStage,
  TimelineEvent,
} from "@/types/analytics.types";

export function useAnalytics() {
  const [stats, setStats] = useState<JobStats | null>(null);
  const [funnel, setFunnel] = useState<FunnelStage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get<JobStats>("/analytics/summary");
      setStats(res.data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load analytics");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchFunnel = useCallback(async (): Promise<void> => {
    try {
      const res = await api.get<{ funnel: FunnelStage[] }>("/analytics/funnel");
      setFunnel(res.data.funnel);
    } catch {
      // silently fail funnel
    }
  }, []);

  const fetchAll = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const [statsRes, funnelRes] = await Promise.all([
        api.get<JobStats>("/analytics/summary"),
        api.get<{ funnel: FunnelStage[] }>("/analytics/funnel"),
      ]);
      setStats(statsRes.data);
      setFunnel(funnelRes.data.funnel);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load analytics");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { stats, funnel, isLoading, error, fetchStats, fetchFunnel, fetchAll };
}
