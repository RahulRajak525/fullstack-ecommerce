import React, { useContext, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { FiArrowUpRight, FiMessageCircle, FiX } from "react-icons/fi";
import { ShopContext } from "../context/ShopContext";

const WHISPER_URL = "https://whisper-app-qc0m.onrender.com/";

const STACK = [
  "React",
  "React Native (Expo)",
  "Node/Express",
  "MongoDB",
  "Socket.IO",
  "Clerk",
];

const ease = [0.22, 1, 0.36, 1];

// One full exchange: left sends, then right replies. Each trip owns half the
// cycle, so the two icons are never in flight at the same time.
const CYCLE = 4;

/** Avatar at either end of the conversation. */
function Peer({ side, children }) {
  return (
    <span
      className={`absolute top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[10px] font-semibold ${
        side === "left"
          ? "left-3 bg-ink-900 text-white"
          : "right-3 bg-accent-500 text-white"
      }`}
    >
      {children}
    </span>
  );
}

/**
 * Two people trading messages. A single icon leaves the left avatar, arcs
 * across and vanishes at the right one; then the reply does the reverse.
 * The curve comes from offsetting the y keyframes against x - y peaks at the
 * midpoint while x moves steadily, which bends the path.
 *
 * Decorative, so it is hidden from assistive tech and stands still under
 * reduced motion.
 */
function ChatAnimation({ reduced }) {
  if (reduced) {
    return (
      <div
        aria-hidden="true"
        className="relative mt-3 h-16 overflow-hidden rounded-xl border border-ink-100 bg-ink-50"
      >
        <Peer side="left">R</Peer>
        <Peer side="right">W</Peer>
        <FiMessageCircle className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-base text-ink-800" />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className="relative mt-3 h-16 overflow-hidden rounded-xl border border-ink-100 bg-ink-50"
    >
      <Peer side="left">R</Peer>
      <Peer side="right">W</Peer>

      {/* Left -> right, arcing over the top. Full opacity for the whole
          trip; it only fades once x has stopped at the right avatar.

          Positioned with top-6 rather than top-1/2 + -translate-y-1/2,
          because motion writes `transform` inline and would overwrite the
          Tailwind translate. */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 1, 1, 1, 1, 1, 1, 0, 0],
          x: [0, 0, 30, 60, 90, 110, 120, 120, 120],
          y: [0, 0, -14, -20, -14, -6, 0, 0, 0],
          rotate: [-14, -14, -8, 0, 8, 12, 14, 14, 14],
          scale: [0.7, 1, 1, 1, 1, 1, 1, 0.7, 0.7],
        }}
        transition={{
          duration: CYCLE,
          times: [0, 0.03, 0.12, 0.2, 0.28, 0.36, 0.4, 0.45, 1],
          repeat: Infinity,
          // A named easing: a 4-number array here would be read as one easing
          // per segment, not as a cubic bezier, and the path breaks.
          ease: "easeInOut",
        }}
        className="absolute left-14 top-6 text-ink-800"
      >
        <FiMessageCircle className="text-base" />
      </motion.span>

      {/* Right -> left, arcing under the bottom */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 0, 1, 1, 1, 1, 1, 0, 0],
          x: [0, 0, 0, -30, -60, -90, -120, -120, -120],
          y: [0, 0, 0, 14, 20, 14, 0, 0, 0],
          rotate: [14, 14, 14, 8, 0, -8, -14, -14, -14],
          scale: [0.7, 0.7, 1, 1, 1, 1, 1, 0.7, 0.7],
        }}
        transition={{
          duration: CYCLE,
          times: [0, 0.5, 0.53, 0.62, 0.71, 0.8, 0.9, 0.95, 1],
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-14 top-6 text-accent-500"
      >
        <span className="inline-block -scale-x-100">
          <FiMessageCircle className="text-base" />
        </span>
      </motion.span>

    </div>
  );
}

/**
 * Points visitors at the other portfolio project. Appears when the footer
 * comes into view - someone who has scrolled the whole page is the one worth
 * asking - and stays until dismissed.
 *
 * Dismissal is intentionally not persisted: a reload starts a fresh visit and
 * the card can appear again at the footer.
 *
 * Also waits for the catalogue to load, so it can never overlap the
 * cold-start notice, which occupies the same corner.
 */
const ProjectNotice = () => {
  const { loadingProducts } = useContext(ShopContext);
  const reduced = useReducedMotion();

  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (loadingProducts || dismissed) return;

    // The footer is rendered by App on every route, so one observer covers
    // the whole site.
    const footer = document.querySelector("footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      // A sliver of the footer is enough to count as having reached it
      { threshold: 0.05 },
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, [loadingProducts, dismissed]);

  const dismiss = () => setDismissed(true);

  return (
    <AnimatePresence>
      {visible && !dismissed && (
        <motion.aside
          aria-label="Another project by the developer"
          initial={{ opacity: 0, y: reduced ? 0 : 20, scale: reduced ? 1 : 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: reduced ? 0 : 20, scale: reduced ? 1 : 0.97 }}
          transition={{ duration: 0.45, ease }}
          className="fixed bottom-4 left-4 z-50 w-[calc(100vw-2rem)] max-w-xs overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-lift sm:bottom-6 sm:left-6"
        >
          {/* Accent hairline, tying it to the storefront's palette */}
          <span className="block h-0.5 w-full bg-accent-500" />

          <div className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <img
                  src="/whisper/favicon.svg"
                  alt=""
                  width="36"
                  height="36"
                  className="h-9 w-9 shrink-0 rounded-xl"
                />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-400">
                    Another project
                  </p>
                  <p className="text-sm font-semibold text-ink-900">
                    Whisper Chat
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={dismiss}
                aria-label="Dismiss"
                className="-mr-1 -mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-900"
              >
                <FiX className="text-sm" />
              </button>
            </div>

            <ChatAnimation reduced={reduced} />

            <p className="mt-3 text-xs leading-relaxed text-ink-500">
              A full-stack real-time messaging app with a web version and an
              Android app built with React Native. It uses Socket.IO for
              instant delivery, typing indicators and online status, plus
              secure sign-in and per-user message deletion.
            </p>

            <ul className="mt-3 flex flex-wrap gap-1.5">
              {STACK.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-ink-200 px-2 py-0.5 text-[10px] font-medium text-ink-500"
                >
                  {item}
                </li>
              ))}
            </ul>

            <a
              href={WHISPER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-4 flex items-center justify-center gap-2 rounded-full bg-ink-900 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-ink-700"
            >
              Try the live demo
              <FiArrowUpRight className="text-sm transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default ProjectNotice;
