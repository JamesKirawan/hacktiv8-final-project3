const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controller");
const user = require("../middlewares/user");
const auth = require("../middlewares/auth");

router.post("/signup", controller.registerUser);
router.post("/login", user.validateLoginBody, controller.loginUser);
router.put("/:userId", auth.verify, controller.putUser);
router.delete("/:userId", auth.verify, controller.deleteUser);
router.patch("/topup", auth.verify, controller.patchUser);

module.exports = router;
