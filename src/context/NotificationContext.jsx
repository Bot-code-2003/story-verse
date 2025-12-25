"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext(null);

// Polling interval in milliseconds (5 minutes)
const POLLING_INTERVAL = 5 * 60 * 1000;

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const pollingRef = useRef(null);
  const lastFetchRef = useRef(0);

  // Get user ID helper
  const getUserId = useCallback(() => {
    return user?._id || user?.id || null;
  }, [user]);

  // Fetch unread count (lightweight for polling)
  const fetchUnreadCount = useCallback(async () => {
    const userId = getUserId();
    if (!userId) return;

    try {
      const res = await fetch(`/api/notifications/unread-count?userId=${encodeURIComponent(userId)}`);
      if (res.ok) {
        const data = await res.json();
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.error("Error fetching unread count:", err);
    }
  }, [getUserId]);

  // Fetch full notifications list
  const fetchNotifications = useCallback(async (page = 1, reset = true) => {
    const userId = getUserId();
    if (!userId) return;

    if (reset) {
      setLoading(true);
    }
    setError(null);

    try {
      const res = await fetch(
        `/api/notifications?userId=${encodeURIComponent(userId)}&page=${page}&limit=10`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data = await res.json();

      if (reset) {
        setNotifications(data.notifications || []);
      } else {
        setNotifications((prev) => [...prev, ...(data.notifications || [])]);
      }

      setUnreadCount(data.unreadCount || 0);
      lastFetchRef.current = Date.now();

      return {
        notifications: data.notifications,
        pagination: data.pagination,
      };
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [getUserId]);

  // Mark single notification as read
  const markAsRead = useCallback(async (notificationId) => {
    const userId = getUserId();
    if (!userId) return false;

    try {
      const res = await fetch("/api/notifications/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, notificationId }),
      });

      if (!res.ok) {
        throw new Error("Failed to mark notification as read");
      }

      // Update local state
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));

      return true;
    } catch (err) {
      console.error("Error marking notification as read:", err);
      return false;
    }
  }, [getUserId]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    const userId = getUserId();
    if (!userId) return false;

    try {
      const res = await fetch("/api/notifications/read-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) {
        throw new Error("Failed to mark all notifications as read");
      }

      // Update local state
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
      setUnreadCount(0);

      return true;
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
      return false;
    }
  }, [getUserId]);

  // Start polling when user is logged in
  useEffect(() => {
    const userId = getUserId();

    if (userId) {
      // Initial fetch
      fetchUnreadCount();

      // Set up polling
      pollingRef.current = setInterval(() => {
        fetchUnreadCount();
      }, POLLING_INTERVAL);
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [getUserId, fetchUnreadCount]);

  // Clear state when user logs out
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setError(null);
    }
  }, [user]);

  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};

export default NotificationContext;
