import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FiCheck, FiMail } from "react-icons/fi";
import Spinner from "./ui/Spinner";

const NewsLetterBox = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | done

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (status !== "idle") return;

    setStatus("sending");
    // No newsletter endpoint on the backend yet - this stands in for it so the
    // button still demonstrates its loading and success states.
    await new Promise((resolve) => setTimeout(resolve, 900));
    setStatus("done");
    setEmail("");
    setTimeout(() => setStatus("idle"), 2600);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-3xl bg-ink-950 px-6 py-14 text-center sm:px-12 sm:py-20"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

      <div className="relative mx-auto max-w-xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-white/70">
          <FiMail /> Newsletter
        </span>

        <h2 className="prata-regular mt-5 text-2xl leading-snug text-white sm:text-4xl">
          Subscribe and get 20% off
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-white/60">
          Early access to drops, restocks and members-only pricing. One email a
          week, never more.
        </p>

        <form
          onSubmit={onSubmitHandler}
          className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full rounded-full border border-white/15 bg-white/5 px-5 py-3.5 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
          />
          <button
            type="submit"
            disabled={status !== "idle"}
            className="flex min-w-32.5 items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-ink-950 transition-all hover:bg-white/90 disabled:opacity-80"
          >
            <AnimatePresence mode="wait" initial={false}>
              {status === "sending" ? (
                <motion.span
                  key="sending"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Spinner className="h-4 w-4" />
                </motion.span>
              ) : status === "done" ? (
                <motion.span
                  key="done"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5"
                >
                  <FiCheck className="text-base" /> Subscribed
                </motion.span>
              ) : (
                <motion.span
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Subscribe
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </form>
      </div>
    </motion.section>
  );
};

export default NewsLetterBox;
