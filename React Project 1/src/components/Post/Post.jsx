import { ChatIcon } from "@chakra-ui/icons"
import { Avatar, Button, Flex, HStack, Heading, Icon, Text } from "@chakra-ui/react"
import { useContext, useEffect, useState } from "react"
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai"
import { Link } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import { getUserById } from "../../services/users.services"
import { useLikePost } from "../PostList/UseLikePost"
import PostTags from "./PostTags"

const Post = ({ post, posts, setPosts }) => {
  const { user } = useContext(AuthContext)
  const { handleLike } = useLikePost()

  const [authorData, setAuthorData] = useState(null)
  useEffect(() => {
    if (post?.userUID) {
      getUserById(post.userUID)
        .then(data => setAuthorData(data))
        .catch(console.error)
    }
  }, [post])

  return (
    <Flex
      direction="column"
      alignItems="flex-start"
      background="rgba(255,255,255, 0.05)"
      padding="2rem"
      marginInline="auto"
      borderRadius="md"
      gap={2}
    >
      <Link
        to={user ? `/post-list/${post.id}` : "/sign-in"}
        style={{ textDecoration: "none", color: "black" }}
      >
        <Heading as="h3" size="lg" mb="10px">
          {post.title}
        </Heading>
      </Link>
      <Text fontSize="lg" color="white.600" mb="10px">
        {post.description}
      </Text>
      <PostTags tags={post.tags} />
      <Text fontSize="sm" color="gray.400" mb="10px">
        {new Date(post.date).toLocaleString()}
      </Text>
      <HStack justifyContent="space-between" alignItems="center" width="100%">
        <HStack spacing="5px" alignItems="center">
          <Avatar src={authorData?.imageURL} />
          <Text fontSize="sm" color={"blue.500"}>
            Posted by:{" "}
            <Link
              to={`/member/${post.userUID}`}
              style={{
                textDecoration: "underline",
              }}
            >
              {post.user}
            </Link>
          </Text>
        </HStack>
        <HStack spacing={2}>
          <Button colorScheme="black" onClick={() => handleLike(post.id, posts, setPosts)}>
            <Icon
              as={post.likedBy?.includes(user?.uid) ? AiFillHeart : AiOutlineHeart}
              boxSize={10}
              color={post.likedBy?.includes(user?.uid) ? "rgba(255,255,255, 0.8)" : "black.300"}
            />
            {post.likes}
          </Button>
          <Button
            colorScheme="black"
            leftIcon={<ChatIcon boxSize={8} />}
            as={Link}
            to={user ? `/post-list/${post.id}` : "/sign-up"}
          ></Button>
        </HStack>
      </HStack>
    </Flex>
  )
}

export default Post
