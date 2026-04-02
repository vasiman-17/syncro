const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./src/models/User");

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for migration...");

    const users = await User.find({ username: { $exists: false } });
    console.log(`Found ${users.length} users needing usernames.`);

    for (const user of users) {
      let base = user.email.split("@")[0].replace(/[^a-z0-9_]/g, "_").toLowerCase();
      let uniqueUsername = base;
      let count = 0;

      while (await User.findOne({ username: uniqueUsername })) {
        count++;
        uniqueUsername = `${base}${count}`;
      }

      user.username = uniqueUsername;
      await user.save();
      console.log(`Updated ${user.email} -> @${uniqueUsername}`);
    }

    console.log("Migration complete!");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

migrate();
