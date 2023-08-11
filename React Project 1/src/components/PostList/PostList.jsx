import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../../services/database-services";
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
import { GlassContainer } from "../GlassContainer/GlassContainer";
import { auth } from "../../config/firebase-config";
import { useNavigate } from "react-router-dom";

export function PostList() {
  const [posts, setPosts] = useState([]);

  const navigate = useNavigate()
  const user = auth.currentUser

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsData = await db.get("posts");
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

  const handleLike = async (postId) => {
    try {
      if (!user){
        navigate('/sign-up');
        return;
      }

      const currentUserUID = user.uid

      // Find the post by ID
      const likedPost = posts.find((post) => post.id === postId);
  
      if (likedPost) {
        // Check if the post has a likedBy array and if the current user liked it
        const userLiked =
          likedPost.likedBy && likedPost.likedBy.includes(currentUserUID);
  
        // Update the likedBy array based on userLiked
        const updatedLikedBy = userLiked
          ? likedPost.likedBy.filter((uid) => uid !== currentUserUID)
          : likedPost.likedBy
          ? [...likedPost.likedBy, currentUserUID]
          : [currentUserUID]; // Initialize likedBy if it doesn't exist
  
        // Increment or decrement the likes count based on userLiked
        const updatedLikes = userLiked
          ? likedPost.likes - 1
          : likedPost.likes + 1;
  
        // Update the likes count and likedBy array in the state
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? { ...post, likes: updatedLikes, likedBy: updatedLikedBy }
              : post
          )
        );
  
        // Update the likes count and likedBy array in the database
        await db.update(`posts/${postId}`, {
          likes: updatedLikes,
          likedBy: updatedLikedBy,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <Heading as="h1" textAlign="center" mb="20px">
        Post List
      </Heading>
      <VStack spacing="20px">
        {posts.map((post) => (
          <GlassContainer key={post.id} height="auto">
            <Link
              to={`/post-list/${post.id}`}
              style={{ textDecoration: "none", color: "black" }}
            >
              <Heading as="h3" size="lg" mb="10px">
                {post.title}
              </Heading>
            </Link>
            <Text fontSize="lg" color="white.600" mb="10px">
                  {post.description}
              </Text>
            <Text fontSize="lg" color="white.600" mb="10px">
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
          </GlassContainer>
        ))}
      </VStack>
    </>
  );
}
