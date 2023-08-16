import React from "react";
import { Box, Heading, Text } from "@chakra-ui/react";

export const AboutUs = () => {
  return (
    <Box p={10} width="50%" marginInline="auto">
      <Heading as="h1" size="xl" mb={6} textAlign="center">
        About Us
      </Heading>
      <Heading size="lg" mb={2}>
        Our mission
      </Heading>
      <Text>
        Welcome to our community! We are a passionate team dedicated to sharing
        knowledge and connecting with others who have similar interests. Our
        goal is to create a space where individuals can express their ideas,
        learn from each other, and grow together.
      </Text>
      {/* Add more content about your team, mission, goals, etc. */}
    </Box>
  );
};
