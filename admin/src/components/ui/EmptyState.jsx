import React from "react";

/**
 * Shown when a list has loaded and genuinely has nothing in it - distinct from
 * the skeleton, which means "still loading".
 */
export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="animate-fade-up flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-300 bg-white px-6 py-16 text-center">
      {icon && (
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-100 text-2xl text-ink-500">
          {icon}
        </span>
      )}
      <p className="mt-5 text-base font-semibold text-ink-900">{title}</p>
      {description && (
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-500">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
