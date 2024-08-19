'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createComment } from '@/lib/context/article';
import { useUser } from '@/lib/context/user';

const CommentsSection = ({ articleId,initialComments }) => {
  const [comments, setComments] = useState(initialComments || [] );
  const [message, setMessage] = useState('');
  const { current: user } = useUser();
  const [name, setName] = useState(user?.name || 'Guest');
  const [replyingTo, setReplyingTo] = useState(null);
  useEffect(() => {

  }, [articleId]);

  const handleSubmit = (e, parentCommentId = null) => {
    e.preventDefault();
    if (message.trim().length === 0) {
      return;
    }
    function arrangeComments(comments) {
      const parents = [];
      const replies = [];
    
      // Separate comments into parents and replies
      comments.forEach(comment => {
          if (comment.parent === null) {
              parents.push(comment);
          } else {
              replies.push(comment);
          }
      });
    }
    const currentDate = new Date();
    createComment(articleId, name, message, currentDate, parentCommentId)
      .then((newComment) => {
        // Re-fetch comments after a new comment is added
        arrangeComments(articleId).then(setComments);
        setName(user?.name || 'Guest');
        setMessage('');
        setReplyingTo(null);
      })
      .catch((error) => {
        console.error('Error creating comment:', error);
      });
  };

  return (
    <div>
      <h2>Comments</h2>
      <div style={{ marginBlock: '1rem', paddingBlock: '1rem', borderTop: '1px solid whitesmoke' }}>
        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.$id}
              style={{
                marginBottom: '1rem',
                backgroundColor: comment.parent ? '#f2f2f2' : 'transparent',
                padding: comment.parent ? 15 : 0,
                borderLeft: comment.parent ? '2px solid black' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>
                <span
                  style={{
                    width: '35px',
                    height: '35px',
                    border: '1px solid #ccc',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                  }}
                >
                  {comment.name.charAt(0).toUpperCase()}
                </span>
                <p>{comment.name}</p>
              </div>
              <p>{comment.message}</p>
              <small style={{ fontSize: 12, color: 'grey' }}>{new Date(comment.date).toLocaleDateString()}</small>
              {!user && !comment.parent && (
                <p>
                  <button
                    onClick={() => setReplyingTo(comment.$id)}
                    style={{ marginRight: '10px', border: 'none', backgroundColor: 'white', color: 'grey' }}
                  >
                    Reply
                  </button>
                  {replyingTo === comment.$id && (
                    <button
                      onClick={() => setReplyingTo(null)}
                      style={{ marginRight: '10px', border: 'none', backgroundColor: 'white', color: 'grey' }}
                    >
                      Cancel
                    </button>
                  )}
                </p>
              )}
              {replyingTo === comment.$id && (
                <form onSubmit={(e) => handleSubmit(e, comment.$id)} style={{ marginTop: '20px' }}>
                  {!user && (
                    <div>
                      <label htmlFor="name">Name:</label>
                      <input
                        id="name"
                        type="text"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ marginTop: '10px', padding: '10px' }}
                      />
                    </div>
                  )}
                  <div style={{ marginTop: '10px' }}>
                    <textarea
                      placeholder="Write a reply"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    ></textarea>
                  </div>
                  <button type="submit" style={{ marginTop: '10px' }}>
                    Submit
                  </button>
                </form>
              )}
              
              {comment.replies?.length > 0 && (
                <div style={{ marginLeft: '20px' }}>
                  {comment.replies.map((reply) => (
                    <div key={reply.$id} style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>
                        <span
                          style={{
                            width: '35px',
                            height: '35px',
                            border: '1px solid #ccc',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 14,
                          }}
                        >
                          {reply.name.charAt(0).toUpperCase()}
                        </span>
                        <p>{reply.name}</p>
                      </div>
                      <p>{reply.message}</p>
                      <small style={{ fontSize: 12, color: 'grey' }}>{new Date(reply.date).toLocaleDateString()}</small>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          {!user && (
            <div>
              <label htmlFor="name">Name:</label>
              <input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ marginTop: '10px', padding: '10px' }}
              />
            </div>
          )}
          <div style={{ marginTop: '10px' }}>
            <textarea
              placeholder="Write a comment"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>
          <button type="submit" style={{ marginTop: '10px' }}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommentsSection;
