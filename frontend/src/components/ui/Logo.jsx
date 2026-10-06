import React from "react";
import { BRAND } from "../../brand";

/**
 * Plain-weave mark: two warp and two weft threads crossing over-under-over.
 * The 1-unit gaps either side of whichever thread is on top are what make it
 * read as woven rather than as a grid. Same geometry as public/favicon.svg.
 */
export function LogoMark({ className = "h-7 w-7" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <rect width="24" height="24" rx="6" fill="#0b0b0d" />
      <g fill="#ffffff">
        <rect x="4" y="7" width="16" height="3" />
        <rect x="4" y="14" width="16" height="3" />
        <rect x="7" y="4" width="3" height="16" />
        <rect x="14" y="4" width="3" height="16" />
      </g>
      <g fill="#0b0b0d">
        {/* Warp over weft: gaps cut into the weft either side */}
        <rect x="6" y="7" width="1" height="3" />
        <rect x="10" y="7" width="1" height="3" />
        <rect x="13" y="14" width="1" height="3" />
        <rect x="17" y="14" width="1" height="3" />
        {/* Weft over warp: gaps cut into the warp above and below */}
        <rect x="14" y="6" width="3" height="1" />
        <rect x="14" y="10" width="3" height="1" />
        <rect x="7" y="13" width="3" height="1" />
        <rect x="7" y="17" width="3" height="1" />
      </g>
    </svg>
  );
}

/** Mark plus wordmark. The wordmark is live text in the display face. */
export default function Logo({ className = "" }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark />
      <span className="type-display text-[26px] leading-none tracking-tight text-ink-950">
        {BRAND.name.toLowerCase()}
      </span>
    </span>
  );
}
