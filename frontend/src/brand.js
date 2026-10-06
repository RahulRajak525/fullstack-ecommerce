/**
 * Everything that names the brand lives here, so a rename is one edit.
 *
 * "Kora" is the Hindi/Urdu word for raw, unbleached cloth - fabric before it
 * meets a dye. The visual identity follows from that: photography laid on
 * woven swatches in the plant dyes the (sample) studio works with.
 */
export const BRAND = {
  name: "Kora",
  tagline: "Undyed. Unhurried.",
  description:
    "Wardrobe staples in raw cotton and plant dyes, cut in small runs and made to be worn long after the season ends.",
  // Reserved example domain: the contact details are sample content
  email: "hello@kora.example",
  phone: "+91 00000 00000",
  address: ["Plot 14, Sanganer", "Jaipur, Rajasthan, India"],
  founded: 2014,
};

/**
 * The dye palette. Separate from the ink/accent tokens on purpose: these are
 * illustrative colours for swatches, not UI colours, and never carry text
 * other than their own labels.
 *
 * `light` marks dyes pale enough to need dark text on top.
 */
export const DYES = {
  kora: { name: "Kora", source: "Undyed cotton", hex: "#e8dfcf", light: true },
  indigo: { name: "Indigo", source: "Indigofera tinctoria", hex: "#27355f" },
  madder: { name: "Madder", source: "Rubia cordifolia", hex: "#a8432e" },
  turmeric: { name: "Turmeric", source: "Curcuma longa", hex: "#d4a03c", light: true },
  kattha: { name: "Kattha", source: "Acacia catechu", hex: "#6e4630" },
  anar: { name: "Pomegranate", source: "Punica granatum rind", hex: "#a69a5b", light: true },
};
