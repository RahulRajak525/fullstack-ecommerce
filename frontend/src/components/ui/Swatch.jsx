import React from "react";

/**
 * A piece of dyed cloth: a flat dye colour with the `weave` texture over it.
 * Used for the backgrounds and panels the photography sits on, and as the
 * fallback when a category has no photo, so they share one dye palette.
 */
export function Weave({ dye, className = "", style, children, ...rest }) {
  return (
    <div
      className={`weave ${className}`}
      style={{ backgroundColor: dye.hex, ...style }}
      {...rest}
    >
      {children}
    </div>
  );
}
