"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Briefcase,
  MessageSquare,
  Trophy,
  Send,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { JobStats } from "@/types/analytics.types";

interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  icon: React.ReactNode;
  color: string;
  index: number;
}

function StatCard({ label, value, suffix = "", icon, color, index }: StatCardProps) {
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = numRef.current;
    if (!el) return;

    let frame: number;
    const duration = 1500;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * value);
      el.textContent = `${current}${suffix}`;
      if (progress < 1) frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value, suffix]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
    >
      <Card className="bg-(--bg-card) border-border hover:border-(--border-bright) transition-colors overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-(--text-secondary)">{label}</span>
            <div
              className="h-9 w-9 rounded-lg flex items-center justify-center"
              style={{ background: `${color}20` }}
            >
              <div style={{ color }}>{icon}</div>
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span
              ref={numRef}
              className="text-3xl font-bold font-syne text-(--text-primary)"
            >
              0{suffix}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function StatsOverview({ stats }: { stats: JobStats | null }) {
  if (!stats) return null;

  const cards: StatCardProps[] = [
    {
      label: "Total Applied",
      value: stats.total,
      icon: <Briefcase className="h-5 w-5" />,
      color: "#3B82F6",
      index: 0,
    },
    {
      label: "Response Rate",
      value: stats.responseRate,
      suffix: "%",
      icon: <Send className="h-5 w-5" />,
      color: "#00D4FF",
      index: 1,
    },
    {
      label: "Interview Rate",
      value: stats.interviewRate,
      suffix: "%",
      icon: <MessageSquare className="h-5 w-5" />,
      color: "#F59E0B",
      index: 2,
    },
    {
      label: "Offer Rate",
      value: stats.offerRate,
      suffix: "%",
      icon: <Trophy className="h-5 w-5" />,
      color: "#10B981",
      index: 3,
    },
  ];

  return (
    <div className="analytics-section grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
}
