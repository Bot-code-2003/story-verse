"use client";
import Link from "next/link";

export default function BecomeAuthorBanner() {
  return (
    <section className="">
      <div className="">
        <div className="relative overflow-hidden bg-[#e7f2e4] pb-10">
          <div className="max-w-7xl mx-auto grid md:grid-cols-5 min-h-[480px]">
            {/* ---------------- Left: Content ---------------- */}
            <div className="md:col-span-3 p-10 md:p-14 lg:p-20 flex flex-col justify-center">
              <div className="max-w-xl space-y-7">
                {/* Small Label */}
                <span className="text-xs font-semibold tracking-widest uppercase text-[#5a6358]/50">
                  For writers
                </span>

                {/* Headline */}
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold leading-tight text-[#2d3a2a]">
                  Start your author journey.
                </h3>

                {/* Description */}
                <p className="text-lg md:text-xl text-[#5a6358] leading-relaxed">
                  Share your stories with readers who care.
                  Publish quietly, grow steadily, and build
                  an audience that returns for your words.
                </p>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <Link
                    href="/login?redirect=/write"
                    className="px-8 py-4 rounded-full font-semibold text-white bg-[#5a7a53] hover:bg-[#4a6344] transition-colors text-center"
                  >
                    Start writing
                  </Link>

                  <Link
                    href="/about"
                    className="px-8 py-4 rounded-full font-semibold text-[#5a7a53] bg-[#e2ede0] hover:bg-[#d8e6d5] transition-colors text-center"
                  >
                    Learn more
                  </Link>
                </div>
              </div>
            </div>

            {/* ---------------- Right: Image ---------------- */}
            <div className="md:col-span-2 relative min-h-[260px] md:min-h-0">
              <img
                src="https://i.pinimg.com/1200x/89/d3/af/89d3af232fc07bb2ac06c73621fef573.jpg"
                alt="Writing desk"
                className="absolute inset-0 rounded-2xl w-full h-full object-cover"
              />
              {/* Soft overlay to blend image */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
