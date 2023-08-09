import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../services/database-services';
import { Link } from 'react-router-dom/dist';
import { GlassContainer } from '../GlassContainer/GlassContainer';
import './TagSearchResults.css';
import {
    Box,
    Heading,
    Text,
    Button,
    HStack,
    VStack,
    IconButton,
  } from "@chakra-ui/react";
import { FaThumbsUp } from "react-icons/fa";

export function TagSearchResults() {
  const { tag } = useParams();
  const [searchResults, setSearchResults] = useState([]);
  const [post, setPost] = useState(null);

  useEffect(() => {
    const handleSearch = async () => {
      try {
        const tagPosts = await db.get(`tags/${tag}`);
        if (tagPosts) {
          const postIds = Object.keys(tagPosts);
          const postDataArray = await Promise.all(
            postIds.map(async (postId) => {
              const postData = await db.get(`posts/${postId}`);
              return postData;
            })
          );

          setPost(postDataArray)
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
          {post.map((postData) => (
  <li key={postData.id} className='searched-posts-container'>
    <GlassContainer height="auto">
      <Link to={`/searched-tag/${tag}/${postData.id}`} style={{ textDecoration: 'none', color: 'black' }}>
        <Heading as="h3" size="lg" mb="10px">
          {postData.title}
        </Heading>
      </Link>
      <Text fontSize="lg" color="gray.600" mb="10px">
        {postData.content}
      </Text>
      <Text fontSize="sm" color="gray.400" mb="10px">
        {new Date(postData.date).toLocaleString()}
      </Text>
      <Text fontSize="sm" color="blue.500" mb="10px">
        Posted by: {postData.user}
      </Text>
      <HStack spacing="10px">
        <Button colorScheme="teal" onClick={() => handleLike(postData.id)}>
          Like ({postData.likes})
        </Button>
        <IconButton
          aria-label="Upvote"
          icon={<FaThumbsUp />}
          colorScheme="blue"
          onClick={() => handleUpvote(postData.id)}
        />
      </HStack>
    </GlassContainer>
  </li>
))}
        </ul>
      )}
    </div>
  );
}