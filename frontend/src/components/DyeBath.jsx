import React, { Component, Suspense, lazy, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { Weave } from "./ui/Swatch";
import { DYES } from "../brand";

// three.js is large; it loads only when this section is about to scroll into
// view, as its own chunk.
const DyeCloth = lazy(() => import("./three/DyeCloth"));

const ease = [0.22, 1, 0.36, 1];
const OPTIONS = ["kora", "indigo", "madder", "turmeric", "kattha"];

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/** The flat swatch shown without WebGL, while the 3D chunk loads, or if it fails. */
function FlatCloth({ dye }) {
  return (
    <div className="absolute inset-x-[14%] bottom-[16%] top-[12%]">
      <span className="absolute -top-2 left-[-6%] right-[-6%] h-2.5 rounded-full bg-[#9a7550]" />
      <Weave
        dye={dye}
        className="h-full w-full rounded-b-md shadow-lift transition-colors duration-1000"
      />
    </div>
  );
}

/** Falls back to the flat cloth if the 3D chunk fails to load or render. */
class ClothBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/**
 * "Pick a dye, watch it take": a length of cloth on a rod that is lowered into
 * a dye bath whenever a dye is chosen. The first dip happens on its own when
 * the section scrolls into view, so the idea lands without any interaction.
 */
const DyeBath = () => {
  const section = useRef(null);
  const reduced = useReducedMotion();

  const [dyeKey, setDyeKey] = useState("kora");
  // Mount the canvas once the section is near, and render only while visible
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [webgl] = useState(supportsWebGL);
  const chosen = useRef(false);

  useEffect(() => {
    const el = section.current;
    if (!el) return;

    const nearObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          nearObserver.disconnect();
        }
      },
      { rootMargin: "400px 0px" },
    );

    let firstDip;
    const visibleObserver = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        // Dip into indigo by itself the first time it is seen, unless the
        // visitor has already picked something
        if (entry.isIntersecting && !firstDip) {
          firstDip = setTimeout(() => {
            if (!chosen.current) setDyeKey("indigo");
          }, 700);
        }
      },
      { threshold: 0.35 },
    );

    nearObserver.observe(el);
    visibleObserver.observe(el);
    return () => {
      nearObserver.disconnect();
      visibleObserver.disconnect();
      clearTimeout(firstDip);
    };
  }, []);

  const choose = (key) => {
    chosen.current = true;
    setDyeKey(key);
  };

  const dye = DYES[dyeKey];
  const flat = <FlatCloth dye={dye} />;

  return (
    <section ref={section}>
      <div className="grid overflow-hidden rounded-3xl bg-white shadow-soft lg:grid-cols-[1fr_1.15fr]">
        {/* Copy and controls */}
        <div className="order-2 flex flex-col justify-center px-7 py-10 sm:px-10 sm:py-12 lg:order-1 lg:px-12">
          <div className="flex items-center gap-3">
            <span className="h-px w-9 bg-ink-900" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-600">
              The dye bath
            </span>
          </div>

          <h2 className="type-display mt-5 text-3xl leading-tight text-ink-950 sm:text-4xl">
            Pick a dye.
            <br />
            Watch it take.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-500">
            Every colour we sell comes from a plant. Choose one and the cloth
            goes into the bath, the way each length is dyed in the studio.
          </p>

          <fieldset className="mt-8">
            <legend className="sr-only">Choose a dye</legend>
            <div className="flex flex-wrap gap-2">
              {OPTIONS.map((key) => {
                const option = DYES[key];
                return (
                  <label
                    key={key}
                    className="flex cursor-pointer items-center gap-2 rounded-full border border-ink-200 bg-white py-2 pl-2.5 pr-4 text-sm font-medium text-ink-700 transition-colors hover:border-ink-400 has-checked:border-ink-900 has-checked:bg-ink-900 has-checked:text-white has-focus-visible:ring-2 has-focus-visible:ring-accent-500 has-focus-visible:ring-offset-2"
                  >
                    <input
                      type="radio"
                      name="dye"
                      value={key}
                      checked={dyeKey === key}
                      onChange={() => choose(key)}
                      className="sr-only"
                    />
                    <span
                      className="h-4 w-4 rounded-full ring-1 ring-black/10"
                      style={{ backgroundColor: option.hex }}
                    />
                    {key === "kora" ? "Undyed" : option.name}
                  </label>
                );
              })}
            </div>
          </fieldset>

          {/* What the current dye is. Announced politely, since choosing a
              dye changes it and the canvas itself is hidden from AT. */}
          <div
            aria-live="polite"
            className="mt-6 min-h-28 rounded-2xl border border-ink-200 bg-ink-50 p-5"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={dyeKey}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease }}
              >
                <p className="flex items-baseline gap-2">
                  <span className="type-display text-xl text-ink-950">
                    {dye.name}
                  </span>
                  <span className="text-xs italic text-ink-400">
                    {dye.source}
                  </span>
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  {dye.note}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <Link
            to="/collection"
            className="group mt-8 inline-flex items-center gap-2 self-start text-sm font-semibold text-ink-900"
          >
            <span className="link-underline">Shop the dyed pieces</span>
            <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* The bath */}
        <div className="relative order-1 aspect-4/3 overflow-hidden bg-linear-to-b from-ink-100 to-ink-200 lg:order-2 lg:aspect-auto lg:min-h-136">
          {/* The vat's surface, in the colour being dyed */}
          <div
            aria-hidden="true"
            className="absolute inset-x-[6%] -bottom-[6%] h-[20%] rounded-[50%] shadow-[inset_0_8px_24px_rgb(0_0_0/0.35)] transition-colors duration-1000"
            style={{ backgroundColor: dye.hex }}
          />

          {webgl && near ? (
            <ClothBoundary fallback={flat}>
              <Suspense fallback={flat}>
                <div className="absolute inset-0">
                  <DyeCloth hex={dye.hex} reduced={Boolean(reduced)} active={visible} />
                </div>
              </Suspense>
            </ClothBoundary>
          ) : (
            flat
          )}

          {/* Pointer hint. Hidden on phones, where it would sit on the rod and
              "move across" means nothing to a finger. */}
          {webgl && !reduced && (
            <p className="pointer-events-none absolute left-5 top-5 hidden rounded-full sm:block bg-white/80 px-3 py-1.5 text-[11px] font-medium text-ink-600 backdrop-blur">
              Move across the cloth
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default DyeBath;
