const {connectRabbit} = require("./connection");
const Video = require("../models/videoModel");
const { videoUpdatedQueueSocialInteractions } = require("../config/env");

async function consumeVideoEvents() {
    const ch = await connectRabbit();
    await ch.assertQueue(videoUpdatedQueueSocialInteractions, { durable: true });
    ch.consume(videoUpdatedQueueSocialInteractions, async (msg) => {
        const {videoId, likes} = msg.content.toString();
        await Video.findByIdAndUpdate(videoId, { likes }, { new: true });
        ch.ack(msg);
    });

}
module.exports = {
    consumeVideoEvents
};
