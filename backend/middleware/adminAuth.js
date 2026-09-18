import jwt from "jsonwebtoken";
import { ApiError } from "./errorHandler.js";

const adminAuth = async (req, res, next) => {
  const token = req.headers.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new ApiError(401, "Not Authorized Login Again");
  }

  const token_decode = jwt.verify(token, process.env.JWT_SECRET);

  if (token_decode.role !== "admin") {
    throw new ApiError(403, "Not Authorized Login Again");
  }

  req.admin = token_decode;
  next();
};

export default adminAuth;
