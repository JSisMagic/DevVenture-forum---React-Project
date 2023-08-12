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
  Badge
} from "@chakra-ui/react";
import { FaThumbsUp } from "react-icons/fa";
import { auth } from "../../config/firebase-config";
import { useNavigate } from "react-router-dom";

export function TagSearchResults() {
  const { tag: term } = useParams();
  const [filteredResults, setFilteredResults] = useState([]);
  const [sortOption, setSortOption] = useState("tags");
  const [sortedPosts, setSortedPosts] = useState([]);

  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    const handleSearch = async () => {
      try {
        const allPosts = await db.get("posts");
        const searchTags = term.toLowerCase().split(" ");
  
        const filteredPosts = Object.values(allPosts)
          .filter((postData) =>
            searchTags.every((searchTag) =>
              ["title", "description", "content", "tags"].some((key) =>
                Array.isArray(postData[key])
                  ? postData[key].some((tag) =>
                      key === "tags" && searchTags.includes(tag.toLowerCase())
                    )
                  : postData[key]?.toLowerCase()?.includes(searchTag)
              )
            )
          )
          .sort((postA, postB) => {
            const tagA = postA.tags.find((tag) => searchTags.includes(tag.toLowerCase()));
            const tagB = postB.tags.find((tag) => searchTags.includes(tag.toLowerCase()));
  
            if (tagA && tagB) {
              return tagA.toLowerCase() === searchTags[0] ? -1 : 1;
            } else if (tagA) {
              return -1;
            } else if (tagB) {
              return 1;
            }
  
            return 0;
          });
  
        setFilteredResults(filteredPosts);
      } catch (error) {
        console.log(error.message);
      }
    };
  
    handleSearch();
  }, [term]);
  

  const handleLike = async (postId) => {
    try {
      if (!user) {
        navigate("/sign-up");
        return;
      }

      const currentUserUID = user.uid;

      // Find the post by ID
      const likedPost = filteredResults.find((post) => post.id === postId);

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
        setFilteredResults((prevPosts) =>
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
                <Text fontSize="sm" color="gray.400" mb="10px">
                  {new Date(postData.date).toLocaleString()}
                </Text>
                <PostTags tags={postData.tags} />
                <Text fontSize="sm" color="blue.500" mb="10px">
                  Posted by: {postData.user}
                </Text>
                <HStack spacing="10px">
                  <Button
                    colorScheme="teal"
                    onClick={() => handleLike(postData.id)}
                  >
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
