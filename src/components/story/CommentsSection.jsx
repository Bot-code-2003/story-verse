"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import Link from "next/link";

export default function CommentsSection({
  comments,
  user,
  newCommentText,
  setNewCommentText,
  handleSubmitComment,
  submittingComment,
  handleCommentLike,
  setShowLoginPrompt,
  loadingComments,
  hasMoreComments,
  loadMoreComments
}) {
  return (
    <div className="py-16 px-6 border-t border-[var(--foreground)]/10" data-comments-section>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-[var(--foreground)]">
          Comments {comments.length > 0 && <span className="text-lg font-normal text-[var(--foreground)]/60">({comments.length})</span>}
        </h2>

        {/* Add Comment Form (if logged in) */}
        {user && (
          <div className="mb-8">
            <textarea
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="w-full p-4 border border-[var(--foreground)]/20 rounded-lg bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            <button
              onClick={handleSubmitComment}
              disabled={submittingComment || !newCommentText.trim()}
              className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submittingComment ? "Posting..." : "Post Comment"}
            </button>
          </div>
        )}

        {/* Comments List */}
        {comments.length > 0 ? (
          <div className="space-y-6">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="border-b border-[var(--foreground)]/10 pb-4"
              >
                <div className="flex items-start gap-3">
                  <Link 
                    href={`/authors/${comment.user?.username || comment.user?.id || ""}`}
                    className="flex items-start gap-3 hover:opacity-80 transition-opacity flex-1"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {comment.user?.profileImage ? (
                        <img
                          src={comment.user.profileImage}
                          alt={comment.user.name || "User"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>
                          {(comment.user?.name || comment.user?.username || "U").charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-[var(--foreground)] hover:underline">
                          {comment.user?.name || comment.user?.username || "Anonymous"}
                        </span>
                      </div>
                      <p className="text-[var(--foreground)]/80 mb-2">
                        {comment.text}
                      </p>
                    </div>
                  </Link>
                </div>
                <div className="ml-[52px]">
                  <button
                    onClick={() => {
                      if (!user) {
                        setShowLoginPrompt(true);
                        return;
                      }
                      handleCommentLike(comment.id, comment.liked);
                    }}
                    className={`text-sm flex items-center gap-1 transition ${
                      comment.liked
                        ? "text-red-500"
                        : "text-[var(--foreground)]/60 hover:text-red-500"
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        comment.liked ? "fill-current" : ""
                      }`}
                    />
                    <span>{comment.likesCount || 0}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[var(--foreground)]/50 text-center py-8">
            No comments yet. Be the first to comment!
          </p>
        )}

        {/* Load More Comments */}
        {hasMoreComments && (
          <div className="flex justify-center mt-8">
            <button
              onClick={loadMoreComments}
              disabled={loadingComments}
              className="px-6 py-2 border border-[var(--foreground)]/20 text-[var(--foreground)]/80 rounded-lg hover:bg-[var(--foreground)]/5 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingComments ? "Loading..." : "Load More Comments"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
