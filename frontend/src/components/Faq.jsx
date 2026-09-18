import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiPlus } from "react-icons/fi";
import Title from "./Title";

const questions = [
  {
    q: "How do your sizes run?",
    a: "True to size, with a little room through the body. Every product page lists flat measurements taken from the actual garment, not a generic chart, so compare those against a piece you already own.",
  },
  {
    q: "How long does delivery take?",
    a: "Stocked items leave the studio within 24 hours and arrive in two to five working days. Orders over $80 ship free; below that a flat $10 is added at checkout.",
  },
  {
    q: "What if the fit is wrong?",
    a: "Send it back within 7 days for a full refund, or swap the size and we cover the return leg. The item just needs to be unworn with its tags on.",
  },
  {
    q: "Where are your clothes made?",
    a: "Cut and sewn across four partner workshops in India and Portugal, using cotton and wool from thirty-eight mills we visit in person at least once a year.",
  },
  {
    q: "Do you restock sold-out pieces?",
    a: "Core pieces, yes, usually within six weeks. Seasonal colours are made once and not repeated, so the newsletter is the only reliable warning.",
  },
];

const Faq = () => {
  const [open, setOpen] = useState(0);

  return (
    <section className="py-16 sm:py-20">
      <Title
        center
        text1={"Common "}
        text2={"Questions"}
        subtitle="The five things people ask us most, answered properly."
      />

      <div className="mx-auto mt-10 max-w-2xl divide-y divide-ink-200 overflow-hidden rounded-2xl border border-ink-200 bg-white">
        {questions.map(({ q, a }, i) => {
          const isOpen = open === i;

          return (
            <div key={q}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${i}`}
                id={`faq-question-${i}`}
                className="group flex w-full items-center justify-between gap-5 px-6 py-5 text-left"
              >
                <span
                  className={`text-sm font-semibold transition-colors ${
                    isOpen
                      ? "text-ink-950"
                      : "text-ink-700 group-hover:text-ink-950"
                  }`}
                >
                  {q}
                </span>

                {/* One icon, rotated 45 degrees to become a close button */}
                <motion.span
                  animate={{ rotate: isOpen ? 135 : 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    isOpen
                      ? "border-ink-900 bg-ink-900 text-white"
                      : "border-ink-200 text-ink-500 group-hover:border-ink-400"
                  }`}
                >
                  <FiPlus />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    id={`faq-answer-${i}`}
                    role="region"
                    aria-labelledby={`faq-question-${i}`}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 pr-16 text-sm leading-relaxed text-ink-500">
                      {a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <Link
          to="/contact"
          className="group inline-flex items-center gap-2 text-sm font-semibold text-ink-900"
        >
          <span className="link-underline">Still stuck? Ask us directly</span>
          <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
};

export default Faq;
