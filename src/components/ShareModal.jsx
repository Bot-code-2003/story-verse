"use client";

import { useState } from "react";
import { X, Copy, Check, Facebook, Twitter, Linkedin, Mail, MessageCircle } from "lucide-react";

export default function ShareModal({ isOpen, onClose, storyTitle, storyUrl }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(storyUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(storyUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(storyUrl)}&text=${encodeURIComponent(storyTitle)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(storyUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${storyTitle} - ${storyUrl}`)}`,
    email: `mailto:?subject=${encodeURIComponent(storyTitle)}&body=${encodeURIComponent(`Check out this story: ${storyUrl}`)}`,
  };

  const handleSocialShare = (platform) => {
    window.open(shareLinks[platform], "_blank", "width=600,height=400");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-[var(--background)] rounded-2xl shadow-2xl w-full max-w-md p-6 z-10 border border-[var(--foreground)]/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-[var(--foreground)]">
            Share Story
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[var(--foreground)]/5 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-[var(--foreground)]/60" />
          </button>
        </div>

        {/* Story Title */}
        <p className="text-sm text-[var(--foreground)]/70 mb-6 line-clamp-2">
          {storyTitle}
        </p>

        {/* Social Share Buttons */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          <button
            onClick={() => handleSocialShare("facebook")}
            className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
            aria-label="Share on Facebook"
          >
            <div className="w-12 h-12 rounded-full bg-[#1877F2] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Facebook className="w-6 h-6 text-white fill-current" />
            </div>
            <span className="text-xs text-[var(--foreground)]/60">Facebook</span>
          </button>

          <button
            onClick={() => handleSocialShare("twitter")}
            className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
            aria-label="Share on Twitter"
          >
            <div className="w-12 h-12 rounded-full bg-[#1DA1F2] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Twitter className="w-6 h-6 text-white fill-current" />
            </div>
            <span className="text-xs text-[var(--foreground)]/60">Twitter</span>
          </button>

          <button
            onClick={() => handleSocialShare("linkedin")}
            className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
            aria-label="Share on LinkedIn"
          >
            <div className="w-12 h-12 rounded-full bg-[#0A66C2] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Linkedin className="w-6 h-6 text-white fill-current" />
            </div>
            <span className="text-xs text-[var(--foreground)]/60">LinkedIn</span>
          </button>

          <button
            onClick={() => handleSocialShare("whatsapp")}
            className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors group"
            aria-label="Share on WhatsApp"
          >
            <div className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center group-hover:scale-110 transition-transform">
              <MessageCircle className="w-6 h-6 text-white fill-current" />
            </div>
            <span className="text-xs text-[var(--foreground)]/60">WhatsApp</span>
          </button>

          <button
            onClick={() => handleSocialShare("email")}
            className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors group"
            aria-label="Share via Email"
          >
            <div className="w-12 h-12 rounded-full bg-[var(--foreground)]/80 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Mail className="w-6 h-6 text-[var(--background)]" />
            </div>
            <span className="text-xs text-[var(--foreground)]/60">Email</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--foreground)]/10"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-[var(--background)] px-2 text-[var(--foreground)]/50">
              Or copy link
            </span>
          </div>
        </div>

        {/* Copy Link */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={storyUrl}
            readOnly
            className="flex-1 px-4 py-3 bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 rounded-lg text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleCopyLink}
            className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
              copied
                ? "bg-green-500 text-white"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
