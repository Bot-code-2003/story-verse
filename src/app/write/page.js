"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import StoryEditor from "@/components/StoryEditor";

export default function WritePage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/write");
    }
  }, [user, router]);

  // Show nothing while redirecting
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-[var(--foreground)]/20 border-t-[var(--foreground)] rounded-full animate-spin mx-auto"></div>
          <p className="text-[var(--foreground)]/60 text-sm">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <StoryEditor />;
}
