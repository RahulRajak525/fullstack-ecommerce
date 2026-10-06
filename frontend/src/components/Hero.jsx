import React from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiTruck } from "react-icons/fi";
import { Weave } from "./ui/Swatch";
import { DYES } from "../brand";
import CountUp from "./ui/CountUp";
import RotatingWord from "./ui/RotatingWord";
import { photoSrcSet, photoUrl } from "../utils/cloudinary";
// Hero photos. Sirio and Marcus Loke on Unsplash (free Unsplash License),
// bundled as WebP at about twice their largest rendered size; the group shot
// is pexels.com/@shkrabaanthony (7081122, free Pexels License), from Cloudinary.
import modelsImg from "../assets/hero/models.webp";
import railImg from "../assets/hero/rail.webp";

const GROUP_PHOTO = "v1791266673/pexels-shkrabaanthony-7081122.jpg";

const ease = [0.22, 1, 0.36, 1];

// The headline animates a line at a time, each sliding up behind a mask.
const headline = ["Dyed slowly,", "worn for years."];

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
              Autumn dye lot is live
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
              Raw cotton &middot; plant dyes
            </span>
          </motion.div>

          <h1 className="type-display mt-5 text-4xl leading-[1.12] text-ink-950 sm:text-5xl lg:text-6xl">
            {headline.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-1">
                <motion.span
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, delay: 0.15 + i * 0.12, ease }}
                  className="block"
                >
                  {line}
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
            Staples in unbleached cotton, coloured with indigo, madder and
            turmeric &mdash; cut in small runs and made to outlast the season.
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

        {/* Artwork: three photographs pinned up on raw cloth. Each layer's
            entrance runs on a motion wrapper while its resting and hover
            poses are Tailwind classes on the child - motion writes
            `transform` inline and would otherwise overwrite them. */}
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease }}
          className="group relative order-1 h-full min-h-112 overflow-hidden rounded-3xl sm:order-2 sm:min-h-128"
        >
          <Weave
            dye={DYES.kora}
            aria-hidden="true"
            className="absolute inset-0 rounded-3xl"
          />

          {/* Main photograph */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
            className="absolute left-[6%] top-[6%] z-10 h-[70%] w-[54%]"
          >
            <div className="h-full w-full overflow-hidden rounded-2xl bg-ink-200 shadow-lift">
              <img
                src={modelsImg}
                alt="Two models in oversized black cotton tops against a blue sky"
                width="800"
                height="1200"
                fetchPriority="high"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-1200 ease-out group-hover:scale-105"
              />
            </div>
          </motion.div>

          {/* Top right: the rail */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease }}
            className="absolute right-[6%] top-[6%] z-20 w-[36%] max-w-56"
          >
            <div className="rotate-[3deg] overflow-hidden rounded-2xl border-4 border-white bg-ink-200 shadow-lift transition-transform duration-700 ease-out group-hover:translate-x-[4%] group-hover:rotate-[6deg]">
              <img
                src={railImg}
                alt="A rail of cream, printed and orange tops"
                width="640"
                height="800"
                decoding="async"
                className="aspect-4/5 w-full object-cover"
              />
            </div>
          </motion.div>

          {/* Bottom right: the group, overlapping the main photo's corner */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease }}
            className="absolute bottom-[9%] right-[9%] z-30 w-[40%] max-w-64"
          >
            <div className="-rotate-[4deg] overflow-hidden rounded-2xl border-4 border-white bg-ink-200 shadow-lift transition-transform duration-700 ease-out group-hover:-translate-y-[3%] group-hover:-rotate-[7deg]">
              <img
                src={photoUrl(GROUP_PHOTO, 512)}
                srcSet={photoSrcSet(GROUP_PHOTO, [320, 512, 768])}
                sizes="(min-width: 640px) 256px, 40vw"
                alt="Four friends in pastel and tie-dye layers posing in a teal studio"
                width="512"
                height="640"
                decoding="async"
                className="aspect-4/5 w-full object-cover"
              />
            </div>
          </motion.div>

          {/* Floating delivery chip over the artwork */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75, ease }}
            className="absolute bottom-5 left-5 z-40 animate-float rounded-2xl bg-white/95 px-4 py-3 shadow-lift backdrop-blur"
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
            className="absolute bottom-4 right-4 z-40 flex h-16 w-16 flex-col items-center justify-center rounded-full bg-accent-500 text-center text-white shadow-lift sm:bottom-5 sm:right-5 sm:h-20 sm:w-20"
          >
            <span className="text-base font-bold leading-none sm:text-lg">20%</span>
            <span className="mt-0.5 text-[8px] font-semibold uppercase tracking-[0.14em] sm:text-[9px]">
              first order
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
