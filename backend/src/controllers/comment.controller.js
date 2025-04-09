const Comment = require('../models/comment.model.js')
const Post =  require('../models/post.model.js')

const createComment = async (req, res) => {
  try {
    const post = await Post.findById(req.body.post);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const comment = new Comment({
      content: req.body.content,
      post: req.body.post,
      user: req.user._id,
      parentComment: req.body.parentComment || null
    });

    await comment.save();

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
    const comment = await Comment.findOne({
      _id: req.params.id,
      $or: [
        { user: req.user._id }, 
        { post: req.user._id } 
      ]
    });

    if (!comment) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const deleteWithReplies = async (commentId) => {
    const replies = await Comment.find({ parentComment: commentId });
      
      for (const reply of replies) {
        await deleteWithReplies(reply._id); 
        await reply.deleteOne();
      }
      
      await Comment.findByIdAndDelete(commentId);
    };

    await deleteWithReplies(req.params.id);

    res.json({ message: 'Comment and all replies deleted successfully' });

  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ error: 'Server error during deletion' });
  }
};

const editComment = async (req, res) => {
  try {
    if (!req.body.content || req.body.content.trim() === '') {
      return res.status(400).json({ error: 'Comment content cannot be empty' });
    }


    const comment = await Comment.findOne({
      _id: req.params.id,
      user: req.user._id 
    });

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found or not authorized' });
    }

    comment.content = req.body.content;
    comment.editedAt = new Date(); 
    await comment.save();

    const updatedComment = await Comment.findById(comment._id)
      .populate('user', 'name email isVerified');

    res.json(updatedComment);
  } catch (error) {
    console.error('Error editing comment:', error);
    res.status(500).json({ error: 'Server error while updating comment' });
  }
}



const getCommentCount = async (req, res) => {
  try {
      const postId = req.params.postId;
      
      if (!mongoose.Types.ObjectId.isValid(postId)) {
          return res.status(400).json({ message: 'Invalid post ID format' });
      }

      const commentCount = await Comment.countDocuments({ post: postId });

      res.status(200).json({ 
          success: true,
          commentCount: commentCount
      });
  } catch (error) {
      console.error('Error getting comment count:', error);
      res.status(500).json({ 
          success: false,
          message: 'Internal server error',
          error: error.message 
      });
  }
};



module.exports = {
    createComment,
    deleteComment,
    getComments,
    editComment,
    getCommentCount
}