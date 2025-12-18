"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import SiteHeader from "@/components/SiteHeader";
import { clearAllHomepageCache } from "@/lib/cache";
import { FileText, Clock } from "lucide-react";

// Import modular step components
import TitleDescriptionStep from "@/components/editor/TitleDescriptionStep";
import ContentEditorStep from "@/components/editor/ContentEditorStep";
import MetadataStep from "@/components/editor/MetadataStep";

// --- Toast Notification Component ---
const ToastNotification = ({ message, type, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  const baseClasses =
    "fixed top-5 left-1/2 transform -translate-x-1/2 px-5 py-3 rounded-lg shadow-xl text-sm font-medium transition-all duration-300 z-50 border";

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

// Success Modal Component
const SuccessModal = ({ isOpen, onClose, storyId, isEdit = false }) => {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative bg-[var(--background)] rounded-lg shadow-2xl w-full max-w-sm p-6 text-center border border-[var(--foreground)]/10">
        <div className="text-4xl text-green-600 mb-4">✓</div>
        <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-2">
          {isEdit ? "Story Updated" : "Story Published"}
        </h2>
        <p className="text-[var(--foreground)]/60 mb-4 text-sm">
          {isEdit 
            ? "Your changes have been saved successfully."
            : "Your story is now live and ready to be read."}
        </p>
        {!isEdit && (
          <p className="text-[var(--foreground)]/40 mb-6 text-xs italic">
            Note: It may take up to 5 minutes for your story to appear on the homepage.
          </p>
        )}
        <div className="flex flex-col gap-3">
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

// Contest Already Submitted Modal
const ContestAlreadySubmittedModal = ({ isOpen, onClose, onUncheck }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative bg-[var(--background)] rounded-lg shadow-2xl w-full max-w-md p-6 text-center border border-[var(--foreground)]/10">
        <div className="text-4xl text-amber-500 mb-4">⚠️</div>
        <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">
          Already Submitted
        </h2>
        <p className="text-[var(--foreground)]/60 mb-4 text-sm">
          You've already submitted a story to 7K Sprint Dec 2025. Each author can only submit one story per contest.
        </p>
        <p className="text-[var(--foreground)]/50 mb-6 text-xs bg-[var(--foreground)]/5 p-3 rounded-md">
          💡 <strong>Want to submit a different story?</strong> Delete your previous contest submission from your profile, then you'll be able to submit this story to the contest.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onUncheck}
            className="w-full px-4 py-2 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
          >
            Publish Without Contest
          </button>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 rounded-md border border-[var(--foreground)]/20 text-[var(--foreground)] font-medium hover:bg-[var(--foreground)]/5 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
export default function StoryEditor({ storyId = null, initialData = null }) {
  const router = useRouter();
  const { user } = useAuth();
  const editorRef = useRef(null);

  // State
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [selectedGenres, setSelectedGenres] = useState(initialData?.genres || []);
  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.coverImage || "");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);

  // Toast states
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState("info");

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [publishedStoryId, setPublishedStoryId] = useState(null);

  // Word count state
  const [wordCount, setWordCount] = useState(0);
  const [readTime, setReadTime] = useState(1);

  // Contest submission state
  const [submitToContest, setSubmitToContest] = useState(false);
  const [showContestAlreadyModal, setShowContestAlreadyModal] = useState(false);

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
        setSelectedGenres(data.genres || []);
        setCoverImageUrl(data.coverImage || "");
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

  // Load initialData content into editor when it's available
  useEffect(() => {
    if (initialData && editorRef.current && initialData.content) {
      editorRef.current.innerHTML = initialData.content;
    }
  }, [initialData]);

  // Rich Text Editor Command
  const format = (cmd, value = null) => {
    document.execCommand(cmd, false, value);
    editorRef.current && editorRef.current.focus();
  };

  const getContent = () => (editorRef.current ? editorRef.current.innerHTML : "");

  // Calculate read time
  const calculateReadTime = (words) => {
    if (words === 0) return 1;
    return Math.ceil(words / 250);
  };

  // Debounced word count update
  useEffect(() => {
    const updateWordCount = () => {
      if (editorRef.current) {
        const text = editorRef.current.innerText || "";
        const words = text.split(/\s+/).filter(Boolean).length;
        setWordCount(words);
        setReadTime(calculateReadTime(words));
      }
    };

    updateWordCount();

    let debounceTimeout;
    const handleInput = () => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(updateWordCount, 300);
    };

    const editor = editorRef.current;
    if (editor) {
      editor.addEventListener("input", handleInput);
    }

    return () => {
      clearTimeout(debounceTimeout);
      if (editor) {
        editor.removeEventListener("input", handleInput);
      }
    };
  }, [step]);

  // Validation functions
  const validateStep1 = () => {
    setToastMessage(null);
    if (!title.trim()) {
      showToast("Title is required.", "error");
      return false;
    }
    if (!description.trim()) {
      showToast("Description is required.", "error");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    setToastMessage(null);
    if (!editorRef.current || !editorRef.current.innerText.trim()) {
      showToast("Story content cannot be empty.", "error");
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    setToastMessage(null);
    if (selectedGenres.length === 0) {
      showToast("Please select at least one genre.", "error");
      return false;
    }
    return true;
  };

  // Navigation functions
  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Create payload
  const makePayload = (published = false) => {
    const autoReadTime = calculateReadTime(wordCount);
    
    return {
      title: title.trim(),
      description: description.trim(),
      content: getContent(),
      coverImage: coverImageUrl.trim(),
      readTime: autoReadTime,
      genres: selectedGenres,
      published: !!published,
      contest: published && submitToContest ? "7k-sprint-dec-2025" : null,
    };
  };

  // Submit handler
  const handleSubmit = async (published = false) => {
    if (!validateStep1() || !validateStep2()) return;
    if (published && !validateStep3()) return;

    // Check for duplicate contest submission
    if (published && submitToContest) {
      // Check if user already submitted to this contest
      try {
        const userRes = await fetch(`/api/authors/${user?.username}`);
        if (userRes.ok) {
          const userData = await userRes.json();
          if (userData.author?.latestContest === "7k-sprint-dec-2025") {
            setShowContestAlreadyModal(true);
            return;
          }
        }
      } catch (err) {
        console.error("Error checking contest submission:", err);
      }
    }

    setToastMessage(null);
    setLoading(true);

    try {
      const payload = makePayload(published);
      payload.author = user?.id || null;

      const url = storyId ? `/api/stories/${storyId}` : "/api/stories";
      const method = storyId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || `Failed to ${published ? "publish" : "save"} story`);
      }

      const data = await res.json();

      if (published) {
        clearAllHomepageCache();
        setPublishedStoryId(data?.id);
        setShowSuccessModal(true);
      } else {
        showToast("Draft saved successfully.", "success");
      }

      if (!storyId && data?.id) {
        router.replace(`/editor/${data.id}`, undefined, { shallow: true });
      }
    } catch (err) {
      showToast(err.message || "An unexpected error occurred", "error");
    } finally {
      setLoading(false);
    }
  };



  return (
    <>
      <SiteHeader />

      <ToastNotification
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage(null)}
      />

      <div className="min-h-screen bg-[var(--background)] pb-24">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="relative min-h-[400px]">
            {/* Keep all steps mounted but hide them to preserve editor content */}
            <div style={{ display: step === 1 ? 'block' : 'none' }}>
              <TitleDescriptionStep
                title={title}
                setTitle={setTitle}
                description={description}
                setDescription={setDescription}
              />
            </div>

            <div style={{ display: step === 2 ? 'block' : 'none' }}>
              <ContentEditorStep
                editorRef={editorRef}
                format={format}
                wordCount={wordCount}
              />
            </div>

            <div style={{ display: step === 3 ? 'block' : 'none' }}>
              <MetadataStep
                coverImageUrl={coverImageUrl}
                setCoverImageUrl={setCoverImageUrl}
                selectedGenres={selectedGenres}
                setSelectedGenres={setSelectedGenres}
                uploadingImage={uploadingImage}
                setUploadingImage={setUploadingImage}
                showToast={showToast}
                wordCount={wordCount}
              />
            </div>
          </div>
        </div>

        {/* Fixed Footer/Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--background)] border-t border-[var(--foreground)]/10 shadow-md">
          <div className="max-w-5xl mx-auto flex items-center justify-between h-16 px-6">
            {/* Left Side: Stats & Back Button */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[var(--foreground)]/50" />
                  <span className="text-sm font-medium text-[var(--foreground)]/70">
                    {wordCount}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[var(--foreground)]/50" />
                  <span className="text-sm font-medium text-[var(--foreground)]/70">
                    {readTime}
                  </span>
                </div>
              </div>
              {step > 1 && (
                <button
                  onClick={prevStep}
                  disabled={loading}
                  className="px-4 py-2 rounded-md text-[var(--foreground)]/80 font-medium text-sm hover:bg-[var(--foreground)]/5 transition-colors disabled:opacity-50"
                >
                  Back
                </button>
              )}
            </div>

            {/* Right Side: Action Buttons */}
            <div className="flex items-center gap-4">
              {step < 3 ? (
                <button
                  onClick={nextStep}
                  disabled={loading}
                  className="px-6 py-2 rounded-md bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  Continue
                </button>
              ) : (
                <>
                  {/* Contest Checkbox - Commented out */}
                  {/* <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={submitToContest}
                      onChange={(e) => setSubmitToContest(e.target.checked)}
                      className="w-4 h-4 rounded border-[var(--foreground)]/30 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-[var(--foreground)]/70">
                      Submit to 7K Sprint Dec 2025
                    </span>
                  </label> */}

                  <button
                    onClick={() => handleSubmit(true)}
                    disabled={loading}
                    className="px-6 py-2 rounded-md bg-green-600 text-white font-medium text-sm hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {loading 
                      ? (storyId ? "Updating..." : "Publishing...") 
                      : (storyId ? "Update" : "Publish")}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        storyId={publishedStoryId}
        isEdit={!!storyId}
      />

      <ContestAlreadySubmittedModal
        isOpen={showContestAlreadyModal}
        onClose={() => setShowContestAlreadyModal(false)}
        onUncheck={() => {
          setShowContestAlreadyModal(false);
          setSubmitToContest(false);
          // Auto-submit without contest
          handleSubmit(true);
        }}
      />
    </>
  );
}
