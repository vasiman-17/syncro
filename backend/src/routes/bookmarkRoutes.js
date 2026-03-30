const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { listBookmarks, addBookmark, removeBookmark } = require("../controllers/bookmarkController");

const router = express.Router();

router.get("/", protect, listBookmarks);
router.post("/", protect, addBookmark);
router.delete("/:id", protect, removeBookmark);

module.exports = router;
