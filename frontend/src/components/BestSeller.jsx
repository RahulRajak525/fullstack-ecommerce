import React, { useContext, useMemo } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";
import { ProductGridSkeleton } from "./ui/Skeleton";
import { staggerChild, staggerParent } from "./ui/motionVariants";

function BestSeller() {
  const { products, loadingProducts } = useContext(ShopContext);

  const bestSeller = useMemo(
    () => products.filter((item) => item.bestseller).slice(0, 5),
    [products],
  );

  return (
    <section className="rounded-3xl bg-white px-5 py-16 shadow-soft sm:px-10 sm:py-20">
      <Title
        center
        text1={"Best "}
        text2={"Sellers"}
        subtitle="The pieces our customers keep coming back for."
      />

      <div className="mt-10">
        {loadingProducts ? (
          <ProductGridSkeleton count={5} />
        ) : (
          <motion.div
            variants={staggerParent}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          >
            {bestSeller.map((item) => (
              <motion.div key={item._id} variants={staggerChild}>
                <ProductItem
                  id={item._id}
                  name={item.name}
                  image={item.image}
                  price={item.price}
                  bestseller={item.bestseller}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <div className="mt-12 text-center">
        <Link
          to="/collection"
          className="group inline-flex items-center gap-2 rounded-full border border-ink-300 px-7 py-3 text-sm font-medium text-ink-800 transition-colors hover:border-ink-900 hover:bg-ink-900 hover:text-white"
        >
          View all products
          <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}

export default BestSeller;
