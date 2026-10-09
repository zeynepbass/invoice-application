const HttpError = require("../utils/HttpError");

const notFound = (req, res, next) => {
  next(new HttpError(404, "Resource not found"));
};

const resolveError = (err) => {
  if (err instanceof HttpError) {
    return { status: err.status, message: err.message };
  }
  if (err.type === "entity.parse.failed") {
    return { status: 400, message: "Request body is not valid JSON" };
  }
  if (err.type === "entity.too.large") {
    return { status: 413, message: "Request body is too large" };
  }
  if (err.name === "ValidationError" || err.name === "CastError") {
    return { status: 400, message: "Request data is not valid" };
  }
  if (err.code === 11000) {
    return { status: 409, message: "Resource already exists" };
  }
  return { status: 500, message: "Internal server error" };
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const { status, message } = resolveError(err);
  if (status >= 500) {
    console.error(err);
  }
  res.status(status).json({ message });
};

module.exports = { notFound, errorHandler };
