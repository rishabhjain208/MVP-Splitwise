const express = require("express");
const {
  getBalances,
  sendMonthlyReport,
} = require("../controllers/balanceController");

const router = express.Router();

router.get("/:userId/getbalances", getBalances); // Get balances for a user
router.get("/:userId/monthly", sendMonthlyReport); // Get monthly balance report

module.exports = router;
