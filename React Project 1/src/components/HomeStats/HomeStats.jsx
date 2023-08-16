import { Box, Flex, Heading, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { getAllPosts } from "../../services/posts.services"
import { getAllUsers } from "../../services/users.services"
import { getTotalCommentCount } from "../../services/comments.services"

const HomeStats = () => {
  const [usersCount, setContextsCount] = useState(0)
  const [postsCount, setPostsCount] = useState(0)
  const [commentsCount, setCommentsCount] = useState(0)

  useEffect(() => {
    getAllUsers().then(data => setContextsCount(data.length))
    getAllPosts().then(data => setPostsCount(data.length))
    getTotalCommentCount().then(count => setCommentsCount(count))
  }, [])

  return (
    <Flex
      width="full"
      padding={"16px"}
      bg={"rgba(255, 255, 255, 0.1)"}
      backdropBlur={"blur(26px)"}
      justify="center"
      alignItems={"center"}
      boxShadow={"0rem 1rem 3rem rgba(0, 0, 0, 0.3)"}
      borderRadius={"6px"}
      opacity={"0.8"}
      border={"none"}
      color={"white"}
      gap={10}
      direction={"row"}
      // bg="rgba(255,255,255, 0.2)"
      // padding="2rem"
      // borderRadius="lg"
      textAlign="center"
      // marginInline="auto"
    >
      <Box>
        <Text>Users</Text>
        <Heading>{usersCount}</Heading>
      </Box>
      <Box>
        <Text>Posts</Text>
        <Heading>{postsCount}</Heading>
      </Box>
      <Box>
        <Text>Comments</Text>
        <Heading>{commentsCount}</Heading>
      </Box>
    </Flex>
  )
}

export default HomeStats
