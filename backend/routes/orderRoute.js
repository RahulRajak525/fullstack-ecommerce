import express from "express";
import adminAuth from "./../middleware/adminAuth.js";
import authUser from "./../middleware/auth.js";
import {
  allOrders,
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  verifyStripe,
  userOrders,
  updateStatus,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

// Admin Features

orderRouter.post("/list", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateStatus);

// Paymnet features

orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/stripe", authUser, placeOrderStripe);
orderRouter.post("/razorpay", authUser, placeOrderRazorpay);
orderRouter.post("/verifyStripe", authUser, verifyStripe);

// User features

orderRouter.post("/userorders", authUser, userOrders);

export default orderRouter;
