const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    img: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("products", ProductSchema);
