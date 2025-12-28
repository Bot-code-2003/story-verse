"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const AUTO_SLIDE_INTERVAL = 10000; // 10 seconds

const slides = [
  {
    id: 1,
    title: "A Home for Short Fiction",
    subtitle:
      "Big ideas. Compact stories. 4,000 words max.",
      image:
        "https://cdn.pixabay.com/photo/2024/12/30/13/23/little-red-riding-hood-9300338_1280.jpg",
        cta: "Browse Stories",
        ctaHref: "/stories",
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
    ctaHref: "/login?redirect=/write",
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
    ctaHref: "/login?redirect=/write",
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
      return "object-cover"; 
  }
};


export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [progressBarKey, setProgressBarKey] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
      setProgressBarKey((prev) => prev + 1);
    }, AUTO_SLIDE_INTERVAL);

    return () => clearInterval(timer);
  }, [index]);

  const handleDotClick = (newIndex) => {
    setIndex(newIndex);
    setProgressBarKey((prev) => prev + 1);
  };

  const currentSlide = slides[index];
  const isWinnerSlide = currentSlide.id === -1;

  return (
    <section className="relative w-full h-[40vh] md:h-[60vh] rounded-2xl mb-12 overflow-hidden">
      {/* BACKGROUND IMAGES */}
      {slides.map((slide, i) => {
        const isWinner = slide.id === -1;
        const isActive = i === index;
        const isFirst = i === 0;
        
        return (
          <div
            key={slide.id}
            className={`
              absolute inset-0 w-full h-full transition-opacity duration-700
              ${isActive ? "opacity-100" : "opacity-0 duration-300"}
            `}
          >
            {isWinner ? (
              <>
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  sizes="100vw"
                  priority={isFirst}
                  className="object-cover scale-110 blur-2xl"
                />
                <div className="absolute inset-0 bg-black/40" />
              </>
            ) : (
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                sizes="100vw"
                priority={isFirst}
                className={`object-cover ${getObjectPositionClass(slide.pos)}`}
              />
            )}
          </div>
        );
      })}

      {/* GRADIENT OVERLAY */}
      {!isWinnerSlide && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      )}

      {/* CONTENT */}
      {isWinnerSlide ? (
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <div className="max-w-5xl w-full flex flex-col md:flex-row items-center gap-8">
            <div className="relative w-48 md:w-64 flex-shrink-0">
              <div className="aspect-[5/7] rounded-xl overflow-hidden shadow-2xl border-4 border-white/20">
                <Image
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  fill
                  sizes="(max-width: 768px) 192px, 256px"
                  className="object-cover"
                />
              </div>
              <div className="absolute -top-3 -right-3 w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-xl border-4 border-white">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left text-white">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-full border border-yellow-400/30 mb-4">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm md:text-base font-bold text-yellow-400">7K Sprint Dec 2025 Winner</span>
              </div>

              <h2 className="text-2xl md:text-4xl font-bold mb-3 leading-tight">
                {currentSlide.title}
              </h2>

              <p className="text-sm md:text-lg text-white/90 mb-6 leading-relaxed max-w-2xl">
                {currentSlide.subtitle}
              </p>

              {currentSlide.cta && (
                <Link href={currentSlide.ctaHref}>
                  <button
                    type="button"
                    className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold text-sm md:text-base shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
                  >
                    {currentSlide.cta}
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="absolute bottom-6 left-6 right-6 md:left-10 md:bottom-10 text-white max-w-xl transition-all duration-700">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            {currentSlide.title}
          </h2>
          <p className="text-sm md:text-base text-white/90 mb-3">
            {currentSlide.subtitle}
          </p>

          {currentSlide.cta && (
            <Link href={currentSlide.ctaHref}>
              <button
                type="button"
                className="mt-1 px-5 py-2.5 rounded-lg border border-white/40 bg-white/15 hover:bg-white/30 hover:border-white/70 text-sm md:text-base font-medium backdrop-blur-sm transition"
              >
                {currentSlide.cta}
              </button>
            </Link>
          )}
        </div>
      )}

      {/* PROGRESS BAR - GPU accelerated */}
      <div className="absolute top-0 left-0 w-full h-1 bg-white/20 overflow-hidden">
        <div
          key={progressBarKey}
          className="h-full w-full bg-white origin-left"
          style={{
            animation: `progress ${AUTO_SLIDE_INTERVAL}ms linear forwards`,
          }}
        />
      </div>

      {/* NAV DOTS - Increased size for touch accessibility (44px min) */}
      <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 flex space-x-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => handleDotClick(i)}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
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

