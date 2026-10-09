const router = require("express").Router();
const asyncHandler = require("../utils/asyncHandler");
const { getBills, createBill } = require("../controllers/billController");

router.get("/", asyncHandler(getBills));
router.post("/", asyncHandler(createBill));

module.exports = router;
