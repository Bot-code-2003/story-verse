"use client";

import { useEffect, useState } from "react";

const slides = [
  {
    id: 1,
    title: "Escape in 10 Minutes",
    subtitle: "Short stories perfect for your quick breaks.",
    image:
      "https://i.pinimg.com/1200x/cd/d7/93/cdd7932243d43e78cfedc2768f1dafb4.jpg",
    cta: "Browse Quick Reads",
  },
  {
    id: 2,
    title: "Stories to Sink Into",
    subtitle: "Take your time with thoughtful, lingering tales.",
    image:
      "https://i.pinimg.com/1200x/db/a1/0e/dba10e448c3df983b21296863e133ff6.jpg",
    cta: "Explore Deep Dives",
  },
  {
    id: 3,
    title: "Read by Mood",
    subtitle: "Stories curated for every mood, moment, and mindset.",
    image:
      "https://i.pinimg.com/1200x/1f/af/b6/1fafb6f2a261cf7962483673ba8d5f21.jpg",
    cta: "Find Your Mood",
  },
  {
    id: 4,
    title: "Discover New Voices",
    subtitle: "Fresh stories from emerging authors.",
    image:
      "https://i.pinimg.com/1200x/29/bf/48/29bf48e91e1388a57bfc30f026ce2784.jpg",
    cta: "Meet the Authors",
  },
];

const AUTO_SLIDE_INTERVAL = 5000; // 5 seconds

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [progressBarKey, setProgressBarKey] = useState(0); // Key to restart CSS animation

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
      setProgressBarKey((prev) => prev + 1); // Reset the progress bar animation
    }, AUTO_SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  // Function to handle manual navigation via dots
  const handleDotClick = (newIndex) => {
    setIndex(newIndex);
    setProgressBarKey((prev) => prev + 1); // Reset the progress bar animation
  };

  return (
    <section className="relative w-full h-[300px] md:h-[450px] rounded-2xl mb-12 overflow-hidden">
      {/* IMAGE */}
      {slides.map((slide, i) => (
        <img
          key={slide.id}
          src={slide.image}
          alt={slide.title}
          // The transition is slightly smoother with a shorter duration on the hidden slide
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            i === index ? "opacity-100" : "opacity-0 duration-300"
          }`}
        />
      ))}

      {/* GRADIENT OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* CONTENT */}
      <div className="absolute bottom-6 left-6 text-white max-w-xl transition-all duration-700">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">
          {slides[index].title}
        </h2>
        <p className="text-sm md:text-base text-white/80 mb-2">
          {slides[index].subtitle}
        </p>
        <button className="mt-3 px-5 py-2 bg-white/20 rounded-lg border border-white/30 hover:bg-white/40 transition">
          {slides[index].cta}
        </button>
      </div>

      {/* --- UI/UX Enhancements --- */}

      {/* PROGRESSIVE BAR (TOP) */}
      <div className="absolute top-0 left-0 w-full h-1 bg-white/20">
        <div
          key={progressBarKey} // Key change forces a re-render and restarts the CSS animation
          className="h-full bg-white transition-none ease-linear"
          // Inlining style for animation duration
          style={{
            animation: `progress ${AUTO_SLIDE_INTERVAL}ms linear forwards`,
            width: 0,
          }}
        />
        {/*
          Note: For the progressive bar animation to work, you need to add a 
          CSS keyframe named 'progress' in your global CSS or a relevant style block.
          
          @keyframes progress {
            from { width: 0; }
            to { width: 100%; }
          }
        */}
      </div>

      {/* NAVIGATION DOTS (BOTTOM) */}
      <div className="absolute bottom-6 right-6 flex space-x-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => handleDotClick(i)}
            className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
              i === index
                ? "bg-white scale-110"
                : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
