import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../services/database-services';

export function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsData = await db.get('posts');
        if (postsData) {
            // Convert the postsData object to an array of posts
            const postsArray = Object.keys(postsData).map((postId) => ({
              id: postId,
              ...postsData[postId],
            }));
            setPosts(postsArray);
          }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <h1>Post List</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
          </li>
        ))}
      </ul>
      <Link to="/new">New Post</Link>
    </div>
  );
}

