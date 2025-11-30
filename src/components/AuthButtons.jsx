"use client";

import Link from "next/link";

export default function AuthButtons() {
  return (
    <div className="flex items-center gap-4">
      <Link
        href="/login"
        className="text-sm font-medium text-[var(--foreground)]/80 hover:text-[var(--foreground)] transition"
      >
        Log In
      </Link>

      <Link
        href="/signup"
        className="text-sm font-medium px-5 py-2 rounded-lg bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 transition"
      >
        Sign Up
      </Link>
    </div>
  );
}
