"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NotificationPanel } from "./NotificationPanel";
import { useNotifications } from "@/hooks/useNotifications";

export function NotificationBell() {
  const {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    dismiss,
  } = useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="relative h-8 w-8 text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-hover)"
          >
            <Bell className="h-4 w-4" />
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1"
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        }
      />
      <SheetContent
        side="right"
        className="w-[90vw] sm:w-[380px] md:w-[420px] p-0 bg-(--bg-card) border-[rgba(60,90,140,0.5)]"
      >
        <NotificationPanel
          notifications={notifications}
          onRead={markAsRead}
          onReadAll={markAllAsRead}
          onDismiss={dismiss}
        />
      </SheetContent>
    </Sheet>
  );
}
