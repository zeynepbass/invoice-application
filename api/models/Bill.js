const mongoose = require("mongoose");

const BillSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true },
    customerPhoneNumber: { type: String, required: true },
    paymentMode: { type: String, required: true },
    cartItems: { type: Array, required: true },
    subTotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("bills", BillSchema);
