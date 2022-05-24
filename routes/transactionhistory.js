const express = require("express");
const router = express.Router();
const controller = require("../controllers/transactionhistory.controller");
const auth = require("../middlewares/auth");

router.get("/", auth.verify, controller.getTransactionHistory);
router.post("/", auth.verify, controller.postTransactionHistory);
router.patch("/:transactionhistoryId", auth.verify, controller.patchTransactionHistory);
router.delete("/:transactionhistoryId", auth.verify, controller.deleteTransactionHistory);

module.exports = router;
