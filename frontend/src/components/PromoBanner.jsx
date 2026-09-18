import React, { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiTag } from "react-icons/fi";

/** Midnight tonight, in the visitor's own timezone. */
function endOfToday() {
  const d = new Date();
  d.setHours(24, 0, 0, 0);
  return d.getTime();
}

function useCountdown(target) {
  const [left, setLeft] = useState(() => Math.max(target - Date.now(), 0));

  useEffect(() => {
    const id = setInterval(
      () => setLeft(Math.max(target - Date.now(), 0)),
      1000,
    );
    return () => clearInterval(id);
  }, [target]);

  const total = Math.floor(left / 1000);
  return {
    hours: String(Math.floor(total / 3600)).padStart(2, "0"),
    minutes: String(Math.floor((total % 3600) / 60)).padStart(2, "0"),
    seconds: String(total % 60).padStart(2, "0"),
  };
}

const PromoBanner = () => {
  // Recomputed only on mount - the banner never needs to roll over to the
  // next day mid-session.
  const target = useMemo(() => endOfToday(), []);
  const { hours, minutes, seconds } = useCountdown(target);
  const reduced = useReducedMotion();

  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-3xl bg-ink-900 px-6 py-12 sm:px-12 sm:py-14"
    >
      {/* Drifting colour wash */}
      <div className="pointer-events-none absolute -left-24 top-1/2 h-72 w-72 -translate-y-1/2 animate-blob rounded-full bg-accent-500/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 animate-float-slow rounded-full bg-white/10 blur-3xl" />

      {/* Light sweeping across the panel, like a shop window */}
      {!reduced && (
        <motion.div
          aria-hidden="true"
          initial={{ x: "-120%" }}
          animate={{ x: "160%" }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            repeatDelay: 2.5,
            ease: "easeInOut",
          }}
          className="pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12 bg-linear-to-r from-transparent via-white/10 to-transparent"
        />
      )}

      <div className="relative flex flex-col items-center gap-8 text-center lg:flex-row lg:justify-between lg:text-left">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-accent-500/40 bg-accent-500/15 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-300">
            <FiTag /> Midseason event
          </span>

          <h2 className="prata-regular mt-5 text-3xl leading-tight text-white sm:text-4xl">
            Up to 40% off the winter rail
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/60">
            Coats, knits and heavyweight tees, reduced while stock lasts. No
            code needed &mdash; prices drop in your cart.
          </p>
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-2.5">
            {[
              [hours, "Hrs"],
              [minutes, "Min"],
              [seconds, "Sec"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="w-18 rounded-2xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur"
              >
                {/* Keyed so each tick re-mounts and replays the pop */}
                <p
                  key={value}
                  className="animate-pop text-2xl font-semibold tabular-nums text-white"
                >
                  {value}
                </p>
                <p className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-white/45">
                  {label}
                </p>
              </div>
            ))}
          </div>

          <Link
            to="/collection"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-ink-950 transition-transform duration-300 hover:scale-[1.03]"
          >
            Shop the event
            <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.section>
  );
};

export default PromoBanner;
