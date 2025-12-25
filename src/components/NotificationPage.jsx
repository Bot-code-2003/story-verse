"use client";

import { useEffect, useState } from "react";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import NotificationItem from "@/components/NotificationItem";

// Helper to group notifications by time
const groupNotificationsByTime = (notifications) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  const groups = {
    today: [],
    thisWeek: [],
    earlier: [],
  };

  notifications.forEach((notif) => {
    const notifDate = new Date(notif.createdAt);
    if (notifDate >= today) {
      groups.today.push(notif);
    } else if (notifDate >= thisWeek) {
      groups.thisWeek.push(notif);
    } else {
      groups.earlier.push(notif);
    }
  });

  return groups;
};

export default function NotificationPage() {
  const { user } = useAuth();
  const {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [markingAllRead, setMarkingAllRead] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications(1, true).then((result) => {
        if (result?.pagination) {
          setHasMore(result.pagination.hasMore);
        }
      });
    }
  }, [user, fetchNotifications]);

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);

    const result = await fetchNotifications(page + 1, false);
    if (result?.pagination) {
      setPage(page + 1);
      setHasMore(result.pagination.hasMore);
    }

    setLoadingMore(false);
  };

  const handleMarkAllAsRead = async () => {
    if (markingAllRead || unreadCount === 0) return;
    setMarkingAllRead(true);
    await markAllAsRead();
    setMarkingAllRead(false);
  };

  const groupedNotifications = groupNotificationsByTime(notifications);

  if (!user) {
    return (
      <>
        <SiteHeader />
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex items-center justify-center">
          <div className="text-center">
            <Bell className="w-16 h-16 text-[var(--foreground)]/30 mx-auto mb-4" />
            <p className="text-xl text-[var(--foreground)]/60">
              Please log in to view your notifications
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-[var(--foreground)]/60 mt-1">
                  {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
                </p>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={markingAllRead}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors disabled:opacity-50"
              >
                {markingAllRead ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCheck className="w-4 h-4" />
                )}
                Mark all as read
              </button>
            )}
          </div>

          {/* Loading State */}
          {loading && notifications.length === 0 && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-[var(--foreground)]/40" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-16">
              <p className="text-red-500">{error}</p>
              <button
                onClick={() => fetchNotifications(1, true)}
                className="mt-4 px-4 py-2 text-sm text-blue-600 hover:underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && notifications.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[var(--foreground)]/5 mb-6">
                <Bell className="w-10 h-10 text-[var(--foreground)]/30" />
              </div>
              <p className="text-xl text-[var(--foreground)]/60 font-medium mb-2">
                No notifications yet
              </p>
              <p className="text-sm text-[var(--foreground)]/40">
                When someone likes your story or comments, you'll see it here
              </p>
            </div>
          )}

          {/* Notification Groups */}
          {!loading && notifications.length > 0 && (
            <div className="space-y-8">
              {/* Today */}
              {groupedNotifications.today.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold text-[var(--foreground)]/50 uppercase tracking-wider mb-3 px-4">
                    Today
                  </h2>
                  <div className="divide-y divide-[var(--foreground)]/5 bg-[var(--foreground)]/[0.02] rounded-2xl">
                    {groupedNotifications.today.map((notif) => (
                      <NotificationItem
                        key={notif.id}
                        notification={notif}
                        onMarkAsRead={markAsRead}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* This Week */}
              {groupedNotifications.thisWeek.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold text-[var(--foreground)]/50 uppercase tracking-wider mb-3 px-4">
                    This Week
                  </h2>
                  <div className="divide-y divide-[var(--foreground)]/5 bg-[var(--foreground)]/[0.02] rounded-2xl">
                    {groupedNotifications.thisWeek.map((notif) => (
                      <NotificationItem
                        key={notif.id}
                        notification={notif}
                        onMarkAsRead={markAsRead}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Earlier */}
              {groupedNotifications.earlier.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold text-[var(--foreground)]/50 uppercase tracking-wider mb-3 px-4">
                    Earlier
                  </h2>
                  <div className="divide-y divide-[var(--foreground)]/5 bg-[var(--foreground)]/[0.02] rounded-2xl">
                    {groupedNotifications.earlier.map((notif) => (
                      <NotificationItem
                        key={notif.id}
                        notification={notif}
                        onMarkAsRead={markAsRead}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Load More */}
              {hasMore && (
                <div className="flex justify-center pt-4">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="px-6 py-3 bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10 text-[var(--foreground)] rounded-xl font-medium transition-colors disabled:opacity-50"
                  >
                    {loadingMore ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Load More"
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
