import React from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiMapPin } from "react-icons/fi";
import CountUp from "./ui/CountUp";
import { assets } from "../assets/assets";

const ease = [0.22, 1, 0.36, 1];

// Masked, line-by-line reveal, same treatment as the storefront hero.
const headline = ["Clothes made", "to be kept."];

const stats = [
  { value: 12, suffix: " yrs", label: "In the trade" },
  { value: 38, suffix: "", label: "Partner mills" },
  { value: 2000, suffix: "+", label: "Customers served" },
];

const AboutHero = () => {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-white px-7 py-12 shadow-soft sm:px-10 sm:py-16 lg:px-14">
      {/* Drifting colour wash */}
      <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 animate-blob rounded-full bg-accent-100 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 animate-float-slow rounded-full bg-ink-200/60 blur-3xl" />

      <div className="relative grid items-center gap-12 lg:grid-cols-2">
        <div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="flex flex-wrap items-center gap-2"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-ink-50 px-3.5 py-1.5">
              <FiMapPin className="text-ink-500" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-600">
                A studio of nine, in Washington
              </span>
            </span>

            {/* The page opens with a brand narrative that is sample content,
                so it says so here rather than only in the footer. */}
            <span className="inline-flex items-center gap-2 rounded-full border border-accent-300 bg-accent-50 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-700">
              Sample brand story
            </span>
          </motion.div>

          <h1 className="prata-regular mt-6 text-4xl leading-[1.12] text-ink-950 sm:text-5xl">
            {headline.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-1">
                <motion.span
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 + i * 0.12, ease }}
                  className="block"
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32, ease }}
            className="mt-6 max-w-lg text-sm leading-relaxed text-ink-500"
          >
            We started in a single rented room with two sewing machines and a
            stubborn opinion: that most clothes are designed to be replaced. A
            decade later the opinion has not changed, only the number of people
            who share it.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.42, ease }}
            className="mt-8 flex flex-wrap items-center gap-3"
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
              to="/contact"
              className="rounded-full border border-ink-300 px-7 py-3.5 text-sm font-medium text-ink-800 transition-colors hover:border-ink-900 hover:bg-ink-900 hover:text-white"
            >
              Talk to us
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-10 flex flex-wrap items-center gap-8 border-t border-ink-200 pt-6"
          >
            {stats.map(({ value, suffix, label }) => (
              <div key={label}>
                <p className="prata-regular text-2xl text-ink-950">
                  <CountUp value={value} suffix={suffix} />
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-wider text-ink-400">
                  {label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Two overlapping frames, the smaller one floating over the corner */}
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease }}
          className="relative"
        >
          <div className="group aspect-4/5 overflow-hidden rounded-3xl bg-ink-100 shadow-soft">
            <img
              src={assets.about_img}
              alt="Inside the Forever studio"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-1200 ease-out group-hover:scale-105"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24, rotate: -6 }}
            animate={{ opacity: 1, y: 0, rotate: -3 }}
            transition={{ duration: 0.8, delay: 0.5, ease }}
            className="absolute -bottom-6 -left-6 hidden w-40 overflow-hidden rounded-2xl border-4 border-white bg-ink-100 shadow-lift sm:block"
          >
            <img
              src={assets.support_img}
              alt="Our support team at work"
              loading="lazy"
              decoding="async"
              className="aspect-square w-full object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.7, ease }}
            className="absolute -right-3 top-6 animate-float rounded-2xl bg-white/95 px-4 py-3 shadow-lift backdrop-blur"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-400">
              Est. 2014
            </p>
            <p className="mt-1 text-xs font-semibold text-ink-900">
              Still the same studio
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutHero;
