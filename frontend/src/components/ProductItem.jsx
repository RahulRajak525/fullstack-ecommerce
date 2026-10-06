import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useSpring } from "motion/react";
import { FiArrowUpRight } from "react-icons/fi";

// Degrees of tilt at the card's edges
const MAX_TILT_X = 12;
const MAX_TILT_Y = 14;
const tiltSpring = { stiffness: 220, damping: 20, mass: 0.6 };

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

  // Tilt toward the pointer, and move the glare to sit under it
  const onPointerMove = (e) => {
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
  };

  // Second image (when the product has one) is revealed on hover
  const primary = image?.[0];
  const secondary = image?.[1];

  // 3D: the card rotates inside a perspective wrapper, and transform-3d is
  // kept on every element down to the tag and chip so their translate-z
  // lifts them off the photo. The photo frame itself clips (overflow-hidden
  // flattens 3D), which is why the tag and chip sit outside it.
  return (
    <div className="group perspective-[750px]">
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        style={tilt ? { rotateX, rotateY } : undefined}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        className="transform-3d"
      >
        <Link to={`/product/${id}`} className="block transform-3d">
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
      </motion.div>
    </div>
  );
}

export default ProductItem;
