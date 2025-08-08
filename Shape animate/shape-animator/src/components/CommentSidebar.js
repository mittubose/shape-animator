import React, { useState } from 'react';
import styled from 'styled-components';

const CommentSidebarContainer = styled.div`
  width: 300px;
  background-color: #ffffff;
  border-left: 1px solid #e0e0e0;
  padding: 10px;
`;

const Comment = styled.div`
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
`;

const CommentAuthor = styled.div`
  font-weight: bold;
`;

const CommentTimestamp = styled.div`
  font-size: 0.8em;
  color: #888;
`;

const CommentSidebar = ({ addComment, comments }) => {
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (newComment.trim()) {
      addComment(newComment);
      setNewComment('');
    }
  };

  return (
    <CommentSidebarContainer>
      <h3>Comments</h3>
      <div>
        {comments.map((comment) => (
          <Comment key={comment.id}>
            <CommentAuthor>{comment.author}</CommentAuthor>
            <CommentTimestamp>{comment.timestamp.toLocaleString()}</CommentTimestamp>
            <p>{comment.text}</p>
          </Comment>
        ))}
      </div>
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Add a comment..."
        rows="4"
        style={{ width: '100%', marginBottom: '10px' }}
      />
      <button onClick={handleAddComment}>Add Comment</button>
    </CommentSidebarContainer>
  );
};

export default CommentSidebar;
