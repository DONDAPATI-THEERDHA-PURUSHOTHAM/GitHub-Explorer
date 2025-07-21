const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  repo: { type: Object, required: true },
  lastSeen: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Bookmark", bookmarkSchema);
