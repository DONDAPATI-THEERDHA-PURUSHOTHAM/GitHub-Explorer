// routes/bookmarkRoutes.js

const express = require("express");
const Bookmark = require("../models/Bookmark");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// @route   POST /api/bookmark
// @desc    Add a new bookmark
// @access  Private
router.post("/bookmark", authMiddleware, async (req, res) => {
  try {
    const { repo } = req.body;
    if (!repo) {
      return res.status(400).json({ message: "Repository data is required" });
    }

    const newBookmark = new Bookmark({
      user: req.user.id,
      repo,
      lastSeen: new Date(),
    });

    await newBookmark.save();
    res.status(201).json(newBookmark);
  } catch (error) {
    res.status(500).json({ message: "Error saving bookmark", error: error.message });
  }
});

// @route   GET /api/bookmarks
// @desc    Get all bookmarks for logged-in user sorted by last seen
// @access  Private
router.get("/bookmarks", authMiddleware, async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user.id }).sort({ lastSeen: -1 });
    res.status(200).json(bookmarks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookmarks", error: error.message });
  }
});

// @route   DELETE /api/bookmark/:id
// @desc    Delete a bookmark by ID
// @access  Private
router.delete("/bookmark/:id", authMiddleware, async (req, res) => {
  try {
    const bookmark = await Bookmark.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!bookmark) {
      return res.status(404).json({ message: "Bookmark not found" });
    }

    res.status(200).json({ message: "Bookmark deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting bookmark", error: error.message });
  }
});

module.exports = router;
