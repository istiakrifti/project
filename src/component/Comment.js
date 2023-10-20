import React from 'react';

export default function Comment({ author, content, replies }) {
  return (
    <div className="comment">
      <div className="author">{author}</div>
      <div className="content">{content}</div>
      {replies && replies.length > 0 && (
        <div className="replies">
          {replies.map((reply, index) => (
            <div key={index} className="reply">
              {reply.author}: {reply.content}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
