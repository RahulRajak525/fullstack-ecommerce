import React from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { assets } from "../assets/assets";

const ease = [0.22, 1, 0.36, 1];

const Hero = () => {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-white shadow-soft">
      {/* Soft colour wash behind the copy */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-accent-100 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-ink-200/60 blur-3xl" />

      <div className="relative grid items-center gap-8 sm:grid-cols-2">
        {/* Copy */}
        <div className="order-2 px-7 pb-10 pt-2 sm:order-1 sm:px-10 sm:py-16 lg:px-14">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease }}
            className="flex items-center gap-3"
          >
            <span className="h-px w-9 bg-ink-900" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-600">
              Our bestsellers
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
            className="prata-regular mt-5 text-4xl leading-[1.12] text-ink-950 sm:text-5xl lg:text-6xl"
          >
            Latest
            <br />
            Arrivals
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22, ease }}
            className="mt-5 max-w-sm text-sm leading-relaxed text-ink-500"
          >
            Considered pieces in soft, durable fabrics &mdash; designed to be
            worn long after the season ends.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32, ease }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link
              to="/collection"
              className="group inline-flex items-center gap-2 rounded-full bg-ink-900 px-7 py-3.5 text-sm font-medium text-white transition-colors hover:bg-ink-700"
            >
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
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 flex items-center gap-7 border-t border-ink-200 pt-6"
          >
            {[
              ["2k+", "Happy customers"],
              ["150+", "Styles"],
              ["4.8", "Average rating"],
            ].map(([value, label]) => (
              <div key={label}>
                <p className="text-lg font-semibold text-ink-900">{value}</p>
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
          className="order-1 h-full sm:order-2"
        >
          <img
            src={assets.hero_img}
            alt="Model wearing the latest collection"
            fetchPriority="high"
            className="h-full max-h-[560px] w-full rounded-3xl object-cover object-top"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
