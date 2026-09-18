// add product to user cart

import userModel from "../models/userModel.js";
import { ApiError } from "../middleware/errorHandler.js";

const addToCart = async (req, res) => {
  const userId = req.userId;
  const { itemId, size } = req.body;

  if (!itemId || !size) {
    throw new ApiError(400, "itemId and size are required");
  }

  // One atomic round trip instead of read-then-write. $inc also means two
  // concurrent adds can't overwrite each other.
  const result = await userModel.updateOne(
    { _id: userId },
    { $inc: { [`cartData.${itemId}.${size}`]: 1 } },
  );

  if (result.matchedCount === 0) {
    throw new ApiError(404, "User not found");
  }

  res.json({ success: true, message: "Added to cart" });
};

const updateCart = async (req, res) => {
  const userId = req.userId;
  const { itemId, size, quantity } = req.body;

  if (!itemId || !size) {
    throw new ApiError(400, "itemId and size are required");
  }
  if (!Number.isInteger(quantity) || quantity < 0) {
    throw new ApiError(400, "Quantity must be a non-negative whole number");
  }

  // quantity 0 removes the entry instead of leaving a zero hanging around
  const update =
    quantity === 0
      ? { $unset: { [`cartData.${itemId}.${size}`]: "" } }
      : { $set: { [`cartData.${itemId}.${size}`]: quantity } };

  const result = await userModel.updateOne({ _id: userId }, update);

  if (result.matchedCount === 0) {
    throw new ApiError(404, "User not found");
  }

  res.json({ success: true, message: "Cart updated" });
};

const getUserCart = async (req, res) => {
  const userId = req.userId;

  const userData = await userModel
    .findById(userId)
    .select("cartData")
    .lean();

  if (!userData) {
    throw new ApiError(404, "User not found");
  }

  res.json({ success: true, cartData: userData.cartData || {} });
};

export { addToCart, updateCart, getUserCart };
