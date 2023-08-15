import { Badge, Box } from "@chakra-ui/react"

const PostTags = ({ tags }) => {
  return (
    <Box>
      {tags.map((tag, index) => (
        <Badge key={index} colorScheme="teal" mr="2">
          {tag}
        </Badge>
      ))}
    </Box>
  )
}

export default PostTags
