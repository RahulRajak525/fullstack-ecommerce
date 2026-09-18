import React from "react";

/** Shimmering placeholder block. The sheen comes from the `skeleton` utility. */
export function Skeleton({ className = "" }) {
  return <div className={`skeleton rounded-lg ${className}`} />;
}

/** Mirrors one product row so the table does not jump when data lands. */
export function ProductRowSkeleton() {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-3 md:grid-cols-[3.5rem_2.5fr_1fr_1fr_auto]">
      <Skeleton className="h-14 w-14 rounded-xl" />
      <Skeleton className="h-4 w-3/5" />
      <Skeleton className="hidden h-4 w-20 md:block" />
      <Skeleton className="hidden h-4 w-14 md:block" />
      <Skeleton className="h-9 w-9 rounded-full" />
    </div>
  );
}

export function ProductListSkeleton({ rows = 6 }) {
  return (
    <div className="divide-y divide-ink-200">
      {Array.from({ length: rows }).map((_, i) => (
        <ProductRowSkeleton key={i} />
      ))}
    </div>
  );
}

/** Mirrors one order card: parcel icon, item lines, address, totals, status. */
export function OrderCardSkeleton() {
  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-5 sm:p-6">
      <div className="grid gap-5 lg:grid-cols-[auto_2fr_1fr_auto]">
        <Skeleton className="h-11 w-11 rounded-xl" />

        <div className="flex flex-col gap-2.5">
          <Skeleton className="h-3.5 w-4/5" />
          <Skeleton className="h-3.5 w-2/3" />
          <Skeleton className="mt-2 h-4 w-40" />
          <Skeleton className="h-3 w-56" />
        </div>

        <div className="flex flex-col gap-2.5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>

        <Skeleton className="h-10 w-44 rounded-full" />
      </div>
    </div>
  );
}

export function OrderListSkeleton({ rows = 3 }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: rows }).map((_, i) => (
        <OrderCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default Skeleton;
