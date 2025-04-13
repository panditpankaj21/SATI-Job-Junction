const mongoose = require('mongoose');
const User = require('./user.model');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    companyName: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    upvotes: {
        type: Number,
        default: 0,
    },
    upvotedBy: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: User
    }],
    views: {
        type: Number,
        default: 0,
    }
}, {timestamps: true});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;