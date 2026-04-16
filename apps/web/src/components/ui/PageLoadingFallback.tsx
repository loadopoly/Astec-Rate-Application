/**
 * Page Loading Fallback
 *
 * Skeleton placeholder shown inside the dashboard layout while a lazy-loaded
 * route chunk is being fetched.  Matches the common page structure (heading +
 * KPI cards + table) so the transition feels seamless.
 */

import { Loader2 } from 'lucide-react'

export function PageLoadingFallback() {
  return (
    <div className="space-y-8 animate-fade-in" role="status" aria-label="Loading page">
      {/* Page heading skeleton */}
      <div className="space-y-2">
        <div className="h-7 w-48 rounded-md bg-secondary animate-pulse" />
        <div className="h-4 w-72 rounded-md bg-secondary/60 animate-pulse" />
      </div>

      {/* KPI card skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-card rounded-xl border border-border p-6 space-y-3"
          >
            <div className="h-10 w-10 rounded-lg bg-secondary animate-pulse" />
            <div className="h-6 w-20 rounded-md bg-secondary animate-pulse" />
            <div className="h-4 w-28 rounded-md bg-secondary/60 animate-pulse" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="bg-card rounded-xl border border-border p-6 space-y-4">
        <div className="h-5 w-40 rounded-md bg-secondary animate-pulse" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="h-4 w-20 rounded bg-secondary/50 animate-pulse" />
            <div className="h-4 flex-1 rounded bg-secondary/40 animate-pulse" />
            <div className="h-4 w-16 rounded bg-secondary/50 animate-pulse" />
            <div className="h-4 w-16 rounded bg-secondary/40 animate-pulse" />
          </div>
        ))}
      </div>

      {/* Centered spinner for extra clarity */}
      <div className="flex justify-center pt-2">
        <Loader2 className="h-6 w-6 text-primary animate-spin" />
      </div>
    </div>
  )
}
