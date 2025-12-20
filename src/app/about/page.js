// src/app/about/page.js

"use client";

import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-serif">
      <SiteHeader />

      <main className="max-w-7xl mx-auto px-6 lg:px-10 pt-20 sm:pt-40 pb-36">
        
        {/* HERO SECTION - STATEMENT PIECE */}
        <section className="mb-48 relative">
          {/* Decorative gradient orbs */}
          <div className="pointer-events-none absolute -top-20 -right-20 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="pointer-events-none absolute top-40 -left-32 h-80 w-80 rounded-full bg-blue-600/5 blur-3xl" />
          
          <p className="text-lg uppercase tracking-[0.3em] text-blue-500 mb-8 font-sans font-medium animate-fade-in">
            Origin Story
          </p>
          
          <h1 className="text-7xl sm:text-8xl md:text-[10rem] font-black leading-[0.9] tracking-tighter max-w-6xl mb-16 relative">
            An escape built by someone who{" "}
            <span className="relative inline-block">
              <span className="text-blue-500">needed one</span>
              <span className="absolute -bottom-4 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" />
            </span>
            .
          </h1>

          {/* Large pull quote - offset to the right */}
          <div className="flex justify-end mt-20">
            <div className="max-w-2xl relative">
              <div className="absolute -left-8 top-0 text-9xl font-black text-blue-500/10 leading-none">"</div>
              <p className="text-2xl sm:text-3xl text-[var(--foreground)]/85 leading-snug border-l-4 border-blue-500 pl-8 relative z-10">
                I'm 22. Software engineer in AI/ML. Already fed up with the grind.
                <br /><br />
                I needed somewhere to escape. I love stories and I love building websites — 
                so I combined them into this.
              </p>
            </div>
          </div>
        </section>

        {/* THE PROBLEM - Bold statement */}
        <section className="mb-48">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-6xl sm:text-7xl font-black tracking-tighter mb-8 leading-tight">
                Stories deserve better than{" "}
                <span className="italic text-blue-500">this</span>
              </h2>
            </div>
            <div className="space-y-6">
              <div className="p-6 bg-[var(--foreground)]/5 border-l-4 border-red-500/50 rounded-r-xl">
                <p className="text-lg text-[var(--foreground)]/60 line-through">Buried in Google Docs</p>
              </div>
              <div className="p-6 bg-[var(--foreground)]/5 border-l-4 border-red-500/50 rounded-r-xl">
                <p className="text-lg text-[var(--foreground)]/60 line-through">Lost in social feeds</p>
              </div>
              <div className="p-6 bg-[var(--foreground)]/5 border-l-4 border-red-500/50 rounded-r-xl">
                <p className="text-lg text-[var(--foreground)]/60 line-through">Fighting algorithms</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-blue-500/10 to-blue-600/5 border-l-4 border-blue-500 rounded-r-xl">
                <p className="text-lg font-bold text-blue-400">A calm, focused home ✓</p>
              </div>
            </div>
          </div>
        </section>

        {/* THE SOLUTION - Split editorial layout */}
        <section className="mb-48 grid lg:grid-cols-[1.2fr_0.8fr] gap-20">
          <div>
            <h2 className="text-6xl font-black tracking-tight mb-12 leading-tight">
              What I'm building here
            </h2>
            <div className="space-y-8 text-xl text-[var(--foreground)]/80 leading-relaxed">
              <p>
                A place where short stories can breathe. Where writers can publish without pressure. 
                Where readers can discover new worlds in minutes, not hours.
              </p>
              <p>
                No engagement metrics. No viral chasing. No algorithmic feed.
              </p>
              <p className="text-2xl font-bold text-[var(--foreground)] border-l-4 border-blue-500 pl-6">
                Just stories that matter, given the attention they deserve.
              </p>
            </div>
          </div>

          {/* Floating principles card */}
          <div className="relative rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-500/15 to-blue-600/5 px-10 py-12 self-start lg:translate-y-16 shadow-2xl backdrop-blur-sm">
            <div className="pointer-events-none absolute -top-8 -right-8 h-32 w-32 rounded-full bg-blue-500/30 blur-3xl" />
            
            <h3 className="text-4xl font-black tracking-tight mb-10 text-blue-400">
              Core Principles
            </h3>
            
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <p className="text-sm uppercase tracking-[0.25em] text-blue-400 font-sans font-bold">
                    Focus
                  </p>
                </div>
                <p className="text-lg font-medium pl-5">
                  Short stories. No endless scroll.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <p className="text-sm uppercase tracking-[0.25em] text-blue-400 font-sans font-bold">
                    Calm
                  </p>
                </div>
                <p className="text-lg font-medium pl-5">
                  A quiet home. Not a noisy feed.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <p className="text-sm uppercase tracking-[0.25em] text-blue-400 font-sans font-bold">
                    Freedom
                  </p>
                </div>
                <p className="text-lg font-medium pl-5">
                  Try. Change. Experiment.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <p className="text-sm uppercase tracking-[0.25em] text-blue-400 font-sans font-bold">
                    Respect
                  </p>
                </div>
                <p className="text-lg font-medium pl-5">
                  Your time. Your voice.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WHO IT'S FOR - Large cards */}
        <section className="mb-48">
          <div className="mb-20">
            <h2 className="text-6xl font-black tracking-tight mb-6 leading-tight">
              Built for two kinds of people
            </h2>
            <div className="h-2 w-32 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" />
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Writer Module */}
            <div className="group relative p-10 border-2 border-[var(--foreground)]/10 rounded-3xl transition-all duration-500 hover:border-blue-500 hover:shadow-[0_0_60px_-10px_rgba(59,130,246,0.4)] overflow-hidden">
              <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-blue-500/0 group-hover:bg-blue-500/10 blur-3xl transition-all duration-500" />
              
              <p className="text-sm font-bold tracking-[0.2em] uppercase text-blue-500 mb-6 font-sans">
                For writers
              </p>
              <h3 className="text-4xl font-black leading-tight mb-6">
                Your low-pressure stage
              </h3>
              <p className="text-xl text-[var(--foreground)]/70 mb-10 leading-relaxed">
                Publish drafts, experiments, polished pieces. No algorithms to fight. 
                No engagement anxiety. Just your stories, your way.
              </p>
              <Link
                href="/login?redirect=/write"
                className="inline-flex items-center gap-2 text-xl font-bold text-blue-500 border-b-2 border-blue-500/50 pb-1 hover:border-blue-500 transition-all group-hover:gap-4"
              >
                Start writing <span className="text-2xl">→</span>
              </Link>
            </div>

            {/* Reader Module */}
            <div className="group relative p-10 border-2 border-[var(--foreground)]/10 rounded-3xl transition-all duration-500 hover:border-blue-500 hover:shadow-[0_0_60px_-10px_rgba(59,130,246,0.4)] overflow-hidden">
              <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-blue-500/0 group-hover:bg-blue-500/10 blur-3xl transition-all duration-500" />
              
              <p className="text-sm font-bold tracking-[0.2em] uppercase text-blue-500 mb-6 font-sans">
                For readers
              </p>
              <h3 className="text-4xl font-black leading-tight mb-6">
                Worlds in minutes
              </h3>
              <p className="text-xl text-[var(--foreground)]/70 mb-10 leading-relaxed">
                Fantasy, sci-fi, romance, horror. Bite-sized stories perfect for quick escapes. 
                No commitment. Just curiosity.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xl font-bold text-blue-500 border-b-2 border-blue-500/50 pb-1 hover:border-blue-500 transition-all group-hover:gap-4"
              >
                Browse stories <span className="text-2xl">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* CLOSING - Full-width impact */}
        <section className="relative border-t-2 border-[var(--foreground)]/10 pt-24">
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-64 w-full max-w-2xl rounded-full bg-blue-500/10 blur-3xl" />
          
          <div className="text-center relative">
            <p className="text-sm uppercase tracking-[0.3em] text-blue-500 mb-6 font-sans font-medium">
              The Journey
            </p>
            <h2 className="text-6xl sm:text-7xl font-black tracking-tight mb-12 leading-tight">
              This is still <span className="italic text-blue-500">early</span>
            </h2>
            <p className="text-3xl font-semibold text-[var(--foreground)]/90 leading-snug max-w-4xl mx-auto mb-10">
              I'm learning. Tweaking. Shipping in small steps.
            </p>
            <div className="inline-block p-8 bg-gradient-to-br from-blue-500/15 to-blue-600/5 border border-blue-500/30 rounded-2xl">
              <p className="text-4xl sm:text-5xl font-black text-blue-500 leading-tight">
                If you're here this early,<br />you're part of the story too.
              </p>
            </div>
            <p className="text-xl text-[var(--foreground)]/60 leading-relaxed mt-16 max-w-2xl mx-auto">
              Thank you for reading, writing, or just quietly lurking.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}