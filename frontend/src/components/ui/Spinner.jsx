import React from "react";

/** Inline spinner. `light` flips it for use on dark buttons. */
export default function Spinner({ className = "h-5 w-5", light = false }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${
        light ? "text-white" : "text-ink-900"
      } ${className}`}
    />
  );
}

/** Full-page loader for route-level waits. */
export function PageLoader({ label = "Loading" }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <span className="relative flex h-12 w-12">
        <span className="absolute inset-0 animate-ping rounded-full bg-ink-900/10" />
        <span className="h-12 w-12 animate-spin rounded-full border-2 border-ink-200 border-t-ink-900" />
      </span>
      <p className="text-sm tracking-wide text-ink-500">{label}</p>
    </div>
  );
}
