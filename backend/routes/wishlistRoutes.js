import express from "express";
import {
  addToWishlist,
  removeFromWishlist,
  syncWishlist,
} from "../controllers/wishlistController.js";
import authUser from "../middleware/auth.js";

const wishlistRouter = express.Router();
wishlistRouter.post("/sync", authUser, syncWishlist);
wishlistRouter.post("/add", authUser, addToWishlist);
wishlistRouter.post("/remove", authUser, removeFromWishlist);

export default wishlistRouter;
