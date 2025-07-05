const {connectRabbit} = require("./connection");
const {videoCreatedQueue,videoDeletedQueue,videoUpdatedQueue} = require("../config/env");

async function publishVideoCreatedEvent(videoData) {
    const ch = await connectRabbit();
    await ch.assertQueue(videoCreatedQueue, { durable: true });
    const payload = JSON.stringify(videoData);
    ch.sendToQueue(videoCreatedQueue, Buffer.from(payload), { persistent: true });
}

async function publishVideoDeletedEvent(videoId) {
    const ch = await connectRabbit();
    await ch.assertQueue(videoDeletedQueue, { durable: true });
    const payload = JSON.stringify({ id: videoId });
    ch.sendToQueue(videoDeletedQueue, Buffer.from(payload), { persistent: true });
}

async function publishVideoUpdatedEvent(videoId, updatedData) {
    const ch = await connectRabbit();
    await ch.assertQueue(videoUpdatedQueue, { durable: true });
    const payload = JSON.stringify({ id: videoId, ...updatedData });
    ch.sendToQueue(videoUpdatedQueue, Buffer.from(payload), { persistent: true });
}

module.exports = {
    publishVideoCreatedEvent,
    publishVideoDeletedEvent,
    publishVideoUpdatedEvent
};
