const express = require("express");
const {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseController");

const router = express.Router();

router.post("/", addExpense); // Add an expense
router.get("/:userId", getExpenses); // Get all expenses for a user
router.put("/update/:id", updateExpense); // Update an expense
router.delete("/delete/:id", deleteExpense); // Delete an expense

module.exports = router;
