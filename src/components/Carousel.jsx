"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const AUTO_SLIDE_INTERVAL = 5000; // 5 seconds

const slides = [
  {
    id: 1,
    title: "A Home for Short Fiction",
    subtitle:
      "Big ideas. Compact stories. 7,000 words max.",
      image:
        "https://cdn.pixabay.com/photo/2024/12/30/13/23/little-red-riding-hood-9300338_1280.jpg",
        cta: "Browse Stories",
        ctaHref: "/stories", // or your main discover route
        pos: "center",
      },
      {
        id: 2,
        title: "Built for Readers and Writers",
        subtitle:
        "Dozens of stories. More voices joining every week.",
        image:
          "https://cdn.pixabay.com/photo/2023/03/17/14/26/bear-7858736_1280.jpg",
    cta: "",
    ctaHref: "/login?redirect=/write", // redirect to /login?redirect=/write if not logged in
    pos: "center",
  },
  {
    id: 3,
    title: "Have a Story to Tell?",
    subtitle:
      "Write, publish, and share your stories with readers worldwide.",
    image:
      "https://cdn.pixabay.com/photo/2023/10/09/16/54/childrens-book-8304585_1280.jpg",
    cta: "Start Writing",
    ctaHref: "/login?redirect=/write", // redirect to /login?redirect=/write if not logged in
    pos: "bottom",
  },
  {
    id: 4,
    title: "Build Your Personal Library",
    subtitle:
      "Like and save stories to read anytime, anywhere.",
    image:
      "https://cdn.pixabay.com/photo/2025/05/24/09/47/fairy-tale-9619388_1280.jpg",
    cta: "Sign In to Save",
    ctaHref: "/login",
    pos: "bottom",
  },
];


const getObjectPositionClass = (pos) => {
  switch (pos) {
    case "top":
      return "object-top";
    case "bottom":
      return "object-bottom";
    case "left":
      return "object-left";
    case "right":
      return "object-right";
    case "center":
      return "object-center";
    default:
      // This is the default when pos is "" or anything else
      return "object-cover"; 
  }
};


export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [progressBarKey, setProgressBarKey] = useState(0); // restart CSS anim

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
      setProgressBarKey((prev) => prev + 1);
    }, AUTO_SLIDE_INTERVAL);

    return () => clearInterval(timer);
  }, []);

  const handleDotClick = (newIndex) => {
    setIndex(newIndex);
    setProgressBarKey((prev) => prev + 1);
  };

  const currentSlide = slides[index];

  return (
    <section className="relative w-full h-[300px] md:h-[500px] rounded-2xl mb-12 overflow-hidden">
      {/* BACKGROUND IMAGES */}
      {slides.map((slide, i) => (
        <img
          key={slide.id}
          src={slide.image}
          alt={slide.title}
          className={`
            absolute inset-0 w-full h-full object-cover transition-opacity duration-700 
            ${getObjectPositionClass(slide.pos)} // <-- Use the mapping function here
            ${i === index ? "opacity-100" : "opacity-0 duration-300"}
          `}      
        />
      ))}

      {/* GRADIENT OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* CONTENT */}
      <div className="absolute bottom-6 left-6 right-6 md:left-10 md:bottom-10 text-white max-w-xl transition-all duration-700">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">
          {currentSlide.title}
        </h2>
        <p className="text-sm md:text-base text-white/80 mb-3">
          {currentSlide.subtitle}
        </p>

        {/* CTA now actually navigates */}
        {currentSlide.cta && (
          <Link href={currentSlide.ctaHref}>
            <button
              type="button"
              className="mt-1 px-5 py-2 rounded-lg border border-white/40 bg-white/15 hover:bg-white/30 hover:border-white/70 text-sm md:text-base font-medium backdrop-blur-sm transition"
            >
              {currentSlide.cta}
            </button>
          </Link>
        )}
      </div>

      {/* PROGRESS BAR (TOP) */}
      <div className="absolute top-0 left-0 w-full h-1 bg-white/20 overflow-hidden">
        <div
          key={progressBarKey}
          className="h-full bg-white"
          style={{
            animation: `progress ${AUTO_SLIDE_INTERVAL}ms linear forwards`,
            width: 0,
          }}
        />
        {/* 
          Make sure this keyframe exists in your globals:

          @keyframes progress {
            from { width: 0; }
            to { width: 100%; }
          }
        */}
      </div>

      {/* NAV DOTS (BOTTOM RIGHT) */}
      <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 flex space-x-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => handleDotClick(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i === index
                ? "bg-white scale-110"
                : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${i + 1}`}
            type="button"
          />
        ))}
      </div>
    </section>
  );
}
