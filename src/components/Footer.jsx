"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--foreground)]/10 bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-[var(--foreground)]" />
              <span className="text-xl font-bold text-[var(--foreground)]">
                OneSitRead
              </span>
            </Link>
            <p className="text-sm text-[var(--foreground)]/60 leading-relaxed">
              Short fiction stories you can finish in one sitting. Read, write, and share.
            </p>
          </div>

          {/* Discover Column */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)] uppercase tracking-wider mb-4">
              Discover
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/#editors-pick"
                  className="text-sm text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition-colors"
                >
                  Editor's Pick
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
                  href="/#browse-genres"
                  className="text-sm text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition-colors"
                >
                  Browse Genres
                </Link>
              </li>
              <li>
                <Link
                  href="/#quick-reads"
                  className="text-sm text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition-colors"
                >
                  Quick Reads
                </Link>
              </li>
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
                  href="/#become-author"
                  className="text-sm text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition-colors"
                >
                  Become an Author
                </Link>
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
                  href="#"
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
              © {currentYear} OneSitRead. All rights reserved.
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
  );
}
