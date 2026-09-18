import React, { useContext, useMemo, useState } from "react";
import { motion } from "motion/react";
import { FiCheck, FiLock, FiTruck } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";
import Title from "../components/Title";
import Spinner from "../components/ui/Spinner";
import EmptyState from "../components/ui/EmptyState";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";

/** Labelled input used across the delivery form. */
function Input({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-ink-500">
        {label}
      </span>
      <input
        {...props}
        className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-ink-900"
      />
    </label>
  );
}

/** Selectable payment tile with an animated radio dot. */
function PaymentOption({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all ${
        active
          ? "border-ink-900 bg-ink-50 ring-1 ring-ink-900"
          : "border-ink-200 bg-white hover:border-ink-400"
      }`}
    >
      <span
        className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border transition-colors ${
          active ? "border-ink-900 bg-ink-900" : "border-ink-300"
        }`}
      >
        {active && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="h-1.5 w-1.5 rounded-full bg-white"
          />
        )}
      </span>
      {children}
    </button>
  );
}

function PlaceOrder() {
  const [method, setMethod] = useState("cod");
  const [submitting, setSubmitting] = useState(false);
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    delivery_fee,
    products,
    currency,
    getCartAmount,
  } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const subtotal = getCartAmount();
  const total = subtotal === 0 ? 0 : subtotal + delivery_fee;

  const itemCount = useMemo(() => {
    let n = 0;
    for (const id in cartItems)
      for (const size in cartItems[id]) n += cartItems[id][size];
    return n;
  }, [cartItems]);

  const formSubmitHandler = async (event) => {
    event.preventDefault();
    if (submitting) return;

    const orderItems = [];
    for (const productId in cartItems) {
      for (const size in cartItems[productId]) {
        if (cartItems[productId][size] > 0) {
          const product = products.find((p) => p._id === productId);
          if (product) {
            const itemInfo = structuredClone(product);
            itemInfo.size = size;
            itemInfo.quantity = cartItems[productId][size];
            orderItems.push(itemInfo);
          }
        }
      }
    }

    if (orderItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setSubmitting(true);
    try {
      const orderData = {
        address: formData,
        items: orderItems,
        amount: total,
      };

      if (method === "cod") {
        const response = await axios.post(
          backendUrl + "/api/order/place",
          orderData,
          { headers: { token } },
        );
        if (response.data.success) {
          setCartItems({});
          toast.success("Order placed");
          navigate("/orders");
        }
      } else if (method === "stripe") {
        const responseStripe = await axios.post(
          backendUrl + "/api/order/stripe",
          orderData,
          { headers: { token } },
        );
        if (responseStripe.data.success) {
          window.location.replace(responseStripe.data.session_url);
          return; // leaving the page, keep the button spinning
        }
      } else {
        // Razorpay is not wired up on the backend yet
        toast.info("Razorpay is not available yet, please pick another method");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (itemCount === 0) {
    return (
      <div className="py-16">
        <EmptyState
          icon={<FiTruck />}
          title="Nothing to check out"
          description="Add something to your bag before placing an order."
          actionLabel="Browse collection"
          actionTo="/collection"
        />
      </div>
    );
  }

  return (
    <form onSubmit={formSubmitHandler} className="py-10">
      <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
        {/* Delivery details */}
        <section>
          <Title
            text1={"Delivery "}
            text2={"Information"}
            subtitle="Where should we send your order?"
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Input
              label="First name"
              required
              onChange={onChangeHandler}
              name="firstName"
              value={formData.firstName}
              type="text"
              autoComplete="given-name"
              placeholder="Jane"
            />
            <Input
              label="Last name"
              required
              onChange={onChangeHandler}
              name="lastName"
              value={formData.lastName}
              type="text"
              autoComplete="family-name"
              placeholder="Doe"
            />
            <div className="sm:col-span-2">
              <Input
                label="Email address"
                required
                onChange={onChangeHandler}
                name="email"
                value={formData.email}
                type="email"
                autoComplete="email"
                placeholder="jane@example.com"
              />
            </div>
            <div className="sm:col-span-2">
              <Input
                label="Street address"
                required
                onChange={onChangeHandler}
                name="street"
                value={formData.street}
                type="text"
                autoComplete="street-address"
                placeholder="12 Market Street"
              />
            </div>
            <Input
              label="City"
              required
              onChange={onChangeHandler}
              name="city"
              value={formData.city}
              type="text"
              autoComplete="address-level2"
              placeholder="Mumbai"
            />
            <Input
              label="State"
              required
              onChange={onChangeHandler}
              name="state"
              value={formData.state}
              type="text"
              autoComplete="address-level1"
              placeholder="Maharashtra"
            />
            <Input
              label="Zip code"
              required
              onChange={onChangeHandler}
              name="zipcode"
              value={formData.zipcode}
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              placeholder="400001"
            />
            <Input
              label="Country"
              required
              onChange={onChangeHandler}
              name="country"
              value={formData.country}
              type="text"
              autoComplete="country-name"
              placeholder="India"
            />
            <div className="sm:col-span-2">
              <Input
                label="Phone"
                required
                onChange={onChangeHandler}
                name="phone"
                value={formData.phone}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+91 98765 43210"
              />
            </div>
          </div>
        </section>

        {/* Summary + payment */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl border border-ink-200 bg-white p-6">
            <h3 className="text-base font-medium text-ink-900">
              Order summary
            </h3>
            <p className="mt-1 text-xs text-ink-500">
              {itemCount} {itemCount === 1 ? "item" : "items"} in your bag
            </p>

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

            <div className="mt-7">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-400">
                Payment method
              </p>
              <div className="flex flex-col gap-2.5">
                <PaymentOption
                  active={method === "cod"}
                  onClick={() => setMethod("cod")}
                >
                  <span className="text-sm font-medium text-ink-800">
                    Cash on delivery
                  </span>
                </PaymentOption>
                <PaymentOption
                  active={method === "stripe"}
                  onClick={() => setMethod("stripe")}
                >
                  <img className="h-5" src={assets.stripe_logo} alt="Stripe" />
                </PaymentOption>
                <PaymentOption
                  active={method === "razorpay"}
                  onClick={() => setMethod("razorpay")}
                >
                  <img
                    className="h-5"
                    src={assets.razorpay_logo}
                    alt="Razorpay"
                  />
                  <span className="ml-auto rounded-full bg-ink-100 px-2 py-0.5 text-[10px] text-ink-500">
                    Soon
                  </span>
                </PaymentOption>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={submitting}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-ink-900 py-4 text-sm font-semibold text-white transition-colors hover:bg-ink-700 disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <Spinner className="h-4 w-4" light /> Placing order...
                </>
              ) : (
                <>
                  <FiCheck className="text-base" /> Place order
                </>
              )}
            </motion.button>

            <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-ink-400">
              <FiLock /> Secure checkout
            </p>
          </div>
        </aside>
      </div>
    </form>
  );
}

export default PlaceOrder;
