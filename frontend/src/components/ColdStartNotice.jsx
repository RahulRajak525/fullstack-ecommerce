import React, { useContext, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { FiX } from "react-icons/fi";
import { ShopContext } from "../context/ShopContext";

const STORAGE_KEY = "forever:cold-start-seen";
// Long enough that a warm backend never triggers the notice - it only appears
// once the wait is real.
const SHOW_AFTER_MS = 2200;

// What we claim to be doing, by seconds elapsed. The work is one request; the
// steps exist so a 30 second wait reads as progress rather than a hang.
const STEPS = [
  { from: 0, label: "Waking the server" },
  { from: 6, label: "Connecting to the catalogue" },
  { from: 14, label: "Fetching products" },
  { from: 24, label: "Almost ready" },
];

function stepFor(seconds) {
  return STEPS.reduce((current, step) =>
    seconds >= step.from ? step : current,
  );
}

/**
 * Approaches 95% and never reaches it, so the bar keeps moving for as long as
 * the wait lasts without ever promising it is finished.
 */
function progressFor(seconds) {
  return 95 * (1 - Math.exp(-seconds / 11));
}

function alreadySeen() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    // Private mode or blocked storage: treat as a first visit rather than fail
    return false;
  }
}

function markSeen() {
  try {
    localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // Not being able to remember is fine; the notice is not important enough
    // to warrant any fallback.
  }
}

/**
 * Shown to a first-time visitor while the free-tier API wakes up. The first
 * request of the day can take ~30 seconds, and an unexplained wall of
 * skeletons reads as a broken site.
 */
const ColdStartNotice = () => {
  const { loadingProducts } = useContext(ShopContext);
  const reduced = useReducedMotion();

  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [seconds, setSeconds] = useState(0);

  // Only arm the timer for a first-time visitor who is actually waiting.
  useEffect(() => {
    if (!loadingProducts || dismissed || alreadySeen()) return;

    const timer = setTimeout(() => {
      setVisible(true);
      markSeen();
    }, SHOW_AFTER_MS);

    return () => clearTimeout(timer);
  }, [loadingProducts, dismissed]);

  useEffect(() => {
    if (!visible) return;

    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [visible]);

  const show = visible && loadingProducts && !dismissed;
  const step = stepFor(seconds);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: reduced ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduced ? 0 : 16 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-4 left-4 z-50 w-[calc(100vw-2rem)] max-w-xs rounded-2xl border border-ink-200 bg-white p-4 shadow-lift sm:bottom-6 sm:left-6"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink-900">
                Preparing your storefront
              </p>

              {/* The step label swaps in place as the wait goes on */}
              <div className="mt-1.5 flex h-4 items-center gap-2">
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-accent-500" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-500" />
                </span>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={step.label}
                    initial={{ opacity: 0, y: reduced ? 0 : 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: reduced ? 0 : -6 }}
                    transition={{ duration: 0.28 }}
                    className="truncate text-xs font-medium text-ink-700"
                  >
                    {step.label}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setDismissed(true)}
              aria-label="Dismiss"
              className="-mr-1 -mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-900"
            >
              <FiX className="text-sm" />
            </button>
          </div>

          <div
            className="mt-3 h-1 overflow-hidden rounded-full bg-ink-100"
            role="presentation"
          >
            <div
              className="h-full rounded-full bg-ink-900 transition-[width] duration-1000 ease-linear"
              style={{ width: `${progressFor(seconds)}%` }}
            />
          </div>

          <p className="mt-2.5 text-[11px] leading-relaxed text-ink-400">
            This demo runs on a free tier that sleeps when idle, so the first
            load takes up to 30 seconds. Everything is quick after that.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ColdStartNotice;
