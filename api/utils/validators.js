const mongoose = require("mongoose");
const HttpError = require("./HttpError");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?\d{10,15}$/;
const IMAGE_PATTERN = /^(https?:\/\/|\/)\S+$/;

const requireString = (value, field, { min = 1, max = 200 } = {}) => {
  if (typeof value !== "string") {
    throw new HttpError(400, `${field} is required`);
  }
  const trimmed = value.trim();
  if (trimmed.length < min || trimmed.length > max) {
    throw new HttpError(
      400,
      `${field} must be between ${min} and ${max} characters`
    );
  }
  return trimmed;
};

const requireEmail = (value) => {
  const email = requireString(value, "email", { max: 254 }).toLowerCase();
  if (!EMAIL_PATTERN.test(email)) {
    throw new HttpError(400, "email is not valid");
  }
  return email;
};

const requirePhone = (value) => {
  const phone = requireString(value, "customerPhoneNumber", { max: 20 }).replace(
    /[\s()-]/g,
    ""
  );
  if (!PHONE_PATTERN.test(phone)) {
    throw new HttpError(400, "customerPhoneNumber is not valid");
  }
  return phone;
};

const requireImage = (value) => {
  const img = requireString(value, "img", { max: 2048 });
  if (!IMAGE_PATTERN.test(img)) {
    throw new HttpError(400, "img must be an http(s) URL or an absolute path");
  }
  return img;
};

const requirePrice = (value) => {
  const price = typeof value === "string" ? Number(value.trim()) : value;
  if (typeof price !== "number" || !Number.isFinite(price) || price < 0) {
    throw new HttpError(400, "price must be a non-negative number");
  }
  return Math.round(price * 100) / 100;
};

const requireObjectId = (value, field = "id") => {
  if (typeof value !== "string" || !mongoose.isValidObjectId(value)) {
    throw new HttpError(400, `${field} is not valid`);
  }
  return value;
};

module.exports = {
  requireString,
  requireEmail,
  requirePhone,
  requireImage,
  requirePrice,
  requireObjectId,
};
