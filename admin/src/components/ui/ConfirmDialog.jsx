import React, { useEffect, useRef } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import Spinner from "./Spinner";

/**
 * Blocking confirmation for destructive actions. Product removal used to fire
 * on a single click with no way back, which is not something an admin panel
 * should do.
 *
 * Escape closes it, the backdrop closes it, and focus lands on Cancel so a
 * stray Enter does not confirm the delete.
 */
export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  busy = false,
  onConfirm,
  onCancel,
}) {
  const cancelRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    cancelRef.current?.focus();

    const onKeyDown = (e) => {
      if (e.key === "Escape" && !busy) onCancel();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, busy, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <div
        className="animate-fade-in absolute inset-0 bg-ink-950/50 backdrop-blur-sm"
        onClick={() => !busy && onCancel()}
      />

      <div className="animate-pop-in relative w-full max-w-md rounded-2xl bg-white p-6 shadow-lift">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
          <FiAlertTriangle className="text-xl" />
        </span>

        <h2
          id="confirm-title"
          className="mt-4 text-base font-semibold text-ink-900"
        >
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-sm leading-relaxed text-ink-500">
            {description}
          </p>
        )}

        <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-full border border-ink-200 px-5 py-2.5 text-sm font-medium text-ink-700 transition-colors hover:border-ink-400 hover:text-ink-900 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="flex items-center justify-center gap-2 rounded-full bg-accent-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-700 disabled:opacity-70"
          >
            {busy && <Spinner />}
            {busy ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
