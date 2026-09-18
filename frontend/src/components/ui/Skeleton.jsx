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

/** Mirrors one cart row, image and stepper included, so nothing jumps. */
export function CartRowSkeleton() {
  return (
    <div className="flex gap-4 rounded-2xl border border-ink-200 bg-white p-4 sm:items-center">
      <Skeleton className="h-28 w-24 shrink-0 rounded-xl" />

      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2.5">
          <Skeleton className="h-4 w-48" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-3.5 w-12" />
            <Skeleton className="h-5 w-16 rounded-md" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-25 rounded-full" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/** Full cart page placeholder: rows on the left, order summary on the right. */
export function CartSkeleton({ rows = 3 }) {
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
      <div className="flex flex-col gap-3">
        {Array.from({ length: rows }).map((_, i) => (
          <CartRowSkeleton key={i} />
        ))}
      </div>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-2xl border border-ink-200 bg-white p-6">
          <Skeleton className="h-5 w-36" />

          <div className="mt-5 flex flex-col gap-4">
            <div className="flex justify-between">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-3.5 w-14" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-3.5 w-14" />
            </div>
            <div className="mt-2 flex justify-between border-t border-ink-200 pt-4">
              <Skeleton className="h-4.5 w-16" />
              <Skeleton className="h-4.5 w-20" />
            </div>
          </div>

          <Skeleton className="mt-6 h-13 w-full rounded-full" />
          <Skeleton className="mx-auto mt-4 h-3 w-32" />
        </div>
      </aside>
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
