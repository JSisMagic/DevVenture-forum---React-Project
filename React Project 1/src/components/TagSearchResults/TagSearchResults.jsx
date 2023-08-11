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
} from "@chakra-ui/react";
import { FaThumbsUp } from "react-icons/fa";

export function TagSearchResults() {
  const { tag: term } = useParams();
  const [filteredResults, setFilteredResults] = useState([]);

  useEffect(() => {
    const handleSearch = async () => {
      try {
        const allPosts = await db.get("posts");
        const searchTags = term.toLowerCase().split(" ");

        const filteredPosts = Object.values(allPosts).filter((postData) =>
          searchTags.every((searchTag) =>
            ["title", "description", "content", "tags"].some((key) =>
              Array.isArray(postData[key])
                ? postData[key].some((tag) =>
                    tag.toLowerCase().includes(searchTag)
                  )
                : postData[key]?.toLowerCase()?.includes(searchTag)
            )
          )
        );

        // Sort the filteredPosts array by date in descending order (newest to oldest)
        const sortedPosts = filteredPosts.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setFilteredResults(sortedPosts);
      } catch (error) {
        console.log(error.message);
      }
    };

    handleSearch();
  }, [term]);

  const handleLike = async (postId) => {
    try {
      // Update the likes count in the state
      setFilteredResults((prevResults) =>
        prevResults.map((postData) =>
          postData.id === postId
            ? { ...postData, likes: postData.likes + 1 }
            : postData
        )
      );

      // Update the likes count in the database
      await db.update(`posts/${postId}`, {
        likes:
          filteredResults.find((postData) => postData.id === postId).likes + 1,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div>
      <h3>Search Results for Term: {term}</h3>
      {filteredResults.length === 0 ? (
        <p>No posts found for this tag.</p>
      ) : (
        <ul>
          {filteredResults.map((postData) => (
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
                <Text fontSize="lg" color="white.600" mb="10px">
                  {postData.content}
                </Text>
                <Text fontSize="sm" color="gray.400" mb="10px">
                  {new Date(postData.date).toLocaleString()}
                </Text>
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
