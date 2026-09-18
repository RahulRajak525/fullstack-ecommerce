import React from "react";

/**
 * Shimmering grey block used as a loading placeholder.
 * The `skeleton` utility (index.css) supplies the moving sheen.
 */
export function Skeleton({ className = "" }) {
  return <div className={`skeleton rounded-lg ${className}`} />;
}

/** Mirrors the real ProductItem layout so nothing shifts when data lands. */
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="aspect-3/4 w-full rounded-2xl" />
      <Skeleton className="h-3.5 w-4/5" />
      <Skeleton className="h-3.5 w-1/3" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 10, className = "" }) {
  return (
    <div
      className={
        className ||
        "grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
      }
    >
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-ink-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <Skeleton className="h-20 w-16 rounded-xl" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-44" />
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-9 w-28 rounded-full" />
    </div>
  );
}

export default Skeleton;
