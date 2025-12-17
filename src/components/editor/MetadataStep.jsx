"use client";

import React from "react";
import { compressStoryCover } from "@/lib/imageCompression";
import { GENRE_TILES } from "@/constants/genres";

// Extract genre names from GENRE_TILES
const GENRES = GENRE_TILES.map(genre => genre.name);

export default function MetadataStep({
  coverImageUrl,
  setCoverImageUrl,
  selectedGenres,
  setSelectedGenres,
  uploadingImage,
  setUploadingImage,
  showToast,
  wordCount
}) {
  const toggleGenre = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
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
                  const compressed = await compressStoryCover(file);
                  setCoverImageUrl(compressed);
                  showToast("Image uploaded and compressed", "success");
                } catch (error) {
                  showToast(error.message || "Failed to compress image", "error");
                } finally {
                  setUploadingImage(false);
                  e.target.value = "";
                }
              }}
              className="hidden"
              id="cover-upload"
            />
            <div className="w-full px-6 py-4 bg-blue-600 text-white text-center rounded-lg cursor-pointer hover:bg-blue-700 transition font-medium shadow-lg hover:shadow-xl">
              {uploadingImage ? "Compressing..." : "Upload Image"}
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
