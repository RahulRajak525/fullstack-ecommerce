import React from "react";
import { motion } from "motion/react";
import { FiStar } from "react-icons/fi";
import Title from "./Title";
import { staggerChild, staggerParent } from "./ui/motionVariants";

const reviews = [
  {
    quote:
      "The cotton is heavier than anything I've ordered online before. Two months of weekly washes and the neck still holds its shape.",
    name: "Aarav Mehta",
    role: "Bought the Pure Cotton Tee",
    initials: "AM",
  },
  {
    quote:
      "Ordered a size up out of habit, exchanged it in three days with zero fuss. The measurements on the page are actually accurate.",
    name: "Sofia Almeida",
    role: "Bought the Round Neck Top",
    initials: "SA",
  },
  {
    quote:
      "Packaging was flat, plastic-free and it arrived a day early. Small thing, but it's why I came back for the trousers.",
    name: "Daniel Osei",
    role: "Bought the Tapered Trousers",
    initials: "DO",
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 sm:py-20">
      <Title
        center
        text1={"What Customers "}
        text2={"Say"}
        subtitle="Unedited notes from people who paid full price."
      />

      <motion.div
        variants={staggerParent}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mt-10 grid gap-5 md:grid-cols-3"
      >
        {reviews.map(({ quote, name, role, initials }) => (
          <motion.figure
            key={name}
            variants={staggerChild}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white p-7 transition-shadow duration-300 hover:shadow-lift"
          >
            {/* Oversized quote mark, decorative only */}
            <span
              aria-hidden="true"
              className="prata-regular pointer-events-none absolute -top-6 right-4 text-8xl text-ink-100 select-none"
            >
              &rdquo;
            </span>

            <div className="relative flex gap-1 text-accent-500">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.span
                  key={i}
                  variants={{
                    hidden: { opacity: 0, scale: 0.4 },
                    show: {
                      opacity: 1,
                      scale: 1,
                      transition: { delay: 0.15 + i * 0.07 },
                    },
                  }}
                >
                  <FiStar className="fill-current text-sm" />
                </motion.span>
              ))}
            </div>

            <blockquote className="relative mt-4 grow text-sm leading-relaxed text-ink-700">
              {quote}
            </blockquote>

            <figcaption className="relative mt-6 flex items-center gap-3 border-t border-ink-100 pt-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-900 text-xs font-semibold text-white">
                {initials}
              </span>
              <span>
                <span className="block text-sm font-semibold text-ink-900">
                  {name}
                </span>
                <span className="block text-[11px] uppercase tracking-wider text-ink-400">
                  {role}
                </span>
              </span>
            </figcaption>
          </motion.figure>
        ))}
      </motion.div>
    </section>
  );
};

export default Testimonials;
