// Small helper so controllers can throw an error with an HTTP status attached.
// Example: throw new ApiError(404, "Product not found");
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Runs when no route matched the request.
const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
};

// Single place where every unhandled error ends up. Express 5 forwards
// rejected promises from async handlers here automatically, so controllers
// no longer need their own try/catch.
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message;

  // Turn common mongoose failures into meaningful responses
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}`;
  } else if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  } else if (err.code === 11000) {
    statusCode = 409;
    message = `${Object.keys(err.keyValue).join(", ")} already exists`;
  } else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token, please login again";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Session expired, please login again";
  }

  console.error(`[${req.method} ${req.originalUrl}]`, err);

  // Never leak internal error text for unexpected failures
  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? "Something went wrong" : message,
  });
};

export { ApiError, notFound, errorHandler };
