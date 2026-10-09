const router = require("express").Router();
const asyncHandler = require("../utils/asyncHandler");
const validateObjectId = require("../middleware/validateObjectId");
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

router.param("id", validateObjectId);

router.get("/", asyncHandler(getCategories));
router.post("/", asyncHandler(createCategory));
router.put("/:id", asyncHandler(updateCategory));
router.delete("/:id", asyncHandler(deleteCategory));

module.exports = router;
