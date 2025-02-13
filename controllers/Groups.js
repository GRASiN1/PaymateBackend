const Groups = require("../models/Groups");
const User = require("../models/User");
const { v4: uuid } = require("uuid");

async function handleCreateGroup(req, res) {
  try {
    const { groupTitle, groupDescription } = req.body;
    if (!groupTitle || !groupDescription) {
      throw new Error("Details missing");
    }
    const groupLink = uuid();
    const adminId = req.user._id;
    const newGroup = await Groups.create({
      groupTitle,
      groupDescription,
      groupLink,
      groupAdmin: adminId,
      groupMembers: [adminId],
      isOpen: true,
    });
    await newGroup.populate("groupMembers");
    res.status(200).json({
      success: true,
      message: "Group created successfully",
      data: { newGroup },
    });
  } catch (error) {
    console.error("Error creating group:", error.message);
    res.status(200).json({
      success: false,
      error: error.message,
    });
  }
}
async function handleJoinGroup(req, res) {
  try {
    const { groupLink } = req.params;
    if (!groupLink || !req.user._id) {
      throw new Error("Details missing");
    }
    const group = await Groups.findOne({ groupLink: groupLink });
    if (!group) {
      throw new Error("No such group found");
    }
    if (!group.isOpen) {
      throw new Error("Group closed");
    }
    if (group.groupMembers.includes(req.user._id)) {
      throw new Error("You are already a member of this group");
    }
    group.groupMembers.push(req.user._id);
    await group.save();
    await group.populate("groupMembers");
    res.status(200).json({
      success: true,
      message: "Group joined successfully",
      data: { ...group },
    });
  } catch (error) {
    res.status(200).json({ success: false, error: error.message });
  }
}
// async function handleGetGroups(req, res) {
//   try {
//     const userId = req.user._id;
//     const groups = await Groups.find({
//       groupMembers: { $in: [userId] },
//     }).populate("groupMembers");
//     if (groups.length <= 0) throw new Error("No Groups available");
//     return res.status(200).json({
//       success: true,
//       message: "All your groups fetched",
//       data: {
//         groups,
//       },
//     });
//   } catch (error) {
//     return res.status(200).json({
//       success: false,
//       error: error.message,
//     });
//   }
// }
async function handleGetGroups(req, res) {
  try {
    const userId = req.user._id;
    const groups = await Groups.find({
      groupMembers: { $in: [userId] },
    })
      .populate("expenses")
      .populate("groupMembers");
    if (groups.length === 0) throw new Error("No groups available");
    res.status(200).json({
      success: true,
      message: "All your groups fetched",
      data: { groups },
    });
  } catch (error) {
    res.status(200).json({
      success: false,
      error: error.message,
    });
  }
}
async function handleCloseGroup(req, res) {
  try {
    const { groupId } = req.params;
    const group = await Groups.findOne({ _id: groupId });
    if (!group) {
      throw new Error("No such group found");
    }
    if (group.isOpen) {
      group.isOpen = false;
      await group.save();
      await group.populate("groupMembers");
      return res.status(200).json({
        success: true,
        message: "Group closed successfully",
        data: { ...group },
      });
    } else {
      throw new Error("Group already closed");
    }
  } catch (error) {
    return res.status(200).json({ success: false, error: error.message });
  }
}

module.exports = {
  handleCreateGroup,
  handleJoinGroup,
  handleGetGroups,
  handleCloseGroup,
};
