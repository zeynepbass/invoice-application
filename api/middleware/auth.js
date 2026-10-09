const jwt = require("jsonwebtoken");
const User = require("../models/User");
const HttpError = require("../utils/HttpError");
const asyncHandler = require("../utils/asyncHandler");
const { jwtSecret } = require("../config/env");

const AUTH_COOKIE = "token";

const requireAuth = asyncHandler(async (req, res, next) => {
  const token = req.cookies[AUTH_COOKIE];
  if (!token) {
    throw new HttpError(401, "Authentication required");
  }

  let payload;
  try {
    payload = jwt.verify(token, jwtSecret);
  } catch {
    throw new HttpError(401, "Session is invalid or has expired");
  }

  const user = await User.findById(payload.sub);
  if (!user) {
    throw new HttpError(401, "Session is invalid or has expired");
  }

  req.user = user;
  next();
});

module.exports = { requireAuth, AUTH_COOKIE };
