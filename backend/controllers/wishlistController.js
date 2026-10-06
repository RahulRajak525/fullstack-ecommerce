// the user's saved favourites: a list of product ids

import mongoose from "mongoose";
import userModel from "../models/userModel.js";
import { ApiError } from "../middleware/errorHandler.js";

// A guest can bring this many favourites into their account at once
const MAX_SYNC_ITEMS = 200;

const isProductId = (id) =>
  typeof id === "string" && mongoose.Types.ObjectId.isValid(id);

const requireItemId = (itemId) => {
  if (!isProductId(itemId)) {
    throw new ApiError(400, "A valid itemId is required");
  }
};

// Merges any favourites saved while logged out into the account, and returns
// the full list. With an empty itemIds it simply fetches the list.
const syncWishlist = async (req, res) => {
  const userId = req.userId;
  const { itemIds = [] } = req.body;

  if (!Array.isArray(itemIds) || itemIds.length > MAX_SYNC_ITEMS) {
    throw new ApiError(400, `itemIds must be a list of at most ${MAX_SYNC_ITEMS}`);
  }
  if (!itemIds.every(isProductId)) {
    throw new ApiError(400, "itemIds contains an invalid id");
  }

  const userData = await userModel
    .findByIdAndUpdate(
      userId,
      { $addToSet: { wishlist: { $each: itemIds } } },
      { returnDocument: "after", projection: { wishlist: 1 } },
    )
    .lean();

  if (!userData) {
    throw new ApiError(404, "User not found");
  }

  res.json({ success: true, wishlist: userData.wishlist || [] });
};

const addToWishlist = async (req, res) => {
  const { itemId } = req.body;
  requireItemId(itemId);

  // $addToSet makes a repeated add harmless
  const result = await userModel.updateOne(
    { _id: req.userId },
    { $addToSet: { wishlist: itemId } },
  );

  if (result.matchedCount === 0) {
    throw new ApiError(404, "User not found");
  }

  res.json({ success: true, message: "Added to favourites" });
};

const removeFromWishlist = async (req, res) => {
  const { itemId } = req.body;
  requireItemId(itemId);

  const result = await userModel.updateOne(
    { _id: req.userId },
    { $pull: { wishlist: itemId } },
  );

  if (result.matchedCount === 0) {
    throw new ApiError(404, "User not found");
  }

  res.json({ success: true, message: "Removed from favourites" });
};

export { syncWishlist, addToWishlist, removeFromWishlist };
