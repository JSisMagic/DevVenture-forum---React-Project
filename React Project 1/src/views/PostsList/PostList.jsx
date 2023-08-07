import React, { useEffect, useState } from "react"
import { getAllPosts } from "../../services/posts.services"
import { Link } from "react-router-dom"
import {
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Stack,
} from "@chakra-ui/react"
import { CheckIcon, PhoneIcon } from "@chakra-ui/icons"
import Post from "../../components/Post/Post"

const PostsList = () => {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    getAllPosts().then(data => setPosts(data))
  }, [])

  console.log(posts)

  return (
    <Flex direction="column">
      {posts.map(post => (
        <Post key={post.id} post={post} />
      ))}
    </Flex>
  )
}

export default PostsList
