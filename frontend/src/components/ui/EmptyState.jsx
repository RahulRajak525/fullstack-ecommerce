import React from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

/** Friendly placeholder for "no results" / "empty cart" style screens. */
export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-ink-200 bg-white/60 px-6 py-20 text-center"
    >
      {icon && (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ink-100 text-2xl text-ink-500">
          {icon}
        </div>
      )}
      <div className="space-y-1.5">
        <h3 className="text-lg font-medium text-ink-900">{title}</h3>
        {description && (
          <p className="max-w-sm text-sm text-ink-500">{description}</p>
        )}
      </div>
      {actionLabel &&
        (actionTo ? (
          <Link
            to={actionTo}
            className="mt-2 rounded-full bg-ink-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ink-700"
          >
            {actionLabel}
          </Link>
        ) : (
          <button
            onClick={onAction}
            className="mt-2 rounded-full bg-ink-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ink-700"
          >
            {actionLabel}
          </button>
        ))}
    </motion.div>
  );
}
