import React from "react";
import { motion } from "motion/react";

/**
 * Horizontally scrollable quick filters. Mirrors the checkbox panel rather than
 * replacing it - both drive the same state, this one is just reachable without
 * opening the filter sheet.
 */
const FilterPills = ({ label, options, active, onToggle, onClear }) => {
  const allActive = active.length === 0;

  return (
    <div className="flex items-center gap-3">
      <span className="hidden shrink-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-400 sm:block">
        {label}
      </span>

      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 py-1">
        <motion.button
          type="button"
          onClick={onClear}
          whileTap={{ scale: 0.94 }}
          aria-pressed={allActive}
          className={`shrink-0 rounded-full border px-4 py-2 text-xs font-medium transition-colors duration-300 ${
            allActive
              ? "border-ink-900 bg-ink-900 text-white"
              : "border-ink-200 bg-white text-ink-600 hover:border-ink-400 hover:text-ink-900"
          }`}
        >
          All
        </motion.button>

        {options.map((option) => {
          const isActive = active.includes(option);

          return (
            <motion.button
              key={option}
              type="button"
              onClick={() => onToggle(option)}
              whileTap={{ scale: 0.94 }}
              aria-pressed={isActive}
              className={`shrink-0 rounded-full border px-4 py-2 text-xs font-medium transition-colors duration-300 ${
                isActive
                  ? "border-ink-900 bg-ink-900 text-white"
                  : "border-ink-200 bg-white text-ink-600 hover:border-ink-400 hover:text-ink-900"
              }`}
            >
              {option}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default FilterPills;
