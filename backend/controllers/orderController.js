import orderModel from "../models/orderModal.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import { ApiError } from "../middleware/errorHandler.js";

//Global variables
const currency = "usd";
const deliveryCharge = 5;

// Gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Shared validation for the checkout payload
const validateOrderInput = ({ items, amount, address }) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, "Your cart is empty");
  }
  if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
    throw new ApiError(400, "Invalid order amount");
  }
  if (!address || typeof address !== "object") {
    throw new ApiError(400, "Delivery address is required");
  }
};

// Placing order using COD Method
const placeOrder = async (req, res) => {
  const userId = req.userId;
  const { items, amount, address } = req.body;

  validateOrderInput({ items, amount, address });

  const newOrder = new orderModel({
    userId,
    items,
    amount,
    address,
    paymentMethod: "COD",
    payment: false,
    date: Date.now(),
  });

  await newOrder.save();
  await userModel.findByIdAndUpdate(userId, { cartData: {} });
  res.status(201).json({ success: true, message: "Order Placed" });
};

// placing orders using Stripe method

const placeOrderStripe = async (req, res) => {
  const userId = req.userId;
  const { items, amount, address } = req.body;
  const { origin } = req.headers;

  validateOrderInput({ items, amount, address });

  // Declared outside the try so the catch block can actually see it - it used
  // to be a const inside try, which made the cleanup throw a ReferenceError.
  let newOrder;

  try {
    newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
    });
    await newOrder.save();

    const line_items = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));
    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: deliveryCharge * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    // Don't leave an orphaned unpaid order behind if Stripe rejected us
    if (newOrder?._id) {
      await orderModel.findByIdAndDelete(newOrder._id).catch(() => {});
    }
    throw error;
  }
};

// verify Stripe payment
const verifyStripe = async (req, res) => {
  const userId = req.userId;
  const { orderId, success } = req.body;

  if (!orderId) {
    throw new ApiError(400, "Order id is required");
  }

  if (success === "true") {
    // Scoped by userId so one account can't touch another account's orders
    const updated = await orderModel.findOneAndUpdate(
      { _id: orderId, userId },
      { payment: true },
    );
    if (!updated) {
      throw new ApiError(404, "Order not found");
    }
    await userModel.findByIdAndUpdate(userId, { cartData: {} });
    res.json({ success: true, message: "Payment verified" });
  } else {
    await orderModel.findOneAndDelete({ _id: orderId, userId });
    throw new ApiError(402, "Payment failed");
  }
};

//Placing orders using razorpay method

const placeOrderRazorpay = async (req, res) => {
  // Not implemented yet - respond instead of leaving the request hanging
  // until the client times out.
  throw new ApiError(501, "Razorpay payments are not available yet");
};

// All Orders data for Admin Panel
const allOrders = async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 0, 200);
  const page = Math.max(Number(req.query.page) || 1, 1);

  const query = orderModel.find({}).sort({ date: -1 }).lean();
  if (limit) {
    query.skip((page - 1) * limit).limit(limit);
  }

  const orders = await query;
  res.json({ success: true, orders });
};

// User order data for frontend
const userOrders = async (req, res) => {
  const userId = req.userId;
  const orders = await orderModel.find({ userId }).sort({ date: -1 }).lean();
  res.json({ success: true, orders });
};

// update order status from admin panel

const updateStatus = async (req, res) => {
  const { orderId, status } = req.body;

  if (!orderId || !status) {
    throw new ApiError(400, "Order id and status are required");
  }

  const updated = await orderModel.findByIdAndUpdate(orderId, { status });
  if (!updated) {
    throw new ApiError(404, "Order not found");
  }

  res.json({ success: true, message: "Status updated" });
};

export {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  verifyStripe,
  allOrders,
  userOrders,
  updateStatus,
};
