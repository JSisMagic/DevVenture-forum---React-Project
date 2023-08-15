import { GlassContainer } from "../GlassContainer/GlassContainer"
import { Link } from "react-router-dom"
import { Avatar, Button, HStack, Heading, Icon, Spacer, Text, VStack } from "@chakra-ui/react"
import { ChatIcon } from "@chakra-ui/icons"
import PostTags from "./PostTags"
import { useLikePost } from "../PostList/UseLikePost"
import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai"

const Post = ({ post, posts, setPosts }) => {
  const { user } = useContext(AuthContext)
  const { handleLike } = useLikePost()

  return (
    <GlassContainer key={post.id} height="auto">
      <Link to={`/post-list/${post.id}`} style={{ textDecoration: "none", color: "black" }}>
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
      <HStack justifyContent="space-between" alignItems="center">
        <VStack alignItems="flex-start" spacing={1}>
          <Avatar />
          <Text fontSize="sm" color="blue.500">
            Posted by: {post.user}
          </Text>
        </VStack>
        <Spacer />
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
    </GlassContainer>
  )
}

export default Post
