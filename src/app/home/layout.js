"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function HomeLayout({ children }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const stored = typeof window !== 'undefined' ? localStorage.getItem("sf_user") : null;
    
    if (!user && !stored) {
      // Redirect to landing page if not logged in
      router.push("/");
    }
  }, [user, router]);

  // Don't render home content if not logged in
  const stored = typeof window !== 'undefined' ? localStorage.getItem("sf_user") : null;
  if (!user && !stored) {
    return <div className="min-h-screen bg-[var(--background)]" />;
  }

  return <>{children}</>;
}
