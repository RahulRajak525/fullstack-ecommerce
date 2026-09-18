import React from "react";
import { motion } from "motion/react";
import Title from "../components/Title";
import NewsLetterBox from "../components/NewsLetterBox";
import Reveal from "../components/ui/Reveal";
import { staggerChild, staggerParent } from "../components/ui/motionVariants";
import { assets } from "../assets/assets";

const reasons = [
  {
    title: "Quality assurance",
    body: "Every piece is checked against the same standards before it reaches the rail. No shortcuts, no seconds.",
  },
  {
    title: "Convenience",
    body: "A checkout that stays out of your way, with clear pricing and delivery you can actually plan around.",
  },
  {
    title: "Exceptional service",
    body: "Real people answering real questions, from sizing advice to returns, whenever you need them.",
  },
];

function About() {
  return (
    <div className="py-10">
      <Title
        center
        text1={"About "}
        text2={"Us"}
        subtitle="A small studio making clothes meant to outlast the season."
      />

      <div className="mt-14 grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <img
            className="w-full rounded-3xl object-cover shadow-soft"
            src={assets.about_img}
            alt="Inside the Forever studio"
            loading="lazy"
          />
        </Reveal>

        <Reveal delay={0.12}>
          <div className="flex flex-col gap-5 text-sm leading-relaxed text-ink-600">
            <p>
              Forever was born out of a passion for innovation and a desire to
              change the way people shop online. It began with a simple idea: a
              place where you can discover, explore and buy without the noise.
            </p>
            <p>
              Since then we have worked to curate a selection that holds up &mdash;
              fabrics that wear in rather than wear out, cuts that keep working
              long after the trend has moved on.
            </p>

            <div className="mt-2 rounded-2xl border border-ink-200 bg-white p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-400">
                Our mission
              </p>
              <p className="mt-3 text-ink-700">
                To give our customers choice, convenience and confidence &mdash;
                a shopping experience that quietly exceeds expectations, from
                browsing right through to delivery.
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Why choose us */}
      <section className="mt-24">
        <Title center text1={"Why "} text2={"Choose Us"} />

        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-10 grid gap-4 md:grid-cols-3"
        >
          {reasons.map((reason, i) => (
            <motion.div
              key={reason.title}
              variants={staggerChild}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-ink-200 bg-white p-7 transition-shadow hover:shadow-lift"
            >
              <span className="text-xs font-semibold tabular-nums text-ink-300">
                0{i + 1}
              </span>
              <h3 className="mt-3 text-base font-semibold text-ink-900">
                {reason.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">
                {reason.body}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <div className="mt-24">
        <NewsLetterBox />
      </div>
    </div>
  );
}

export default About;
