import React from "react";
import { motion } from "motion/react";
import { Link, useLocation } from "react-router-dom";
import { FiArrowRight, FiSearch } from "react-icons/fi";
import { staggerChild, staggerParent } from "../components/ui/motionVariants";

const ease = [0.22, 1, 0.36, 1];

// Somewhere useful to go, rather than a dead end with a single "home" link.
const suggestions = [
  { label: "Women", to: "/collection?category=Women" },
  { label: "Men", to: "/collection?category=Men" },
  { label: "Kids", to: "/collection?category=Kids" },
  { label: "Everything", to: "/collection" },
];

function NotFound() {
  const { pathname } = useLocation();

  return (
    <section className="relative overflow-hidden rounded-3xl bg-white px-7 py-16 shadow-soft sm:px-10 sm:py-24">
      {/* Same drifting wash as the hero, so the page still feels like the shop */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 animate-blob rounded-full bg-accent-100 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 right-0 h-72 w-72 animate-float-slow rounded-full bg-ink-200/60 blur-3xl" />

      <motion.div
        variants={staggerParent}
        initial="hidden"
        animate="show"
        className="relative mx-auto max-w-lg text-center"
      >
        <motion.p
          variants={staggerChild}
          className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-400"
        >
          Error 404
        </motion.p>

        {/* The numerals animate in one at a time */}
        <div className="mt-4 flex items-center justify-center gap-2 sm:gap-4">
          {["4", "0", "4"].map((digit, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 28, rotate: i === 1 ? -8 : 0 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.1, ease }}
              className="prata-regular text-6xl leading-none text-ink-950 sm:text-8xl"
            >
              {digit}
            </motion.span>
          ))}
        </div>

        <motion.h1
          variants={staggerChild}
          className="prata-regular mt-8 text-2xl text-ink-950 sm:text-3xl"
        >
          This page has sold out.
        </motion.h1>

        <motion.p
          variants={staggerChild}
          className="mt-4 text-sm leading-relaxed text-ink-500"
        >
          We could not find{" "}
          <span className="break-all font-medium text-ink-700">{pathname}</span>.
          It may have been moved, or the link might be out of date.
        </motion.p>

        <motion.div
          variants={staggerChild}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            to="/collection"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-ink-900 px-7 py-3.5 text-sm font-medium text-white transition-transform duration-300 hover:scale-[1.03]"
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            Browse the collection
            <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          <Link
            to="/"
            className="rounded-full border border-ink-300 px-7 py-3.5 text-sm font-medium text-ink-800 transition-colors hover:border-ink-900 hover:bg-ink-900 hover:text-white"
          >
            Back home
          </Link>
        </motion.div>

        <motion.div
          variants={staggerChild}
          className="mt-10 border-t border-ink-200 pt-6"
        >
          <p className="flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-400">
            <FiSearch /> Try one of these
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {suggestions.map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className="rounded-full border border-ink-200 bg-white px-4 py-2 text-xs font-medium text-ink-600 transition-colors hover:border-ink-900 hover:text-ink-900"
              >
                {label}
              </Link>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default NotFound;
