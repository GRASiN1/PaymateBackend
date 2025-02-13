const { Schema, model } = require("mongoose");

const expenseSchema = new Schema({
  expenseTitle: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    default: 0,
  },
  paidBy: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  expenseOf: {
    type: Schema.Types.ObjectId,
    ref: "groups",
    required: true,
  },
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  ],
  date: {
    type: Date,
    default: Date.now(),
  },
});

expenseSchema.pre(/^find/, function () {
  this.populate("expenseOf");
});

const Expenses = model("expenses", expenseSchema);

module.exports = Expenses;
