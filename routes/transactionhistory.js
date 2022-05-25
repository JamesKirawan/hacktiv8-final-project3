const express = require("express");
const router = express.Router();
const controller = require("../controllers/transactionhistory.controller");
const auth = require("../middlewares/auth");

router.get("/user", auth.verify, controller.getTransactionHistoryUser);
router.get("/admin", auth.verify, controller.getTransactionHistoryAdmin);
router.get("/:transactionhistoryId", auth.verify, controller.getTransactionHistoryId);
router.post("/", auth.verify, controller.postTransactionHistory);

module.exports = router;
