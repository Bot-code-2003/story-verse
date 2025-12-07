// src/app/about/page.js

"use client";

import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";

// --- REVISED DESIGN SYSTEM VARIABLES ---
// We're using a rich, dark theme with a warm, sophisticated accent.

// Deep, modern charcoal background
const BG_DARK = "#0A0A0A"; 
// Clean off-white for text
const TEXT_LIGHT = "hsl(30, 8%, 96%)";
// Warm, earthy accent color (e.g., a muted terracotta/sienna)
const ACCENT_SIENNA = "hsl(10, 50%, 55%)"; 

export default function AboutPage() {
  return (
    // Applying a high-contrast dark theme with a serif font for editorial feel
    <div
      style={{
        // "--background": BG_DARK,
        // "--foreground": TEXT_LIGHT,
        "--accent": ACCENT_SIENNA,
      }}
      className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-serif"
    >
      <SiteHeader />

      <main className="max-w-7xl mx-auto px-6 lg:px-10 pt-20 sm:pt-40 pb-36">
        
        {/* 🥇 HERO SECTION: STATEMENT PIECE */}
        <section className="mb-40">
          <p className="text-lg uppercase tracking-[0.3em] text-[var(--accent)] mb-8 font-sans font-medium">
            StoryVerse Manifesto
          </p>
          <h1 className="text-7xl sm:text-8xl md:text-9xl font-extrabold leading-none tracking-tighter max-w-6xl">
            A small home for{" "}
            <span className="text-[var(--accent)]">big feelings</span>{" "}
            in short stories.
          </h1>
          <div className="flex justify-end mt-16">
            <p className="text-2xl sm:text-3xl text-[var(--foreground)]/85 max-w-2xl leading-snug border-l-4 border-[var(--accent)] pl-6">
              StoryVerse started as a tiny side project: a place to put the
              stories that were “too small” for a book, but too special to live
              and die in a notes app.
            </p>
          </div>
        </section>

        {/* 📚 CORE REASON: Editorial Split with Pull Quote (Corrected Bold Text) */}
        <section className="mb-40 grid lg:grid-cols-[1fr_0.8fr] gap-20">
          <div>
            <h2 className="text-5xl font-extrabold tracking-tight mb-12">
              The Need for Quiet Space
            </h2>
            <div className="space-y-8 text-xl text-[var(--foreground)]/80 leading-relaxed">
              <p>
                We kept hearing the same thing from friends who write: "I have
                ideas… I just don’t know where to put them."
              </p>
              <p>
                Threads vanish. Docs get buried. Social feeds move on in minutes. We
                wanted a slower corner of the internet — focused, cozy, and built
                just for short fiction, giving every piece the
                <span className="font-bold text-[var(--foreground)]">
                  {" "}
                  attention it deserves
                </span>
                .
              </p>
              <p>
                So we built StoryVerse: a calm, simple place for writers to share,
                and for readers to wander through new worlds in just a few minutes.
              </p>
            </div>
          </div>

          {/* Accent Box / Pull Quote (CLEANED UP) */}
          {/* Commitment / Minimal Manifesto */}
<div className="relative rounded-3xl border border-[var(--foreground)]/10 bg-[var(--foreground)]/5 px-8 py-10 sm:px-10 sm:py-12 self-start lg:translate-y-16 shadow-sm">
  {/* Soft decorative glow */}
  <div className="pointer-events-none absolute -top-6 -left-6 h-24 w-24 rounded-full bg-[var(--foreground)]/5 blur-2xl" />

  {/* Title */}
  <h3 className="text-3xl font-bold tracking-tight mb-8">
    Our promise
  </h3>

  {/* Grid of short ideas */}
  <div className="grid gap-6 sm:grid-cols-2">
    <div>
      <p className="text-sm uppercase tracking-[0.25em] text-[var(--foreground)]/50 mb-1">
        Focus
      </p>
      <p className="text-base font-medium">
        Short stories.  
        No endless scroll.
      </p>
    </div>

    <div>
      <p className="text-sm uppercase tracking-[0.25em] text-[var(--foreground)]/50 mb-1">
        Calm
      </p>
      <p className="text-base font-medium">
        A quiet home.  
        Not a noisy feed.
      </p>
    </div>

    <div>
      <p className="text-sm uppercase tracking-[0.25em] text-[var(--foreground)]/50 mb-1">
        Freedom
      </p>
      <p className="text-base font-medium">
        Try. Change.  
        Experiment.
      </p>
    </div>

    <div>
      <p className="text-sm uppercase tracking-[0.25em] text-[var(--foreground)]/50 mb-1">
        Respect
      </p>
      <p className="text-base font-medium">
        Your time.  
        Your voice.
      </p>
    </div>
  </div>
</div>

        </section>

        {/* 👥 DOUBLE-COLUMN CTA: The User Groups */}
        <section className="mb-40">
          <h2 className="text-5xl font-extrabold tracking-tight mb-16 max-w-4xl border-b border-[var(--foreground)]/10 pb-6">
            Who we empower
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Writer Module */}
            <div className="p-8 border border-[var(--foreground)]/15 rounded-3xl transition duration-500 hover:border-[var(--accent)] hover:shadow-[0_0_40px_-5px_var(--accent)/20]">
              <p className="text-sm font-semibold tracking-[0.2em] uppercase text-[var(--accent)] mb-4 font-sans">
                For writers
              </p>
              <h3 className="text-3xl font-bold leading-snug mb-4">
                A low-pressure stage to debut your work.
              </h3>
              <p className="text-xl text-[var(--foreground)]/70 mb-8">
                Share drafts, experiments, and polished pieces without fighting
                an algorithm. Publish one story at a time, on your terms.
              </p>
              <Link
                href="/login?redirect=/write"
                className="inline-flex text-lg font-semibold text-[var(--accent)] border-b-2 border-[var(--accent)]/50 pb-1 hover:border-[var(--accent)] transition-colors"
              >
                Start a new story →
              </Link>
            </div>

            {/* Reader Module */}
            <div className="p-8 border border-[var(--foreground)]/15 rounded-3xl transition duration-500 hover:border-[var(--accent)] hover:shadow-[0_0_40px_-5px_var(--accent)/20]">
              <p className="text-sm font-semibold tracking-[0.2em] uppercase text-[var(--accent)] mb-4 font-sans">
                For readers
              </p>
              <h3 className="text-3xl font-bold leading-snug mb-4">
                Tiny worlds you can finish in one sitting.
              </h3>
              <p className="text-xl text-[var(--foreground)]/70 mb-8">
                Dip into fantasy, romance, horror, and more — without needing a
                whole weekend. Just a few quiet minutes and some curiosity.
              </p>
              <Link
                href="/stories"
                className="inline-flex text-lg font-semibold text-[var(--accent)] border-b-2 border-[var(--accent)]/50 pb-1 hover:border-[var(--accent)] transition-colors"
              >
                Browse stories →
              </Link>
            </div>
          </div>
        </section>

        {/* 🚀 CLOSING NOTE: Full-width, Impactful Paragraph */}
        <section className="max-w-5xl mx-auto border-t border-[var(--foreground)]/20 pt-16">
          <h2 className="text-5xl font-extrabold tracking-tight mb-8 text-center">
            The Next Chapter
          </h2>
          <p className="text-3xl font-semibold text-[var(--foreground)]/90 leading-snug text-center">
            StoryVerse is still early. We're learning, tweaking, and
            shipping in small steps — with a singular, driving commitment:
          </p>
          <p className="text-4xl mt-8 font-extrabold text-[var(--accent)] text-center">
            To make it easier to tell and discover good short stories.
          </p>
          <p className="text-xl text-[var(--foreground)]/70 leading-relaxed mt-12 text-center">
            If you're here this early, you're part of that story too.
            Thank you for reading, writing, or just quietly lurking.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}