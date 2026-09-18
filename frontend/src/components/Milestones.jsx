import React, { useRef } from "react";
import { motion, useScroll } from "motion/react";
import Title from "./Title";

const milestones = [
  {
    year: "2014",
    title: "Two machines, one room",
    body: "We started altering and reselling deadstock fabric out of a rented room, mostly for friends who could not find a tee that fit.",
  },
  {
    year: "2017",
    title: "Our first mill partnership",
    body: "A family-run mill in Coimbatore agreed to spin us a heavier cotton than anyone would sell in small runs. It is still our house fabric.",
  },
  {
    year: "2020",
    title: "Made to order, on purpose",
    body: "Rather than guess at demand, we moved to short production runs. Slower drops, but almost nothing ends up discounted or discarded.",
  },
  {
    year: "2023",
    title: "Plastic out of the parcel",
    body: "Every order now ships in a flat, recycled paper mailer. Cost us margin, saved roughly nine tonnes of film in the first year.",
  },
  {
    year: "2026",
    title: "Where we are now",
    body: "Nine people, thirty-eight mills, and a returns rate low enough that we publish it. The plan from here is simply more of the same.",
  },
];

const Milestones = () => {
  const ref = useRef(null);
  // The spine draws itself as the list scrolls past, so progress through the
  // story is visible at a glance.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 65%"],
  });

  return (
    <section className="py-16 sm:py-20">
      <Title
        center
        text1={"How We Got "}
        text2={"Here"}
        subtitle="Twelve years, condensed into the five decisions that mattered."
      />

      <div ref={ref} className="relative mx-auto mt-12 max-w-2xl">
        {/* Track, then the line that fills it */}
        <div className="absolute bottom-2 left-2.5 top-2 w-px bg-ink-200 sm:left-3" />
        <motion.div
          style={{ scaleY: scrollYProgress }}
          className="absolute bottom-2 left-2.5 top-2 w-px origin-top bg-ink-900 sm:left-3"
        />

        <ol className="space-y-10">
          {milestones.map(({ year, title, body }) => (
            <motion.li
              key={year}
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="group relative pl-12 sm:pl-14"
            >
              {/* Dot pops as its entry arrives */}
              <motion.span
                initial={{ scale: 0.3, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="absolute left-0 top-1.5 flex h-5.5 w-5.5 items-center justify-center rounded-full border border-ink-300 bg-white transition-colors duration-300 group-hover:border-ink-900 sm:left-0.5"
              >
                <span className="h-2 w-2 rounded-full bg-ink-300 transition-colors duration-300 group-hover:bg-accent-500" />
              </motion.span>

              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-400">
                {year}
              </p>
              <h3 className="prata-regular mt-2 text-xl text-ink-950">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{body}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default Milestones;
