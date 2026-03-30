"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { StatsOverview } from "@/components/analytics/StatsOverview";
import { ApplicationFunnel } from "@/components/analytics/ApplicationFunnel";
import { MonthlyChart } from "@/components/analytics/MonthlyChart";
import { StatusPieChart } from "@/components/analytics/StatusPieChart";
import { ResponseRateCard } from "@/components/analytics/ResponseRateCard";
import { SalaryRangeChart } from "@/components/analytics/SalaryRangeChart";
import { MostAppliedTags } from "@/components/analytics/MostAppliedTags";
import { InsightCards } from "@/components/analytics/InsightCard";

export default function AnalyticsPage() {
  const { stats, funnel, isLoading, error, fetchAll } = useAnalytics();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="h-7 w-7 text-(--accent-cyan)" />
          <div>
            <h1 className="font-syne text-2xl text-(--text-primary) tracking-tight">
              Analytics
            </h1>
            <p className="text-sm text-(--text-secondary)">
              Loading your career intelligence...
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-xl bg-(--bg-card) border border-border animate-pulse"
            />
          ))}
        </div>
        <div className="h-64 rounded-xl bg-(--bg-card) border border-border animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-border bg-(--bg-card) p-8 text-center">
          <p className="text-(--status-rejected)">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 overflow-y-auto h-full space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3"
      >
        <div className="h-10 w-10 rounded-xl bg-[#00D4FF15] flex items-center justify-center">
          <BarChart3 className="h-5 w-5 text-(--accent-cyan)" />
        </div>
        <div>
          <h1 className="font-syne text-2xl text-(--text-primary) tracking-tight">
            Analytics
          </h1>
          <p className="text-sm text-(--text-secondary)">
            Your career intelligence dashboard
          </p>
        </div>
      </motion.div>

      {/* Section 1: KPI Overview */}
      <StatsOverview stats={stats} />

      {/* Section 2: Application Funnel */}
      <ApplicationFunnel funnel={funnel} />

      {/* Section 3: Charts Row */}
      <div className="analytics-section grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <MonthlyChart data={stats?.monthlyApplications ?? []} />
        </div>
        <div className="lg:col-span-2">
          <StatusPieChart
            byStatus={stats?.byStatus ?? {}}
            total={stats?.total ?? 0}
          />
        </div>
      </div>

      {/* Section 4: Secondary Stats */}
      <div className="analytics-section grid grid-cols-1 md:grid-cols-3 gap-4">
        <ResponseRateCard data={stats?.monthlyApplications ?? []} />
        <MostAppliedTags data={stats?.mostAppliedTags ?? []} />
        <SalaryRangeChart data={stats?.salaryDistribution ?? []} />
      </div>

      {/* Section 5: Insights */}
      <InsightCards stats={stats} />
    </div>
  );
}
