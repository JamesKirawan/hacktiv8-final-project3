const express = require("express");
const router = express.Router();
const controller = require("../controllers/product.controller");
const auth = require("../middlewares/auth");

router.get("/", auth.verify, controller.getProduct);
router.post("/", auth.verify, controller.postProduct);
router.put("/:productId", auth.verify, controller.putProduct);
router.patch("/:productId", auth.verify, controller.patchProduct);
router.delete("/:productId", auth.verify, controller.deleteProduct);

module.exports = router;
