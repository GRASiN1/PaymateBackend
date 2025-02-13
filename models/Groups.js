const { Schema, model } = require("mongoose");

const groupSchema = new Schema(
  {
    groupLink: {
      type: String,
      required: true,
      unique: true,
    },
    groupTitle: {
      type: String,
      required: true,
    },
    groupDescription: {
      type: String,
      required: true,
    },
    groupMembers: [
      {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    groupAdmin: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    expenses: [
      {
        type: Schema.Types.ObjectId,
        ref: "expenses",
      },
    ],
    totalExpenses: {
      type: Number,
      default: 0,
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Middleware to update totalExpenses whenever expenses are modified
groupSchema.methods.updateTotalExpenses = async function () {
  await this.populate("expenses");
  this.totalExpenses = this.expenses.reduce(
    (sum, expense) => sum + (expense.amount || 0),
    0
  );
  await this.save();
};

const Groups = model("groups", groupSchema);
module.exports = Groups;
