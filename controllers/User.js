const User = require("../models/User");
const { generateToken } = require("../services/authentication");
const bcrypt = require("bcryptjs");

async function handleCreateUser(req, res) {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  try {
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }
    const user = await User.create({
      name,
      email,
      password,
    });
    return res.status(200).json({
      success: true,
      message: "User created successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        gender: user.gender,
        dob: user.dob?.toISOString().split("T")[0],
        number: user.number,
        token: generateToken({
          fullName: user.name,
          email: user.email,
          _id: user._id,
          role: user.role,
        }),
      },
    });
  } catch (error) {
    res.status(200).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}
async function handleLoginUser(req, res) {
  try {
    const { email, password } = req.body;

    // 🔍 Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(200)
        .json({ success: false, message: "User not found" });
    }

    // 🔐 Compare entered password with stored hashed password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res
        .status(200)
        .json({ success: false, message: "Invalid email or password" });
    }

    // 🛡️ Generate authentication token
    const token = generateToken({
      fullName: user.name,
      email: user.email,
      _id: user._id,
      role: user.role,
    });

    // ✅ Send response
    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        gender: user.gender,
        dob: user.dob?.toISOString().split("T")[0],
        number: user.number,
        token: token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(200).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}
async function handleGetUser(req, res) {
  const user = await User.findById({ _id: req.user._id });
  try {
    if (user) {
      res.status(200).json({
        success: true,
        message: "User retrieved successfully",
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          gender: user.gender,
          dob: user.dob?.toISOString().split("T")[0],
          number: user.number,
        },
      });
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(200).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}
async function handleUpdateDetails(req, res) {
  const user = await User.findById({ _id: req.user._id });
  try {
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.image = req.body.image || user.image;
      user.number = req.body.number || user.number;
      user.dob = new Date(req.body.dob) || user.dob;
      user.gender = req.body.gender || user.gender;

      await user.save();
      res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          number: user.number,
          dob: user.dob?.toISOString().split("T")[0],
          gender: user.gender,
        },
      });
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(200).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}
async function handleUpdatePassword(req, res) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(200)
        .json({ success: false, message: "User not found" });
    }

    const { oldpassword, newpassword } = req.body;

    // Compare old password
    const isMatch = await user.matchPassword(oldpassword);
    if (!isMatch) {
      return res
        .status(200)
        .json({ success: false, message: "Invalid old password" });
    }

    // 🔥 Fix: Generate a new salt & hash the password

    user.password = newpassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(200).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

module.exports = {
  handleCreateUser,
  handleLoginUser,
  handleGetUser,
  handleUpdateDetails,
  handleUpdatePassword,
};
