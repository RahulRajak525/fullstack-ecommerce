import React from "react";
import { motion } from "motion/react";
import CountUp from "./ui/CountUp";
import { staggerChild, staggerParent } from "./ui/motionVariants";

const figures = [
  { value: 12, suffix: "", label: "Years in the trade", note: "Since 2014" },
  { value: 96, suffix: "%", label: "Reorder rate", note: "Last 12 months" },
  { value: 2.1, decimals: 1, suffix: "%", label: "Returns rate", note: "Industry average is 18%" },
  { value: 24, suffix: "h", label: "Dispatch window", note: "On stocked items" },
];

/** Dark band that breaks up the long-form copy with something countable. */
const StatBand = () => {
  return (
    <motion.section
      variants={staggerParent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      className="relative overflow-hidden rounded-3xl bg-ink-950 px-6 py-12 sm:px-12 sm:py-14"
    >
      <div className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 animate-blob rounded-full bg-accent-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-0 h-64 w-64 animate-float-slow rounded-full bg-white/10 blur-3xl" />

      <motion.p
        variants={staggerChild}
        className="relative text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45"
      >
        The numbers we are happy to publish
      </motion.p>

      <div className="relative mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {figures.map(({ value, decimals, suffix, label, note }) => (
          <motion.div
            key={label}
            variants={staggerChild}
            className="text-center sm:text-left"
          >
            <p className="prata-regular text-3xl text-white sm:text-4xl">
              <CountUp value={value} decimals={decimals} suffix={suffix} />
            </p>
            <p className="mt-2 text-sm font-medium text-white/80">{label}</p>
            <p className="mt-1 text-[11px] uppercase tracking-wider text-white/40">
              {note}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default StatBand;
