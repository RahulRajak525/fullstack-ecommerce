import React, { useContext, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";

function Verify() {
  const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext);
  const [searchParams] = useSearchParams();
  const verified = useRef(false);

  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (!token || verified.current) return;
    // Guard against React's double-invoked effects firing this twice
    verified.current = true;

    const verifyPayment = async () => {
      try {
        const response = await axios.post(
          backendUrl + "/api/order/verifyStripe",
          { success, orderId },
          { headers: { token } },
        );
        if (response.data.success) {
          setCartItems({});
          toast.success("Payment confirmed");
          navigate("/orders");
        } else {
          navigate("/cart");
        }
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || error.message);
        // A failed or cancelled payment now comes back as an error status, so
        // send the user back to the cart instead of leaving them on the spinner.
        navigate("/cart");
      }
    };

    verifyPayment();
  }, [token, success, orderId, backendUrl, navigate, setCartItems]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6">
      <div className="relative flex h-20 w-20 items-center justify-center">
        <motion.span
          animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-ink-900/10"
        />
        <span className="h-16 w-16 animate-spin rounded-full border-2 border-ink-200 border-t-ink-900" />
      </div>

      <div className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="prata-regular text-2xl text-ink-950"
        >
          Confirming your payment
        </motion.h1>
        <p className="mt-2 text-sm text-ink-500">
          Please keep this tab open, it only takes a moment.
        </p>
      </div>
    </div>
  );
}

export default Verify;
