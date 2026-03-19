"use client";

import { formatDistanceToNow } from "date-fns";
import { Bell, Briefcase, CalendarClock, Clock, User, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AppNotification } from "@/types/notification.types";

const ICON_MAP: Record<string, React.ElementType> = {
  deadline_approaching: CalendarClock,
  follow_up_reminder: Clock,
  interview_today: Briefcase,
  stale_application: AlertTriangle,
  offer_expiring: Bell,
};

const COLOR_MAP: Record<string, string> = {
  deadline_approaching: "#F59E0B",
  follow_up_reminder: "#3B82F6",
  interview_today: "#10B981",
  stale_application: "#EF4444",
  offer_expiring: "#8B5CF6",
};

interface Props {
  notification: AppNotification;
  onRead: (id: string) => void;
  onDismiss: (id: string) => void;
  onNavigate?: (jobId?: string, contactId?: string) => void;
}

export function NotificationItem({
  notification,
  onRead,
  onDismiss,
  onNavigate,
}: Props) {
  const Icon = ICON_MAP[notification.type] ?? Bell;
  const color = COLOR_MAP[notification.type] ?? "#6B7280";

  return (
    <div
      className={`rounded-lg border p-3 transition ${
        notification.isRead
          ? "border-[rgba(60,90,140,0.2)] bg-transparent opacity-70"
          : "border-[rgba(60,90,140,0.4)] bg-(--bg-secondary)"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
          style={{ backgroundColor: color + "15" }}
        >
          <Icon className="h-4 w-4" style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-(--text-primary) line-clamp-1">
            {notification.title}
          </p>
          <p className="text-xs text-(--text-secondary) line-clamp-2 mt-0.5">
            {notification.message}
          </p>
          <div className="flex items-center gap-2 mt-2">
            {(notification.jobId || notification.contactId) && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-[10px] text-(--accent-cyan) px-2"
                onClick={() =>
                  onNavigate?.(notification.jobId, notification.contactId)
                }
              >
                View
              </Button>
            )}
            {!notification.isRead && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-[10px] text-(--text-muted) px-2"
                onClick={() => onRead(notification._id)}
              >
                Mark read
              </Button>
            )}
            <span className="text-[10px] text-(--text-muted) ml-auto">
              {formatDistanceToNow(new Date(notification.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
