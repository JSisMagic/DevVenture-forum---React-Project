import { Box, Flex, Heading, Text } from "@chakra-ui/react"
import { format } from "date-fns"
import React from "react"

const Post = ({ post }) => {
  return (
    <Box width={1000}>
      <Heading size="md">{post.title}</Heading>
      <Text>{post.content}</Text>
      <Flex width={1000} justify="space-between">
        <Text>{post.likes}</Text>
        <Text>{format(new Date(post.date), "PPPppp")}</Text>
      </Flex>
    </Box>
  )
}

export default Post
