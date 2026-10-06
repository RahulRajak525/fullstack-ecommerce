import React from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import Title from "./Title";
import { staggerChild, staggerParent } from "./ui/motionVariants";
import { Weave } from "./ui/Swatch";
import { DYES } from "../brand";
import { photoSrcSet, photoUrl } from "../utils/cloudinary";

// Category photos, all from Pexels under the free Pexels License:
// Women @ron-lach (8306365), Men @mahdibafande (7940719), Kids @shvetsa (5325640).

const categories = [
  {
    name: "Women",
    caption: "Tops, dresses & layers",
    dye: DYES.madder,
    photo: "v1791266397/pexels-ron-lach-8306365.jpg",
  },
  {
    name: "Men",
    caption: "Tees, trousers & knits",
    dye: DYES.kattha,
    photo: "v1791266261/pexels-mahdibafande-7940719.jpg",
  },
  {
    name: "Kids",
    caption: "Play-proof everyday wear",
    // Indigo because the photograph is all denim
    dye: DYES.indigo,
    photo: "v1791266107/pexels-shvetsa-5325640.jpg",
  },
];

/**
 * Each edit is shown as a photograph, or as a bolt of its own dye when no
 * `photo` (a Cloudinary path) is given. The dye tag stays either way, so the
 * cards read as one set.
 *
 * Three tall cards linking into the collection with the category preselected
 * (Collection reads the `category` query param).
 */
const CategoryStrip = () => {
  return (
    <section className="py-16 sm:py-20">
      <Title
        center
        text1={"Shop by "}
        text2={"Category"}
        subtitle="Three edits, one wardrobe. Start wherever you are today."
      />

      <motion.div
        variants={staggerParent}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mt-10 grid gap-5 sm:grid-cols-3"
      >
        {categories.map(({ name, caption, dye, photo }) => (
          <motion.div key={name} variants={staggerChild}>
            <Link
              to={`/collection?category=${name}`}
              className="group relative block aspect-4/5 overflow-hidden rounded-3xl bg-ink-100 shadow-soft transition-shadow duration-500 hover:shadow-lift"
            >
              {photo ? (
                <img
                  src={photoUrl(photo, 800)}
                  srcSet={photoSrcSet(photo, [480, 800, 1200])}
                  sizes="(min-width: 640px) 33vw, 100vw"
                  // The link already reads as the category name
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-900 ease-out group-hover:scale-110"
                />
              ) : (
                <Weave
                  dye={dye}
                  aria-hidden="true"
                  className="h-full w-full transition-transform duration-900 ease-out group-hover:scale-110"
                />
              )}

              {/* Dye label, like the tag pinned to a bolt of cloth */}
              <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-700 shadow-soft">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: dye.hex }}
                />
                {dye.name}
              </span>

              {/* Gradient deepens on hover so the white copy keeps contrast */}
              <div className="absolute inset-0 bg-linear-to-t from-ink-950/80 via-ink-950/15 to-transparent transition-opacity duration-500 group-hover:from-ink-950/90" />

              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-6">
                <div>
                  <p className="type-display text-2xl text-white">{name}</p>
                  <p className="mt-1 translate-y-1 text-xs text-white/0 transition-all duration-500 group-hover:translate-y-0 group-hover:text-white/75">
                    {caption}
                  </p>
                </div>

                <span className="flex h-11 w-11 shrink-0 translate-y-2 items-center justify-center rounded-full bg-white text-ink-900 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <FiArrowUpRight className="text-lg" />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default CategoryStrip;
