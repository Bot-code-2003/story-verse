// Skeleton loading component for StoryCard
export default function SkeletonCard() {
  return (
    <div className="min-w-[160px] md:min-w-[200px] lg:min-w-[220px] max-w-[180px] md:max-w-[220px] animate-pulse">
      {/* Image skeleton */}
      <div className="relative h-[200px] md:h-[280px] lg:h-[350px] rounded-lg overflow-hidden bg-[var(--foreground)]/10">
        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[var(--foreground)]/20 to-transparent flex items-end p-2 md:p-3">
          <div className="h-3 w-16 bg-[var(--foreground)]/20 rounded"></div>
        </div>
      </div>

      {/* Text skeleton */}
      <div className="pt-2 md:pt-3 space-y-2">
        {/* Title */}
        <div className="h-4 bg-[var(--foreground)]/10 rounded w-3/4"></div>
        <div className="h-4 bg-[var(--foreground)]/10 rounded w-1/2"></div>
        
        {/* Author */}
        <div className="h-3 bg-[var(--foreground)]/10 rounded w-2/3"></div>
        
        {/* Genre */}
        <div className="h-3 bg-[var(--foreground)]/10 rounded w-1/2"></div>
      </div>
    </div>
  );
}
