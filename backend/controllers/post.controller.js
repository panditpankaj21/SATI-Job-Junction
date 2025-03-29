const Post = require('../models/post.model');

const allPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 4;
        const skip = (page - 1) * limit;

        const totalPosts = await Post.countDocuments();
        const totalPages = Math.ceil(totalPosts / limit);

        const posts = await Post.find()
            .populate('user', '-password')
            .skip(skip)
            .limit(limit)
            .sort({ updatedAt: -1 });

        res.status(200).json({
            posts,
            totalPosts,
            currentPage: page,
            totalPages
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('user', '-password');
        if (!post) return res.status(404).json({ message: 'Post not found' });

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

const addPost = async (req, res) => {
    try {
        const user = req.user;
        const { title, companyName, content} = req.body;
        if (!title || !companyName || !content || !user) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newPost = new Post({ title, companyName, content, user });
        await newPost.save();

        res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

const updatePost = async (req, res) => {
    try {
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updatedPost) return res.status(404).json({ message: 'Post not found' });

        res.status(200).json({ message: 'Post updated successfully', post: updatedPost });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

const deletePost = async (req, res) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.id);
        if (!deletedPost) return res.status(404).json({ message: 'Post not found' });

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

module.exports = { 
    allPosts,
    getPost,
    addPost, 
    updatePost, 
    deletePost 
};
