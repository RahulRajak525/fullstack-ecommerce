import React, { useContext, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "motion/react";
import {
  FiCheck,
  FiChevronRight,
  FiRefreshCw,
  FiShield,
  FiShoppingBag,
  FiStar,
  FiTruck,
} from "react-icons/fi";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import Spinner from "../components/ui/Spinner";
import { Skeleton } from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";
import { staggerChild, staggerParent } from "../components/ui/motionVariants";

const ease = [0.22, 1, 0.36, 1];

function ProductSkeleton() {
  return (
    <div className="grid gap-10 py-10 lg:grid-cols-2">
      <div className="flex gap-3">
        <div className="hidden w-20 flex-col gap-3 sm:flex">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="aspect-3/4 flex-1 rounded-3xl" />
      </div>
      <div className="flex flex-col gap-4 pt-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-28" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-12 w-full rounded-full" />
      </div>
    </div>
  );
}

function Product() {
  const { productId } = useParams();
  const { products, loadingProducts } = useContext(ShopContext);

  const productData = useMemo(
    () => products.find((item) => item._id === productId),
    [products, productId],
  );

  if (loadingProducts) return <ProductSkeleton />;

  if (!productData) {
    return (
      <div className="py-20">
        <EmptyState
          icon={<FiShoppingBag />}
          title="Product not found"
          description="This item may have been removed or the link is out of date."
          actionLabel="Back to collection"
          actionTo="/collection"
        />
      </div>
    );
  }

  // The key remounts this on navigation, so the gallery and size selection
  // start fresh without an effect writing state back on every product change.
  return <ProductView key={productData._id} productData={productData} />;
}

function ProductView({ productData }) {
  const { products, currency, addToCart, addingToCart } =
    useContext(ShopContext);

  const [image, setImage] = useState(productData.image[0]);
  const [size, setSize] = useState("");
  const [imgLoaded, setImgLoaded] = useState(false);

  const relatedProducts = useMemo(
    () =>
      products
        .filter(
          (item) =>
            item.category === productData.category &&
            item._id !== productData._id,
        )
        .slice(0, 5),
    [products, productData],
  );

  const isAdding = addingToCart === productData._id;

  return (
    <div className="py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-ink-400">
        <Link to="/" className="transition-colors hover:text-ink-900">
          Home
        </Link>
        <FiChevronRight className="text-[11px]" />
        <Link to="/collection" className="transition-colors hover:text-ink-900">
          Collection
        </Link>
        <FiChevronRight className="text-[11px]" />
        <span className="truncate text-ink-700">{productData.name}</span>
      </nav>

      <div className="grid gap-10 pt-8 lg:grid-cols-2 lg:gap-14">
        {/* Gallery */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          <div className="no-scrollbar flex gap-3 overflow-x-auto sm:w-20 sm:flex-col sm:overflow-visible">
            {productData.image.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  setImage(item);
                  setImgLoaded(false);
                }}
                aria-label={`View image ${index + 1}`}
                className={`relative aspect-square w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all sm:w-full ${
                  image === item
                    ? "border-ink-900"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={item}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>

          <div className="relative flex-1 overflow-hidden rounded-3xl bg-ink-100">
            {!imgLoaded && <div className="skeleton absolute inset-0" />}
            <motion.img
              key={image}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: imgLoaded ? 1 : 0, scale: 1 }}
              transition={{ duration: 0.45, ease }}
              onLoad={() => setImgLoaded(true)}
              src={image}
              alt={productData.name}
              className="aspect-3/4 w-full object-cover"
            />
          </div>
        </div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="lg:sticky lg:top-28 lg:self-start"
        >
          {productData.bestseller && (
            <span className="inline-block rounded-full bg-accent-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent-700">
              Bestseller
            </span>
          )}

          <h1 className="prata-regular mt-3 text-3xl leading-tight text-ink-950 sm:text-4xl">
            {productData.name}
          </h1>

          <div className="mt-3 flex items-center gap-2">
            <div className="flex items-center gap-0.5 text-accent-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <FiStar
                  key={i}
                  className={`text-sm ${i < 4 ? "fill-current" : "text-ink-300"}`}
                />
              ))}
            </div>
            <span className="text-sm text-ink-500">4.0 (122 reviews)</span>
          </div>

          <p className="mt-6 text-4xl font-semibold text-ink-950">
            {currency}
            {productData.price}
          </p>

          <p className="mt-5 max-w-md text-sm leading-relaxed text-ink-500">
            {productData.description}
          </p>

          {/* Size */}
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-ink-900">Select size</p>
              {size && (
                <span className="flex items-center gap-1 text-xs text-ink-500">
                  <FiCheck className="text-green-600" /> {size} selected
                </span>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {productData.sizes.map((item, index) => (
                <motion.button
                  key={index}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setSize(item)}
                  className={`min-w-13 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                    item === size
                      ? "border-ink-900 bg-ink-900 text-white"
                      : "border-ink-200 bg-white text-ink-700 hover:border-ink-900"
                  }`}
                >
                  {item}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Add to cart */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => addToCart(productData._id, size)}
            disabled={isAdding}
            className="mt-8 flex w-full items-center justify-center gap-2.5 rounded-full bg-ink-900 px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-ink-700 disabled:opacity-70 sm:w-auto sm:min-w-65"
          >
            {isAdding ? (
              <>
                <Spinner className="h-4 w-4" light /> Adding...
              </>
            ) : (
              <>
                <FiShoppingBag className="text-base" /> Add to bag
              </>
            )}
          </motion.button>

          {/* Reassurance */}
          <div className="mt-8 grid gap-3 border-t border-ink-200 pt-6 text-sm text-ink-500 sm:grid-cols-3">
            {[
              [FiShield, "100% original"],
              [FiTruck, "Cash on delivery"],
              [FiRefreshCw, "7-day returns"],
            ].map(([Icon, label]) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="shrink-0 text-ink-400" />
                {label}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Related */}
      {relatedProducts.length > 0 && (
        <section className="mt-24">
          <Title center text1={"Related "} text2={"Products"} />
          <div className="mt-10">
            {(
              <motion.div
                variants={staggerParent}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.1 }}
                className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
              >
                {relatedProducts.map((item) => (
                  <motion.div key={item._id} variants={staggerChild}>
                    <ProductItem
                      id={item._id}
                      name={item.name}
                      price={item.price}
                      image={item.image}
                      bestseller={item.bestseller}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

export default Product;
