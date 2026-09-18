import React, { useContext, useMemo } from "react";
import { motion } from "motion/react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";
import { ProductGridSkeleton } from "./ui/Skeleton";
import { staggerChild, staggerParent } from "./ui/motionVariants";

const LatestCollection = () => {
  const { products, loadingProducts } = useContext(ShopContext);

  const latest = useMemo(() => products.slice(0, 10), [products]);

  return (
    <section className="py-16 sm:py-20">
      <Title
        center
        text1={"Latest "}
        text2={"Collection"}
        subtitle="Fresh cuts and seasonal staples, added to the rail this week."
      />

      <div className="mt-10">
        {loadingProducts ? (
          <ProductGridSkeleton count={10} />
        ) : (
          <motion.div
            variants={staggerParent}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          >
            {latest.map((item) => (
              <motion.div key={item._id} variants={staggerChild}>
                <ProductItem
                  id={item._id}
                  image={item.image}
                  name={item.name}
                  price={item.price}
                  bestseller={item.bestseller}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default LatestCollection;
