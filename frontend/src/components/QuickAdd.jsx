import React, { useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { FiArrowUpRight, FiShoppingBag, FiX } from "react-icons/fi";
import { ShopContext } from "../context/ShopContext";
import Spinner from "./ui/Spinner";

const ease = [0.22, 1, 0.36, 1];

// Phones get a bottom sheet that slides up; wider screens a centred dialog
const sheetMotion = {
  initial: { y: "100%" },
  animate: { y: 0 },
  exit: { y: "100%" },
  transition: { type: "spring", stiffness: 320, damping: 34 },
};
const dialogMotion = {
  initial: { opacity: 0, y: 16, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 16, scale: 0.97 },
  transition: { duration: 0.3, ease },
};
const isPhone = () => !window.matchMedia("(min-width: 640px)").matches;

/** Size picker and add-to-bag for one product, without leaving the grid. */
function QuickAddPanel({ product, onClose }) {
  const { currency, addToCart, addingToCart } = useContext(ShopContext);
  const [size, setSize] = useState("");
  const [motionProps] = useState(() => (isPhone() ? sheetMotion : dialogMotion));
  const panelRef = useRef(null);
  const isAdding = addingToCart === product._id;

  // Focus moves into the dialog and goes back to whatever opened it
  useEffect(() => {
    const opener = document.activeElement;
    panelRef.current?.focus();
    return () => opener?.focus?.();
  }, []);

  const onAdd = async () => {
    if (await addToCart(product._id, size)) onClose();
  };

  return (
    <motion.div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-add-title"
      tabIndex={-1}
      {...motionProps}
      className="fixed inset-x-0 bottom-0 z-90 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-6 outline-none sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-full sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl sm:shadow-lift"
    >
      <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-ink-200 sm:hidden" />

      <div className="flex gap-4">
        <img
          src={product.image[0]}
          alt=""
          className="aspect-3/4 w-24 shrink-0 rounded-xl bg-ink-100 object-cover sm:w-28"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h2
              id="quick-add-title"
              className="type-display text-xl leading-snug text-ink-950"
            >
              {product.name}
            </h2>
            <button
              onClick={onClose}
              aria-label="Close"
              className="-mr-2 -mt-1 shrink-0 rounded-full p-2 text-ink-500 hover:bg-ink-100"
            >
              <FiX />
            </button>
          </div>
          <p className="mt-2 text-lg font-semibold text-ink-950">
            {currency}
            {product.price}
          </p>
          <Link
            to={`/product/${product._id}`}
            onClick={onClose}
            className="mt-2 inline-flex items-center gap-1 text-xs text-ink-500 transition-colors hover:text-ink-900"
          >
            View full details <FiArrowUpRight />
          </Link>
        </div>
      </div>

      <p className="mt-6 text-sm font-medium text-ink-900">Select size</p>
      <div className="mt-3 flex flex-wrap gap-2.5">
        {product.sizes.map((item) => (
          <motion.button
            key={item}
            whileTap={{ scale: 0.94 }}
            onClick={() => setSize(item)}
            aria-pressed={item === size}
            className={`min-w-13 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
              item === size
                ? "border-ink-900 bg-ink-900 text-white"
                : "border-ink-200 bg-white text-ink-700 hover:border-ink-900"
            }`}
          >
            {item}
          </motion.button>
        ))}
      </div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onAdd}
        disabled={isAdding}
        className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-full bg-ink-900 px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-ink-700 disabled:opacity-70"
      >
        {isAdding ? (
          <>
            <Spinner className="h-4 w-4" light /> Adding...
          </>
        ) : (
          <>
            <FiShoppingBag className="text-base" /> Add to bag
          </>
        )}
      </motion.button>
    </motion.div>
  );
}

/**
 * Quick-add dialog for a product card. Rendered into <body> because the card
 * is a 3D-transformed element, which would otherwise trap `position: fixed`.
 */
export default function QuickAdd({ productId, open, onClose }) {
  const { products } = useContext(ShopContext);
  const product = products.find((item) => item._id === productId);
  const show = open && Boolean(product);

  // Lock page scroll and close on Escape while open
  useEffect(() => {
    if (!show) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [show, onClose]);

  return createPortal(
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease }}
            onClick={onClose}
            className="fixed inset-0 z-80 bg-ink-950/40 backdrop-blur-sm"
          />
          <QuickAddPanel key="panel" product={product} onClose={onClose} />
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
