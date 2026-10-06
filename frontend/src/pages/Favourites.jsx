import React, { useContext, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import EmptyState from "../components/ui/EmptyState";
import { ProductGridSkeleton } from "../components/ui/Skeleton";

function Favourites() {
  const { products, wishlist, token, loadingProducts, loadingWishlist } =
    useContext(ShopContext);

  // Newest first, skipping anything no longer in the catalogue
  const items = useMemo(
    () =>
      [...wishlist]
        .reverse()
        .map((id) => products.find((p) => p._id === id))
        .filter(Boolean),
    [wishlist, products],
  );

  const loading = loadingProducts || loadingWishlist;

  return (
    <div className="py-10">
      <Title
        text1={"Your "}
        text2={"Favourites"}
        subtitle="The pieces you've saved for later. Tap the heart again to remove one."
      />

      {loading ? (
        <div className="mt-10">
          <ProductGridSkeleton count={5} />
        </div>
      ) : items.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            icon={<FiHeart />}
            title="No favourites yet"
            description="Tap the heart on any piece to save it here for later."
            actionLabel="Browse the collection"
            actionTo="/collection"
          />
        </div>
      ) : (
        <>
          {!token && (
            <p className="mt-8 rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-500">
              Saved on this device only.{" "}
              <Link
                to="/login"
                className="font-medium text-ink-900 underline underline-offset-2"
              >
                Sign in
              </Link>{" "}
              to keep your favourites on every device.
            </p>
          )}

          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ProductItem
                    id={item._id}
                    name={item.name}
                    price={item.price}
                    image={item.image}
                    bestseller={item.bestseller}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
}

export default Favourites;
