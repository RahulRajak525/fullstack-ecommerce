import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { FiArrowUpRight } from "react-icons/fi";

function ProductItem({ id, image, name, price, bestseller }) {
  const { currency } = useContext(ShopContext);
  const [loaded, setLoaded] = useState(false);

  // Second image (when the product has one) is revealed on hover
  const primary = image?.[0];
  const secondary = image?.[1];

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group"
    >
      <Link to={`/product/${id}`} className="block">
        <div className="relative aspect-3/4 overflow-hidden rounded-2xl bg-ink-100">
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

          {bestseller && (
            <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-900 shadow-soft backdrop-blur">
              Bestseller
            </span>
          )}

          {/* Slides up from the bottom edge on hover */}
          <div className="pointer-events-none absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
            <div className="flex items-center justify-between gap-2 rounded-full bg-white/95 px-4 py-2.5 text-xs font-medium text-ink-900 shadow-lift backdrop-blur">
              View product
              <FiArrowUpRight className="text-sm" />
            </div>
          </div>
        </div>

        <div className="mt-3 space-y-1">
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
  );
}

export default ProductItem;
