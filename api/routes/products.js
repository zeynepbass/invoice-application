const router = require("express").Router();
const asyncHandler = require("../utils/asyncHandler");
const validateObjectId = require("../middleware/validateObjectId");
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

router.param("id", validateObjectId);

router.get("/", asyncHandler(getProducts));
router.post("/", asyncHandler(createProduct));
router.put("/:id", asyncHandler(updateProduct));
router.delete("/:id", asyncHandler(deleteProduct));

module.exports = router;
