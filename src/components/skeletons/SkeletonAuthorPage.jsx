// Skeleton loader for author page
export default function SkeletonAuthorPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] animate-pulse">
      {/* Hero section */}
      <div className="relative py-14 px-6 bg-gradient-to-b from-[var(--foreground)]/5 to-transparent">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-6">
            {/* Avatar skeleton */}
            <div className="inline-block w-32 h-32 rounded-full bg-[var(--foreground)]/10"></div>
            
            {/* Name skeleton */}
            <div className="space-y-3">
              <div className="h-12 bg-[var(--foreground)]/10 rounded w-64 mx-auto"></div>
              <div className="h-4 bg-[var(--foreground)]/10 rounded w-32 mx-auto"></div>
            </div>

            {/* Bio skeleton */}
            <div className="max-w-2xl mx-auto space-y-2 pt-4">
              <div className="h-4 bg-[var(--foreground)]/10 rounded w-full"></div>
              <div className="h-4 bg-[var(--foreground)]/10 rounded w-3/4 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Stories section */}
      <div className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Section title */}
          <div className="mb-8 space-y-2">
            <div className="h-8 bg-[var(--foreground)]/10 rounded w-48"></div>
            <div className="h-4 bg-[var(--foreground)]/10 rounded w-64"></div>
          </div>

          {/* Story grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="h-64 bg-[var(--foreground)]/10 rounded-lg"></div>
                <div className="h-4 bg-[var(--foreground)]/10 rounded w-3/4"></div>
                <div className="h-3 bg-[var(--foreground)]/10 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
