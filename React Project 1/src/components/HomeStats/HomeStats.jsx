import { Box, Flex, Heading, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { getAllPosts } from "../../services/posts.services"
import { getAllUsers } from "../../services/users.services"

const HomeStats = () => {
  const [usersCount, setUsersCount] = useState(0)
  const [postsCount, setPostsCount] = useState(0)

  useEffect(() => {
    getAllUsers().then(data => setUsersCount(data.length))
    getAllPosts().then(data => setPostsCount(data.length))
  }, [])

  return (
    <Flex
      gap={10}
      bg="rgba(255,255,255, 0.2)"
      width="max-content"
      padding="2rem"
      borderRadius="lg"
      alignItems="center"
      textAlign="center"
      marginInline="auto"
    >
      <Box>
        <Text>Users</Text>
        <Heading>{usersCount}</Heading>
      </Box>
      <Box>
        <Text>Posts</Text>
        <Heading>{postsCount}</Heading>
      </Box>
    </Flex>
  )
}

export default HomeStats
