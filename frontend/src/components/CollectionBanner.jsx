import React from "react";
import { motion } from "motion/react";
import { FiClock, FiRotateCcw, FiTruck } from "react-icons/fi";
import CountUp from "./ui/CountUp";

const ease = [0.22, 1, 0.36, 1];

const perks = [
  { icon: FiTruck, title: "Free over $80", note: "Flat $10 below that" },
  { icon: FiClock, title: "Dispatch in 24h", note: "On stocked items" },
  { icon: FiRotateCcw, title: "7-day returns", note: "Swaps are on us" },
];

/**
 * Header strip for the collection page. `total` is the unfiltered catalogue
 * size, so the number stays put while filters are toggled.
 */
const CollectionBanner = ({ total = 0, loading = false }) => {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-white px-7 py-10 shadow-soft sm:px-10 sm:py-12">
      {/* Drifting colour wash */}
      <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 animate-blob rounded-full bg-accent-100 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -left-16 h-64 w-64 animate-float-slow rounded-full bg-ink-200/60 blur-3xl" />

      <div className="relative grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="inline-flex items-center gap-2.5 rounded-full border border-ink-200 bg-ink-50 px-3.5 py-1.5"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-accent-500" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-500" />
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-600">
              {loading ? "Loading the rail" : "New pieces added weekly"}
            </span>
          </motion.div>

          <h1 className="prata-regular mt-5 text-4xl leading-[1.12] text-ink-950 sm:text-5xl">
            <span className="block overflow-hidden pb-1">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease }}
                className="block"
              >
                The whole rail.
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.26, ease }}
            className="mt-4 max-w-md text-sm leading-relaxed text-ink-500"
          >
            {loading ? (
              "Pulling in the catalogue."
            ) : (
              <>
                <span className="font-semibold text-ink-900">
                  <CountUp value={total} />
                </span>{" "}
                pieces in stock, every one cut in a short run. Filter by who it
                is for, or by what it actually is.
              </>
            )}
          </motion.p>
        </div>

        {/* Perks, staggered in from the right */}
        <div className="flex flex-col gap-3">
          {perks.map(({ icon: Icon, title, note }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease }}
              className="group flex items-center gap-3.5 rounded-2xl border border-ink-200 bg-white/70 px-4 py-3 backdrop-blur transition-colors hover:border-ink-300"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ink-100 text-ink-800 transition-colors duration-300 group-hover:bg-ink-900 group-hover:text-white">
                <Icon className="text-base" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-ink-900">
                  {title}
                </span>
                <span className="block text-[11px] uppercase tracking-wider text-ink-400">
                  {note}
                </span>
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollectionBanner;
