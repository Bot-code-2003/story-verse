"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const Writers = () => {
  return (
    <section className="py-28 px-6 bg-[#f3f7f2]">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
        {/* ------------------------------ Left: Writing mockup ------------------------------ */}
        <div className="order-2 lg:order-1">
          <div className="bg-white  border border-[#c5d8c1]/60 shadow-sm p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-semibold text-[#5a7a53]">
                Draft
              </span>
              <span className="text-xs text-[#5a6358]/60">
                autosaved
              </span>
            </div>

            {/* Title */}
            <div className="h-8 bg-[#e2ede0] rounded-md w-3/4 mb-6" />

            {/* Body */}
            <div className="space-y-3 mb-6">
              <div className="h-3 bg-[#e2ede0] rounded w-full" />
              <div className="h-3 bg-[#e2ede0] rounded w-5/6" />
              <div className="h-3 bg-[#e2ede0] rounded w-4/6" />
              <div className="h-3 bg-[#e2ede0] rounded w-2/3" />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-full bg-[#e2ede0] text-xs font-medium text-[#5a7a53]">
                  Fantasy
                </span>
                <span className="px-3 py-1 rounded-full bg-[#e2ede0] text-xs font-medium text-[#5a7a53]">
                  Adventure
                </span>
              </div>

              <button className="px-5 py-2 rounded-full bg-[#5a7a53] text-white text-sm font-semibold">
                Publish
              </button>
            </div>
          </div>
        </div>

        {/* ------------------------------ Right: Text ------------------------------ */}
        <div className="order-1 lg:order-2 space-y-6">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#2d3a2a] leading-tight">
            Your story,
            <br />
            your rules.
          </h2>

          <p className="text-lg md:text-xl text-[#5a6358] leading-relaxed max-w-xl">
            Craft your narrative without distractions.
            From first draft to final publish, we provide
            the canvas for your creativity.
          </p>

          <p className="font-serif italic text-[#5a7a53]/50 text-lg">
            Focus on what matters: your words.
          </p>

          <Link
            href="/login?redirect=/write"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#5a7a53] hover:bg-[#4a6344] text-white font-semibold text-lg transition-colors mt-6"
          >
            Start writing
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Writers;
