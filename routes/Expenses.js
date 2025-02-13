const express = require("express");
const router = express.Router();
const {
  handleAddExpense,
  handlegetAllExpenses,
} = require("../controllers/Expenses");

router.post("/createExpense", handleAddExpense);
router.get("/getExpenses", handlegetAllExpenses);

module.exports = router;
