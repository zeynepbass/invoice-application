const { requireObjectId } = require("../utils/validators");

const validateObjectId = (req, res, next, value) => {
  requireObjectId(value);
  next();
};

module.exports = validateObjectId;
