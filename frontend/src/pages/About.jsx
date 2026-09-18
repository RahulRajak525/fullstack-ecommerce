import React from "react";
import { motion } from "motion/react";
import { FiAward, FiHeadphones, FiPackage } from "react-icons/fi";
import Title from "../components/Title";
import AboutHero from "../components/AboutHero";
import StatBand from "../components/StatBand";
import Milestones from "../components/Milestones";
import Faq from "../components/Faq";
import NewsLetterBox from "../components/NewsLetterBox";
import Reveal from "../components/ui/Reveal";
import { staggerChild, staggerParent } from "../components/ui/motionVariants";

const reasons = [
  {
    icon: FiAward,
    title: "Quality assurance",
    body: "Every piece is checked against the same standards before it reaches the rail. No shortcuts, no seconds, no clearing last season's mistakes onto you.",
  },
  {
    icon: FiPackage,
    title: "Convenience",
    body: "A checkout that stays out of your way, with clear pricing, flat measurements on every page and delivery you can actually plan around.",
  },
  {
    icon: FiHeadphones,
    title: "Exceptional service",
    body: "Real people answering real questions, from sizing advice to returns. One inbox, no ticket numbers, replies inside a working day.",
  },
];

// Things we have turned down, which says more than a list of values.
const nevers = [
  "Invent a discount by inflating the price first",
  "Run a fabric we have not worn ourselves for a season",
  "Sell a size we cannot cut properly",
];

function About() {
  return (
    <div className="py-10">
      <AboutHero />

      {/* Story ------------------------------------------------------------ */}
      <section className="grid gap-12 py-16 sm:py-20 lg:grid-cols-[1fr_0.85fr] lg:gap-16">
        <Reveal>
          <div className="flex flex-col gap-5 text-sm leading-relaxed text-ink-600">
            <div className="flex items-center gap-3">
              <span className="h-px w-9 bg-ink-900" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-600">
                Our story
              </span>
            </div>

            <h2 className="prata-regular text-3xl leading-tight text-ink-950 sm:text-4xl">
              It began as a complaint
              <br />
              about t-shirts.
            </h2>

            <p>
              Forever was born out of a passion for innovation and a desire to
              change the way people shop online. It began with a simple idea: a
              place where you can discover, explore and buy without the noise
              &mdash; no countdown timers on evergreen stock, no fourteen upsells
              between the cart and the card.
            </p>
            <p>
              Since then we have worked to curate a selection that holds up
              &mdash; fabrics that wear in rather than wear out, cuts that keep
              working long after the trend has moved on. We buy in small runs
              from mills we have stood inside, and we would rather tell you a
              piece is sold out than substitute something close enough.
            </p>
            <p>
              None of that makes us unusual. It just makes us slow, which in this
              industry turns out to be the same thing.
            </p>

            <div className="mt-2 rounded-2xl border border-ink-200 bg-white p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-400">
                What we will never do
              </p>
              <ul className="mt-4 space-y-2.5">
                {nevers.map((item) => (
                  <li
                    key={item}
                    className="group flex items-start gap-3 text-sm text-ink-700"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500 transition-transform duration-300 group-hover:scale-150" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.12} className="flex flex-col gap-5">
          {/* Statement of intent, set large so it breaks the column of body
              copy. Deliberately unattributed - this is a demo brand. */}
          <div className="relative overflow-hidden rounded-3xl bg-ink-900 p-8 sm:p-10">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 animate-blob rounded-full bg-accent-500/25 blur-3xl" />
            <span
              aria-hidden="true"
              className="prata-regular pointer-events-none absolute -top-4 right-6 text-8xl text-white/10 select-none"
            >
              &rdquo;
            </span>
            <p className="relative text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
              The standard
            </p>
            <p className="prata-regular relative mt-4 text-xl leading-snug text-white sm:text-2xl">
              If a jacket comes back for a new zip in ten years, that is the
              business working exactly as intended.
            </p>
          </div>

          <div className="rounded-3xl border border-ink-200 bg-white p-8 sm:p-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-400">
              Our mission
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink-700">
              To give our customers choice, convenience and confidence &mdash; a
              shopping experience that quietly exceeds expectations, from
              browsing right through to delivery.
            </p>
          </div>
        </Reveal>
      </section>

      <StatBand />

      <Milestones />


      {/* Why choose us ---------------------------------------------------- */}
      <section className="pb-16 sm:pb-20">
        <Title
          center
          text1={"Why "}
          text2={"Choose Us"}
          subtitle="Three promises, each one narrow enough to hold us to."
        />

        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-10 grid gap-4 md:grid-cols-3"
        >
          {reasons.map(({ icon: Icon, title, body }, i) => (
            <motion.div
              key={title}
              variants={staggerChild}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="group relative overflow-hidden rounded-2xl border border-ink-200 bg-white p-7 transition-shadow duration-300 hover:shadow-lift"
            >
              {/* Accent rule that draws itself across the top on hover */}
              <span className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-accent-500 transition-transform duration-500 group-hover:scale-x-100" />

              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink-100 text-ink-800 transition-colors duration-300 group-hover:bg-ink-900 group-hover:text-white">
                  <Icon className="text-lg" />
                </div>
                <span className="prata-regular text-2xl tabular-nums text-ink-200 transition-colors duration-300 group-hover:text-ink-300">
                  0{i + 1}
                </span>
              </div>

              <h3 className="mt-5 text-base font-semibold text-ink-900">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{body}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <Faq />

      <NewsLetterBox />
    </div>
  );
}

export default About;
