"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { useTimeline } from "@/hooks/useTimeline";
import { CalendarView } from "@/components/timeline/CalendarView";
import { TimelineList } from "@/components/timeline/TimelineList";
import { DeadlineAlert } from "@/components/timeline/DeadlineAlert";

export default function TimelinePage() {
  const { events, isLoading, fetchEvents } = useTimeline();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  useEffect(() => {
    fetchEvents(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
    );
  }, [currentDate, fetchEvents]);

  return (
    <div className="p-4 md:p-6 overflow-y-auto h-full space-y-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3"
      >
        <div className="h-10 w-10 rounded-xl bg-[#8B5CF615] flex items-center justify-center">
          <Calendar className="h-5 w-5 text-[#8B5CF6]" />
        </div>
        <div>
          <h1 className="font-syne text-2xl text-(--text-primary) tracking-tight">
            Timeline
          </h1>
          <p className="text-sm text-(--text-secondary)">
            Your application journey at a glance
          </p>
        </div>
      </motion.div>

      {/* Deadline Alert */}
      <DeadlineAlert />

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2 h-80 rounded-xl bg-(--bg-card) border border-[rgba(60,90,140,0.3)] animate-pulse" />
          <div className="lg:col-span-3 h-80 rounded-xl bg-(--bg-card) border border-[rgba(60,90,140,0.3)] animate-pulse" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4" style={{ minHeight: "calc(100vh - 220px)" }}>
          <div className="lg:col-span-2">
            <CalendarView
              currentDate={currentDate}
              onDateChange={(d) => {
                setCurrentDate(d);
                setSelectedDay(null);
              }}
              selectedDay={selectedDay}
              onSelectDay={setSelectedDay}
              events={events}
            />
          </div>
          <div className="lg:col-span-3">
            <TimelineList events={events} selectedDay={selectedDay} />
          </div>
        </div>
      )}
    </div>
  );
}
