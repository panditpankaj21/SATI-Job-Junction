const Post = require('../models/post.model');
const Comment = require('../models/comment.model');

const allPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 4;
        const skip = (page - 1) * limit;
        const searchQuery = req.query.search || '';

        // Build the query object
        const query = {};
        
        if (searchQuery) {
            query.$or = [
                { companyName: { $regex: searchQuery, $options: 'i' } },
                { title: { $regex: searchQuery, $options: 'i' } },
                { content: { $regex: searchQuery, $options: 'i' } }
            ];
        }

        const totalPosts = await Post.countDocuments(query);
        const totalPages = Math.ceil(totalPosts / limit);

        const posts = await Post.find(query)
            .populate('user', '-password')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        // add commentCount to each post
        const plainPosts = await Promise.all(
            posts.map(async (postDoc) => {
                const post = postDoc.toObject(); // convert Mongoose doc to plain object
                const commentCount = await Comment.countDocuments({ post: post._id });
                return {
                    ...post,
                    commentCount,
                };
            })
        );

        res.status(200).json({
            posts: plainPosts,
            message: 'Posts fetched successfully',
            totalPosts,
            currentPage: page,
            totalPages
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ 
            message: 'Internal Server Error', 
            error: error.message 
        });
    }
};

const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('user', '-password');
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const commentCount = await Comment.countDocuments({ post: post._id });

        res.status(200).json({
            ...post.toObject(),
            commentCount
        });
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


/********************* Upvotes *************************** */
const upvotePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;

        // First check if post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const alreadyUpvoted = post.upvotedBy.includes(userId);
        
        if (alreadyUpvoted) {
            // Remove upvote without updating timestamps
            await Post.updateOne(
                { _id: postId },
                { 
                    $inc: { upvotes: -1 },
                    $pull: { upvotedBy: userId }
                },
                { timestamps: false } // This prevents updatedAt change
            );
        } else {
            // Add upvote without updating timestamps
            await Post.updateOne(
                { _id: postId },
                { 
                    $inc: { upvotes: 1 },
                    $push: { upvotedBy: userId }
                },
                { timestamps: false } // This prevents updatedAt change
            );
        }

        // Get the updated post to return
        const updatedPost = await Post.findById(postId);
        res.status(200).json({ message: 'Post upvoted successfully', post: updatedPost });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

// Get upvote status for current user
const getUpvoteStatus = async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      const userId = req.user._id;
  
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      const hasUpvoted = post.upvotedBy.includes(userId);
      res.status(200).json({ hasUpvoted });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    allPosts,
    getPost,
    addPost, 
    updatePost, 
    deletePost,
    upvotePost,
    getUpvoteStatus
};
