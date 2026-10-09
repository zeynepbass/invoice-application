const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("categories", CategorySchema);
