"use client";

import { useState, useMemo } from "react";
import { Heart, Reply, Pencil, Trash2, X, Check } from "lucide-react";
import Link from "next/link";

export default function CommentsSection({
  comments,
  user,
  newCommentText,
  setNewCommentText,
  handleSubmitComment,
  submittingComment,
  handleCommentLike,
  handleDeleteComment,
  handleEditComment,
  handleReplyComment,
  setShowLoginPrompt,
  loadingComments,
  hasMoreComments,
  loadMoreComments,
  storyAuthorId,
}) {
  // Reply state
  const [replyingTo, setReplyingTo] = useState(null); // { commentId, userName, userId }
  const [replyText, setReplyText] = useState("");
  
  // Edit state
  const [editingComment, setEditingComment] = useState(null); // commentId
  const [editText, setEditText] = useState("");

  // Group comments: top-level and their replies
  const { topLevelComments, repliesByParent } = useMemo(() => {
    const topLevel = [];
    const replies = {};

    comments.forEach((comment) => {
      if (comment.parentComment) {
        // This is a reply
        if (!replies[comment.parentComment]) {
          replies[comment.parentComment] = [];
        }
        replies[comment.parentComment].push(comment);
      } else {
        // This is a top-level comment
        topLevel.push(comment);
      }
    });

    // Sort replies by date (oldest first for natural conversation flow)
    Object.keys(replies).forEach((parentId) => {
      replies[parentId].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    });

    return { topLevelComments: topLevel, repliesByParent: replies };
  }, [comments]);

  const handleReplyClick = (comment, rootParentId = null) => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    // If this comment is already a reply, use the root parent's ID
    // Otherwise, use this comment's ID as the parent
    const parentId = rootParentId || comment.parentComment || comment.id;
    
    setReplyingTo({
      commentId: parentId,
      userName: comment.user?.name || comment.user?.username || "Anonymous",
      userId: comment.user?.id,
    });
    setReplyText("");
    setEditingComment(null);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyText("");
  };

  const handleSubmitReply = async () => {
    if (!replyText.trim() || !replyingTo) return;
    
    await handleReplyComment(
      replyText.trim(),
      replyingTo.commentId,
      replyingTo.userId
    );
    
    setReplyingTo(null);
    setReplyText("");
  };

  const handleEditClick = (comment) => {
    setEditingComment(comment.id);
    setEditText(comment.text);
    setReplyingTo(null);
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditText("");
  };

  const handleSubmitEdit = async (commentId) => {
    if (!editText.trim()) return;
    
    await handleEditComment(commentId, editText.trim());
    
    setEditingComment(null);
    setEditText("");
  };

  const handleDeleteClick = (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      handleDeleteComment(commentId);
    }
  };

  const currentUserId = user?._id || user?.id;

  // Render a single comment (used for both top-level and replies)
  // rootParentId is passed when rendering sub-thread replies to keep threads flat
  const renderComment = (comment, isReply = false, rootParentId = null) => {
    const isCommentAuthor = currentUserId && comment.user?.id === currentUserId;
    const isStoryAuthor = currentUserId && storyAuthorId === currentUserId;
    const canDelete = isCommentAuthor || isStoryAuthor;
    const canEdit = isCommentAuthor;
    const isEditing = editingComment === comment.id;

    return (
      <div
        key={comment.id}
        className={`${isReply ? "ml-12 pl-4 border-l-2 border-[var(--foreground)]/10" : "border-b border-[var(--foreground)]/10"} pb-4`}
      >
        {/* Replying to indicator for replies */}
        {isReply && comment.replyingToUser && (
          <div className="mb-1">
            <span className="text-xs text-[var(--foreground)]/50">
              replying to{" "}
              <span className="text-blue-500">
                {comment.replyingToUser.name || comment.replyingToUser.username || "Anonymous"}
              </span>
            </span>
          </div>
        )}
        
        <div className="flex items-start gap-3">
          <Link 
            href={`/authors/${comment.user?.username || comment.user?.id || ""}`}
            className="flex-shrink-0"
          >
            <div className={`${isReply ? "w-8 h-8" : "w-10 h-10"} rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm`}>
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
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Link 
                href={`/authors/${comment.user?.username || comment.user?.id || ""}`}
                className="hover:opacity-80 transition-opacity"
              >
                <span className={`font-medium text-[var(--foreground)] hover:underline ${isReply ? "text-sm" : ""}`}>
                  {comment.user?.name || comment.user?.username || "Anonymous"}
                </span>
              </Link>
            </div>
            
            {/* Comment text or edit mode */}
            {isEditing ? (
              <div className="my-2">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full p-3 border border-[var(--foreground)]/20 rounded-lg bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  rows={2}
                  autoFocus
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleSubmitEdit(comment.id)}
                    disabled={!editText.trim()}
                    className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                  >
                    <Check className="w-3 h-3" />
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center gap-1 px-3 py-1 text-[var(--foreground)]/70 text-sm rounded-lg hover:bg-[var(--foreground)]/10 transition"
                  >
                    <X className="w-3 h-3" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className={`text-[var(--foreground)]/80 mb-2 ${isReply ? "text-sm" : ""}`}>
                {comment.text}
              </p>
            )}

            {/* Action buttons */}
            {!isEditing && (
              <div className="flex items-center gap-4">
                {/* Like button */}
                <button
                  onClick={() => {
                    if (!user) {
                      setShowLoginPrompt(true);
                      return;
                    }
                    handleCommentLike(comment.id, comment.liked);
                  }}
                  className={`text-xs flex items-center gap-1 transition ${
                    comment.liked
                      ? "text-red-500"
                      : "text-[var(--foreground)]/60 hover:text-red-500"
                  }`}
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      comment.liked ? "fill-current" : ""
                    }`}
                  />
                  <span>{comment.likesCount || 0}</span>
                </button>

                {/* Reply button */}
                <button
                  onClick={() => handleReplyClick(comment, isReply ? rootParentId : null)}
                  className="text-xs flex items-center gap-1 text-[var(--foreground)]/60 hover:text-blue-500 transition"
                  title="Reply"
                >
                  <Reply className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reply</span>
                </button>

                {/* Edit button (only for comment author) */}
                {canEdit && (
                  <button
                    onClick={() => handleEditClick(comment)}
                    className="text-xs flex items-center gap-1 text-[var(--foreground)]/60 hover:text-yellow-500 transition"
                    title="Edit"
                  >
                    <Pencil className="w-3 h-3" />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                )}

                {/* Delete button (comment author OR story author) */}
                {canDelete && (
                  <button
                    onClick={() => handleDeleteClick(comment.id)}
                    className="text-xs flex items-center gap-1 text-[var(--foreground)]/60 hover:text-red-500 transition"
                    title="Delete"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Inline reply form when replying to this specific comment */}
        {replyingTo?.commentId === comment.id && (
          <div className="mt-3 ml-12 p-3 bg-[var(--foreground)]/5 rounded-lg border border-[var(--foreground)]/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[var(--foreground)]/70">
                Replying to <span className="font-medium text-blue-500">{replyingTo.userName}</span>
              </span>
              <button
                onClick={handleCancelReply}
                className="text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your reply..."
              className="w-full p-2 border border-[var(--foreground)]/20 rounded-lg bg-[var(--background)] text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              autoFocus
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleSubmitReply}
                disabled={!replyText.trim()}
                className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reply
              </button>
              <button
                onClick={handleCancelReply}
                className="px-3 py-1 text-[var(--foreground)]/70 text-xs rounded-lg hover:bg-[var(--foreground)]/10 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Render replies as sub-thread */}
        {!isReply && repliesByParent[comment.id] && repliesByParent[comment.id].length > 0 && (
          <div className="mt-4 space-y-3">
            {repliesByParent[comment.id].map((reply) => renderComment(reply, true, comment.id))}
          </div>
        )}
      </div>
    );
  };

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

        {/* Comments List with sub-threads */}
        {topLevelComments.length > 0 ? (
          <div className="space-y-6">
            {topLevelComments.map((comment) => renderComment(comment, false))}
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
