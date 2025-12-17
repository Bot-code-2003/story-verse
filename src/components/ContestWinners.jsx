"use client";

import Link from "next/link";
import { Trophy, Award, Medal, Heart, Clock, ChevronRight } from "lucide-react";

/**
 * Contest Winners Component - Podium Style
 * Displays top 3 winners with a premium podium layout
 */
export default function ContestWinners({ winners = [] }) {
  if (!winners || winners.length === 0) return null;

  // Ensure we have exactly 3 winners (pad with nulls if needed)
  const [first, second, third] = winners;

  return (
    <section className="mb-16">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] mb-2">
            🏆 7K Sprint Dec 2025 Winners
          </h2>
          <p className="text-sm text-[var(--foreground)]/60">
            Celebrating our award-winning authors
          </p>
        </div>
        <Link
          href="/contests"
          className="hidden md:flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition"
        >
          View Contest
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Podium Layout */}
      <div className="relative">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 dark:from-yellow-950/20 dark:via-orange-950/20 dark:to-pink-950/20 rounded-3xl -z-10" />
        
        <div className="p-6 md:p-10">
          {/* Desktop: Podium Layout */}
          <div className="hidden md:grid md:grid-cols-3 gap-6 items-end">
            {/* 2nd Place - Left */}
            {second && (
              <WinnerCard 
                story={second} 
                rank={2} 
                position="second"
              />
            )}

            {/* 1st Place - Center (Tallest) */}
            {first && (
              <WinnerCard 
                story={first} 
                rank={1} 
                position="first"
              />
            )}

            {/* 3rd Place - Right */}
            {third && (
              <WinnerCard 
                story={third} 
                rank={3} 
                position="third"
              />
            )}
          </div>

          {/* Mobile: Stacked Layout */}
          <div className="md:hidden space-y-4">
            {first && <WinnerCard story={first} rank={1} position="first" mobile />}
            {second && <WinnerCard story={second} rank={2} position="second" mobile />}
            {third && <WinnerCard story={third} rank={3} position="third" mobile />}
          </div>

          {/* View All Link - Mobile */}
          <Link
            href="/contests"
            className="md:hidden flex items-center justify-center gap-2 mt-6 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition"
          >
            View All Contest Entries
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/**
 * Individual Winner Card Component
 */
function WinnerCard({ story, rank, position, mobile = false }) {
  const getRankConfig = (rank) => {
    switch (rank) {
      case 1:
        return {
          icon: Trophy,
          color: "from-yellow-400 to-yellow-600",
          textColor: "text-yellow-600 dark:text-yellow-400",
          bgColor: "bg-yellow-500/10",
          borderColor: "border-yellow-500/30",
          label: "1st Place",
          size: mobile ? "h-72" : "h-96",
        };
      case 2:
        return {
          icon: Award,
          color: "from-gray-300 to-gray-500",
          textColor: "text-gray-600 dark:text-gray-400",
          bgColor: "bg-gray-500/10",
          borderColor: "border-gray-500/30",
          label: "2nd Place",
          size: mobile ? "h-64" : "h-80",
        };
      case 3:
        return {
          icon: Medal,
          color: "from-amber-600 to-amber-800",
          textColor: "text-amber-700 dark:text-amber-500",
          bgColor: "bg-amber-600/10",
          borderColor: "border-amber-600/30",
          label: "3rd Place",
          size: mobile ? "h-64" : "h-80",
        };
      default:
        return {
          icon: Trophy,
          color: "from-gray-400 to-gray-600",
          textColor: "text-gray-600",
          bgColor: "bg-gray-500/10",
          borderColor: "border-gray-500/30",
          label: `${rank}th Place`,
          size: "h-72",
        };
    }
  };

  const config = getRankConfig(rank);
  const Icon = config.icon;

  return (
    <Link
      href={`/stories/${story.id}`}
      className={`group relative bg-[var(--background)] rounded-2xl border-2 ${config.borderColor} overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 ${config.size}`}
    >
      {/* Rank Badge */}
      <div className="absolute top-4 left-4 z-20">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${config.color} shadow-lg`}>
          <Icon className="w-4 h-4 text-white" />
          <span className="text-xs font-bold text-white">{config.label}</span>
        </div>
      </div>

      {/* Cover Image */}
      <div className="relative h-2/3 overflow-hidden">
        {story.coverImage ? (
          <img
            src={story.coverImage}
            alt={story.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${config.color} flex items-center justify-center`}>
            <Icon className="w-20 h-20 text-white/30" />
          </div>
        )}
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Story Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <h3 className="font-bold text-lg line-clamp-2 mb-2 group-hover:text-yellow-300 transition">
          {story.title}
        </h3>
        
        {story.description && (
          <p className="text-sm text-white/80 line-clamp-2 mb-3">
            {story.description}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex items-center gap-3 text-xs text-white/70">
          {story.author && (
            <span className="font-medium">
              by {typeof story.author === 'object' ? story.author.name : story.author}
            </span>
          )}
          {story.readTime && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{story.readTime} min</span>
            </div>
          )}
          {story.likesCount > 0 && (
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              <span>{story.likesCount}</span>
            </div>
          )}
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className={`absolute inset-0 bg-gradient-to-t ${config.color} opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none`} />
    </Link>
  );
}
