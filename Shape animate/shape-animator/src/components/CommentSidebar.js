import React, { useState } from 'react';
import styled from 'styled-components';

const CommentSidebarContainer = styled.div`
  width: 300px;
  background-color: #ffffff;
  border-left: 1px solid #e0e0e0;
  padding: 10px;
`;

const CommentSidebar = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([...comments, newComment]);
      setNewComment('');
    }
  };

  return (
    <CommentSidebarContainer>
      <h3>Comments</h3>
      <div>
        {comments.map((comment, index) => (
          <p key={index}>{comment}</p>
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
