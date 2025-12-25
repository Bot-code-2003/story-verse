"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, ThumbsUp } from "lucide-react";

// Helper to get notification icon based on type
const getNotificationIcon = (type) => {
  switch (type) {
    case "story_like":
      return <Heart className="w-5 h-5 text-red-500" />;
    case "comment":
      return <MessageCircle className="w-5 h-5 text-blue-500" />;
    case "comment_like":
      return <ThumbsUp className="w-5 h-5 text-indigo-500" />;
    default:
      return <Heart className="w-5 h-5 text-gray-500" />;
  }
};

// Helper to generate notification message
const getNotificationMessage = (notification) => {
  const senderName = notification.sender?.name || notification.sender?.username || "Someone";
  const storyTitle = notification.story?.title || "a story";

  switch (notification.type) {
    case "story_like":
      return (
        <>
          <span className="font-semibold">{senderName}</span>
          {" liked your story "}
          <span className="font-medium text-[var(--foreground)]">"{storyTitle}"</span>
        </>
      );
    case "comment":
      return (
        <>
          <span className="font-semibold">{senderName}</span>
          {" commented on "}
          <span className="font-medium text-[var(--foreground)]">"{storyTitle}"</span>
        </>
      );
    case "comment_like":
      return (
        <>
          <span className="font-semibold">{senderName}</span>
          {" liked your comment on "}
          <span className="font-medium text-[var(--foreground)]">"{storyTitle}"</span>
        </>
      );
    default:
      return (
        <>
          <span className="font-semibold">{senderName}</span>
          {" interacted with your content"}
        </>
      );
  }
};

// Helper to get notification link
const getNotificationLink = (notification) => {
  if (notification.story?.id) {
    return `/stories/${notification.story.id}`;
  }
  return "#";
};

export default function NotificationItem({ notification, onMarkAsRead }) {
  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
  });

  const handleClick = () => {
    if (!notification.read && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <Link
      href={getNotificationLink(notification)}
      onClick={handleClick}
      className={`flex items-start gap-4 p-4 rounded-xl transition-all hover:bg-[var(--foreground)]/5 ${
        !notification.read ? "bg-blue-500/5" : ""
      }`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 relative">
        {notification.sender?.profileImage ? (
          <img
            src={notification.sender.profileImage}
            alt={notification.sender.name || notification.sender.username}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
            {(notification.sender?.name || notification.sender?.username || "U")
              .charAt(0)
              .toUpperCase()}
          </div>
        )}
        {/* Icon badge */}
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[var(--background)] flex items-center justify-center shadow-sm border border-[var(--foreground)]/10">
          {getNotificationIcon(notification.type)}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[var(--foreground)]/80 leading-relaxed">
          {getNotificationMessage(notification)}
        </p>
        {notification.comment?.text && (
          <p className="mt-1 text-xs text-[var(--foreground)]/50 truncate">
            "{notification.comment.text}"
          </p>
        )}
        <p className="mt-1 text-xs text-[var(--foreground)]/40">{timeAgo}</p>
      </div>

      {/* Unread indicator */}
      {!notification.read && (
        <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-blue-500 mt-1.5"></div>
      )}
    </Link>
  );
}
