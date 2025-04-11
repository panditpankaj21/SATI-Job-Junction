import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  MdVerified, 
  MdReply, 
  MdDelete,
  MdEdit,
  MdClose,
  MdExpandMore,
  MdExpandLess
} from 'react-icons/md';
import Avatar from './Avatar';
import { timeAgo } from '../utils/timeAgo';

const CommentSection = ({ postId, postAuthorId }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedReplies, setExpandedReplies] = useState({});
  const commentEndRef = useRef(null);

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/v1/users/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setCurrentUser(res.data.user);
      } catch (err) {
        console.error('Failed to fetch user:', err);
      }
    };
    fetchCurrentUser();
  }, []);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/api/v1/comments/post/${postId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        setComments(res.data);
      } catch (err) {
        setError('Failed to load comments');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [postId]);

  // Scroll to bottom when comments update
  useEffect(() => {
    commentEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  // Submit new comment or reply
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      // Find the root parent comment if replying to a reply
      let rootParentId = replyingTo;
      if (replyingTo) {
        const findRootParent = (commentId) => {
          const comment = comments.find(c => c._id === commentId) || 
                         comments.flatMap(c => c.replies || []).find(r => r._id === commentId);
          if (comment?.parentComment) {
            return findRootParent(comment.parentComment);
          }
          return commentId;
        };
        rootParentId = findRootParent(replyingTo);
      }

      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/comments/`,
        {
          content: newComment,
          post: postId,
          ...(replyingTo && { parentComment: rootParentId })
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (replyingTo) {
        // Add reply to the root parent comment
        setComments(comments.map(comment => 
          comment._id === rootParentId
            ? { ...comment, replies: [...(comment.replies || []), data] }
            : comment
        ));
      } else {
        // Add new top-level comment
        setComments([data, ...comments]);
      }

      // Create notification for the post author
      if (currentUser._id !== postAuthorId) {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URI}/api/v1/notifications`,
          {
            post: postId,
            comment: data._id,
            type: 'comment'
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
      }

      setNewComment('');
      setReplyingTo(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to post comment');
    }
  };

  // Edit comment
  const handleEdit = async () => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/comments/${editingId}`,
        { content: editContent },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      // Update comment in state
      const updateComment = (comment) => {
        if (comment._id === editingId) {
          return { ...comment, content: editContent };
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: comment.replies.map(updateComment)
          };
        }
        return comment;
      };

      setComments(comments.map(updateComment));
      setEditingId(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update comment');
    }
  };

  // Delete comment
  const handleDelete = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/comments/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      // Remove comment from state
      setComments(comments.filter(comment => comment._id !== commentId));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete comment');
    }
  };

  // Toggle replies visibility
  const toggleReplies = (commentId) => {
    setExpandedReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  // Render comment
  const renderComment = (comment, isReply = false, level = 0) => {
    if (!comment?.user?._id) return null;

    const isOwner = currentUser?._id === comment.user._id;
    const isAdmin = comment.user._id === postAuthorId;
    const isEditing = editingId === comment._id;
    const hasReplies = comment.replies && comment.replies.length > 0;
    const repliesExpanded = expandedReplies[comment._id];

    return (
      <div 
        key={comment._id}
        className={`${isReply ? `ml-10 border-l-2 border-purple-400 mt-4 pl-4 ` : 'border-b border-gray-700/50 p-2 '}`}
      >
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <Avatar 
              user={comment.user}
              className="w-10 h-10 text-sm"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className={`font-medium ${
                isAdmin ? 'text-purple-400' : 'text-white'
              }`}>
                {comment.user.name || comment.user.email.split('@')[0]}
              </span>
              {comment.user.isVerified && (
                <MdVerified className="text-purple-400 flex-shrink-0" />
              )}
              <span className="text-xs text-gray-400">
                {timeAgo(comment.createdAt)}
              </span>
            </div>

            {isEditing ? (
              <div className="mt-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full bg-transparent text-white border-b border-gray-700/50 p-2 text-sm focus:outline-none focus:border-purple-500"
                  autoFocus
                  rows="3"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleEdit}
                    className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-gray-400 hover:text-gray-300 text-sm transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-gray-300 mt-1 whitespace-pre-wrap break-words">
                  {comment.content}
                </p>

                <div className="flex items-center gap-4 mt-2">
                  <button
                    onClick={() => {
                      setReplyingTo(replyingTo === comment._id ? null : comment._id);
                      setEditingId(null);
                    }}
                    className={`flex items-center gap-1 text-sm ${
                      replyingTo === comment._id 
                        ? 'text-purple-400' 
                        : 'text-gray-400 hover:text-white'
                    } transition-colors`}
                  >
                    <MdReply /> Reply
                  </button>

                  {(isOwner || currentUser?._id === postAuthorId) && (
                    <>
                      {isOwner && (
                        <button
                          onClick={() => {
                            setEditingId(comment._id);
                            setEditContent(comment.content);
                            setReplyingTo(null);
                          }}
                          className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
                        >
                          <MdEdit /> Edit
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(comment._id)}
                        className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <MdDelete /> Delete
                      </button>
                    </>
                  )}

                  {hasReplies && (
                    <button
                      onClick={() => toggleReplies(comment._id)}
                      className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {repliesExpanded ? <MdExpandLess /> : <MdExpandMore />}
                      {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                    </button>
                  )}
                </div>
              </>
            )}

            {/* Reply form */}
            {replyingTo === comment._id && (
              <form onSubmit={handleSubmit} className="mt-4">
                <div className="flex gap-3">
                  <Avatar 
                    user={currentUser}
                    className="w-10 h-10 text-sm"
                  />
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder={`Replying to ${comment.user.name}...`}
                      className="w-full bg-transparent text-white border-b border-gray-700/50 p-2 text-sm focus:outline-none focus:border-purple-500"
                      rows="2"
                      autoFocus
                    />
                    <div className="flex justify-end items-center mt-2">
                      <button
                        type="button"
                        onClick={() => setReplyingTo(null)}
                        className="text-gray-400 hover:text-gray-300 text-sm transition-colors mr-2"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
                      >
                        Post Reply
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Render replies if expanded */}
        {hasReplies && repliesExpanded && (
          <div className="mt-3 space-y-3">
            {comment.replies.map(reply => renderComment(reply, true, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // Count total comments (including replies)
  const countTotalComments = () => {
    return comments.reduce((total, comment) => {
      return total + 1 + (comment.replies ? comment.replies.length : 0);
    }, 0);
  };

  return (
    <section className="mt-4 border-t border-gray-700/30 pt-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">
          Discussion ({countTotalComments()})
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>Sort by</span>
          <button className="text-white hover:text-purple-400 transition-colors">
            Most relevant
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/30 text-red-300 rounded-lg text-sm flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError('')} className="hover:text-red-200">
            <MdClose />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-3">
          <Avatar 
            user={currentUser}
            className="w-10 h-10 text-sm"
          />
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts about this interview..."
              className="w-full bg-gray-800/50 text-white rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-purple-500 border border-gray-700/50"
              rows="3"
            />
            <div className="flex justify-end items-center mt-3">
              <button
                type="submit"
                disabled={!newComment.trim()}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  newComment.trim()
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-gray-700/50 text-gray-400 cursor-not-allowed'
                }`}
              >
                Post Comment
              </button>
            </div>
          </div>
        </div>
      </form>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-10 h-10 bg-gray-700 rounded-full animate-pulse" />
              <div className="flex-1">
                <div className="h-4 w-1/3 bg-gray-700 rounded animate-pulse mb-2" />
                <div className="h-3 w-full bg-gray-700 rounded animate-pulse mb-1" />
                <div className="h-3 w-4/5 bg-gray-700 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map(comment => renderComment(comment))}
          <div ref={commentEndRef} />
        </div>
      ) : (
        <p className="text-gray-400 text-center py-8">
          No comments yet. Be the first to share your thoughts!
        </p>
      )}
    </section>
  );
};

export default CommentSection;