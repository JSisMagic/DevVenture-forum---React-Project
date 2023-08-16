import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../../services/database-services";
import { Button, Flex } from "@chakra-ui/react";

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
    <Flex direction="column" alignItems="center" maxW={"230px"}>
      <Button
        fontSize="xl"
        fontWeight="bold"
        mb={6}
        boxShadow="0 1rem 3rem rgba(0, 0, 0, 0.4)"
        bg={" rgba(255, 255, 255, 0.1)"}
        cursor={"none"}
      >
        Available Tags
      </Button>
      <Flex flexWrap="wrap" justifyContent="center">
        {tags.map((tag) => (
          <Link
            key={tag.name}
            to={`/searched-tag/${tag.name}`}
            style={{
              textDecoration: "none",
              padding: "6px",
              border: "none",
              borderRadius: "8px",
              margin: "3px",
              cursor: "pointer",
              zIndex: "12",
              backgroundColor: " rgba(255, 255, 255, 0.1)",
              opacity: "0.8",
              boxShadow: "0 1rem 3rem rgba(0, 0, 0, 0.8)",
              color: "white",
              backdropBlur: "36px",
            }}
          >
            {tag.name}
          </Link>
        ))}
      </Flex>
    </Flex>
  );
};
