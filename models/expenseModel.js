const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    }, // Expense name or description
    amount: {
      type: Number,
      required: true,
    }, // Expense amount
    currency: {
      type: String,
      required: true,
    }, // Currency type, e.g., "INR", "USD"
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ], // Array of user references for members involved in the expense
    date: {
      type: Date,
      default: Date.now,
    }, // Date of the expense
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Reference to the user who created the expense
    splitDetails: [
      {
        member: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        }, // Member involved in the split
        amountOwed: {
          type: Number,
          required: true,
        }, // Amount owed by the member
      },
    ], // Details of how the expense is split among members
  },
  {
    timestamps: true,
  } // Automatically manage createdAt and updatedAt fields
);

module.exports = mongoose.model("Expense", expenseSchema);
