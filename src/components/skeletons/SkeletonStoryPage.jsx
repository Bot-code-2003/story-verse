// Skeleton loader for story page
export default function SkeletonStoryPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] animate-pulse">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero section skeleton */}
        <div className="mb-8 space-y-4">
          {/* Title */}
          <div className="h-10 bg-[var(--foreground)]/10 rounded w-3/4"></div>
          <div className="h-10 bg-[var(--foreground)]/10 rounded w-1/2"></div>
          
          {/* Author and meta */}
          <div className="flex items-center gap-4 mt-6">
            <div className="w-12 h-12 rounded-full bg-[var(--foreground)]/10"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-[var(--foreground)]/10 rounded w-32"></div>
              <div className="h-3 bg-[var(--foreground)]/10 rounded w-48"></div>
            </div>
          </div>

          {/* Genre badges */}
          <div className="flex gap-2 mt-4">
            <div className="h-6 w-20 bg-[var(--foreground)]/10 rounded-full"></div>
            <div className="h-6 w-24 bg-[var(--foreground)]/10 rounded-full"></div>
          </div>
        </div>

        {/* Content skeleton */}
        <div className="space-y-4 mt-8">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-[var(--foreground)]/10 rounded w-full"></div>
              <div className="h-4 bg-[var(--foreground)]/10 rounded w-11/12"></div>
              <div className="h-4 bg-[var(--foreground)]/10 rounded w-10/12"></div>
              {i % 3 === 0 && <div className="h-4"></div>} {/* Paragraph spacing */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
