const { MongoClient } = require('mongodb');
require('dotenv').config();

async function migrate() {
  const client = new MongoClient(process.env.MONGO_URI);
  try {
    await client.connect();
    console.log("Connected to MongoDB...");
    const db = client.db();
    const usersCol = db.collection('users');

    const users = await usersCol.find({ username: { $exists: false } }).toArray();
    console.log(`Found ${users.length} users needing usernames.`);

    for (const user of users) {
      let base = (user.email || 'user').split("@")[0].replace(/[^a-z0-9_]/g, "_").toLowerCase();
      let uniqueUsername = base;
      let count = 0;

      while (await usersCol.findOne({ username: uniqueUsername })) {
        count++;
        uniqueUsername = `${base}${count}`;
      }

      await usersCol.updateOne({ _id: user._id }, { $set: { username: uniqueUsername } });
      console.log(`Updated ${user.email} -> @${uniqueUsername}`);
    }

    console.log("Migration complete!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await client.close();
    process.exit(0);
  }
}

migrate();
