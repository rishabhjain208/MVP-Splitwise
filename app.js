const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const balanceRoutes = require("./routes/balanceRoutes");

const app = express();

app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/balances", balanceRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to Splitwise MVP!");
});

module.exports = app;
