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
        // name,
        // email,
        // password,
        // isVerified
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    }
}, {timestamps: true});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;