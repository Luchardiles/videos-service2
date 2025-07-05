const {connectRabbit} = require("./connection");
const {videoCreatedQueuePlaylists, videoCreatedQueueSocialInteractions, videoDeletedQueues, videoUpdatedQueuePlaylists, exchangeVideoDeleted} = require("../config/env");

async function publishVideoCreatedPlaylist(videoData) {
    const ch = await connectRabbit();
    await ch.assertQueue(videoCreatedQueuePlaylists, { durable: true });
    const payload = JSON.stringify(videoData);
    ch.sendToQueue(videoCreatedQueuePlaylists, Buffer.from(payload), { persistent: true });
}

async function publishVideoCreatedSocialInteractions(videoId, likes) {
    const ch = await connectRabbit();
    await ch.assertQueue(videoCreatedQueueSocialInteractions, { durable: true });
    const payload = JSON.stringify({ id: videoId, likes });
    ch.sendToQueue(videoCreatedQueueSocialInteractions, Buffer.from(payload), { persistent: true });
}

async function publishVideoDeleted(videoId) {
    const ch = await connectRabbit();
    ch.assertExchange(exchangeVideoDeleted, 'fanout', { durable: true });
    videoDeletedQueues.forEach(async (queue) => {
        await ch.assertQueue(queue, { durable: true });
        await ch.bindQueue(queue, exchangeVideoDeleted, '');
    });
    const payload = JSON.stringify({ id: videoId });
    ch.publish(exchangeVideoDeleted, '', Buffer.from(payload), { persistent: true });
}

async function publishVideoUpdatedPlaylist(videoId, updatedData) {
    const ch = await connectRabbit();
    await ch.assertQueue(videoUpdatedQueuePlaylists, { durable: true });
    const payload = JSON.stringify({ id: videoId, ...updatedData });
    ch.sendToQueue(videoUpdatedQueuePlaylists, Buffer.from(payload), { persistent: true });
}

module.exports = {
    publishVideoCreatedPlaylist,
    publishVideoCreatedSocialInteractions,
    publishVideoDeleted,
    publishVideoUpdatedPlaylist
};
