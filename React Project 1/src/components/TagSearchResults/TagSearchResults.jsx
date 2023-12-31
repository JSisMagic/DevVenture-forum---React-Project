import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../services/database-services";
import "./TagSearchResults.css";
import { Button, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { VStack } from "@chakra-ui/react";
import Post from "../Post/Post";
import { Flex } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";

export function TagSearchResults() {
  const { tag: term } = useParams();
  const [filteredResults, setFilteredResults] = useState([]);
  const [sortOption, setSortOption] = useState("Tag");
  const [sortedPosts, setSortedPosts] = useState([]);

  const searchTags = term.toLowerCase().split(" ");

  useEffect(() => {
    const handleSearch = async () => {
      try {
        setSortOption("Tag");

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
      case "Newest":
        sortedPostsCopy.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "Oldest":
        sortedPostsCopy.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "Most Liked":
        sortedPostsCopy.sort(
          (a, b) => b.likes - a.likes || new Date(b.date) - new Date(a.date)
        );
        break;
      case "Least Liked":
        sortedPostsCopy.sort(
          (a, b) => a.likes - b.likes || new Date(b.date) - new Date(a.date)
        );
        break;
      case "Most Commented":
        sortedPostsCopy.sort(
          (a, b) => (b.replies?.length || 0) - (a.replies?.length || 0)
        );
        break;
      case "Least Commented":
        sortedPostsCopy.sort(
          (a, b) => (a.replies?.length || 0) - (b.replies?.length || 0)
        );
        break;
      case "Tag":
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

  return (
    <div className="main-searche-term">
      <h3 className="results">Results for: </h3>
      <p className="term">{term}</p>
      {filteredResults.length === 0 ? (
        <div className="no-posts-found">
          <p className="no-posts-message">NO POSTS FOUND FOR THIS TERM!</p>
        </div>
      ) : (
        <ul>
          <Box
            width="60%"
            position="relative"
            mx="auto" // Center the box
          >
            <Menu>
              <MenuButton as={Button} mr="900px" mb="20px">
                Sort By: {sortOption}
              </MenuButton>
              <MenuList
                bg="rgba(44,72,84, 0.5)"
                backdropFilter="blur(36px)"
                zIndex={3}
              >
                <MenuItem
                  backdropFilter="blur(36px)"
                  bg="rgba(44,72,84, 0.1)"
                  _hover={{ bg: "rgba(255,255,255, 0.1)" }}
                  onClick={() => handleSort("Newest")}
                >
                  Newest
                </MenuItem>
                <MenuItem
                  backdropFilter="blur(36px)"
                  bg="rgba(44,72,84, 0.1)"
                  _hover={{ bg: "rgba(255,255,255, 0.1)" }}
                  onClick={() => handleSort("Oldest")}
                >
                  Oldest
                </MenuItem>
                <MenuItem
                  backdropFilter="blur(36px)"
                  bg="rgba(44,72,84, 0.1)"
                  _hover={{ bg: "rgba(255,255,255, 0.1)" }}
                  onClick={() => handleSort("Most Liked")}
                >
                  Most Liked
                </MenuItem>
                <MenuItem
                  backdropFilter="blur(36px)"
                  bg="rgba(44,72,84, 0.1)"
                  _hover={{ bg: "rgba(255,255,255, 0.1)" }}
                  onClick={() => handleSort("Least Liked")}
                >
                  Least Liked
                </MenuItem>
                <MenuItem
                  backdropFilter="blur(36px)"
                  bg="rgba(44,72,84, 0.1)"
                  _hover={{ bg: "rgba(255,255,255, 0.1)" }}
                  onClick={() => handleSort("Most Commented")}
                >
                  Most Commented{" "}
                </MenuItem>
                <MenuItem
                  backdropFilter="blur(36px)"
                  bg="rgba(44,72,84, 0.1)"
                  _hover={{ bg: "rgba(255,255,255, 0.1)" }}
                  onClick={() => handleSort("Least Commented")}
                >
                  Least Commented
                </MenuItem>
                <MenuItem
                  backdropFilter="blur(36px)"
                  bg="rgba(44,72,84, 0.1)"
                  _hover={{ bg: "rgba(255,255,255, 0.1)" }}
                  onClick={() => handleSort("Tag")}
                >
                  Tag
                </MenuItem>
              </MenuList>
            </Menu>
            <Flex
              direction="column"
              alignItems="start"
              opacity={"0.8"}
              color={"white"}
              gap={5}
              textAlign="left"
              position="relative"
              zIndex={2}
              backdropFilter="blur(7px)"
            >
              {sortedPosts.map((post) => (
                <Post
                  key={post.id}
                  post={post}
                  posts={filteredResults}
                  setPosts={setFilteredResults}
                />
              ))}
            </Flex>
          </Box>
        </ul>
      )}
    </div>
  );
}
