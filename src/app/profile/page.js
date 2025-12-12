"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      // Redirect to login if not authenticated
      router.push("/login?redirect=/profile");
    } else if (user.username) {
      // Redirect to the user's author page if they have a username
      router.push(`/authors/${user.username}`);
    }
  }, [user, router]);

  // Show loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-[var(--foreground)]/20 border-t-[var(--foreground)] rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-[var(--foreground)]/60">Redirecting to your profile...</p>
      </div>
    </div>
  );
}
