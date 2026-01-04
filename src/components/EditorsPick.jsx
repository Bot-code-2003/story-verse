"use client";

import Link from "next/link";
import Image from "next/image";

export default function EditorsPick({ stories }) {
  // 1. Updated slice to 5 to accommodate the larger screen requirement
  const pickedStories = stories?.slice(0, 5) || [];

  if (pickedStories.length === 0) return null;

  return (
    <section className="mb-20 bg-gradient-to-b from-[var(--foreground)]/10 to-transparent p-3 sm:p-6 rounded-3xl">
      {/* Hero Banner with Background */}
      <div className="relative rounded-3xl overflow-hidden mb-12">
        <div className="relative h-[150px] md:h-[200px]">
          <Image
            src="https://i.pinimg.com/originals/98/ad/fa/98adfaae828e28e5afef8598c089eec5.gif"
            alt="Editor's Pick Background"
            fill
            sizes="100vw"
            className="object-cover object-center"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/40"></div>

          <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
            <h3 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
              Editor's Pick
            </h3>
            <p className="text-md sm:text-xl text-white/90">
              captivating stories hand-selected for you
            </p>
          </div>
        </div>
      </div>

      {/* 2. Updated Grid: grid-cols-2 for tiny, sm:grid-cols-4 for mobile/tablet, lg:grid-cols-5 for laptop */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 px-4">
        {pickedStories.map((story, index) => (
          <Link
            key={story.id}
            href={`/stories/${story.id}`}
            className="group block"
          >
            <article className="text-center space-y-4">
              {/* <div className="text-3xl sm:text-5xl font-bold text-blue-500 mb-4">
                0{index + 1}
              </div> */}

              <div className="relative aspect-[2/3] w-full max-w-[200px] mx-auto rounded-xl overflow-hidden shadow-xl">
                <div className="absolute top-3 right-3 z-10 bg-black/60 backdrop-blur-sm text-white text-[10px] sm:text-xs font-medium px-2 py-1 rounded-lg pointer-events-none">
                  {story.readTime} min
                </div>

                <Image
                  src={story.coverImage}
                  alt={story.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="space-y-2 pt-4">
                <h4 className="text-sm sm:text-base font-bold text-[var(--foreground)] leading-tight uppercase tracking-wide line-clamp-2">
                  {story.title}
                </h4>

                <div className="text-[10px] sm:text-xs text-[var(--foreground)]/60 pt-2">
                  <span className="truncate block">By {story.author}</span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}