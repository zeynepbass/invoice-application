const Bill = require("../models/Bill");
const Product = require("../models/Product");
const HttpError = require("../utils/HttpError");
const {
  requireString,
  requirePhone,
  requireObjectId,
} = require("../utils/validators");

const TAX_RATE = 8;
const PAYMENT_MODES = ["Nakit", "Kredi Kartı"];
const MAX_LINES = 100;
const MAX_QUANTITY = 999;

const roundMoney = (value) => Math.round(value * 100) / 100;

const parseQuantities = (cartItems) => {
  if (
    !Array.isArray(cartItems) ||
    cartItems.length === 0 ||
    cartItems.length > MAX_LINES
  ) {
    throw new HttpError(400, "cartItems must contain at least one item");
  }

  const quantities = new Map();
  for (const item of cartItems) {
    const id = requireObjectId(item?._id, "cartItems._id");
    const quantity = item.quantity;
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
      throw new HttpError(400, "cartItems.quantity is not valid");
    }
    quantities.set(id, (quantities.get(id) || 0) + quantity);
  }
  return quantities;
};

const getBills = async (req, res) => {
  const bills = await Bill.find().sort({ createdAt: -1 });
  res.json(bills);
};

const createBill = async (req, res) => {
  const customerName = requireString(req.body.customerName, "customerName", {
    min: 2,
    max: 80,
  });
  const customerPhoneNumber = requirePhone(req.body.customerPhoneNumber);
  const { paymentMode } = req.body;
  if (!PAYMENT_MODES.includes(paymentMode)) {
    throw new HttpError(400, "paymentMode is not valid");
  }

  const quantities = parseQuantities(req.body.cartItems);
  const products = await Product.find({ _id: { $in: [...quantities.keys()] } });
  if (products.length !== quantities.size) {
    throw new HttpError(409, "Some products are no longer available");
  }

  const cartItems = products.map((product) => ({
    _id: product._id,
    title: product.title,
    img: product.img,
    category: product.category,
    price: product.price,
    quantity: quantities.get(product._id.toString()),
  }));

  const subTotal = roundMoney(
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  );
  const tax = roundMoney((subTotal * TAX_RATE) / 100);

  const bill = await Bill.create({
    customerName,
    customerPhoneNumber,
    paymentMode,
    cartItems,
    subTotal,
    tax,
    totalAmount: roundMoney(subTotal + tax),
  });

  res.status(201).json(bill);
};

module.exports = { getBills, createBill };
