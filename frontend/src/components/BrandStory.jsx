import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiCheck } from "react-icons/fi";
import CountUp from "./ui/CountUp";
import { staggerChild, staggerParent } from "./ui/motionVariants";
import { assets } from "../assets/assets";

const promises = [
  "Natural fibres, mill-certified and pre-shrunk",
  "Cut in small runs so nothing sits in a warehouse",
  "Reinforced seams that survive the wash cycle",
  "Honest pricing, no invented discounts",
];

const stats = [
  { value: 12, suffix: "yrs", label: "Making clothes" },
  { value: 38, suffix: "", label: "Partner mills" },
  { value: 96, suffix: "%", label: "Reorder rate" },
];

const BrandStory = () => {
  const ref = useRef(null);
  // Image drifts slightly slower than the page as the section passes through.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1, 1.08]);

  return (
    <section
      ref={ref}
      className="grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:gap-16"
    >
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative aspect-4/3 overflow-hidden rounded-3xl bg-ink-100 shadow-soft lg:aspect-square"
      >
        <motion.img
          src={assets.about_img}
          alt="Inside our studio"
          loading="lazy"
          decoding="async"
          style={{ y, scale }}
          className="h-full w-full object-cover"
        />

        {/* Floating card, lifted off the photo */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="absolute bottom-5 left-5 right-5 animate-float rounded-2xl bg-white/95 p-5 shadow-lift backdrop-blur sm:right-auto sm:max-w-65"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-400">
            Since 2014
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-700">
            One studio, one standard &mdash; every piece is approved by hand
            before it ships.
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        variants={staggerParent}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
      >
        <motion.div variants={staggerChild} className="flex items-center gap-3">
          <span className="h-px w-9 bg-ink-900" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-600">
            Why shop with us
          </span>
        </motion.div>

        <motion.h2
          variants={staggerChild}
          className="prata-regular mt-5 text-3xl leading-tight text-ink-950 sm:text-4xl"
        >
          Fewer clothes,
          <br />
          chosen properly.
        </motion.h2>

        <motion.p
          variants={staggerChild}
          className="mt-5 max-w-lg text-sm leading-relaxed text-ink-500"
        >
          We would rather sell you one jacket you keep for a decade than four
          you forget by spring. That means slower drops, stricter fabric
          checks, and a fit we test on real bodies before it reaches the rail.
        </motion.p>

        <motion.ul variants={staggerChild} className="mt-7 space-y-3">
          {promises.map((item) => (
            <li key={item} className="group flex items-start gap-3 text-sm text-ink-700">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink-100 text-ink-800 transition-colors duration-300 group-hover:bg-ink-900 group-hover:text-white">
                <FiCheck className="text-xs" />
              </span>
              {item}
            </li>
          ))}
        </motion.ul>

        <motion.div
          variants={staggerChild}
          className="mt-9 grid grid-cols-3 gap-4 border-y border-ink-200 py-6"
        >
          {stats.map(({ value, suffix, label }) => (
            <div key={label}>
              <p className="prata-regular text-2xl text-ink-950 sm:text-3xl">
                <CountUp value={value} suffix={suffix} />
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-wider text-ink-400">
                {label}
              </p>
            </div>
          ))}
        </motion.div>

        <motion.div variants={staggerChild} className="mt-8">
          <Link
            to="/about"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-ink-900"
          >
            <span className="link-underline">Read our story</span>
            <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default BrandStory;
