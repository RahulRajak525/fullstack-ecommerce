import React, { useContext } from "react";
import { motion, useAnimate } from "motion/react";
import { FiHeart } from "react-icons/fi";
import { ShopContext } from "../context/ShopContext";

/** Heart toggle that saves a product to, or removes it from, favourites. */
export default function WishlistButton({ id, name, className = "" }) {
  const { wishlist, toggleWishlist } = useContext(ShopContext);
  const saved = wishlist.includes(id);
  // The heart pops when the shopper toggles it, not when favourites load
  const [scope, animate] = useAnimate();
  const onClick = () => {
    toggleWishlist(id);
    animate(
      scope.current,
      { scale: [0.6, 1] },
      { type: "spring", stiffness: 500, damping: 15 },
    );
  };
  const label = saved
    ? `Remove ${name} from favourites`
    : `Save ${name} to favourites`;

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.85 }}
      onClick={onClick}
      aria-label={label}
      aria-pressed={saved}
      title={saved ? "Saved to favourites" : "Save to favourites"}
      className={`flex items-center justify-center rounded-full transition-colors ${
        saved ? "text-accent-500" : "text-ink-900 hover:text-accent-500"
      } ${className}`}
    >
      <span ref={scope} className="flex">
        <FiHeart className={saved ? "fill-current" : ""} />
      </span>
    </motion.button>
  );
}
