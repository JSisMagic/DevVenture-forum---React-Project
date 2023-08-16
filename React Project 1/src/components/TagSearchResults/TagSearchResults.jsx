import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../services/database-services";
import "./TagSearchResults.css";
import { Button, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { VStack } from "@chakra-ui/react";
import Post from "../Post/Post";
import { Flex } from "@chakra-ui/react";

export function TagSearchResults() {
  const { tag: term } = useParams();
  const [filteredResults, setFilteredResults] = useState([]);
  const [sortOption, setSortOption] = useState("tags");
  const [sortedPosts, setSortedPosts] = useState([]);

  const searchTags = term.toLowerCase().split(" ");

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

  return (
    <div>
      <h3>Search Results for Term: {term}</h3>
      {filteredResults.length === 0 ? (
        <p>No posts found for this tag.</p>
      ) : (
        <ul>
          <Flex
            direction="column"
            alignItems="flex-start"
            position="relative"
            opacity={"0.8"}
            color={"white"}
          >
            <Menu>
              <MenuButton as={Button} mb="30px" ml={"439px"}>
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
          </Flex>
          <Flex justifyContent="center" alignItems={"start"} mb="23px">
            <VStack spacing="13px" alignItems={"center"} width="60%">
              {sortedPosts.map((post) => (
                <Post
                  key={post.id}
                  post={post}
                  posts={filteredResults}
                  setPosts={setFilteredResults}
                />
              ))}
            </VStack>
          </Flex>
        </ul>
      )}
    </div>
  );
}
