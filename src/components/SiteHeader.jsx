"use client";

import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon, Menu, X, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import SearchBar from "./SearchBar";
import AuthButtons from "./AuthButtons";
import BrowseMenu from "./BrowseMenu";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";

export default function SiteHeader() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const { unreadCount } = useNotifications();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sfUser, setSfUser] = useState(null); // added state to store sf_user
  const [showLoginPrompt, setShowLoginPrompt] = useState(false); // modal when not logged in

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen || showLoginPrompt) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen, showLoginPrompt]);

  // Load sf_user from localStorage
  useEffect(() => {
    try {
      const stored =
        typeof window !== "undefined" ? localStorage.getItem("sf_user") : null;
      if (stored) setSfUser(JSON.parse(stored));
    } catch (err) {
      console.error("Failed to read sf_user from localStorage:", err);
    }
  }, []);

  // Handler for Write click
  const handleWriteClick = (opts = { closeMobile: false }) => {
    if (opts.closeMobile) closeMobileMenu();
    if (user) {
      router.push("/write");
    } else {
      setShowLoginPrompt(true);
    }
  };

  return (
    <>
      <header className="flex items-center justify-between px-4 md:px-6 lg:px-10 py-3 relative z-50 gap-3">
        {/* Left: Logo */}
        <Link href="/">
          <h1 className="text-lg md:text-xl font-extrabold text-[var(--foreground)] cursor-pointer whitespace-nowrap">
            TheStoryBits
          </h1>
        </Link>

        {/* Desktop Navigation - Only show on large screens */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 flex-1 max-w-4xl">
          <div className="flex items-center gap-6 xl:gap-8">
            <BrowseMenu isMobile={false} />
            {/* Contest menu - commented out for future implementation */}
            {/* <Link
              href="/contests"
              className="text-sm font-medium text-[var(--foreground)]/80 hover:text-[var(--foreground)] transition whitespace-nowrap"
            >
              Contests
            </Link> */}
            {/* Write as a button (permission-checked) */}
            <button
              onClick={() => handleWriteClick({ closeMobile: false })}
              className="text-sm font-medium text-[var(--foreground)]/80 hover:text-[var(--foreground)] transition whitespace-nowrap"
            >
              Write
            </button>
          </div>
          <SearchBar />
        </nav>

        {/* Right: Auth + Theme + Mobile Menu */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Desktop/Tablet Auth + Theme - Show on md and up */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            {/* Notification Bell - only show when logged in */}
            {user && (
              <Link
                href="/notifications"
                className="relative p-2 rounded-full border border-[var(--foreground)]/10 text-[var(--foreground)]/80 hover:bg-[var(--foreground)]/5 transition flex-shrink-0"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-[10px] font-bold text-white bg-red-500 rounded-full">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>
            )}
            <AuthButtons />
            <button
              onClick={toggleTheme}
              className="
                p-2 rounded-full border border-[var(--foreground)]/10 
                text-[var(--foreground)]/80 hover:bg-[var(--foreground)]/5 transition
                flex-shrink-0
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

          {/* Mobile Notification Bell - Show outside menu on mobile */}
          {user && (
            <Link
              href="/notifications"
              className="lg:hidden relative p-2 rounded-full border border-[var(--foreground)]/10 text-[var(--foreground)]/80 hover:bg-[var(--foreground)]/5 transition flex-shrink-0"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] flex items-center justify-center px-1 text-[9px] font-bold text-white bg-red-500 rounded-full">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Link>
          )}

          {/* Mobile/Tablet Menu Button - Show on lg and below */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-full border border-[var(--foreground)]/10 text-[var(--foreground)]/80 hover:bg-[var(--foreground)]/5 transition flex-shrink-0"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 md:w-6 md:h-6" />
            ) : (
              <Menu className="w-5 h-5 md:w-6 md:h-6" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile/Tablet Menu */}
      {mobileMenuOpen && (
        <div className="fixed top-0 left-0 right-0 bottom-0 lg:hidden bg-[var(--background)] z-40 overflow-y-auto pt-20">
          <div className="px-4 py-6 space-y-4">
            {/* Search Bar */}
            <SearchBar />

            {/* Theme + Write */}
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

              {/* Contest menu - commented out for future implementation */}
              {/* <Link
                href="/contests"
                onClick={closeMobileMenu}
                className="flex-1 flex items-center justify-center py-3 px-4 rounded-lg border border-[var(--foreground)]/20 text-[var(--foreground)] hover:bg-[var(--foreground)]/5 transition font-medium text-sm"
              >
                Contests
              </Link> */}

              <button
                onClick={() => handleWriteClick({ closeMobile: true })}
                className="flex-1 flex items-center justify-center py-3 px-4 rounded-lg border border-[var(--foreground)]/20 text-[var(--foreground)] hover:bg-[var(--foreground)]/5 transition font-medium text-sm"
              >
                Write
              </button>
            </div>

            {/* Profile Preview + Auth - Only show on small screens, hide on md */}
            <div className="border-t border-[var(--foreground)]/10 pt-4 md:hidden">
              {/* Mobile User Info */}
              {sfUser && (
                <div className="flex items-center gap-3 mb-4">
                  {sfUser.profileImage ? (
                    <img
                      src={sfUser.profileImage}
                      alt={sfUser.username || sfUser.name || "User"}
                      className="w-10 h-10 rounded-full object-cover border border-[var(--foreground)]/20"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[var(--foreground)]/10 flex items-center justify-center text-sm font-semibold text-[var(--foreground)]">
                      {(sfUser.username || sfUser.name || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    {sfUser.username || sfUser.name}
                  </span>
                </div>
              )}

              <div className="flex gap-3">
                <AuthButtons />
              </div>
            </div>

            {/* Browse Menu */}
            <div onClick={closeMobileMenu} className="pt-2">
              <BrowseMenu isMobile={true} />
            </div>
          </div>
        </div>
      )}

      {/* Login Prompt Modal (shown when user tries to Write but not logged in) */}
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
