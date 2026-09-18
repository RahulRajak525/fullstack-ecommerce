import React, { useCallback, useContext, useEffect, useState } from "react";
import { motion } from "motion/react";
import { FiPackage, FiRefreshCw } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { OrderCardSkeleton } from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";

/** Colour-codes the order status coming back from the admin panel. */
const statusStyles = {
  "Order Placed": "bg-ink-100 text-ink-700",
  Packing: "bg-amber-100 text-amber-800",
  Shipped: "bg-blue-100 text-blue-800",
  "Out for delivery": "bg-indigo-100 text-indigo-800",
  Delivered: "bg-green-100 text-green-800",
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${
        statusStyles[status] || "bg-ink-100 text-ink-700"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

function Orders() {
  const { currency, backendUrl, token } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrderData = useCallback(
    async (isRefresh = false) => {
      if (!token) {
        setLoading(false);
        return;
      }
      isRefresh ? setRefreshing(true) : setLoading(true);
      try {
        const response = await axios.post(
          backendUrl + "/api/order/userorders",
          {},
          { headers: { token } },
        );
        if (response.data.success) {
          // Backend already sorts newest first
          setOrders(response.data.orders);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [backendUrl, token],
  );

  useEffect(() => {
    loadOrderData();
  }, [loadOrderData]);

  return (
    <div className="py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <Title
          text1={"My "}
          text2={"Orders"}
          subtitle="Track everything you have ordered, newest first."
        />
        {orders.length > 0 && (
          <button
            onClick={() => loadOrderData(true)}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-full border border-ink-200 bg-white px-4 py-2.5 text-sm font-medium text-ink-700 transition-colors hover:border-ink-900 disabled:opacity-60"
          >
            <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        )}
      </div>

      <div className="mt-10 flex flex-col gap-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <OrderCardSkeleton key={i} />)
        ) : !token ? (
          <EmptyState
            icon={<FiPackage />}
            title="Sign in to see your orders"
            description="Your order history lives in your account."
            actionLabel="Sign in"
            actionTo="/login"
          />
        ) : orders.length === 0 ? (
          <EmptyState
            icon={<FiPackage />}
            title="No orders yet"
            description="When you place your first order it will appear here."
            actionLabel="Start shopping"
            actionTo="/collection"
          />
        ) : (
          orders.map((order, index) => (
            <motion.article
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                delay: index * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="overflow-hidden rounded-2xl border border-ink-200 bg-white"
            >
              {/* Order header */}
              <header className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-200 bg-ink-50/60 px-5 py-4">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-ink-500">
                  <span>
                    Order{" "}
                    <span className="font-medium text-ink-900">
                      #{order._id.slice(-8).toUpperCase()}
                    </span>
                  </span>
                  <span>{new Date(order.date).toDateString()}</span>
                  <span>
                    {order.paymentMethod}
                    {" · "}
                    <span
                      className={
                        order.payment ? "text-green-700" : "text-amber-700"
                      }
                    >
                      {order.payment ? "Paid" : "Pending"}
                    </span>
                  </span>
                </div>
                <StatusBadge status={order.status} />
              </header>

              {/* Items */}
              <div className="divide-y divide-ink-100">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 px-5 py-4">
                    <div className="h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-ink-100">
                      {item.image?.[0] && (
                        <img
                          src={item.image[0]}
                          alt={item.name}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-sm font-medium text-ink-900">
                        {item.name}
                      </p>
                      <p className="mt-1 text-xs text-ink-500">
                        Size {item.size} &middot; Qty {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium tabular-nums text-ink-900">
                      {currency}
                      {item.price}
                    </p>
                  </div>
                ))}
              </div>

              {/* Total */}
              <footer className="flex items-center justify-between border-t border-ink-200 px-5 py-4">
                <span className="text-sm text-ink-500">Order total</span>
                <span className="text-base font-semibold tabular-nums text-ink-950">
                  {currency}
                  {order.amount}.00
                </span>
              </footer>
            </motion.article>
          ))
        )}
      </div>
    </div>
  );
}

export default Orders;
