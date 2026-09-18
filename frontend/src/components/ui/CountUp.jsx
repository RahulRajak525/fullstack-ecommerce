import React, { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

/**
 * Counts from zero up to `value` the first time it scrolls into view. A static
 * number reads as decoration; a moving one pulls the eye, so the home page
 * stats use this instead of plain text.
 */
export default function CountUp({
  value,
  decimals = 0,
  suffix = "",
  prefix = "",
  duration = 1500,
  className = "",
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });

  // Honour the OS setting the same way index.css does for CSS animations:
  // reduced motion skips the tween and renders the final number.
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!inView || reduced) return;

    let frame;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min((now - start) / duration, 1);
      // Cubic ease-out, so the number decelerates into its final value.
      setProgress(1 - Math.pow(1 - t, 3));
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduced, duration]);

  const shown = reduced ? value : value * progress;
  const text =
    decimals > 0
      ? shown.toFixed(decimals)
      : Math.round(shown).toLocaleString("en-US");

  return (
    <span ref={ref} className={className}>
      {prefix}
      {text}
      {suffix}
    </span>
  );
}
