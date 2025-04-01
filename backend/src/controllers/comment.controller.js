// controllers/comments.js
const Comment = require('../models/comment.model.js')
const Post =  require('../models/post.model.js')

const createComment = async (req, res) => {
  try {
    // Validate post exists
    const post = await Post.findById(req.body.post);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const comment = new Comment({
      content: req.body.content,
      post: req.body.post,
      user: req.user._id,
      parentComment: req.body.parentComment || null
    });

    await comment.save();

    // If reply, add to parent's replies array
    if (req.body.parentComment) {
      await Comment.findByIdAndUpdate(
        req.body.parentComment,
        { $push: { replies: comment._id } }
      );
    }

    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId, parentComment: null })
      .populate('user', 'name email isVerified, avatar')
      .populate({
        path: 'replies',
        populate: {
          path: 'user',
          select: 'name email isVerified avatar',
        },
      })
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteComment = async (req, res) => {
  try {
    // 1. Find the comment and verify permissions
    const comment = await Comment.findOne({
      _id: req.params.id,
      $or: [
        { user: req.user._id }, // Comment owner
        { post: req.user._id }  // Post owner
      ]
    });

    if (!comment) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // 2. Recursively delete all replies
    const deleteWithReplies = async (commentId) => {
      // First find all replies
      const replies = await Comment.find({ parentComment: commentId });
      
      // Delete each reply and their nested replies
      for (const reply of replies) {
        await deleteWithReplies(reply._id); // Recursive call
        await reply.deleteOne();
      }
      
      // Finally delete the parent comment
      await Comment.findByIdAndDelete(commentId);
    };

    // 3. Execute the recursive deletion
    await deleteWithReplies(req.params.id);

    res.json({ message: 'Comment and all replies deleted successfully' });

  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ error: 'Server error during deletion' });
  }
};

const editComment = async (req, res) => {
  try {
    // Validate request data
    if (!req.body.content || req.body.content.trim() === '') {
      return res.status(400).json({ error: 'Comment content cannot be empty' });
    }

    // Find the comment and verify ownership
    const comment = await Comment.findOne({
      _id: req.params.id,
      user: req.user._id // Only comment owner can edit
    });

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found or not authorized' });
    }

    // Update the comment
    comment.content = req.body.content;
    comment.editedAt = new Date(); // Track edit timestamp
    await comment.save();

    // Return the updated comment with populated user data
    const updatedComment = await Comment.findById(comment._id)
      .populate('user', 'name email isVerified');

    res.json(updatedComment);
  } catch (error) {
    console.error('Error editing comment:', error);
    res.status(500).json({ error: 'Server error while updating comment' });
  }
}


module.exports = {
    createComment,
    deleteComment,
    getComments,
    editComment
}