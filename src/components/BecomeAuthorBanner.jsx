"use client";
import Link from "next/link";

export default function BecomeAuthorBanner() {
  return (
    <section className="mb-20">
      <div className="relative rounded-3xl overflow-hidden border border-[var(--foreground)]/10">
        <div className="grid md:grid-cols-5 min-h-[500px]">
          {/* Left Side - Content (3 columns) */}
          <div className="md:col-span-3 p-12 md:p-16 lg:p-20 flex flex-col justify-center">
            <div className="max-w-xl space-y-8">
              {/* Small Label */}
              <div className="inline-block">
                <span className="text-sm font-medium tracking-wider uppercase text-[var(--foreground)]/40">
                  For Creators
                </span>
              </div>

              {/* Headline */}
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.1] text-[var(--foreground)]">
                Start Your Author Journey
              </h3>

              {/* Description */}
              <p className="text-lg md:text-xl text-[var(--foreground)]/60 leading-relaxed">
                Share your stories with thousands of readers. Build your
                audience and connect with a community that loves great writing.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  href="/login"
                  className="px-8 py-4 rounded-full font-semibold text-white bg-blue-500 hover:bg-blue-600 transition-colors"
                >
                  Sign Up to Write
                </Link>
                <button className="px-8 py-4 rounded-full font-semibold text-[var(--foreground)] bg-[var(--foreground)]/10 hover:bg-[var(--foreground)]/20 transition-colors">
                  Learn More
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Image (2 columns) */}
          <div className="md:col-span-2 relative h-[300px] md:h-auto">
            <img
              src="https://i.pinimg.com/1200x/89/d3/af/89d3af232fc07bb2ac06c73621fef573.jpg"
              alt="Author Background"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
