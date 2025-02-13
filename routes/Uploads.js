const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const User = require("../models/User");

const fs = require("fs");
const uploadDir = path.join(__dirname, "../public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer Storage (Local)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // ✅ Save to 'public/uploads/'
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// ✅ Route to Upload Image
router.post("/upload", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  }

  try {
    // 1️⃣ Get current user from DB
    const user = await User.findById(req.user.id); // Assuming `req.user.id` contains the authenticated user's ID
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // 2️⃣ Delete old profile image (if exists)
    if (user.image) {
      // Extract the filename from the stored image URL
      const oldImagePath = path.join(
        __dirname,
        "..",
        "public",
        user.image.replace(`${req.protocol}://${req.get("host")}/`, "")
      );
      console.log("Old image path:", oldImagePath);
      // Check if file exists before deleting
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
        console.log("✅ Old image deleted:", oldImagePath);
      } else {
        console.log("⚠️ Old image not found:", oldImagePath);
      }
    }

    // 3️⃣ Save new image URL to user profile
    const newImageUrl = `https://paymatebackend.onrender.com/uploads/${req.file.filename}`;
    user.image = newImageUrl;
    await user.save();

    res.status(200).json({ success: true, imageUrl: newImageUrl });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
