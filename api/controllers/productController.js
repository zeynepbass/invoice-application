const Product = require("../models/Product");
const Category = require("../models/Category");
const HttpError = require("../utils/HttpError");
const {
  requireString,
  requireImage,
  requirePrice,
} = require("../utils/validators");

const parseProduct = async (body) => {
  const product = {
    title: requireString(body.title, "title", { max: 80 }),
    img: requireImage(body.img),
    price: requirePrice(body.price),
    category: requireString(body.category, "category", { max: 40 }),
  };

  if (!(await Category.exists({ title: product.category }))) {
    throw new HttpError(400, "category does not exist");
  }

  return product;
};

const getProducts = async (req, res) => {
  const products = await Product.find().sort({ createdAt: 1 });
  res.json(products);
};

const createProduct = async (req, res) => {
  const product = await Product.create(await parseProduct(req.body));
  res.status(201).json(product);
};

const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    await parseProduct(req.body),
    { new: true, runValidators: true }
  );
  if (!product) {
    throw new HttpError(404, "Product not found");
  }
  res.json(product);
};

const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    throw new HttpError(404, "Product not found");
  }
  res.status(204).end();
};

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };
