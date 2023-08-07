import React, { useState, useEffect } from 'react';
import { db } from '../../services/database-services';
import { auth } from '../../config/firebase-config';
import { useNavigate, Link } from 'react-router-dom';

export function NewPost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is signed in when the component mounts
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    // Unsubscribe from the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      if (!currentUser) {
        // If no user is logged in, redirect to the signup page
        navigate('/sign-up');
        return;
      }

      const currentUserUid = currentUser.uid
      
      const userData = await db.get(`users/${currentUserUid}`);
      const username = userData && userData.username ? userData.username : '';
      
      const postId = await db.push('posts', {
        title: title,
        content: content,
        date: new Date().toISOString(),
        likes: 0,
        userUID: currentUser.uid,
        user: username 
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
      {!currentUser && (
        <p>
          You need to <Link to="/sign-up">sign up</Link> to create a new post.
        </p>
      )}
    </div>
  );
}
