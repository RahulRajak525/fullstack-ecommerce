// Shared motion variants. Kept out of Reveal.jsx so that file only exports a
// component, which is what React Fast Refresh needs.

/** Parent that staggers each direct <motion.*> child. */
export const staggerParent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

export const staggerChild = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};
