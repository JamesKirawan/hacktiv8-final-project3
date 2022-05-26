const express = require("express");
const router = express.Router();
const controller = require("../controllers/transactionhistory.controller");
const auth = require("../middlewares/auth");

router.post("/", auth.verify, controller.postTransactionHistory);
router.get("/user", auth.verify, controller.getTransactionHistoryUser);
router.get("/admin", auth.verify, controller.getTransactionHistoryAdmin);
router.get("/:transactionId", auth.verify, controller.getTransactionHistory);
module.exports = router;
