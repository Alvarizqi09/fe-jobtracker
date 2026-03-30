"use client";

import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import type { JobStats } from "@/types/analytics.types";

function generateInsights(stats: JobStats): string[] {
  const insights: string[] = [];

  // Total activity
  if (stats.total > 0) {
    insights.push(
      `You've tracked ${stats.total} job${stats.total !== 1 ? "s" : ""} so far. Keep the momentum going!`,
    );
  }

  // Response rate insight
  if (stats.responseRate > 30) {
    insights.push(
      `Your response rate of ${stats.responseRate}% is above the industry average of ~20%. Great job tailoring your applications!`,
    );
  } else if (stats.responseRate > 0 && stats.responseRate <= 20) {
    insights.push(
      `Your response rate is ${stats.responseRate}%. Try customizing cover letters for each application to improve this.`,
    );
  }

  // Interview to offer conversion
  if (stats.interviewRate > 0 && stats.offerRate > 0) {
    const conversionRate = Math.round(
      (stats.offerRate / stats.interviewRate) * 100,
    );
    if (conversionRate > 50) {
      insights.push(
        `${conversionRate}% of your interviews lead to offers — you're nailing the interview stage!`,
      );
    } else {
      insights.push(
        `${conversionRate}% of interviews convert to offers. Consider doing mock interviews to boost this number.`,
      );
    }
  }

  // Tags insight
  if (stats.mostAppliedTags.length >= 2) {
    const top = stats.mostAppliedTags[0];
    insights.push(
      `Your most applied tag is "${top.tag}" with ${top.count} applications. Specialization can lead to better results!`,
    );
  }

  // Average response time
  if (stats.avgDaysToResponse > 0) {
    insights.push(
      `Companies take an average of ${stats.avgDaysToResponse} days to respond to your applications. Patience pays off!`,
    );
  }

  // Fallback if no insights
  if (insights.length === 0) {
    insights.push(
      "Start tracking jobs to get personalized insights about your job search.",
    );
  }

  return insights.slice(0, 3);
}

export function InsightCards({ stats }: { stats: JobStats | null }) {
  if (!stats) return null;
  const insights = generateInsights(stats);

  return (
    <div className="analytics-section grid grid-cols-1 md:grid-cols-3 gap-4">
      {insights.map((insight, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 + 0.3, duration: 0.5 }}
          className="rounded-xl border border-border bg-(--bg-card) dark:bg-gradient-to-br dark:from-[#121e33] dark:to-[#0e1625] p-5"
        >
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-[#F59E0B20] flex items-center justify-center shrink-0 mt-0.5">
              <Lightbulb className="h-4 w-4 text-[#F59E0B]" />
            </div>
            <p className="text-sm text-(--text-secondary) leading-relaxed">
              {insight}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
