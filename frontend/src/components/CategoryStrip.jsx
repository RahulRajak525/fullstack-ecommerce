import React from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import Title from "./Title";
import { staggerChild, staggerParent } from "./ui/motionVariants";
import womenImg from "../assets/p_img1.png";
import menImg from "../assets/p_img2_1.png";
import kidsImg from "../assets/p_img3.png";

const categories = [
  {
    name: "Women",
    caption: "Tops, dresses & layers",
    image: womenImg,
  },
  {
    name: "Men",
    caption: "Tees, trousers & knits",
    image: menImg,
  },
  {
    name: "Kids",
    caption: "Play-proof everyday wear",
    image: kidsImg,
  },
];

/**
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
        {categories.map(({ name, caption, image }) => (
          <motion.div key={name} variants={staggerChild}>
            <Link
              to={`/collection?category=${name}`}
              className="group relative block aspect-4/5 overflow-hidden rounded-3xl bg-ink-100 shadow-soft transition-shadow duration-500 hover:shadow-lift"
            >
              <img
                src={image}
                alt={`${name}'s collection`}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-top transition-transform duration-900 ease-out group-hover:scale-110"
              />

              {/* Gradient deepens on hover so the white copy keeps contrast */}
              <div className="absolute inset-0 bg-linear-to-t from-ink-950/80 via-ink-950/15 to-transparent transition-opacity duration-500 group-hover:from-ink-950/90" />

              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-6">
                <div>
                  <p className="prata-regular text-2xl text-white">{name}</p>
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
