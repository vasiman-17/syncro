const mongoose = require("mongoose");
const Feedback = require("./src/models/Feedback");
const User = require("./src/models/User");
require("dotenv").config();

async function checkFeedback() {
  await mongoose.connect(process.env.MONGO_URI);
  const feedbacks = await Feedback.find().populate("user");
  console.log("Feedbacks count:", feedbacks.length);
  feedbacks.forEach(fb => {
    console.log(`- From: ${fb.user?.email}, Msg: ${fb.message}`);
  });
  process.exit(0);
}

checkFeedback().catch(err => {
  console.error(err);
  process.exit(1);
});
