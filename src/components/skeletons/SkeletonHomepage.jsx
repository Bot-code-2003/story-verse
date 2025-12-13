import SkeletonSection from "./SkeletonSection";

// Skeleton for homepage carousel
function SkeletonCarousel() {
  return (
    <div className="relative w-full h-[500px] md:h-[600px] bg-[var(--foreground)]/5 rounded-2xl overflow-hidden animate-pulse mb-12">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-4 px-4">
          <div className="h-12 bg-[var(--foreground)]/10 rounded w-96 mx-auto"></div>
          <div className="h-8 bg-[var(--foreground)]/10 rounded w-64 mx-auto"></div>
          <div className="h-6 bg-[var(--foreground)]/10 rounded w-48 mx-auto"></div>
        </div>
      </div>
      {/* Carousel dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-2 h-2 rounded-full bg-[var(--foreground)]/20"></div>
        ))}
      </div>
    </div>
  );
}

// Complete homepage skeleton
export default function SkeletonHomepage() {
  return (
    <div className="min-h-screen w-full bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-8">
        {/* Carousel skeleton */}
        <SkeletonCarousel />

        {/* Trending section */}
        <SkeletonSection />

        {/* Editor's Pick skeleton */}
        <div className="mb-12">
          <div className="h-8 bg-[var(--foreground)]/10 rounded w-48 mb-6 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-[var(--foreground)]/5 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>

        {/* Quick Reads section */}
        <SkeletonSection />

        {/* Featured Author skeleton */}
        <div className="mb-12">
          <div className="h-8 bg-[var(--foreground)]/10 rounded w-64 mb-6 animate-pulse"></div>
          <div className="h-96 bg-[var(--foreground)]/5 rounded-2xl animate-pulse"></div>
        </div>

        {/* New Releases section */}
        <SkeletonSection />

        {/* Discover Genres skeleton */}
        <div className="mb-12">
          <div className="h-8 bg-[var(--foreground)]/10 rounded w-56 mb-6 animate-pulse"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-[var(--foreground)]/5 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>

        {/* Genre sections */}
        <SkeletonSection />
        <SkeletonSection />
        <SkeletonSection />
        <SkeletonSection />
      </div>
    </div>
  );
}
