const multer = require("multer");
const path = require("path");

// Use memory storage so files stay in buffer (works on Render's ephemeral FS)
const storage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
  const allowed = [".pdf", ".doc", ".docx"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, DOC, and DOCX files are allowed"), false);
  }
};

const uploadResume = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = { uploadResume };
