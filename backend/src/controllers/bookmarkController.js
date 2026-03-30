const Bookmark = require("../models/Bookmark");
const asyncHandler = require("../utils/asyncHandler");

const listBookmarks = asyncHandler(async (req, res) => {
  const bookmarks = await Bookmark.find({ user: req.user._id })
    .populate("project", "title description status requiredSkills techStack")
    .sort({ createdAt: -1 });
  res.status(200).json({ success: true, bookmarks });
});

const addBookmark = asyncHandler(async (req, res) => {
  const { projectId } = req.body;
  if (!projectId) {
    res.status(400);
    throw new Error("projectId is required");
  }
  const bookmark = await Bookmark.create({ user: req.user._id, project: projectId });
  res.status(201).json({ success: true, bookmark });
});

const removeBookmark = asyncHandler(async (req, res) => {
  const bookmark = await Bookmark.findById(req.params.id);
  if (!bookmark) {
    res.status(404);
    throw new Error("Bookmark not found");
  }
  if (String(bookmark.user) !== String(req.user._id)) {
    res.status(403);
    throw new Error("Not allowed");
  }
  await bookmark.deleteOne();
  res.status(200).json({ success: true, message: "Bookmark removed" });
});

module.exports = { listBookmarks, addBookmark, removeBookmark };
