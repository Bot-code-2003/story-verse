"use client";

import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

import SearchBar from "./SearchBar";
import AuthButtons from "./AuthButtons";
import BrowseMenu from "./BrowseMenu";

export default function SiteHeader() {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header className="flex items-center justify-between px-4 md:px-10 py-6 relative z-50">
        {/* Left: Logo */}
        <Link href="/">
          <h1 className="text-xl font-extrabold text-[var(--foreground)] cursor-pointer">
            StoryVerse
          </h1>
        </Link>

        {/* Desktop Navigation - Hidden on Mobile */}
        <nav className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-8">
            <BrowseMenu isMobile={false} />
            <Link
              href="/write"
              className="text-sm font-medium text-[var(--foreground)]/80 hover:text-[var(--foreground)] transition"
            >
              Write
            </Link>
          </div>
          <SearchBar />
        </nav>

        {/* Right: Auth + Theme + Mobile Menu */}
        <div className="flex items-center gap-5">
          {/* Desktop Auth + Theme - Hidden on Mobile */}
          <div className="hidden md:flex items-center gap-5">
            <AuthButtons />
            <button
              onClick={toggleTheme}
              className="
              p-2 rounded-full border border-[var(--foreground)]/10 
              text-[var(--foreground)]/80 hover:bg-[var(--foreground)]/5 transition
            "
              aria-label={`Switch to ${
                theme === "light" ? "dark" : "light"
              } mode`}
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full border border-[var(--foreground)]/10 text-[var(--foreground)]/80 hover:bg-[var(--foreground)]/5 transition"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu - Full Screen Overlay */}
      {mobileMenuOpen && (
        <div className="fixed top-0 left-0 right-0 bottom-0 md:hidden bg-[var(--background)] z-40 overflow-y-auto pt-20">
          <div className="px-4 py-6 space-y-4">
            {/* Search Bar */}
            <SearchBar />

            {/* Theme Toggle & Write Button - Same Row */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  toggleTheme();
                  closeMobileMenu();
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-[var(--foreground)]/20 text-[var(--foreground)] hover:bg-[var(--foreground)]/5 transition font-medium text-sm"
              >
                {theme === "light" ? (
                  <Moon className="w-4 h-4" />
                ) : (
                  <Sun className="w-4 h-4" />
                )}
                <span>{theme === "light" ? "Dark" : "Light"}</span>
              </button>

              <Link
                href="/write"
                className="flex-1 flex items-center justify-center py-3 px-4 rounded-lg border border-[var(--foreground)]/20 text-[var(--foreground)] hover:bg-[var(--foreground)]/5 transition font-medium text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Write
              </Link>
            </div>

            <div className="border-t border-[var(--foreground)]/10 pt-4">
              <div className="flex gap-3">
                <Link
                  href="/login"
                  className="flex-1 text-center py-3 px-4 rounded-lg border border-[var(--foreground)]/20 text-[var(--foreground)] hover:bg-[var(--foreground)]/5 transition font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="flex-1 text-center py-3 px-4 rounded-lg bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 transition font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </div>

            {/* Browse Menu - Grid View on Mobile */}
            <div onClick={closeMobileMenu} className="pt-2">
              <BrowseMenu isMobile={true} />
            </div>

            {/* Auth Buttons - Same Row */}
          </div>
        </div>
      )}
    </>
  );
}
