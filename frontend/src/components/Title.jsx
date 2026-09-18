import React from "react";
import { motion } from "motion/react";

/**
 * Section heading. `center` is used by the home-page sections, the default
 * left alignment by list pages like the cart and collection.
 */
function Title({ text1, text2, subtitle, center = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={center ? "text-center" : ""}
    >
      <h2 className="prata-regular text-2xl text-ink-950 sm:text-3xl">
        <span className="text-ink-400">{text1}</span>
        <span>{text2}</span>
      </h2>

      <div
        className={`mt-3 h-px w-14 bg-ink-900 ${center ? "mx-auto" : ""}`}
      />

      {subtitle && (
        <p
          className={`mt-4 text-sm leading-relaxed text-ink-500 ${
            center ? "mx-auto max-w-lg" : "max-w-lg"
          }`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

export default Title;
