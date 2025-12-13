import SkeletonCard from "./SkeletonCard";

// Skeleton for a full section with multiple cards
export default function SkeletonSection({ title = "Loading..." }) {
  return (
    <section className="mb-10">
      {/* Section header skeleton */}
      <div className="flex items-center justify-between mb-4">
        <div className="h-7 bg-[var(--foreground)]/10 rounded w-48 animate-pulse"></div>
        <div className="md:hidden h-4 w-16 bg-[var(--foreground)]/10 rounded animate-pulse"></div>
      </div>

      {/* Cards container */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-4 pb-4">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
