import React from "react"
import { Box, Heading, Stack, Text } from "@chakra-ui/react"

export const AboutUs = () => {
  return (
    <Box
      mt={10}
      p={10}
      borderRadius="md"
      width="50%"
      marginInline="auto"
      bg="rgba(255,255,255,.05)"
      position="relative"
      zIndex={2}
      backdropFilter="blur(7px)"
    >
      <Heading as="h1" size="xl" mb={6} textAlign="center">
        Nurturing the Dev Venture Community
      </Heading>
      <Text>
        Welcome to Dev Venture, your ultimate platform for developer empowerment. Our mission is to
        provide a dynamic ecosystem that nurtures talent, fosters growth, and connects developers
        with the opportunities they deserve.
      </Text>
      <Stack gap={6} marginTop={12}>
        <Box>
          <Heading as="h2" size="md" mb={2}>
            Who We Are?
          </Heading>
          <Text>
            Dev Venture is not just a forum; it's a dynamic ecosystem designed exclusively for
            developers to connect, collaborate, and catalyze innovation. We are a collective of tech
            enthusiasts, aspiring developers, and seasoned professionals who believe in the power of
            uniting minds, inspiring growth, and propelling the world of technology forward.
          </Text>
        </Box>
        <Box>
          <Heading as="h2" size="md" mb={2}>
            What We Do?
          </Heading>
          <Text>
            At Dev Venture, we provide a platform that empowers developers to showcase their
            talents, share ideas, and build a network that fuels creativity. We offer the tools to
            connect your LinkedIn, GitHub, and GitLab profiles, making your accomplishments and
            skills accessible to potential employers and collaborators. Our forum enables you to
            create posts, engage in discussions, and participate in an ecosystem that thrives on
            shared knowledge.
          </Text>
        </Box>
        <Box>
          <Heading as="h2" size="md" mb={2}>
            Why We Do It?
          </Heading>
          <Text>
            We are driven by a deep-seated belief that collaboration fuels progress. Dev Venture was
            born out of the need to create a space where developers could come together, exchange
            ideas, and explore new horizons. Our purpose is to foster an environment where tech
            enthusiasts can find inspiration, empowerment, and opportunities to advance their
            careers.
          </Text>
        </Box>
        <Box>
          <Heading as="h2" size="md" mb={2}>
            Our Mission
          </Heading>
          <Text>
            Our mission is to unite developers from all walks of life and provide a nurturing ground
            for innovation and growth. We aim to inspire and empower you to elevate your skills,
            forge meaningful connections, and contribute to the ever-evolving landscape of
            technology. Dev Venture strives to be the hub where networking, idea-sharing, and job
            opportunities converge.
          </Text>
        </Box>
      </Stack>

      {/* Add more content about your team, mission, goals, etc. */}
    </Box>
  )
}
