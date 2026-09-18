import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiInbox, FiMapPin, FiPhone } from "react-icons/fi";
import { backendUrl, currency } from "../config";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { OrderListSkeleton } from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";

const STATUSES = [
  "Order Placed",
  "Packing",
  "Shipped",
  "Out for delivery",
  "Delivered",
];

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  // Order currently being updated, so its select can show it is saving.
  const [savingId, setSavingId] = useState(null);

  const fetchAllOrders = async () => {
    if (!token) return null;

    try {
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { token } },
      );
      if (response.data.success) {
        // Newest first - an operator works the top of the pile.
        setOrders([...response.data.orders].reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const statusHandler = async (e, orderId) => {
    setSavingId(orderId);
    try {
      const response = await axios.post(
        backendUrl + "/api/order/status",
        { orderId, status: e.target.value },
        { headers: { token } },
      );
      if (response.data.success) {
        await fetchAllOrders();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setSavingId(null);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <>
      <div className="mb-6">
        <h1 className="prata-regular text-2xl text-ink-950">Orders</h1>
        <p className="mt-1.5 text-sm text-ink-500">
          {loading
            ? "Loading orders..."
            : `${orders.length} ${orders.length === 1 ? "order" : "orders"}, newest first`}
        </p>
      </div>

      {loading ? (
        <OrderListSkeleton rows={3} />
      ) : orders.length === 0 ? (
        <EmptyState
          icon={<FiInbox />}
          title="No orders yet"
          description="Orders placed on the storefront land here, where you can move them through to delivery."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <div
              key={order._id}
              className="animate-fade-up rounded-2xl border border-ink-200 bg-white p-5 transition-shadow hover:shadow-soft sm:p-6"
            >
              <div className="grid gap-5 lg:grid-cols-[auto_2fr_1fr_auto] lg:items-start">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink-100">
                  <img className="w-5" src={assets.parcel_icon} alt="" />
                </span>

                {/* Items and delivery address */}
                <div className="min-w-0">
                  <ul className="flex flex-col gap-1">
                    {order.items.map((item, idx) => (
                      <li key={`${item._id ?? item.name}-${item.size}-${idx}`} className="text-sm text-ink-700">
                        {item.name}
                        <span className="text-ink-400">
                          {" "}
                          &times; {item.quantity}
                        </span>
                        <span className="ml-2 rounded-md bg-ink-100 px-1.5 py-0.5 text-[11px] font-medium text-ink-600">
                          {item.size}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 border-t border-ink-100 pt-4">
                    <p className="text-sm font-semibold text-ink-900">
                      {order.address.firstName} {order.address.lastName}
                    </p>
                    <p className="mt-1.5 flex items-start gap-2 text-xs leading-relaxed text-ink-500">
                      <FiMapPin className="mt-0.5 shrink-0" />
                      <span>
                        {order.address.street}
                        <br />
                        {order.address.city}, {order.address.state},{" "}
                        {order.address.country} {order.address.zipcode}
                      </span>
                    </p>
                    <p className="mt-1.5 flex items-center gap-2 text-xs text-ink-500">
                      <FiPhone className="shrink-0" />
                      {order.address.phone}
                    </p>
                  </div>
                </div>

                {/* Order meta */}
                <dl className="flex flex-col gap-2 text-xs">
                  <div className="flex justify-between gap-4 lg:block">
                    <dt className="text-ink-400">Items</dt>
                    <dd className="font-medium text-ink-800">
                      {order.items.length}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 lg:block">
                    <dt className="text-ink-400">Method</dt>
                    <dd className="font-medium text-ink-800">
                      {order.paymentMethod}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 lg:block">
                    <dt className="text-ink-400">Payment</dt>
                    <dd>
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          order.payment
                            ? "bg-success-50 text-success-700"
                            : "bg-accent-50 text-accent-700"
                        }`}
                      >
                        {order.payment ? "Paid" : "Pending"}
                      </span>
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 lg:block">
                    <dt className="text-ink-400">Date</dt>
                    <dd className="font-medium text-ink-800">
                      {new Date(order.date).toLocaleDateString()}
                    </dd>
                  </div>
                </dl>

                {/* Total and status */}
                <div className="flex items-center justify-between gap-4 border-t border-ink-100 pt-4 lg:flex-col lg:items-end lg:border-0 lg:pt-0">
                  <p className="text-lg font-semibold tabular-nums text-ink-950">
                    {currency}
                    {order.amount}
                  </p>

                  <div className="flex items-center gap-2">
                    {savingId === order._id && (
                      <span className="text-[11px] text-ink-400">Saving...</span>
                    )}
                    <select
                      onChange={(e) => statusHandler(e, order._id)}
                      value={order.status}
                      disabled={savingId === order._id}
                      aria-label={`Order status for ${order.address.firstName} ${order.address.lastName}`}
                      className="rounded-full border border-ink-200 bg-white px-4 py-2 text-xs font-medium text-ink-800 transition-colors hover:border-ink-400 focus:border-ink-900 focus:outline-none disabled:opacity-60"
                    >
                      {STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Orders;
