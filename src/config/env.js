require("dotenv").config();

module.exports = {
  port: process.env.PORT || 50055,
  serverUrl: process.env.SERVER_URL || "localhost",
  nodeEnv: process.env.NODE_ENV || "development",
  rabbitmqUrl: process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672",
  videoCreatedQueuePlaylists:
    process.env.VIDEO_CREATED_QUEUE_PLAYLISTS || "video.created.playlists",
  videoCreatedQueueSocialInteractions:
    process.env.VIDEO_CREATED_QUEUE_SOCIAL_INTERACTIONS ||
    "video.created.social.interactions",
  videoUpdatedQueuePlaylists:
    process.env.VIDEO_UPDATED_QUEUE_PLAYLISTS || "video.updated.playlists",
  videoUpdatedQueueSocialInteractions:
    process.env.VIDEO_UPDATED_QUEUE_SOCIAL_INTERACTIONS ||
    "video.updated.social.interactions",
  videoDeletedQueues: [
    process.env.VIDEO_DELETED_QUEUE_PLAYLISTS || "video.deleted.playlists",
    process.env.VIDEO_DELETED_QUEUE_SOCIAL_INTERACTIONS ||
      "video.deleted.social.interactions",
  ],
  exchangeVideoDeleted:
    process.env.EXCHANGE_VIDEO_DELETED || "exchange.video.deleted",
  database: {
    host: process.env.DATABASE_HOST || "localhost",
    port: process.env.DATABASE_PORT || 27018,
    collection: process.env.DATABASE_COLLECTION || "video",
    username: process.env.DATABASE_USERNAME || "root",
    password: process.env.DATABASE_PASSWORD || "rootpassword",
    db: process.env.DATABASE_DB || "videos",
  },
  // new—so mongooseConfig can just grab this
  mongodbUri:
    process.env.MONGODB_URI ||
    // fallback if you hadn’t set MONGODB_URI:
    `mongodb://${encodeURIComponent(
      process.env.DATABASE_USERNAME || "root"
    )}:${encodeURIComponent(process.env.DATABASE_PASSWORD || "rootpassword")}@${
      process.env.DATABASE_HOST || "localhost"
    }:${process.env.DATABASE_PORT || 27018}/${
      process.env.DATABASE_DB || "videos"
    }?authSource=admin`,
};
