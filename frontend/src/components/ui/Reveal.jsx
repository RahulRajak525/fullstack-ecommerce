import React from "react";
import { motion } from "motion/react";

/**
 * Fades + lifts its children the first time they scroll into view.
 * `delay` staggers siblings; `once` keeps it from replaying on scroll-back.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 24,
  className = "",
  once = true,
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.15 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
