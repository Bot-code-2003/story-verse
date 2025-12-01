"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import SiteHeader from "@/components/SiteHeader";

// Simplified constant list of genres
const GENRES = [
  "Fantasy",
  "Romance",
  "Thriller",
  "Sci-Fi",
  "Horror",
  "Slice of Life",
  "Adventure",
  "Drama",
];

// --- New Toast Notification Component ---
const ToastNotification = ({ message, type, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 3000); // 3-second auto-close
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  const baseClasses =
    "fixed top-5 left-1/2 transform -translate-x-1/2 px-5 py-3 rounded-lg shadow-xl text-sm font-medium transition-all duration-300 z-50 border";

  // Determine styles based on message type
  const styleMap = {
    error:
      "bg-red-50 dark:bg-red-900/80 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700",
    success:
      "bg-green-50 dark:bg-green-900/80 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700",
    info: "bg-blue-50 dark:bg-blue-900/80 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700",
  };

  const icon = type === "error" ? "⚠️" : type === "success" ? "✓" : "ⓘ";

  return (
    <div className={`${baseClasses} ${styleMap[type] || styleMap.info}`}>
      <div className="flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        {message}
      </div>
    </div>
  );
};
// --- End Toast Component ---

// 1. Success Modal Component
const SuccessModal = ({ isOpen, onClose, storyId }) => {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative bg-[var(--background)] rounded-lg shadow-2xl w-full max-w-sm p-6 text-center border border-[var(--foreground)]/10">
        <div className="text-4xl text-green-600 mb-4">✓</div>{" "}
        {/* Minimal checkmark */}
        <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-2">
          Story Published
        </h2>
        <p className="text-[var(--foreground)]/60 mb-6 text-sm">
          Your story is now live and ready to be read.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push(`/stories/${storyId}`)}
            className="w-full px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            View Story
          </button>
          <button
            onClick={() => router.push("/")}
            className="w-full px-4 py-2 rounded-md border border-[var(--foreground)]/20 text-[var(--foreground)] font-medium hover:bg-[var(--foreground)]/5 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

// 2. Editor Toolbar Component (Minimalist)
const EditorToolbar = ({ format }) => (
  <div className="flex items-center gap-2 text-[var(--foreground)]/80">
    <button
      onClick={() => format("bold")}
      className="p-2 hover:bg-[var(--foreground)]/10 rounded font-bold"
      title="Bold"
    >
      B
    </button>
    <button
      onClick={() => format("italic")}
      className="p-2 hover:bg-[var(--foreground)]/10 rounded italic"
      title="Italic"
    >
      I
    </button>
    <button
      onClick={() => format("underline")}
      className="p-2 hover:bg-[var(--foreground)]/10 rounded underline"
      title="Underline"
    >
      U
    </button>
    <div className="w-px h-5 bg-[var(--foreground)]/20 mx-1"></div>
    <button
      onClick={() => format("formatBlock", "H1")}
      className="px-3 py-1 hover:bg-[var(--foreground)]/10 rounded text-lg font-extrabold"
      title="Heading 1"
    >
      H1
    </button>
    <button
      onClick={() => format("formatBlock", "H2")}
      className="px-3 py-1 hover:bg-[var(--foreground)]/10 rounded font-bold"
      title="Heading 2"
    >
      H2
    </button>
    <button
      onClick={() => format("formatBlock", "P")}
      className="px-3 py-1 hover:bg-[var(--foreground)]/10 rounded"
      title="Paragraph"
    >
      P
    </button>
  </div>
);

// --- Main Component ---

export default function StoryEditor({ storyId = null, initialData = null }) {
  const router = useRouter();
  const { user } = useAuth();
  const editorRef = useRef(null);

  // State
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  // **GENRE STATE:** This is correctly initialized as an array.
  const [selectedGenres, setSelectedGenres] = useState(
    initialData?.genres || []
  );
  const [tagsText, setTagsText] = useState(
    (initialData?.tags || []).join(", ") || ""
  );
  const [coverImageUrl, setCoverImageUrl] = useState(
    initialData?.coverImage || ""
  );
  const [readTime, setReadTime] = useState(initialData?.readTime || "");

  const [loading, setLoading] = useState(false);

  // TOAST STATES
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState("info");

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [publishedStoryId, setPublishedStoryId] = useState(null);

  // Helper function to show toast
  const showToast = (message, type) => {
    setToastMessage(message);
    setToastType(type);
  };

  // Load story data for editing
  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!storyId || initialData) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/stories/${storyId}`);
        if (!res.ok) throw new Error("Failed to load story");
        const data = await res.json();
        if (!mounted) return;
        setTitle(data.title || "");
        setDescription(data.description || "");
        // **INITIAL LOAD FIX/CHECK:** Ensure 'data.genres' from the API is an array here.
        setSelectedGenres(data.genres || []);
        setTagsText((data.tags || []).join(", ") || "");
        setCoverImageUrl(data.coverImage || "");
        setReadTime(data.readTime || "");
        if (editorRef.current) editorRef.current.innerHTML = data.content || "";
      } catch (err) {
        showToast(err.message, "error");
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, [storyId, initialData]);

  // Rich Text Editor Command
  const format = (cmd, value = null) => {
    document.execCommand(cmd, false, value);
    editorRef.current && editorRef.current.focus();
  };

  // Helper Functions
  // **TOGGLE GENRE FIX/CHECK:** This logic is already correct for adding/removing items in an array.
  const toggleGenre = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const getContent = () =>
    editorRef.current ? editorRef.current.innerHTML : "";

  const wordCount = useMemo(() => {
    return editorRef.current
      ? editorRef.current.innerText.split(/\s+/).filter(Boolean).length
      : 0;
  }, [title, description, loading, step]);

  const validateStep1 = () => {
    setToastMessage(null); // Clear previous messages
    if (!title.trim()) {
      showToast("Title is required.", "error");
      return false;
    }
    if (!editorRef.current || !editorRef.current.innerText.trim()) {
      showToast("Story content cannot be empty.", "error");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    setToastMessage(null); // Clear previous messages
    if (selectedGenres.length === 0) {
      showToast("Please select at least one genre.", "error");
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      }
    }
  };

  const prevStep = () => {
    setStep(1);
  };

  // **PAYLOAD CHECK:** This correctly includes the array.
  const makePayload = (published = false) => {
    const tags = tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    return {
      title: title.trim(),
      description: description.trim(),
      content: getContent(),
      coverImage: coverImageUrl.trim(),
      readTime:
        readTime && !isNaN(Number(readTime)) ? Number(readTime) : undefined,
      genres: selectedGenres,
      tags,
      published: !!published,
    };
  };

  const handleSubmit = async (published = false) => {
    if (published && !validateStep2()) return;
    if (!validateStep1()) return;

    setToastMessage(null);
    setLoading(true);

    try {
      const payload = makePayload(published);
      payload.author = user?.id || null;

      const url = storyId ? `/api/stories/${storyId}` : "/api/stories";
      const method = storyId ? "PUT" : "POST";
      console.log("Submitting payload:", payload);
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(
          err?.error || `Failed to ${published ? "publish" : "save"} story`
        );
      }

      const data = await res.json();

      if (published) {
        setPublishedStoryId(data?.id);
        setShowSuccessModal(true);
      } else {
        showToast("Draft saved successfully.", "success");
      }

      if (!storyId && data?.id) {
        router.replace(`/editor/${data.id}`, undefined, { shallow: true });
      }
    } catch (err) {
      // Catch network or API errors and show them in the toast
      showToast(err.message || "An unexpected error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  // --- Render Steps (Now always rendered, controlled by visibility) ---

  const Step1Content = (
    <div
      className={`space-y-12 transition-opacity duration-300 ${
        step === 1 ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Title */}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Untitled Story: A compelling title..."
        className="w-full text-5xl md:text-6xl font-extrabold bg-transparent border-none focus:outline-none text-[var(--foreground)] placeholder:text-[var(--foreground)]/20 transition-colors"
      />

      {/* Description */}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Write a brief synopsis to hook your readers..."
        rows={3}
        className="w-full text-xl bg-transparent border-none focus:outline-none text-[var(--foreground)]/70 placeholder:text-[var(--foreground)]/30 resize-none"
        maxLength={350}
      />

      {/* Editor & Toolbar */}
      <div className="border border-[var(--foreground)]/10 rounded-lg shadow-sm">
        <div className="p-4 bg-[var(--foreground)]/5 border-b border-[var(--foreground)]/10">
          <EditorToolbar format={format} />
        </div>
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          className="min-h-[600px] p-8 bg-transparent focus:outline-none prose prose-lg max-w-none text-[var(--foreground)]"
          style={{ whiteSpace: "pre-wrap" }}
          placeholder="Start writing your masterpiece here..."
        />
      </div>
    </div>
  );

  const Step2Metadata = (
    <div
      className={`max-w-xl mx-auto space-y-8 transition-opacity duration-300 ${
        step === 2 ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <h2 className="text-3xl font-semibold text-[var(--foreground)] text-center">
        Finalize Details
      </h2>
      <p className="text-[var(--foreground)]/60 text-center">
        Add essential metadata before publishing your story.
      </p>

      {/* Cover Image */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[var(--foreground)]/80">
          Cover Image URL (2:3 Portrait Recommended)
        </label>
        <input
          value={coverImageUrl}
          onChange={(e) => setCoverImageUrl(e.target.value)}
          placeholder="https://example.com/cover.jpg"
          className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--foreground)]/10 rounded-lg focus:border-blue-500 focus:outline-none transition"
        />
        {coverImageUrl && (
          <div className="relative aspect-[2/3] w-32 rounded-lg overflow-hidden shadow-lg mt-3 mx-auto">
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
        )}
      </div>

      {/* Genres */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[var(--foreground)]/80">
          Genres (Select up to 3)
        </label>
        <div className="flex flex-wrap gap-2">
          {GENRES.map((genre) => (
            <button
              key={genre}
              type="button"
              // **BUTTON HANDLER CHECK:** This correctly calls toggleGenre and applies the 3-genre limit.
              onClick={() => {
                if (
                  !selectedGenres.includes(genre) &&
                  selectedGenres.length >= 3
                )
                  return;
                toggleGenre(genre);
              }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                selectedGenres.includes(genre)
                  ? "bg-blue-600 text-white"
                  : "bg-[var(--background)] border border-[var(--foreground)]/20 text-[var(--foreground)]/70 hover:border-blue-500 hover:text-blue-500"
              } ${
                selectedGenres.length >= 3 && !selectedGenres.includes(genre)
                  ? "opacity-60 cursor-not-allowed"
                  : ""
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
        <p className="text-xs text-[var(--foreground)]/50 pt-1">
          {selectedGenres.length} / 3 genres selected.
        </p>
      </div>

      {/* Tags & Read Time (Side-by-side) */}
      <div className="grid md:grid-cols-2 gap-6 pt-2">
        <div className="space-y-3">
          <label className="block text-sm font-medium text-[var(--foreground)]/80">
            Tags (Comma separated keywords)
          </label>
          <input
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
            placeholder="magic, adventure, epic"
            className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--foreground)]/10 rounded-lg focus:border-blue-500 focus:outline-none transition"
          />
        </div>
        <div className="space-y-3">
          <label className="block text-sm font-medium text-[var(--foreground)]/80">
            Reading Time (minutes)
          </label>
          <input
            type="number"
            value={readTime}
            onChange={(e) => setReadTime(e.target.value)}
            placeholder="5"
            min="1"
            className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--foreground)]/10 rounded-lg focus:border-blue-500 focus:outline-none transition"
          />
        </div>
      </div>
    </div>
  );

  // --- Main Render ---

  return (
    <>
      <SiteHeader />

      {/* Toast Notification Mount Point */}
      <ToastNotification
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage(null)}
      />

      <div className="min-h-screen bg-[var(--background)] pb-24">
        <div className="max-w-5xl mx-auto px-6 py-12">
          {/* Story Content Area: Render both, control visibility */}
          <div className="relative max-w-4xl mx-auto min-h-[700px]">
            <div className={step === 1 ? "block" : "hidden"}>
              {Step1Content}
            </div>
            <div className={step === 2 ? "block" : "hidden"}>
              {Step2Metadata}
            </div>
          </div>

          {/* Removed inline error/message display */}
        </div>

        {/* Fixed Footer/Action Bar (Minimalist) */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--background)] border-t border-[var(--foreground)]/10 shadow-md">
          <div className="max-w-5xl mx-auto flex items-center justify-between h-16 px-6">
            {/* Left Side: Stats & Back Button */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-mono text-[var(--foreground)]/50">
                {wordCount} words
              </span>
              {step === 2 && (
                <button
                  onClick={prevStep}
                  disabled={loading}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md text-[var(--foreground)]/80 font-medium text-sm hover:bg-[var(--foreground)]/5 transition-colors disabled:opacity-50"
                >
                  <span className="text-xl">←</span> Back
                </button>
              )}
            </div>

            {/* Right Side: Action Buttons */}
            <div className="flex items-center gap-4">
              {/* Always visible: Save Draft */}
              <button
                onClick={() => handleSubmit(false)}
                disabled={loading}
                className="px-4 py-2 rounded-md border border-[var(--foreground)]/20 text-[var(--foreground)]/80 font-medium text-sm hover:bg-[var(--foreground)]/10 transition-colors disabled:opacity-50"
              >
                Draft
              </button>

              {/* Step-specific button */}
              {step === 1 ? (
                <button
                  onClick={nextStep}
                  disabled={loading}
                  className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  Continue <span className="text-xl ml-1">→</span>
                </button>
              ) : (
                <button
                  onClick={() => handleSubmit(true)}
                  disabled={loading}
                  className="px-4 py-2 rounded-md bg-green-600 text-white font-medium text-sm hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  Publish
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        storyId={publishedStoryId}
      />
    </>
  );
}
