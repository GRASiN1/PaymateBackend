const express = require("express");
const router = express.Router();
const User = require("../models/User");
const {
  handleCreateUser,
  handleLoginUser,
  handleGetUser,
  handleUpdateDetails,
  handleUpdatePassword,
} = require("../controllers/User");
const { authenticateUser } = require("../middleware/Authentication");

router.post("/signup", handleCreateUser);
router.post("/login", handleLoginUser);
router.get("/user", authenticateUser, handleGetUser);
router.put("/updateUser", authenticateUser, handleUpdateDetails);
router.put("/resetPassword", authenticateUser, handleUpdatePassword);

module.exports = router;
