const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const HttpError = require("../utils/HttpError");
const { requireString, requireEmail } = require("../utils/validators");
const { AUTH_COOKIE } = require("../middleware/auth");
const { jwtSecret, isProduction } = require("../config/env");

const SESSION_DAYS = 7;

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax",
  path: "/",
};

const toPublicUser = (user) => ({
  _id: user._id,
  username: user.username,
  email: user.email,
});

const findByEmail = (email) =>
  User.findOne({ email }).collation({ locale: "en", strength: 2 });

const register = async (req, res) => {
  const username = requireString(req.body.username, "username", {
    min: 2,
    max: 50,
  });
  const email = requireEmail(req.body.email);
  const password = requireString(req.body.password, "password", {
    min: 6,
    max: 72,
  });

  if (await findByEmail(email)) {
    throw new HttpError(409, "An account with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hashedPassword });

  res.status(201).json(toPublicUser(user));
};

const login = async (req, res) => {
  const email = requireEmail(req.body.email);
  const password = requireString(req.body.password, "password", { max: 72 });

  const user = await findByEmail(email).select("+password");
  const isValid = user && (await bcrypt.compare(password, user.password));
  if (!isValid) {
    throw new HttpError(401, "Invalid email or password");
  }

  const token = jwt.sign({ sub: user._id.toString() }, jwtSecret, {
    expiresIn: `${SESSION_DAYS}d`,
  });

  res
    .cookie(AUTH_COOKIE, token, {
      ...cookieOptions,
      maxAge: SESSION_DAYS * 24 * 60 * 60 * 1000,
    })
    .json(toPublicUser(user));
};

const logout = (req, res) => {
  res.clearCookie(AUTH_COOKIE, cookieOptions).status(204).end();
};

const me = (req, res) => {
  res.json(toPublicUser(req.user));
};

module.exports = { register, login, logout, me };
