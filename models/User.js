const { Schema, model } = require("mongoose");
const { genSalt, hash, compare } = require("bcryptjs");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: "NORMAL",
    },
    image: {
      type: String,
      default: "/images/avatar.png",
    },
    dob: {
      type: Date,
      default: Date.now(),
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "Male",
    },
    number: {
      type: String,
      default: "1234567890",
    },
  },
  {
    timestamps: true,
  }
);

// 🔥 Fix: Compare plain text password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await compare(enteredPassword, this.password);
};

// 🔥 Fix: Remove salt storage and only hash passwords when first created
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await genSalt(5);
  this.password = await hash(this.password, salt);
});

const User = model("users", userSchema);

module.exports = User;
