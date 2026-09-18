import React from "react";
import { motion } from "motion/react";
import { FiShoppingBag, FiStar } from "react-icons/fi";
import Title from "./Title";
import { staggerChild, staggerParent } from "./ui/motionVariants";

// Sample reviews for the demo storefront. Deliberately not attributed to
// named people - inventing a reviewer and presenting them as real is the one
// thing this section must not do.
const reviews = [
  {
    quote:
      "The cotton is heavier than anything I have ordered online before. Two months of weekly washes and the neck still holds its shape.",
    product: "Pure Cotton Tee",
  },
  {
    quote:
      "Ordered a size up out of habit, exchanged it in three days with zero fuss. The measurements on the page are actually accurate.",
    product: "Round Neck Top",
  },
  {
    quote:
      "Packaging was flat, plastic-free and it arrived a day early. Small thing, but it is why I came back for the trousers.",
    product: "Tapered Trousers",
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 sm:py-20">
      <Title
        center
        text1={"What Customers "}
        text2={"Say"}
        subtitle="Sample reviews, shown to demonstrate the layout."
      />

      <motion.div
        variants={staggerParent}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mt-10 grid gap-5 md:grid-cols-3"
      >
        {reviews.map(({ quote, product }) => (
          <motion.figure
            key={product}
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
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-100 text-ink-700">
                <FiShoppingBag className="text-base" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-ink-900">
                  {product}
                </span>
                <span className="block text-[11px] uppercase tracking-wider text-ink-400">
                  Sample review
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
