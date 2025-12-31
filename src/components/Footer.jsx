"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { GENRE_TILES } from "@/constants/genres";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { user } = useAuth();
  const router = useRouter();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleWriteClick = () => {
    if (user) {
      router.push("/write");
    } else {
      setShowLoginPrompt(true);
    }
  };

  return (
    <>
      <footer className="border-t border-[var(--foreground)]/10 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand Column */}
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2">
                {/* <BookOpen className="w-6 h-6 text-[var(--foreground)]" /> */}
                <img src="/favicon-g.png" className="w-5 h-5" alt="" />
                <span className="text-xl font-bold text-[var(--foreground)]">
                  TheStoryBits
                </span>
              </Link>
              <p className="text-sm text-[var(--foreground)]/60 leading-relaxed">
                Bite-sized fiction stories. Read, write, and share story bits across all genres.
              </p>
            </div>

            {/* Genres Column */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--foreground)] uppercase tracking-wider mb-4">
                Genres
              </h3>
              <ul className="space-y-3">
                {GENRE_TILES.map((genre) => (
                  <li key={genre.name}>
                    <Link
                      href={genre.link}
                      className="text-sm text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition-colors"
                    >
                      {genre.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Community Column */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--foreground)] uppercase tracking-wider mb-4">
                Community
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/stories"
                    className="text-sm text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition-colors"
                  >
                    All Stories
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#featured-authors"
                    className="text-sm text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition-colors"
                  >
                    Featured Authors
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#new-releases"
                    className="text-sm text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition-colors"
                  >
                    New Releases
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleWriteClick}
                    className="text-sm text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition-colors text-left"
                  >
                    Write a Story
                  </button>
                </li>
              </ul>
            </div>

            {/* Connect Column */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--foreground)] uppercase tracking-wider mb-4">
                Connect
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="/about"
                    className="text-sm text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:madisettydharmadeep@gmail.com"
                    className="text-sm text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition-colors"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="/tandp"
                    className="text-sm text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition-colors"
                  >
                    Terms and Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-[var(--foreground)]/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-[var(--foreground)]/50">
                © {currentYear} TheStoryBits. All rights reserved.
              </p>
              <div className="flex gap-6">
                <a
                  href="#"
                  className="text-sm text-[var(--foreground)]/50 hover:text-[var(--foreground)] transition-colors"
                >
                  Twitter
                </a>
                <a
                  href="#"
                  className="text-sm text-[var(--foreground)]/50 hover:text-[var(--foreground)] transition-colors"
                >
                  Instagram
                </a>
                <a
                  href="#"
                  className="text-sm text-[var(--foreground)]/50 hover:text-[var(--foreground)] transition-colors"
                >
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          aria-labelledby="login-prompt-title"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowLoginPrompt(false)}
          />
          {/* Modal */}
          <div className="relative bg-[var(--background)] rounded-3xl shadow-2xl w-full max-w-md p-6 z-10">
            <h3
              id="login-prompt-title"
              className="text-lg font-bold mb-2 text-[var(--foreground)]"
            >
              Please log in to write
            </h3>
            <p className="text-sm text-[var(--foreground)]/70 mb-6">
              You need an account to create and publish stories. Log in to
              continue, or create a new account.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowLoginPrompt(false);
                  router.push("/login?redirect=/write");
                }}
                className="flex-1 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              >
                Log in
              </button>

              <button
                onClick={() => setShowLoginPrompt(false)}
                className="flex-1 px-4 py-2 rounded-xl border border-[var(--foreground)]/20 text-[var(--foreground)] font-semibold hover:bg-[var(--foreground)]/5 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
