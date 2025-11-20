// Reusable skeleton loader components for better perceived performance

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-gray-700/50 rounded ${className}`} />
  );
}

export function SkeletonInfluencerCard() {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
      <div className="flex items-start gap-3 mb-3">
        {/* Avatar skeleton */}
        <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />

        <div className="flex-1 min-w-0">
          {/* Name skeleton */}
          <Skeleton className="h-5 w-32 mb-2" />
          {/* Handle skeleton */}
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Tier badge skeleton */}
        <Skeleton className="w-12 h-6 rounded-full" />
      </div>

      {/* Stats row skeleton */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div>
          <Skeleton className="h-3 w-16 mb-1" />
          <Skeleton className="h-5 w-12" />
        </div>
        <div>
          <Skeleton className="h-3 w-16 mb-1" />
          <Skeleton className="h-5 w-12" />
        </div>
        <div>
          <Skeleton className="h-3 w-16 mb-1" />
          <Skeleton className="h-5 w-12" />
        </div>
      </div>

      {/* Price and button skeleton */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-700">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-9 w-24 rounded-lg" />
      </div>
    </div>
  );
}

export function SkeletonDuelCard() {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>

      {/* Creator */}
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="w-8 h-8 rounded-full" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Prediction details */}
      <div className="space-y-3 mb-4">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-5 w-1/2" />
      </div>

      {/* Action button */}
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  );
}

export function SkeletonGauntletCard() {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-6 w-20" />
      </div>

      {/* Prediction items */}
      <div className="space-y-3 mb-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-8 w-32 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Entry fee and button */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
    </div>
  );
}

export function SkeletonLeaderboardRow() {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-800/30 border border-gray-700/50 rounded-lg">
      {/* Rank */}
      <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />

      {/* Avatar */}
      <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />

      {/* User info */}
      <div className="flex-1 min-w-0">
        <Skeleton className="h-5 w-32 mb-2" />
        <Skeleton className="h-4 w-24" />
      </div>

      {/* Stats */}
      <div className="flex gap-6">
        <div>
          <Skeleton className="h-4 w-16 mb-1" />
          <Skeleton className="h-5 w-12" />
        </div>
        <div>
          <Skeleton className="h-4 w-16 mb-1" />
          <Skeleton className="h-5 w-12" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonTeamCard() {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
      {/* Team header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-700">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-8 w-16 rounded-full" />
      </div>

      {/* Team slots */}
      <div className="space-y-2 mb-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3 p-2 bg-gray-900/50 rounded-lg">
            <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
            <div className="flex-1">
              <Skeleton className="h-4 w-28 mb-1" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-6 w-12" />
          </div>
        ))}
      </div>

      {/* Total score */}
      <div className="pt-3 border-t border-gray-700">
        <Skeleton className="h-7 w-full" />
      </div>
    </div>
  );
}

interface SkeletonGridProps {
  count?: number;
  component: React.ComponentType;
  className?: string;
}

export function SkeletonGrid({ count = 6, component: Component, className = 'grid grid-cols-1 md:grid-cols-2 gap-4' }: SkeletonGridProps) {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <Component key={i} />
      ))}
    </div>
  );
}
