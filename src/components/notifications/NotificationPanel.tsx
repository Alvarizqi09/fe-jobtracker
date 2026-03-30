"use client";

import { useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotificationItem } from "./NotificationItem";
import type { AppNotification } from "@/types/notification.types";
import { Bell, BellOff } from "lucide-react";

interface Props {
  notifications: AppNotification[];
  onRead: (id: string) => void;
  onReadAll: () => void;
  onDismiss: (id: string) => void;
}

export function NotificationPanel({
  notifications,
  onRead,
  onReadAll,
  onDismiss,
}: Props) {
  const router = useRouter();

  const handleNavigate = (jobId?: string, contactId?: string) => {
    if (jobId) router.push(`/jobs/${jobId}`);
    else if (contactId) router.push("/contacts");
  };

  const today = notifications.filter(
    (n) =>
      new Date(n.createdAt).toDateString() === new Date().toDateString(),
  );
  const earlier = notifications.filter(
    (n) =>
      new Date(n.createdAt).toDateString() !== new Date().toDateString(),
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h2 className="text-lg font-syne text-(--text-primary)">
          Notifications
        </h2>
        {notifications.some((n) => !n.isRead) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReadAll}
            className="text-xs text-(--accent-cyan)"
          >
            Mark all read
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 p-3">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <BellOff className="h-10 w-10 text-(--text-muted) mb-3" />
            <p className="text-sm text-(--text-secondary)">
              No notifications
            </p>
            <p className="text-xs text-(--text-muted) mt-1">
              You&apos;re all caught up!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {today.length > 0 && (
              <div>
                <div className="text-[10px] uppercase tracking-wider text-(--text-muted) font-medium mb-2 px-1">
                  Today
                </div>
                <div className="space-y-2">
                  {today.map((n) => (
                    <NotificationItem
                      key={n._id}
                      notification={n}
                      onRead={onRead}
                      onDismiss={onDismiss}
                      onNavigate={handleNavigate}
                    />
                  ))}
                </div>
              </div>
            )}
            {earlier.length > 0 && (
              <div>
                <div className="text-[10px] uppercase tracking-wider text-(--text-muted) font-medium mb-2 px-1">
                  Earlier
                </div>
                <div className="space-y-2">
                  {earlier.map((n) => (
                    <NotificationItem
                      key={n._id}
                      notification={n}
                      onRead={onRead}
                      onDismiss={onDismiss}
                      onNavigate={handleNavigate}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
