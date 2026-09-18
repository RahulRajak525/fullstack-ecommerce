import React from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiTruck } from "react-icons/fi";
import { assets } from "../assets/assets";
import CountUp from "./ui/CountUp";
import RotatingWord from "./ui/RotatingWord";

const ease = [0.22, 1, 0.36, 1];

// The headline animates a word at a time, each sliding up behind a mask.
const headline = ["Latest", "Arrivals"];

const stats = [
  { value: 2000, suffix: "+", label: "Happy customers" },
  { value: 150, suffix: "+", label: "Styles" },
  { value: 4.8, decimals: 1, label: "Average rating" },
];

const Hero = () => {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-white shadow-soft">
      {/* Soft colour wash behind the copy, drifting slowly */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 animate-blob rounded-full bg-accent-100 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 animate-float-slow rounded-full bg-ink-200/60 blur-3xl" />

      <div className="relative grid items-center gap-8 sm:grid-cols-2">
        {/* Copy */}
        <div className="order-2 px-7 pb-10 pt-2 sm:order-1 sm:px-10 sm:py-16 lg:px-14">
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
              Autumn drop is live
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease }}
            className="mt-6 flex items-center gap-3"
          >
            <span className="h-px w-9 bg-ink-900" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-600">
              Our bestsellers
            </span>
          </motion.div>

          <h1 className="prata-regular mt-5 text-4xl leading-[1.12] text-ink-950 sm:text-5xl lg:text-6xl">
            {headline.map((word, i) => (
              <span key={word} className="block overflow-hidden pb-1">
                <motion.span
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, delay: 0.15 + i * 0.12, ease }}
                  className="block"
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>

          {/* Fixed label, rotating category - keeps something moving up top */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-4 flex items-baseline gap-2 text-sm text-ink-500"
          >
            <span className="text-ink-400">New in:</span>
            <RotatingWord
              words={[
                "Everyday knits",
                "Winter layers",
                "Weekend tees",
                "Tailored trousers",
              ]}
              className="font-semibold text-ink-900"
            />
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease }}
            className="mt-5 max-w-sm text-sm leading-relaxed text-ink-500"
          >
            Considered pieces in soft, durable fabrics &mdash; designed to be
            worn long after the season ends.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link
              to="/collection"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-ink-900 px-7 py-3.5 text-sm font-medium text-white transition-transform duration-300 hover:scale-[1.03]"
            >
              {/* Sheen crossing the button on hover */}
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              Shop now
              <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/about"
              className="rounded-full border border-ink-300 px-7 py-3.5 text-sm font-medium text-ink-800 transition-colors hover:border-ink-900 hover:bg-ink-900 hover:text-white"
            >
              Our story
            </Link>
          </motion.div>

          {/* Small credibility row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-10 flex items-center gap-7 border-t border-ink-200 pt-6"
          >
            {stats.map(({ value, decimals, suffix, label }) => (
              <div key={label}>
                <p className="text-lg font-semibold text-ink-900">
                  <CountUp value={value} decimals={decimals} suffix={suffix} />
                </p>
                <p className="text-[11px] uppercase tracking-wider text-ink-400">
                  {label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease }}
          className="group relative order-1 h-full overflow-hidden rounded-3xl sm:order-2"
        >
          <img
            src={assets.hero_img}
            alt="Model wearing the latest collection"
            fetchPriority="high"
            className="h-full max-h-140 w-full rounded-3xl object-cover object-top transition-transform duration-1200 ease-out group-hover:scale-105"
          />

          {/* Floating delivery chip over the photo */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75, ease }}
            className="absolute bottom-5 left-5 animate-float rounded-2xl bg-white/95 px-4 py-3 shadow-lift backdrop-blur"
          >
            <p className="flex items-center gap-2 text-xs font-semibold text-ink-900">
              <FiTruck className="text-base" /> Free delivery over $80
            </p>
            <p className="mt-0.5 text-[11px] text-ink-500">
              Dispatched within 24 hours
            </p>
          </motion.div>

          {/* Discount seal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: -8 }}
            transition={{ duration: 0.7, delay: 0.85, ease }}
            className="absolute right-5 top-5 flex h-20 w-20 flex-col items-center justify-center rounded-full bg-accent-500 text-center text-white shadow-lift"
          >
            <span className="text-lg font-bold leading-none">20%</span>
            <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.14em]">
              first order
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
