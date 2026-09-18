import jwt from "jsonwebtoken";
import { ApiError } from "./errorHandler.js";

const authUser = async (req, res, next) => {
  const token = req.headers.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new ApiError(401, "Not Authorized, Login again");
  }

  // jwt.verify throws on invalid/expired tokens; errorHandler maps those to 401
  const token_decode = jwt.verify(token, process.env.JWT_SECRET);

  // Attach to the request, not req.body - the client controls req.body and
  // a GET request has no body at all.
  req.userId = token_decode.id;
  next();
};

export default authUser;
