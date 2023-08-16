import { Box, Button, Flex, Menu, MenuButton, MenuItem, MenuList, VStack } from "@chakra-ui/react"
import { useEffect, useMemo, useState } from "react"
import { db } from "../../services/database-services"
import Post from "../Post/Post"

export function PostList() {
  const [posts, setPosts] = useState([])
  const [sortOption, setSortOption] = useState("Newest")

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsData = await db.get("posts")
        if (postsData) {
          // Convert the postsData object to an array of posts
          const postsArray = Object.keys(postsData).map(postId => ({
            id: postId,
            ...postsData[postId],
          }))
          setPosts(postsArray)
        }
      } catch (error) {
        console.log(error.message)
      }
    }

    fetchPosts()
  }, [])

  const sortedPosts = useMemo(() => {
    let sortedPosts = [...posts]

    switch (sortOption) {
      case "Newest":
        sortedPosts.sort((a, b) => new Date(b.date) - new Date(a.date))
        break
      case "Oldest":
        sortedPosts.sort((a, b) => new Date(a.date) - new Date(b.date))
        break
      case "Most Liked":
        sortedPosts.sort((a, b) => b.likes - a.likes || new Date(b.date) - new Date(a.date))
        break
      case "Least Liked":
        sortedPosts.sort((a, b) => a.likes - b.likes || new Date(b.date) - new Date(a.date))
        break
      case "Most Commented":
        sortedPosts.sort((a, b) => (b.replies?.length || 0) - (a.replies?.length || 0))
        break
      case "Least Commented":
        sortedPosts.sort((a, b) => (a.replies?.length || 0) - (b.replies?.length || 0))
        break
      default:
        break
    }

    return sortedPosts
  }, [posts, sortOption])

  const handleSort = option => {
    setSortOption(option)
  }

  return (
    <Box width="60%">
      <Menu>
        <MenuButton as={Button}>Sort By: {sortOption}</MenuButton>
        <MenuList bg="rgba(44,72,84, 0.5)" backdropFilter="blur(36px)">
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
            Most Commented
          </MenuItem>
          <MenuItem
            backdropFilter="blur(36px)"
            bg="rgba(44,72,84, 0.1)"
            _hover={{ bg: "rgba(255,255,255, 0.1)" }}
            onClick={() => handleSort("Least Commented")}
          >
            Least Commented
          </MenuItem>
        </MenuList>
      </Menu>
      <Flex
        mt={5}
        direction="column"
        alignItems="start"
        opacity={"0.8"}
        color={"white"}
        gap={5}
        position="relative"
        zIndex={2}
        backdropFilter="blur(7px)"
      >
        {sortedPosts.map(post => (
          <Post key={post.id} post={post} posts={posts} setPosts={setPosts} />
        ))}
      </Flex>
    </Box>
  )
}
