const express = require("express");
const router = express.Router();
const controller = require("../controllers/category.controller");
const auth = require("../middlewares/auth");

router.get("/", auth.verify, controller.getCategory);
router.post("/", auth.verify, controller.postCategory);
router.patch("/:categoryId", auth.verify, controller.patchCategory);
router.delete("/:categoryId", auth.verify, controller.deleteCategory);

module.exports = router;
