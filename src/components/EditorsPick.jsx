"use client";

import Link from "next/link";

export default function EditorsPick({ stories }) {
  const pickedStories = stories?.slice(0, 3) || [];

  if (pickedStories.length === 0) return null;

  return (
    <section className="mb-20 bg-gradient-to-b from-[var(--foreground)]/10 to-transparent p-6 rounded-3xl">
      {/* Hero Banner with Background */}
      <div className="relative rounded-3xl overflow-hidden mb-12">
        {/* Background Image */}
        <div className="relative h-[300px] md:h-[200px]">
          <img
            src="https://i.pinimg.com/originals/98/ad/fa/98adfaae828e28e5afef8598c089eec5.gif"
            alt="Editor's Pick Background"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/40"></div>

          {/* Centered Text */}
          <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
            <h3 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Editor's Pick
            </h3>
            <p className="text-xl text-white/90">
              Three captivating stories hand-selected for you
            </p>
          </div>
        </div>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        {pickedStories.map((story, index) => (
          <Link
            key={story.id}
            href={`/stories/${story.id}`}
            className="group block"
          >
            <article className="text-center space-y-4">
              {/* Number */}
              <div className="text-6xl font-bold text-blue-500 mb-4">
                0{index + 1}
              </div>

              {/* Portrait Book Cover */}
              <div className="relative aspect-[2/3] w-full max-w-[240px] mx-auto rounded-xl overflow-hidden shadow-xl">
                <img
                  src={story.coverImage}
                  alt={story.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Text Content */}
              <div className="space-y-2 pt-4">
                <h4 className="text-xl font-bold text-[var(--foreground)] leading-tight uppercase tracking-wide">
                  {story.title}
                </h4>

                {story.description && (
                  <p className="text-[var(--foreground)]/60 text-sm leading-relaxed line-clamp-2 max-w-xs mx-auto">
                    {story.description}
                  </p>
                )}

                <div className="flex items-center justify-center gap-2 text-xs text-[var(--foreground)]/50 pt-2">
                  <span>{story.readTime} min</span>
                  <span>•</span>
                  <span>{story.author.username || `Author ${story.author.username}`}</span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
