const express = require("express");
const router = express.Router();
const {
  handleCreateGroup,
  handleJoinGroup,
  handleGetGroups,
  handleCloseGroup,
} = require("../controllers/Groups");

router.post("/createGroup", handleCreateGroup);
router.post("/joinGroup/:groupLink", handleJoinGroup);
router.get("/getGroups", handleGetGroups);
router.post("/closeGroup/:groupId", handleCloseGroup);

module.exports = router;
