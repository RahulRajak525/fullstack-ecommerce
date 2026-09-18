import React, { useContext, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowRight, FiMinus, FiPlus, FiShoppingBag, FiTrash2 } from "react-icons/fi";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import EmptyState from "../components/ui/EmptyState";
import { CartSkeleton } from "../components/ui/Skeleton";

/** Compact -/+ stepper replacing the old free-text number input. */
function QtyStepper({ value, onChange }) {
  return (
    <div className="inline-flex items-center rounded-full border border-ink-200 bg-white">
      <button
        onClick={() => onChange(value - 1)}
        aria-label="Decrease quantity"
        className="flex h-9 w-9 items-center justify-center rounded-full text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-900"
      >
        <FiMinus className="text-sm" />
      </button>
      <span className="w-8 text-center text-sm font-medium tabular-nums">
        {value}
      </span>
      <button
        onClick={() => onChange(value + 1)}
        aria-label="Increase quantity"
        className="flex h-9 w-9 items-center justify-center rounded-full text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-900"
      >
        <FiPlus className="text-sm" />
      </button>
    </div>
  );
}

function Cart() {
  const {
    products,
    currency,
    cartItems,
    updateQuantity,
    getCartAmount,
    delivery_fee,
    token,
    loadingProducts,
    loadingCart,
  } = useContext(ShopContext);
  const navigate = useNavigate();

  // Flatten { productId: { size: qty } } into rows, dropping any product that
  // is no longer in the catalogue (this used to crash on productData.image).
  const cartData = useMemo(() => {
    const rows = [];
    for (const productId in cartItems) {
      for (const size in cartItems[productId]) {
        const quantity = cartItems[productId][size];
        if (quantity > 0) {
          const product = products.find((p) => p._id === productId);
          if (product) rows.push({ _id: productId, size, quantity, product });
        }
      }
    }
    return rows;
  }, [cartItems, products]);

  const loading = loadingProducts || loadingCart;

  const subtotal = getCartAmount();
  const total = subtotal === 0 ? 0 : subtotal + delivery_fee;

  const handleCheckout = () => {
    if (!token) {
      navigate("/login");
      return;
    }
    navigate("/place-order");
  };

  return (
    <div className="py-10">
      <Title text1={"Your "} text2={"Cart"} />

      {loading ? (
        <div className="mt-10">
          <CartSkeleton rows={3} />
        </div>
      ) : cartData.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            icon={<FiShoppingBag />}
            title="Your bag is empty"
            description="Once you add something you like, it will show up here."
            actionLabel="Start shopping"
            actionTo="/collection"
          />
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
          {/* Items */}
          <div className="flex flex-col gap-3">
            <AnimatePresence initial={false}>
              {cartData.map((item) => (
                <motion.div
                  key={`${item._id}-${item.size}`}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -40, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="flex gap-4 rounded-2xl border border-ink-200 bg-white p-4 sm:items-center"
                >
                  <Link
                    to={`/product/${item._id}`}
                    className="shrink-0 overflow-hidden rounded-xl bg-ink-100"
                  >
                    <img
                      className="h-28 w-24 object-cover transition-transform duration-500 hover:scale-105"
                      src={item.product.image[0]}
                      alt={item.product.name}
                      loading="lazy"
                    />
                  </Link>

                  <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <Link
                        to={`/product/${item._id}`}
                        className="line-clamp-1 text-sm font-medium text-ink-900 hover:underline sm:text-base"
                      >
                        {item.product.name}
                      </Link>
                      <div className="mt-1.5 flex items-center gap-3 text-sm text-ink-500">
                        <span className="font-medium text-ink-900">
                          {currency}
                          {item.product.price}
                        </span>
                        <span className="rounded-md bg-ink-100 px-2 py-0.5 text-xs">
                          Size {item.size}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <QtyStepper
                        value={item.quantity}
                        onChange={(q) => updateQuantity(item._id, item.size, q)}
                      />
                      <button
                        onClick={() => updateQuantity(item._id, item.size, 0)}
                        aria-label={`Remove ${item.product.name}`}
                        className="rounded-full p-2.5 text-ink-400 transition-colors hover:bg-accent-50 hover:text-accent-600"
                      >
                        <FiTrash2 className="text-base" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-ink-200 bg-white p-6">
              <h3 className="text-base font-medium text-ink-900">
                Order summary
              </h3>

              <dl className="mt-5 flex flex-col gap-3 text-sm">
                <div className="flex justify-between text-ink-600">
                  <dt>Subtotal</dt>
                  <dd className="tabular-nums">
                    {currency}
                    {subtotal}.00
                  </dd>
                </div>
                <div className="flex justify-between text-ink-600">
                  <dt>Shipping</dt>
                  <dd className="tabular-nums">
                    {currency}
                    {delivery_fee}.00
                  </dd>
                </div>
                <div className="mt-2 flex justify-between border-t border-ink-200 pt-4 text-base font-semibold text-ink-950">
                  <dt>Total</dt>
                  <dd className="tabular-nums">
                    {currency}
                    {total}.00
                  </dd>
                </div>
              </dl>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckout}
                className="group mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-ink-900 py-4 text-sm font-semibold text-white transition-colors hover:bg-ink-700"
              >
                Proceed to checkout
                <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </motion.button>

              <Link
                to="/collection"
                className="mt-3 block text-center text-xs text-ink-500 transition-colors hover:text-ink-900"
              >
                or continue shopping
              </Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default Cart;
