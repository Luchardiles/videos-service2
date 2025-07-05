const { connectMongo, closeMongo } = require("./mongooseConfig");
const Video = require("../models/videoModel");
const fs = require("fs");
const path = require("path");

async function seed() {
  try {
    console.log("🔄 Starting database seeding...");

    const videosPath = path.resolve(__dirname, "../../mock/videos.json");
    const videosData = JSON.parse(fs.readFileSync(videosPath, "utf-8"));

    await connectMongo();
    await Video.deleteMany({});

    console.log(`🛠 Seeding ${videosData.length} videos...`);

    const videos = videosData.map((video) => ({
      _id: video.id,
      title: video.title,
      description: video.description,
      likes: video.likes,
      genre: video.genre,
    }));

    await Video.insertMany(videos);
    console.log("✅ Database seeding completed successfully.");
  } catch (err) {
    console.error("❌ Error during seeding:", error);
  } finally {
    await closeMongo();
  }
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    console.log("MongoDB connection closed.");
    process.exit(0);
  });
