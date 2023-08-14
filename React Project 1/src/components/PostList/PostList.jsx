import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Menu,
  Flex ,
  Heading,
  Text,
  Button,
  HStack,
  VStack,
  IconButton,
  MenuButton,
  MenuList,
  MenuItem,
  Badge,
  Icon,
  Avatar,

  Spacer,
} from "@chakra-ui/react";
import { ChatIcon } from "@chakra-ui/icons";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { GlassContainer } from "../GlassContainer/GlassContainer";
import { auth } from "../../config/firebase-config";
import { useNavigate } from "react-router-dom";
import { TagList } from "./TagList";
import { db } from "../../services/database-services";
import { useLikePost } from "./UseLikePost";

export function PostList() {
  const [posts, setPosts] = useState([]);
  const [sortOption, setSortOption] = useState("newest");
  const navigate = useNavigate();
  const { handleLike } = useLikePost();

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

  const sortedPosts = useMemo(() => {
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

    return sortedPosts;
  }, [posts, sortOption]);

  const handleSort = (option) => {
    setSortOption(option);
  };

  const PostTags = ({ tags }) => {
    return (
      <Box>
        {tags.map((tag, index) => (
          <Badge key={index} colorScheme="teal" mr="2">
            {tag}
          </Badge>
        ))}
      </Box>
    );
  };

  return (
    <>
    <Menu>
      <Flex justifyContent="space-between" alignItems={'center'} mb="23px" >
      <TagList textAlign="start" />
       <MenuButton as={Button} rounded={"full"} cursor={"pointer"} minW={0}>
          Sort By: {sortOption}
        </MenuButton>
        </Flex> 
        <MenuList
          padding={"-1"}
          bg={"transparent"} // Set the background color of MenuList to transparent
          backdropBlur={"blur(26px)"}
          alignItems={"center"}
          boxShadow={"0rem 1rem 3rem rgba(0, 0, 0, 0.8)"}
          borderRadius={"16px"}
          opacity={"0.8"}
          border={"none"}
          color={"white"}
        >
          <MenuItem>
            <Button
              onClick={() => handleSort("newest")}
              w="100%"
              justifyContent="flex-start"
              paddingLeft="1rem"
              border={"none"}
            >
              Newest
            </Button>
          </MenuItem>
          <MenuItem>
            <Button onClick={() => handleSort("oldest")}>Oldest</Button>
          </MenuItem>
          <MenuItem onClick={() => handleSort("mostLiked")}>
            Most Liked
          </MenuItem>
          <MenuItem onClick={() => handleSort("leastLiked")}>
            Least Liked
          </MenuItem>
          <MenuItem onClick={() => handleSort("mostCommented")}>
            Most Commented
          </MenuItem>
          <MenuItem onClick={() => handleSort("leastCommented")}>
            Least Commented
          </MenuItem>
        </MenuList>
        </Menu>
      <VStack spacing="20px">
        {sortedPosts.map((post) => (
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
            <PostTags tags={post.tags} />
            <Text fontSize="sm" color="gray.400" mb="10px">
              {new Date(post.date).toLocaleString()}
            </Text>
            <HStack justifyContent="space-between" alignItems="center">
              <VStack alignItems="flex-start" spacing={1}>
                <Avatar />
                <Text fontSize="sm" color="blue.500">
                  Posted by: {post.user}
                </Text>
              </VStack>
              <Spacer />
              <HStack spacing={2}>
                <Button colorScheme="black" onClick={() => handleLike(post.id, posts, setPosts)}>
                  <Icon
                    as={
                      user && post.likedBy?.includes(user.uid)
                        ? AiFillHeart
                        : AiOutlineHeart
                    }
                    boxSize={10}
                    color={
                      user && post.likedBy?.includes(user.uid) ? "red.500" : "black.300"
                    }
                  />
                  {post.likes}
                </Button>
                <Button
                  colorScheme="black"
                  leftIcon={<ChatIcon boxSize={8} />}
                  as={Link}
                  to={user ? `/post-list/${post.id}` : "/sign-up"}
                ></Button>
              </HStack>
            </HStack>
          </GlassContainer>
        ))}
      </VStack>
    </>
  );
}
