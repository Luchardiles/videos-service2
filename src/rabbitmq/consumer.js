const {connectRabbit} = require("./connection");
const Video = require("../models/videoModel");
const { videoUpdatedQueueSocialInteractions } = require("../config/env");
const { connectMongo, closeMongo } = require("../database/mongooseConfig");

async function consumeVideoEvents() {
    const ch = await connectRabbit();
    await ch.assertQueue(videoUpdatedQueueSocialInteractions, { durable: true });
    ch.consume(videoUpdatedQueueSocialInteractions, async (msg) => {
        const {videoId, likes} = msg.content.toString();
        await connectMongo();
        await Video.findByIdAndUpdate(videoId, { likes }, { new: true });
        await closeMongo();
        ch.ack(msg);
    });

}
module.exports = {
    consumeVideoEvents
};
