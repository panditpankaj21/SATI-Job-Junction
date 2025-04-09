import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  MdVerified, 
  MdReply, 
  MdDelete,
  MdEdit,
  MdClose
} from 'react-icons/md';
import { FaUserCircle } from 'react-icons/fa';
import { timeAgo } from '../utils/timeAgo';
import Avatar from './Avatar';

const CommentSection = ({ postId }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const commentEndRef = useRef(null);


  async function fetchCurrentUser(){
    try{
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/v1/users/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      setCurrentUser(res.data.user);
    } catch (error){
      setError('Failed to load comments. Please refresh.');
      console.error('Fetch error:', err);
    }
    finally{
      setLoading(false);
    }
  }

  // Fetch comments with error handling
  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/v1/comments/post/${postId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setComments(res.data);
      setError('');
    } catch (err) {
      setError('Failed to load comments. Please refresh.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    fetchCurrentUser();
  }, []);


  useEffect(() => {
    fetchComments();
  }, [postId]);

  // Auto-scroll to new comments
  useEffect(() => {
    commentEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  // Submit new comment or reply
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      console.log(newComment, postId);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/comments/`,
        {
          content: newComment,
          post: postId,
          ...(replyingTo && { parentComment: replyingTo })
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (replyingTo) {
        setComments(comments.map(comment => 
          comment._id === replyingTo
            ? { ...comment, replies: [...comment.replies, data] }
            : comment
        ));
      } else {
        setComments([data, ...comments]);
      }

      setNewComment('');
      setReplyingTo(null);
      fetchComments();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to post comment');
    }
  };

  // Edit existing comment
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

      const updateCommentInTree = (comment) => {
        if (comment._id === editingId) {
          return { ...comment, content: editContent };
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: comment.replies.map(updateCommentInTree)
          };
        }
        return comment;
      };

      setComments(comments.map(updateCommentInTree));
      setEditingId(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update comment');
    }
  };

  // Delete comment with nested replies
  const handleDelete = async (commentId) => {
    if (!window.confirm('Delete this comment and all its replies?')) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/comments/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      const removeCommentFromTree = (comment) => {
        if (comment._id === commentId) return null;
        if (comment.replies) {
          return {
            ...comment,
            replies: comment.replies
              .map(removeCommentFromTree)
              .filter(Boolean)
          };
        }
        return comment;
      };

      setComments(comments.map(removeCommentFromTree).filter(Boolean));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete comment');
    }
  };

  // Render comment with all nested replies
  const renderComment = (comment, depth = 0) => {
    if(!comment.user?._id) return null;   // This is an Edge case Need to handle: TODO
    const isOwner = currentUser?._id === comment.user._id;
    const isPostOwner = currentUser?._id === comment.post?.user?._id;
    const isEditing = editingId === comment._id;

    return (
      <div 
        key={comment._id}
        className={`mt-4 ${depth > 0 ? 'ml-8 border-l-2 border-gray-700 pl-4' : ''}`}
      >
        <div className="flex gap-2">
          <div className="relative group">
            <Avatar 
              user={comment.user}
              account={false}
              className="w-8 h-8 text-sm transition-all"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex gap-1 items-center flex-wrap">
              <span className="font-medium text-gray-200 truncate">
                {comment.user.name || comment.user.email.split('@')[0]}
              </span>
              {comment.user.isVerified && (
                <MdVerified className="text-purple-400 flex-shrink-0" />
              )}
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {timeAgo(comment.createdAt)}
              </span>
            </div>

            {isEditing ? (
              <div className="mt-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded p-2 text-sm"
                  autoFocus
                  rows="3"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleEdit}
                    className="px-3 py-1 bg-purple-600 text-white rounded text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-3 py-1 bg-gray-600 text-white rounded text-sm"
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

                <div className="flex gap-4 mt-2">
                  <button
                    onClick={() => {
                      setReplyingTo(replyingTo === comment._id ? null : comment._id);
                      setEditingId(null);
                    }}
                    className={`flex items-center gap-1 text-xs ${
                      replyingTo === comment._id 
                        ? 'text-purple-400' 
                        : 'text-gray-400 hover:text-purple-400'
                    }`}
                  >
                    <MdReply /> Reply
                  </button>

                  {(isOwner || isPostOwner) && (
                    <>
                      {isOwner && (
                        <button
                          onClick={() => {
                            setEditingId(comment._id);
                            setEditContent(comment.content);
                            setReplyingTo(null);
                          }}
                          className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-400"
                        >
                          <MdEdit /> Edit
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(comment._id)}
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-400"
                      >
                        <MdDelete /> Delete
                      </button>
                    </>
                  )}
                </div>
              </>
            )}

            {/* Reply form */}
            {replyingTo === comment._id && (
              <form onSubmit={handleSubmit} className="mt-3">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={`Replying to ${comment.user.name}...`}
                  className="w-full bg-gray-700 text-white rounded p-2 text-sm"
                  rows="2"
                  autoFocus
                />
                <div className="flex gap-2 mt-2">
                  <button
                    type="submit"
                    className="px-3 py-1 bg-purple-600 text-white rounded text-sm"
                  >
                    Post Reply
                  </button>
                  <button
                    type="button"
                    onClick={() => setReplyingTo(null)}
                    className="px-3 py-1 bg-gray-600 text-white rounded text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Render nested replies */}
        {console.log("comments: ", comment)}
        {comment.replies?.map(reply => renderComment(reply, depth + 1))}
      </div>
    );
  };

  return (
    <section className="mt-4 border-t border-gray-700 pt-6">
      <h3 className="text-xl font-semibold text-white mb-6">
        Discussion ({comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0)})
      </h3>

      {error && (
        <div className="mb-4 p-2 bg-red-900/30 text-red-300 rounded text-sm">
          {error}
          <button 
            onClick={() => setError('')} 
            className="float-right"
          >
            <MdClose />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-8">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts about this interview..."
          className="w-full bg-gray-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          rows="3"
        />
        <div className="flex justify-between items-center mt-2">
          <button
            type="submit"
            disabled={!newComment.trim()}
          className={`px-4 py-2 rounded transition ${
              newComment.trim()
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            Post Comment
          </button>
          {replyingTo && (
            <div className="flex items-center text-sm text-gray-400">
              <span>Replying to comment</span>
              <button
                onClick={() => setReplyingTo(null)}
                className="ml-2 text-gray-500 hover:text-white"
              >
                <MdClose size={18} />
              </button>
            </div>
          )}
        </div>
      </form>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse" />
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