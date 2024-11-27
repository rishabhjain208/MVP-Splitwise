const Expense = require("../models/expenseModel");
const User = require("../models/userModel");

exports.addExpense = async (req, res) => {
  try {
    const { name, amount, currency, members, date, createdBy } = req.body;

    // Validate input
    if (!name || !amount || !currency || !members) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Resolve member names to user IDs
    const memberIds = [];
    for (const memberName of members) {
      const user = await User.findOne({ email: memberName });
      if (!user) {
        return res.status(404).json({
          message: `User with email "${memberName}" not found`,
        });
      }
      memberIds.push(user._id);
    }

    // Calculate split amounts
    const splitamount = amount / memberIds.length;
    const splitDetails = memberIds.map((memberId) => ({
      member: memberId,
      amountOwed: splitamount,
    }));

    // Create expense
    const expense = await Expense.create({
      name,
      amount,
      currency,
      members: memberIds,
      date,
      createdBy,
      splitDetails,
    });

    res.status(201).json({
      success: true,
      message: "Expense added successfully",
      expense,
    });
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).json({
      success: false,
      message: "Error adding expense",
      error: error.message,
    });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const { userId } = req.params;
    const expenses = await Expense.find({ members: userId })
      .populate("members", "email currency")
      .populate("createdBy", "email");

    if (!expenses || expenses.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No expenses found for the user" });
    }

    res.status(200).json({ success: true, expenses });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching expenses",
      error: error.message,
    });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedExpense = await Expense.findByIdAndUpdate(id, req.body, {
      new: true,
    })
      .populate("members", "email currency")
      .populate("createdBy", "email");

    if (!updatedExpense) {
      return res
        .status(404)
        .json({ success: false, message: "Expense not found" });
    }

    res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      updatedExpense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating expense",
      error: error.message,
    });
  }
};
exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedExpense = await Expense.findByIdAndDelete(id);

    if (!deletedExpense) {
      return res
        .status(404)
        .json({ success: false, message: "Expense not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting expense",
      error: error.message,
    });
  }
};
