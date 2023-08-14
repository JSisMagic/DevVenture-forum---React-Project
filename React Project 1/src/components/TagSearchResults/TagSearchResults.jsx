import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../services/database-services";
import { Link } from "react-router-dom/dist";
import { GlassContainer } from "../GlassContainer/GlassContainer";
import "./TagSearchResults.css";
import {
  Box,
  Heading,
  Text,
  Button,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Badge,
  Icon,
} from "@chakra-ui/react";
import { FaThumbsUp } from "react-icons/fa";
import { ChatIcon } from "@chakra-ui/icons";
import { auth } from "../../config/firebase-config";
import { useNavigate } from "react-router-dom";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useLikePost } from "../PostList/UseLikePost";
import { VStack, Spacer } from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/react";

export function TagSearchResults() {
  const { tag: term } = useParams();
  const [filteredResults, setFilteredResults] = useState([]);
  const [sortOption, setSortOption] = useState("tags");
  const [sortedPosts, setSortedPosts] = useState([]);

  const navigate = useNavigate();
  const user = auth.currentUser;
  const searchTags = term.toLowerCase().split(" ");

  const { handleLike } = useLikePost();

  useEffect(() => {
    const handleSearch = async () => {
      try {
        setSortOption("tags");

        const allPosts = await db.get("posts");

        const filteredPosts = Object.values(allPosts).filter((postData) =>
          searchTags.every((searchTag) =>
            ["title", "description", "content", "tags"].some((key) =>
              Array.isArray(postData[key])
                ? postData[key].some(
                    (tag) =>
                      key === "tags" && searchTags.includes(tag.toLowerCase())
                  )
                : postData[key]?.toLowerCase()?.includes(searchTag)
            )
          )
        );

        setFilteredResults(filteredPosts);
      } catch (error) {
        console.log(error.message);
      }
    };

    handleSearch();
  }, [term]);

  useEffect(() => {
    let sortedPostsCopy = [...filteredResults];

    switch (sortOption) {
      case "newest":
        sortedPostsCopy.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "oldest":
        sortedPostsCopy.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "mostLiked":
        sortedPostsCopy.sort(
          (a, b) => b.likes - a.likes || new Date(b.date) - new Date(a.date)
        );
        break;
      case "leastLiked":
        sortedPostsCopy.sort(
          (a, b) => a.likes - b.likes || new Date(b.date) - new Date(a.date)
        );
        break;
      case "mostCommented":
        sortedPostsCopy.sort(
          (a, b) => (b.replies?.length || 0) - (a.replies?.length || 0)
        );
        break;
      case "leastCommented":
        sortedPostsCopy.sort(
          (a, b) => (a.replies?.length || 0) - (b.replies?.length || 0)
        );
        break;
      case "tags":
        sortedPostsCopy.sort((a, b) => {
          const tagA = a.tags.find((tag) =>
            searchTags.includes(tag.toLowerCase())
          );
          const tagB = b.tags.find((tag) =>
            searchTags.includes(tag.toLowerCase())
          );

          if (tagA && tagB) {
            return tagA.toLowerCase() === searchTags[0] ? -1 : 1;
          } else if (tagA) {
            return -1;
          } else if (tagB) {
            return 1;
          }

          return 0;
        });
        break;
      default:
        break;
    }

    setSortedPosts(sortedPostsCopy);
  }, [filteredResults, sortOption]);

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
    <div>
      <h3>Search Results for Term: {term}</h3>
      {filteredResults.length === 0 ? (
        <p>No posts found for this tag.</p>
      ) : (
        <ul>
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
              <MenuItem onClick={() => handleSort("tags")}>Tag</MenuItem>
            </MenuList>
          </Menu>
          {sortedPosts.map((postData) => (
            <li key={postData.id} className="searched-posts-container">
              <GlassContainer height="auto">
                <Link
                  to={`/searched-tag/${term}/${postData.id}`}
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <Heading as="h3" size="lg" mb="10px">
                    {postData.title}
                  </Heading>
                </Link>
                <Text fontSize="lg" color="white.600" mb="10px">
                  {postData.description}
                </Text>
                <PostTags tags={postData.tags} />
                <Text fontSize="sm" color="gray.400" mb="10px">
                  {new Date(postData.date).toLocaleString()}
                </Text>
                <HStack justifyContent="space-between" alignItems="center">
                  <VStack alignItems="flex-start" spacing={1}>
                    <Avatar />
                    <Text fontSize="sm" color="blue.500">
                      Posted by: {postData.user}
                    </Text>
                  </VStack>
                  <Spacer />
                  <HStack spacing={2}>
                    <Button
                      colorScheme="black"
                      onClick={() =>
                        handleLike(
                          postData.id,
                          filteredResults,
                          setFilteredResults
                        )
                      }
                    >
                      <Icon
                        as={
                          user && postData.likedBy?.includes(user.uid)
                            ? AiFillHeart
                            : AiOutlineHeart
                        }
                        boxSize={10}
                        color={
                          user && postData.likedBy?.includes(user.uid)
                            ? "red.500"
                            : "black.300"
                        }
                      />
                      {postData.likes}
                    </Button>
                    <Button
                      colorScheme="black"
                      leftIcon={<ChatIcon boxSize={8} />}
                      as={Link}
                      to={user ? `/post-list/${postData.id}` : "/sign-up"}
                    ></Button>
                  </HStack>
                </HStack>
              </GlassContainer>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
