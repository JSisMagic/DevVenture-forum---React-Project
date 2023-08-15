import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Menu,
  Flex,
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
import HomeStats from "../HomeStats/HomeStats";
import Post from "../Post/Post";

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
      <Flex
        direction="column"
        alignItems="flex-end"
        position="relative"
        opacity={"0.8"}
        color={"white"}
      >
        <Flex>
        <Menu>
          <MenuButton as={Button} rounded={"full"} cursor={"pointer"} minW={0}>
            Sort By: {sortOption}
          </MenuButton>
          <MenuList>
            <MenuItem>
              <MenuItem onClick={() => handleSort("newest")}>Newest</MenuItem>
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
        </Flex>
      </Flex>

      <Flex justifyContent="space-between" alignItems={"start"} mb="23px">
        <TagList textAlign="start" />
        {/* <UpperBody /> */}

        <VStack spacing="13px" alignItems={"center"} marginRight={"123px"} width="60%">
          {sortedPosts.map((post) => (
            <Post key={post.id} post={post} posts={posts} setPosts={setPosts} />
          ))}
        </VStack>
        <Flex>
          <HomeStats />
        </Flex>
      </Flex>
    </>
  );
}
