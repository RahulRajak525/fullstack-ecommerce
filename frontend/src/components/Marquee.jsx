import React from "react";

const items = [
  "Free shipping over $80",
  "7-day easy returns",
  "New arrivals every Friday",
  "Secure checkout",
  "Loved by 2,000+ shoppers",
  "Cash on delivery available",
];

/**
 * Edge-to-edge scrolling strip under the hero. The list is rendered twice so
 * the -50% keyframe in index.css loops without a visible seam; hovering pauses
 * it so the text stays readable.
 */
const Marquee = () => {
  return (
    <div
      aria-label="Store highlights"
      className="group relative overflow-hidden rounded-full border border-ink-200 bg-white py-3 shadow-soft"
    >
      {/* Fade the ends so items appear to slide out of the surface */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-white to-transparent" />

      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
            {items.map((item) => (
              <span
                key={item}
                className="flex items-center gap-4 px-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-500 sm:text-xs"
              >
                {item}
                <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
