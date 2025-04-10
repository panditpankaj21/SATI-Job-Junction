const Notification = require('../models/Notification.js');
const Post = require('../models/post.model.js');
const Comment = require('../models/comment.model.js');

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('post', 'title')
      .populate('comment', 'content')
      .populate('commenter', 'name');

    const unreadCount = await Notification.countDocuments({
      user: req.user._id,
      isRead: false
    });

    res.json({ notifications, unreadCount });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete notification' });
  }
};

const createNotification = async (req, res) => {
  try {
    const { post, comment, type } = req.body;

    // Get the post author
    const postDoc = await Post.findById(post);
    if (!postDoc) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Get the comment
    const commentDoc = await Comment.findById(comment);
    if (!commentDoc) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Create notification for post author
    const notification = new Notification({
      user: postDoc.user,
      post,
      comment,
      commenter: req.user._id,
      type
    });

    console.log(notification);

    await notification.save();

    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create notification' });
  }
}; 

module.exports = { getNotifications, markAsRead, deleteNotification, createNotification };