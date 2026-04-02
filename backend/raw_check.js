const { MongoClient } = require('mongodb');
require('dotenv').config();

async function run() {
  const client = new MongoClient(process.env.MONGO_URI);
  try {
    await client.connect();
    const db = client.db(); // the db name is in the URI
    const feedbackCol = db.collection('feedbacks');
    const allFeedback = await feedbackCol.find({}).toArray();
    console.log('--- DB FEEDBACK CHECK ---');
    console.log('Found:', allFeedback.length);
    allFeedback.forEach(f => {
      console.log(`Msg: ${f.message}, UserID: ${f.user}`);
    });
    console.log('-------------------------');
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
