const Expenses = require("../models/Expenses");
const Groups = require("../models/Groups");

async function handleAddExpense(req, res) {
  try {
    const { expense, groupId } = req.body;
    const { expenseTitle, amount, paidBy, participants } = expense;
    const newExpense = new Expenses({
      expenseTitle,
      amount,
      paidBy,
      expenseOf: groupId,
      participants,
      date: Date.now(),
    });
    const group = await Groups.findById(groupId);
    if (!group) throw new Error("Group not found");
    const savedExpense = await newExpense.save();
    group.expenses.push(savedExpense._id);
    await group.save();
    await group.updateTotalExpenses();
    res.status(201).json({
      success: true,
      message: "Expense Logged",
      data: {
        savedExpense,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
async function handlegetAllExpenses(req, res) {
  try {
    const userId = req.user._id;
    const userGroups = await Groups.find({ groupMembers: userId }).select(
      "_id"
    );
    if (!userGroups.length) {
      throw new Error("User is not part of any group.");
    }
    const groupIds = userGroups.map((group) => group._id);
    const allExpenses = await Expenses.find({ expenseOf: { $in: groupIds } })
      .populate("paidBy")
      .populate("participants");
    if (allExpenses.length <= 0) throw new Error("No expenses");
    return res.status(200).json({
      success: true,
      message: "Fetch all the expense of all the groups user is member of",
      data: {
        allExpenses,
      },
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      error: error.message,
    });
  }
}
module.exports = {
  handleAddExpense,
  handlegetAllExpenses,
};
