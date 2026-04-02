const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

async function checkFeedback() {
  await mongoose.connect(process.env.MONGO_URI);
  
  // Directly define the schema to avoid path/require issues in a script
  const Feedback = mongoose.models.Feedback || mongoose.model("Feedback", new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    message: String,
  }, { timestamps: true }));
  
  const feedbacks = await Feedback.find().populate("user");
  console.log("-------------------");
  console.log("Feedbacks count:", feedbacks.length);
  feedbacks.forEach(fb => {
    console.log(`- From: ${fb.user?.email || "Unknown"}, Msg: ${fb.message}`);
  });
  console.log("-------------------");
  process.exit(0);
}

checkFeedback().catch(err => {
  console.error("ERROR:", err);
  process.exit(1);
});
