const Category = require("../models/Category");
const Product = require("../models/Product");
const HttpError = require("../utils/HttpError");
const { requireString } = require("../utils/validators");

const assertTitleAvailable = async (title, ignoreId) => {
  const existing = await Category.findOne({ title }).collation({
    locale: "tr",
    strength: 2,
  });
  if (existing && existing._id.toString() !== ignoreId) {
    throw new HttpError(409, "A category with this title already exists");
  }
};

const getCategories = async (req, res) => {
  const categories = await Category.find().sort({ createdAt: 1 });
  res.json(categories);
};

const createCategory = async (req, res) => {
  const title = requireString(req.body.title, "title", { max: 40 });
  await assertTitleAvailable(title);

  const category = await Category.create({ title });
  res.status(201).json(category);
};

const updateCategory = async (req, res) => {
  const title = requireString(req.body.title, "title", { max: 40 });
  await assertTitleAvailable(title, req.params.id);

  const category = await Category.findById(req.params.id);
  if (!category) {
    throw new HttpError(404, "Category not found");
  }

  const previousTitle = category.title;
  category.title = title;
  await category.save();

  if (previousTitle !== title) {
    await Product.updateMany({ category: previousTitle }, { category: title });
  }

  res.json(category);
};

const deleteCategory = async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    throw new HttpError(404, "Category not found");
  }
  res.status(204).end();
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
