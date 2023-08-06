import React, { useState } from 'react';
import { db } from '../../services/database-services';
import { useNavigate } from 'react-router-dom';

export function NewPost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();
  
    const handleTitleChange = (e) => {
      setTitle(e.target.value);
    };
  
    const handleContentChange = (e) => {
      setContent(e.target.value);
    };
  
    const handleSubmit = async () => {
        try {
            // Save the new post to Firebase Firestore using push
            const postId = await db.push('posts', {
              title: title,
              content: content,
              date: new Date().toISOString(),
              likes: 0,
            });
      
            // Add the post's key as 'id' in the database
            await db.update(`posts/${postId}`, { id: postId });
      
            // Redirect to the home page after submitting the new post
            navigate('/post-list');
          } catch (error) {
            console.log(error.message);
            alert('Error submitting post. Please try again later.');
          }
    };
  
    return (
      <div>
        <h1>New Post</h1>
        <div>
          <label>Title:</label>
          <input type="text" value={title} onChange={handleTitleChange} />
        </div>
        <div>
          <label>Content:</label>
          <textarea value={content} onChange={handleContentChange} />
        </div>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    );
}


