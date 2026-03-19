"use client";

import { useCallback, useState } from "react";
import { api } from "@/lib/api";
import type { AppNotification } from "@/types/notification.types";

export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/notifications");
      setNotifications(data.notifications);
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    await api.patch(`/notifications/${id}/read`);
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
    );
  }, []);

  const markAllAsRead = useCallback(async () => {
    await api.patch("/notifications/read-all");
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const dismiss = useCallback(async (id: string) => {
    await api.delete(`/notifications/${id}`);
    setNotifications((prev) => prev.filter((n) => n._id !== id));
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    dismiss,
  };
}
