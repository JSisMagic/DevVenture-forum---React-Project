import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../../services/database-services";
import { Box, Flex, Text } from "@chakra-ui/react";

export const TagList = () => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tagsData = await db.get("tags");
        if (tagsData) {
          // Convert the tagsData object to an array of tags
          const tagsArray = Object.keys(tagsData).map((tagName) => ({
            name: tagName,
          }));
          setTags(tagsArray);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchTags();
  }, []);


  return (
    <Flex direction="column" alignItems="center">
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Available Tags
      </Text>
      <Flex flexWrap="wrap" justifyContent="center">
        {tags.map((tag) => (
          <Link
            key={tag.name}
            to={`/searched-tag/${tag.name}`} 
            style={{
              textDecoration: "none",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              margin: "4px",
            }}
          >
            {tag.name}
          </Link>
        ))}
      </Flex>
    </Flex>
  );
};

