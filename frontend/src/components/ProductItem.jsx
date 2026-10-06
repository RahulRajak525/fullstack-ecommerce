import React, {
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { FiArrowUpRight, FiChevronsLeft, FiShoppingBag } from "react-icons/fi";
import QuickAdd from "./QuickAdd";
import WishlistButton from "./WishlistButton";
import {
  claimSwipeHint,
  markSwipeHintShown,
  markSwipeLearned,
} from "./swipeHint";

// Degrees of tilt at the card's edges
const MAX_TILT_X = 12;
const MAX_TILT_Y = 14;
const tiltSpring = { stiffness: 220, damping: 20, mass: 0.6 };

// A sideways swipe (touch) or left-button drag (mouse) this far, in px,
// opens quick add
const SWIPE_DISTANCE = 60;
// Past this much sideways movement the gesture is a swipe, not a click
const DRAG_SLOP = 8;
// How far the card follows the pointer before it opens
const MAX_SWIPE_SHIFT = 28;
// How long the one-time hint stays up, in ms
const HINT_DURATION = 5000;

// Only for a real mouse: on touch the card would tilt on tap and stay there
const canHover = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;

function ProductItem({ id, image, name, price, bestseller }) {
  const { currency } = useContext(ShopContext);
  const [loaded, setLoaded] = useState(false);
  const reduced = useReducedMotion();
  const [hoverable] = useState(canHover);
  const tilt = hoverable && !reduced;

  const rotateX = useSpring(0, tiltSpring);
  const rotateY = useSpring(0, tiltSpring);
  const swipeX = useSpring(0, { stiffness: 400, damping: 30 });
  // The hint's demo nudge, kept apart so it never fights the finger
  const nudgeX = useMotionValue(0);
  const x = useTransform(() => swipeX.get() + nudgeX.get());

  const [quickAdd, setQuickAdd] = useState(false);
  const closeQuickAdd = useCallback(() => setQuickAdd(false), []);
  // Where the current swipe started; null when none is being tracked
  const swipeStart = useRef(null);
  // Set once the pointer moves sideways, so releasing it isn't a click
  const swiped = useRef(false);

  // First card into view nudges sideways and says how quick add works, since
  // a gesture alone can't be discovered. Limits live in swipeHint.js.
  const cardRef = useRef(null);
  const cardId = useId();
  const inView = useInView(cardRef, { once: true, amount: 0.6 });
  const [hint, setHint] = useState(false);

  useEffect(() => {
    if (!inView || !claimSwipeHint(cardId)) return;
    let nudge;
    // Wait for the grid's entrance stagger to settle first
    const show = setTimeout(() => {
      setHint(true);
      markSwipeHintShown();
      if (!reduced) {
        nudge = animate(nudgeX, [0, -22, 0, -22, 0], {
          duration: 1.6,
          ease: "easeInOut",
          delay: 0.3,
        });
      }
    }, 700);
    const hide = setTimeout(() => setHint(false), 700 + HINT_DURATION);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
      nudge?.stop();
    };
  }, [inView, cardId, reduced, nudgeX]);

  const onPointerDown = (e) => {
    setHint(false);
    swiped.current = false;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    swipeStart.current = { x: e.clientX, y: e.clientY };
  };
  const endSwipe = () => {
    swipeStart.current = null;
    swipeX.set(0);
  };

  // Tilt toward the pointer, and move the glare to sit under it
  const onPointerMove = (e) => {
    if (swipeStart.current) {
      const dx = e.clientX - swipeStart.current.x;
      const dy = e.clientY - swipeStart.current.y;
      if (Math.abs(dx) > DRAG_SLOP) swiped.current = true;
      if (Math.abs(dx) >= SWIPE_DISTANCE && Math.abs(dx) > Math.abs(dy) * 1.5) {
        endSwipe();
        markSwipeLearned();
        setQuickAdd(true);
      } else if (!reduced) {
        const shift = Math.max(-MAX_SWIPE_SHIFT, Math.min(MAX_SWIPE_SHIFT, dx * 0.4));
        swipeX.set(shift);
      }
      return;
    }
    if (!tilt) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rotateY.set((px - 0.5) * 2 * MAX_TILT_Y);
    rotateX.set((0.5 - py) * 2 * MAX_TILT_X);
    e.currentTarget.style.setProperty("--gx", `${px * 100}%`);
    e.currentTarget.style.setProperty("--gy", `${py * 100}%`);
  };
  const onPointerLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    endSwipe();
  };
  const onLinkClick = (e) => {
    if (swiped.current) e.preventDefault();
  };

  // Second image (when the product has one) is revealed on hover
  const primary = image?.[0];
  const secondary = image?.[1];

  // 3D: the card rotates inside a perspective wrapper, and transform-3d is
  // kept on every element down to the tag and chip so their translate-z
  // lifts them off the photo. The photo frame itself clips (overflow-hidden
  // flattens 3D), which is why the tag and chip sit outside it.
  // touch-pan-y leaves vertical scrolling to the browser and hands sideways
  // moves to the swipe handler. Native drag and text selection are off, as
  // either would swallow a mouse swipe.
  return (
    <div
      ref={cardRef}
      className="group relative perspective-[750px]"
      onDragStart={(e) => e.preventDefault()}
    >
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        style={tilt ? { x, rotateX, rotateY } : { x }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endSwipe}
        onPointerCancel={endSwipe}
        onPointerLeave={onPointerLeave}
        className="relative touch-pan-y touch-pinch-zoom select-none transform-3d"
      >
        <Link
          to={`/product/${id}`}
          onClick={onLinkClick}
          className="block transform-3d"
        >
          <div className="relative transform-3d">
            <div className="relative aspect-3/4 overflow-hidden rounded-2xl bg-ink-100 shadow-soft transition-shadow duration-500 group-hover:shadow-lift">
              {/* Shimmer stays until the real image decodes */}
              {!loaded && <div className="skeleton absolute inset-0" />}

              <img
                src={primary}
                alt={name}
                loading="lazy"
                decoding="async"
                onLoad={() => setLoaded(true)}
                className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
                  loaded ? "opacity-100" : "opacity-0"
                } ${secondary ? "group-hover:opacity-0" : ""}`}
              />

              {secondary && (
                <img
                  src={secondary}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100"
                />
              )}

              {/* Glare: a soft light that follows the pointer */}
              {tilt && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(circle at var(--gx, 50%) var(--gy, 50%), rgb(255 255 255 / 0.32), transparent 50%)",
                  }}
                />
              )}
            </div>

            {bestseller && (
              <span className="absolute left-2 top-2 translate-z-6 rounded-full bg-white/95 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-ink-900 shadow-soft backdrop-blur sm:left-2.5 sm:top-2.5 sm:text-[9px]">
                Bestseller
              </span>
            )}

            {/* Slides up from the bottom edge on hover */}
            <div className="pointer-events-none absolute inset-x-3 bottom-3 translate-y-3 translate-z-8 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
              <div className="flex items-center justify-between gap-2 rounded-full bg-white/95 px-4 py-2.5 text-xs font-medium text-ink-900 shadow-lift backdrop-blur">
                View product
                <FiArrowUpRight className="text-sm" />
              </div>
            </div>
          </div>

          <div className="mt-3 translate-z-3 space-y-1">
            <p className="line-clamp-1 text-sm text-ink-700 transition-colors group-hover:text-ink-900">
              {name}
            </p>
            <p className="text-sm font-semibold text-ink-900">
              {currency}
              {price}
            </p>
          </div>
        </Link>

        {/* Favourite and quick add sit outside the link, since a button can't
            nest inside one. The heart always shows; quick add always on
            touch, on hover with a mouse. */}
        <WishlistButton
          id={id}
          name={name}
          className="absolute right-2 top-2 h-8 w-8 translate-z-8 bg-white/95 text-sm shadow-soft backdrop-blur sm:right-2.5 sm:top-2.5 sm:h-9 sm:w-9"
        />
        <button
          type="button"
          onClick={() => setQuickAdd(true)}
          aria-label={`Quick add ${name}`}
          title="Quick add"
          className={`absolute right-2 top-11.5 flex h-8 w-8 translate-z-8 items-center justify-center rounded-full bg-white/95 text-sm text-ink-900 shadow-soft backdrop-blur transition-all duration-300 hover:bg-ink-900 hover:text-white sm:right-2.5 sm:top-13 sm:h-9 sm:w-9 ${
            hoverable
              ? "opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
              : ""
          }`}
        >
          <FiShoppingBag />
        </button>
      </motion.div>

      <AnimatePresence>
        {hint && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.3 }}
            role="status"
            className="pointer-events-none absolute inset-x-0 top-[40%] z-10 flex justify-center px-2"
          >
            <span className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-ink-950/85 px-3 py-2 text-[11px] font-medium text-white shadow-lift backdrop-blur sm:text-xs">
              <FiChevronsLeft className="shrink-0 text-sm" />
              {hoverable ? "Drag sideways to quick add" : "Swipe to quick add"}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <QuickAdd productId={id} open={quickAdd} onClose={closeQuickAdd} />
    </div>
  );
}

export default ProductItem;
