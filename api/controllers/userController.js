const User = require("../models/User");
const HttpError = require("../utils/HttpError");

const PUBLIC_FIELDS = "username email createdAt";

const getUsers = async (req, res) => {
  const users = await User.find().select(PUBLIC_FIELDS).sort({ createdAt: 1 });
  res.json(users);
};

const getUser = async (req, res) => {
  const user = await User.findById(req.params.id).select(PUBLIC_FIELDS);
  if (!user) {
    throw new HttpError(404, "User not found");
  }
  res.json(user);
};

module.exports = { getUsers, getUser };
