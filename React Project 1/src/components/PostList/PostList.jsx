import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../services/database-services';
import { Box, Heading, Text, Button, HStack, VStack, IconButton } from '@chakra-ui/react';
import { FaThumbsUp } from 'react-icons/fa';


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
    <Box maxW="600px" mx="auto" p="20px">
      <Heading as="h1" textAlign="center" mb="20px">
        Post List
      </Heading>
      <VStack spacing="20px">
        {posts.map((post) => (
          <Box key={post.id} borderWidth="1px" borderRadius="md" p="20px">
            <Link to={`/post-list/${post.id}`} style={{ textDecoration: 'none', color: 'black' }}>
              <Heading as="h3" size="lg" mb="10px">
                {post.title}
              </Heading>
            </Link>
            <Text fontSize="lg" color="gray.600" mb="10px">
              {post.content}
            </Text>
            <Text fontSize="sm" color="gray.400" mb="10px">
              {new Date(post.date).toLocaleString()}
            </Text>
            <Text fontSize="sm" color="blue.500" mb="10px">
              Posted by: {post.user}
          </Text>
            <HStack spacing="10px">
              <Button colorScheme="teal" onClick={() => handleLike(post.id)}>
                Like ({post.likes})
              </Button>
              <IconButton
                aria-label="Upvote"
                icon={<FaThumbsUp />}
                colorScheme="blue"
                onClick={() => handleUpvote(post.id)}
              />
            </HStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
