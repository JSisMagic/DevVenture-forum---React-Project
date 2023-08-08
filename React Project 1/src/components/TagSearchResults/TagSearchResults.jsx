import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../services/database-services';
import { Link } from 'react-router-dom/dist';

export function TagSearchResults() {
  const { tag } = useParams();
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const handleSearch = async () => {
      try {
        const tagPosts = await db.get(`tags/${tag}`);
        if (tagPosts) {
          const postIds = Object.keys(tagPosts);
          setSearchResults(postIds);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    handleSearch();
  }, [tag]);

  return (
    <div>
      <h3>Search Results for Tag: {tag}</h3>
      {searchResults.length === 0 ? (
        <p>No posts found for this tag.</p>
      ) : (
        <ul>
          {searchResults.map((postId) => (
            <li key={postId}>
              <Link to={`/post-list/${postId}`}>Post {postId}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}