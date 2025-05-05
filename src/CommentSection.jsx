import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { apiRequest } from './utils/api';
import { Heart, Edit, Trash2 } from 'lucide-react';
import './CommentSection.css';

const CommentSection = ({ postId, comments = [], refreshPosts }) => {
  const [newComment, setNewComment] = useState('');
  

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const result = await apiRequest({
        method: 'POST',
        route: `/users/add-comment/${postId}`,
        body: { text: newComment },
      });

      if (result.success) {
        toast.success('Comment added!');
        setNewComment('');
        refreshPosts();
      } else {
        toast.error(result.message || 'Failed to add comment');
      }
    } catch (error) {
      toast.error('Error adding comment' + error.message);
    }
  };

  const handleUpdateComment = async (commentId, currentText) => {
    const updatedText = prompt('Edit your comment:', currentText);
    if (!updatedText || updatedText === currentText) return;

    try {
      const result = await apiRequest({
        method: 'PUT',
        route: `/users/update-comment/${commentId}`,
        body: { text: updatedText },
      });

      if (result.success) {
        toast.success('Comment updated!');
        refreshPosts();
      } else {
        toast.error(result.message || 'Failed to update comment');
      }
    } catch (error) {
      toast.error('Error updating comment' + error.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      const result = await apiRequest({
        method: 'DELETE',
        route: `/users/delete-comment/${commentId}`,
      });

      if (result.success) {
        toast.success('Comment deleted!');
        refreshPosts();
      } else {
        toast.error(result.message || 'Failed to delete comment');
      }
    } catch (error) {
      toast.error('Error deleting comment' + error.message);
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      const result = await apiRequest({
        method: 'POST',
        route: `/users/like-comment/${commentId}`,
        });

      if (result.success) {
        toast.success('Comment liked!');
        refreshPosts();
      } else {
        toast.error(result.message || 'Failed to like comment');
      }
    } catch (error) {
      toast.error('Error liking comment' + error.message);
    }
  };

  return (
    <div className="comment-section">
      {comments.map((comment) => (
        <div key={comment._id} className="comment">
          <p>{comment.text}</p>
          <div className="comment-actions">
            <button className="icon-btn" onClick={() => handleLikeComment(comment._id)}title="Like">
              <Heart size={16} color={comment.isLiked ? 'red' : 'gray'} />
            </button>
            <button className="icon-btn" onClick={() => handleUpdateComment(comment._id, comment.text)}title="Edit">
              <Edit size={16} color="gray" />
            </button>
            <button className="icon-btn" onClick={() => handleDeleteComment(comment._id)}title="Delete">
              <Trash2 size={16} color="gray" />
            </button>
          </div>
        </div>
      ))}

      <div className="add-comment">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
        />
        <button onClick={handleAddComment}>Post</button>
      </div>
    </div>
  );
};

export default CommentSection;
