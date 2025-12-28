"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { compressStoryCover } from "@/lib/imageCompression";
import { GENRE_TILES } from "@/constants/genres";

// Extract genre names from GENRE_TILES
const GENRES = GENRE_TILES.map(genre => genre.name);

const MAX_TAGS = 5;
const MAX_TAG_LENGTH = 20;

export default function MetadataStep({
  coverImageUrl,
  setCoverImageUrl,
  selectedGenres,
  setSelectedGenres,
  tags = [],
  setTags,
  uploadingImage,
  setUploadingImage,
  showToast,
  wordCount
}) {
  const [tagInput, setTagInput] = useState("");

  const toggleGenre = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const addTag = (newTag) => {
    const trimmed = newTag.trim().toLowerCase().slice(0, MAX_TAG_LENGTH);
    if (!trimmed) return;
    if (tags.length >= MAX_TAGS) {
      showToast(`Maximum ${MAX_TAGS} tags allowed`, "error");
      return;
    }
    if (tags.includes(trimmed)) {
      showToast("Tag already exists", "error");
      return;
    }
    setTags([...tags, trimmed]);
    setTagInput("");
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  const calculateReadTime = (words) => {
    if (words === 0) return 1;
    return Math.ceil(words / 250);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Cover Image Section */}
      <div className="space-y-3">
        <label className="block text-base font-medium text-[var(--foreground)]">
          Cover Image
        </label>
        
        {/* Upload Button */}
        <div className="flex gap-3">
          <label className="flex-1">
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                
                if (file.size > 5 * 1024 * 1024) {
                  showToast("Image too large. Maximum 5MB", "error");
                  return;
                }
                
                setUploadingImage(true);
                try {
                  // Upload to ImgBB via server API
                  const formData = new FormData();
                  formData.append("file", file);
                  formData.append("type", "story");
                  
                  const response = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                  });
                  
                  const result = await response.json();
                  
                  if (!response.ok || !result.success) {
                    throw new Error(result.error || "Upload failed");
                  }
                  
                  // Use the cloud URL instead of base64
                  setCoverImageUrl(result.url);
                  showToast(`Image uploaded to cloud! (${result.savings} smaller)`, "success");
                } catch (error) {
                  showToast(error.message || "Failed to upload image", "error");
                } finally {
                  setUploadingImage(false);
                  e.target.value = "";
                }
              }}
              className="hidden"
              id="cover-upload"
            />
            <div className="w-full px-6 py-4 bg-blue-600 text-white text-center rounded-lg cursor-pointer hover:bg-blue-700 transition font-medium shadow-lg hover:shadow-xl">
              {uploadingImage ? "Uploading to cloud..." : "Upload Image"}
            </div>
          </label>
        </div>
        
        {/* URL Input */}
        <div className="text-center text-sm text-[var(--foreground)]/50 font-medium">or paste URL</div>
        <input
          value={coverImageUrl}
          onChange={(e) => setCoverImageUrl(e.target.value)}
          placeholder="https://example.com/cover.jpg"
          className="w-full px-4 py-3 bg-[var(--background)] border-2 border-[var(--foreground)]/10 rounded-lg focus:border-blue-500 focus:outline-none transition text-[var(--foreground)]"
        />
        
        {/* Preview */}
        {coverImageUrl && (
          <div className="flex justify-center pt-4">
            <div className="relative aspect-[5/7] w-48 rounded-lg overflow-hidden shadow-2xl border-2 border-[var(--foreground)]/10">
              <img
                src={coverImageUrl}
                alt="Cover Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/placeholder-image.jpg";
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Genres Section */}
      <div className="space-y-3">
        <label className="block text-base font-medium text-[var(--foreground)]">
          Genres
        </label>
        
        <div className="flex flex-wrap gap-3">
          {GENRES.map((genre) => (
            <button
              key={genre}
              type="button"
              onClick={() => {
                if (
                  !selectedGenres.includes(genre) &&
                  selectedGenres.length >= 3
                )
                  return;
                toggleGenre(genre);
              }}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm ${
                selectedGenres.includes(genre)
                  ? "bg-blue-600 text-white shadow-lg scale-105"
                  : "bg-[var(--background)] border-2 border-[var(--foreground)]/20 text-[var(--foreground)]/70 hover:border-blue-500 hover:text-blue-500 hover:shadow-md"
              } ${
                selectedGenres.length >= 3 && !selectedGenres.includes(genre)
                  ? "opacity-40 cursor-not-allowed"
                  : ""
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2 pt-2">
          <div className={`w-2 h-2 rounded-full ${selectedGenres.length > 0 ? 'bg-blue-500' : 'bg-[var(--foreground)]/20'}`}></div>
          <p className="text-sm text-[var(--foreground)]/60">
            {selectedGenres.length} / 3 genres selected
          </p>
        </div>
      </div>

      {/* Tags Section */}
      <div className="space-y-3">
        <label className="block text-base font-medium text-[var(--foreground)]">
          Tags <span className="text-sm font-normal text-[var(--foreground)]/50">(optional)</span>
        </label>
        <p className="text-sm text-[var(--foreground)]/50">
          Add up to 5 tags to help readers discover your story. Press Enter or comma to add.
        </p>
        
        {/* Tag Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value.replace(",", ""))}
            onKeyDown={handleTagKeyDown}
            placeholder="adventure, mystery, quick-read..."
            maxLength={MAX_TAG_LENGTH}
            disabled={tags.length >= MAX_TAGS}
            className="flex-1 px-4 py-3 bg-[var(--background)] border-2 border-[var(--foreground)]/10 rounded-lg focus:border-blue-500 focus:outline-none transition text-[var(--foreground)] disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="button"
            onClick={() => addTag(tagInput)}
            disabled={!tagInput.trim() || tags.length >= MAX_TAGS}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>

        {/* Tags Display */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/15 text-purple-600 dark:text-purple-400 rounded-full text-sm font-medium border border-purple-500/20"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="p-0.5 rounded-full hover:bg-purple-500/20 transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 pt-1">
          <div className={`w-2 h-2 rounded-full ${tags.length > 0 ? 'bg-purple-500' : 'bg-[var(--foreground)]/20'}`}></div>
          <p className="text-sm text-[var(--foreground)]/60">
            {tags.length} / {MAX_TAGS} tags added
          </p>
        </div>
      </div>

      {/* Auto-calculated Read Time Display */}
      <div className="space-y-3 pt-4">
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-[var(--foreground)]/10">
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)]/80 mb-1">
              Estimated Reading Time
            </label>
            <p className="text-xs text-[var(--foreground)]/50">
              Automatically calculated based on word count
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-blue-600">
              {calculateReadTime(wordCount)}
            </div>
            <div className="text-xs text-[var(--foreground)]/50">minutes</div>
          </div>
        </div>
        <p className="text-xs text-[var(--foreground)]/50 text-center">
          Based on {wordCount} words at 250 words/minute
        </p>
      </div>
    </div>
  );
}
