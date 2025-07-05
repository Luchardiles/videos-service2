const {catchGrpc} = require('../utils/catchGrpc'); 
const AppError = require('../utils/appError');
const Video = require('../models/videoModel');
const { publishVideoCreatedPlaylist, publishVideoCreatedSocialInteractions, publishVideoDeleted, publishVideoUpdatedPlaylist } = require('../rabbitmq/producer');

const UploadVideo = catchGrpc(async (call, callback) => {
    const { title, description, genre, requestorRole } = call.request;
    if (requestorRole !== "Administrador") {
        return callback(new AppError("Permission denied", 403), null);
    }
    if (!title || !description || !genre) {
        return callback(new AppError("Title, description, and genre are required", 400), null);
    }
    const video = await Video.create({
        title,
        description,
        genre
    });
    await publishVideoCreatedPlaylist(video);
    await publishVideoCreatedSocialInteractions(video._id, 0); // Initial likes set to 0
    callback(null, { status: 201, data: video });
});

const GetVideo = catchGrpc(async (call, callback) => {
    const { id } = call.request;
    const video = await Video.findById(id);
    if (!video) {
        return callback(new AppError("Video not found", 404), null);
    }
    callback(null, { 
        status: 200, 
        data: {
            id: video._id,
            title: video.title,
            description: video.description,
            likes: video.likes,
            genre: video.genre,
        }
     });
});

const UpdateVideo = catchGrpc(async (call, callback) => {
    const { id, title, description, genre, likes, requestorRole } = call.request;
    if (requestorRole !== "Administrador") {
        return callback(new AppError("Permission denied", 403), null);
    }
    if (!title || !description || !genre) {
        return callback(new AppError("Title, description, and genre are required", 400), null);
    }
    if (likes) {
        return callback(new AppError("Likes cannot be updated directly", 400), null);
    }
    if (!id) {
        return callback(new AppError("Video ID is required", 400), null);
    }
    const video = await Video.findByIdAndUpdate(id, { title, description, genre }, { new: true });
    if (!video) {
        return callback(new AppError("Video not found", 404), null);
    }
    await publishVideoUpdatedPlaylist(video._id, { title });
    callback(null, {
        status: 200,
        data: video
    });
});

const DeleteVideo = catchGrpc(async (call, callback) => {
    const { id, requestorRole } = call.request;
    if (requestorRole !== "Administrador") {
        return callback(new AppError("Permission denied", 403), null);
    }
    const video = await Video.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true });
    if (!video) {
        return callback(new AppError("Video not found", 404), null);
    }
    await publishVideoDeleted(video._id);
    callback(null, { status: 204 });
});

const ListVideos = catchGrpc(async (call, callback) => {
    const { page = 1, limit = 10, title, genre } = call.request;
    const query = {};
    if (title) {
        query.title = { $regex: title, $options: "i" };
    }
    if (genre) {
        query.genre = { $regex: genre, $options: "i" };
    }
    const videos = await Video.find({ ...query, deletedAt: null })
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });
    if (!videos.length) {
        return callback(new AppError("No videos found", 404), null);
    }
    callback(null, { status: 200, data: videos });
});

module.exports = {
    UploadVideo,
    GetVideo,
    UpdateVideo,
    DeleteVideo,
    ListVideos
};
