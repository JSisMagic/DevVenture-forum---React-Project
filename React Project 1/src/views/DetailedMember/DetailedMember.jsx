
import { DownloadIcon } from "@chakra-ui/icons"
import { Avatar, Box, Button, Flex, Heading, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getUserById } from "../../services/users.services"

const fallbackUrl =
  "https://images.saymedia-content.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cq_auto:eco%2Cw_1200/MTk2NzY3MjA5ODc0MjY5ODI2/top-10-cutest-cat-photos-of-all-time.jpg"

const DetailedMember = () => {
  const { id } = useParams()
  const [memberData, setMemberData] = useState({})

  useEffect(() => {
    getUserById(id)
      .then(data => setMemberData(data))
      .catch(console.error)
  }, [id])
  console.log(memberData)
  return (
    <Box
      width="50%"
      marginInline="auto"
      marginTop={5}
      bg="rgba(255,255,255,0.2)"
      padding="2rem"
      borderRadius={10}
    >
      <Flex justify="space-between" alignItems="center">
        <Flex gap={3}>
          <Avatar borderRadius="5px" size="2xl" src={memberData.profilePhotoUrl || fallbackUrl} />
          <Box>
            <Heading>
              {memberData.firstname} {memberData.lastname}
            </Heading>
            <Heading size="sm">@{memberData.username}</Heading>
            <Heading size="md">dev</Heading>
          </Box>
        </Flex>
      </Flex>
      <Box marginTop={5}>
        <Text>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quo ipsa provident, tempora cum
          dolorum pariatur porro ullam autem fugit omnis, sed qui. Natus sint sunt quaerat in
          quibusdam pariatur voluptatibus?
        </Text>
      </Box>
      <Flex gap={2} marginTop={5}>
        <Button>LinkedIn</Button>
        <Button>GitLab</Button>
        <Button>GitHub</Button>
        <Button flexGrow={1}>
          <DownloadIcon marginRight={2} />
          CV
        </Button>
      </Flex>
    </Box>
  )
}

export default DetailedMember