import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../../services/database-services";
import {
  Box,
  Menu,
  Heading,
  Text,
  Button,
  HStack,
  VStack,
  IconButton,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { ChatIcon } from "@chakra-ui/icons";
import { FaThumbsUp } from "react-icons/fa";
import { GlassContainer } from "../GlassContainer/GlassContainer";
import { auth } from "../../config/firebase-config";
import { useNavigate } from "react-router-dom";

export function PostList() {
  const [posts, setPosts] = useState([]);
  const [sortOption, setSortOption] = useState("newest");

  const navigate = useNavigate();
  const user = auth.currentUser;

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
      if (!user) {
        navigate("/sign-up");
        return;
      }

      const currentUserUID = user.uid;

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

  useEffect(() => {
    let sortedPosts = [...posts];

    switch (sortOption) {
      case "newest":
        sortedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "oldest":
        sortedPosts.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "mostLiked":
        sortedPosts.sort(
          (a, b) => b.likes - a.likes || new Date(b.date) - new Date(a.date)
        );
        break;
      case "leastLiked":
        sortedPosts.sort(
          (a, b) => a.likes - b.likes || new Date(b.date) - new Date(a.date)
        );
        break;
      case "mostCommented":
        sortedPosts.sort(
          (a, b) => (b.replies?.length || 0) - (a.replies?.length || 0)
        );
        break;
      case "leastCommented":
        sortedPosts.sort(
          (a, b) => (a.replies?.length || 0) - (b.replies?.length || 0)
        );
        break;
      default:
        break;
    }

    setPosts(sortedPosts);
  }, [posts, sortOption]);

  const handleSort = (option) => {
    setSortOption(option);
  };

  return (
    <>
      {" "}
      <Menu>
        <MenuButton as={Button} mb="20px">
          Sort By: {sortOption}
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => handleSort("newest")}>Newest</MenuItem>
          <MenuItem onClick={() => handleSort("oldest")}>Oldest</MenuItem>
          <MenuItem onClick={() => handleSort("mostLiked")}>
            Most Liked
          </MenuItem>
          <MenuItem onClick={() => handleSort("leastLiked")}>
            Least Liked
          </MenuItem>
          <MenuItem onClick={() => handleSort("mostCommented")}>
            Most Commented{" "}
          </MenuItem>
          <MenuItem onClick={() => handleSort("leastCommented")}>
            Least Commented
          </MenuItem>
        </MenuList>
      </Menu>
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
              <Button
                aria-label="Upvote"
                colorScheme="black"
                leftIcon={<ChatIcon boxSize={8} />}
                alignSelf="flex"
                as={Link}
                to={user ? `/post-list/${post.id}` : "/sign-up"}
              ></Button>
            </HStack>
          </GlassContainer>
        ))}
      </VStack>
    </>
  );
}
