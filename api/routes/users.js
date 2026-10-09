const router = require("express").Router();
const asyncHandler = require("../utils/asyncHandler");
const validateObjectId = require("../middleware/validateObjectId");
const { getUsers, getUser } = require("../controllers/userController");

router.param("id", validateObjectId);

router.get("/", asyncHandler(getUsers));
router.get("/:id", asyncHandler(getUser));

module.exports = router;
