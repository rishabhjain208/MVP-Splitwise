const Expense = require("../models/expenseModel");
const User = require("../models/userModel");
const nodemailer = require("nodemailer");

// Get balances with user details and createdBy info
exports.getBalances = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch all expenses involving the user, populating the members field
    const expenses = await Expense.find({ members: userId }).populate(
      "members",
      "email"
      //   "email name"
    );

    const balances = {};
    let createdByDetails = {};

    // Process each expense
    for (const expense of expenses) {
      // Fetch the createdBy user details
      if (!createdByDetails[expense.createdBy.toString()]) {
        const createdByUser = await User.findById(expense.createdBy).select(
          "email balance"
        );
        createdByDetails[expense.createdBy.toString()] = {
          //   name: createdByUser?.name || "Unknown",
          email: createdByUser?.email || "Unknown",
          balance: createdByUser?.balance,
        };
      }

      expense.splitDetails.forEach((split) => {
        const memberId = split.member.toString();

        if (memberId !== userId) {
          // Initialize balance entry if not already present
          if (!balances[memberId]) {
            const member = expense.members.find(
              (m) => m._id.toString() === memberId
            );
            balances[memberId] = {
              //   name: member?.name || "Unknown",
              email: member?.email || "Unknown",
              balance: 0,
            };
          }

          if (expense.createdBy.toString() === userId) {
            // Current user paid the expense
            balances[memberId].balance += split.amountOwed;
          } else if (memberId === userId) {
            // Current user owes the expense
            const creatorId = expense.createdBy.toString();
            if (!balances[creatorId]) {
              balances[creatorId] = {
                // name: createdByDetails[creatorId].name,
                email: createdByDetails[creatorId].email,
                balance: createdByDetails[creatorId].balance,
              };
            }
            balances[creatorId].balance -= split.amountOwed;
          }
        }
      });
    }

    // Format balances as an array for easier consumption
    const formattedBalances = Object.keys(balances).map((key) => ({
      memberId: key,
      //   name: balances[key].name,
      email: balances[key].email,
      balance: balances[key].balance,
    }));

    res.status(200).json({
      success: true,
      createdBy: {
        id: Object.keys(createdByDetails)[0],
        ...Object.values(createdByDetails)[0],
      },
      balances: formattedBalances,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching balances",
      error: error.message,
    });
  }
};

// Send monthly balance report
exports.sendMonthlyReport = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch user details
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Fetch balances
    const expenses = await Expense.find({ members: userId }).populate(
      "members",
      "email"
    );
    const balances = {};

    expenses.forEach((expense) => {
      const amountPerMember = expense.value / expense.members.length;

      expense.members.forEach((member) => {
        if (member._id.toString() !== userId) {
          if (!balances[member.email]) {
            balances[member.email] = 0;
          }

          if (expense.createdBy.toString() === userId) {
            balances[member.email] += amountPerMember;
          } else if (member._id.toString() === userId) {
            balances[expense.createdBy] -= amountPerMember;
          }
        }
      });
    });

    // Send email
    // const transporter = nodemailer.createTransport({
    //   service: "Gmail",
    //   auth: {
    //     user: process.env.EMAIL,
    //     pass: process.env.EMAIL_PASSWORD,
    //   },
    // });

    // const emailBody = `
    //   <h3>Monthly Balance Report</h3>
    //   <p>Hello ${user.email},</p>
    //   <p>Here is your balance report with all users:</p>
    //   <ul>
    //     ${Object.entries(balances)
    //       .map(([email, balance]) => `<li>${email}: ${balance.toFixed(2)}</li>`)
    //       .join("")}
    //   </ul>
    // `;

    // await transporter.sendMail({
    //   from: process.env.EMAIL,
    //   to: user.email,
    //   subject: "Your Monthly Balance Report",
    //   html: emailBody,
    // });

    res.status(200).json({
      success: true,
      message: "Monthly report sent successfully",
      expenses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error sending monthly report",
      error: error.message,
    });
  }
};
