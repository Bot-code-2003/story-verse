"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PulseCheckSimple({
  onPulseSubmit,
  user,
  pulseCounts = { soft: 0, intense: 0, heavy: 0, warm: 0, dark: 0 },
  userPulse = null,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const pulses = [
    { label: "Soft", value: "soft", emoji: "☁️" },
    { label: "Intense", value: "intense", emoji: "🔥" },
    { label: "Heavy", value: "heavy", emoji: "🪨" },
    { label: "Warm", value: "warm", emoji: "☕" },
    { label: "Dark", value: "dark", emoji: "🌑" },
  ];

  const handleClick = async (pulse) => {
    if (!user) {
      router.push(`/login?redirect=${window.location.pathname}`);
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onPulseSubmit?.(pulse);
    } finally {
      setIsSubmitting(false);
    }
  };

  const total = Object.values(pulseCounts).reduce((a, b) => a + b, 0);

  return (
    <div
      className="max-w-xl mx-auto px-4 my-10"
      style={{
        background: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      {/* Header */}
      <h3 className="text-center text-lg font-medium mb-2">
        How did this story feel?
      </h3>

      {total > 0 && (
        <p
          className="text-center text-sm mb-6"
          style={{ color: "var(--muted)" }}
        >
          {total} readers responded
        </p>
      )}

      {/* Pulse buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {pulses.map((p) => {
          const selected = userPulse === p.value;
          const count = pulseCounts[p.value] || 0;

          return (
            <button
              key={p.value}
              onClick={() => handleClick(p.value)}
              disabled={isSubmitting}
              className="rounded-xl px-4 py-3 transition border"
              style={{
                background: selected
                  ? "var(--foreground)"
                  : "var(--background)",
                color: selected
                  ? "var(--background)"
                  : "var(--foreground)",
                borderColor: "var(--border)",
              }}
            >
              <div className="flex flex-col items-center">
                <span className="text-2xl mb-1">{p.emoji}</span>
                <span className="text-xs font-medium">{p.label}</span>

                {count > 0 && (
                  <span
                    className="mt-1 text-[10px]"
                    style={{ opacity: 0.6 }}
                  >
                    {count}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {userPulse && !isSubmitting && (
        <p
          className="text-center text-sm mt-6"
          style={{ color: "var(--muted)" }}
        >
          Your pulse is saved.
        </p>
      )}

      {/* Login hint */}
      {!user && (
        <p
          className="text-center text-sm mt-6"
          style={{ color: "var(--muted)" }}
        >
          <span style={{ color: "var(--foreground)", fontWeight: 500 }}>
            Sign in
          </span>{" "}
          to share how this felt
        </p>
      )}
    </div>
  );
}
