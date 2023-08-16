import { Badge, Box } from "@chakra-ui/react";

const PostTags = ({ tags, fontSize }) => {
  return (
    <Box>
      {tags.map((tag, index) => (
        <Badge key={index} colorScheme="teal" mr="3" fontSize={fontSize}>
          {tag}
        </Badge>
      ))}
    </Box>
  );
};

export default PostTags;
