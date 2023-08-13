import { DownloadIcon, EditIcon } from "@chakra-ui/icons"
import { Avatar, Box, Button, Flex, Heading, IconButton, Text } from "@chakra-ui/react"
import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getUserById } from "../../services/users.services"
import { AuthContext } from "../../context/AuthContext"

const DetailedMember = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { userData } = useContext(AuthContext)
  const [memberData, setMemberData] = useState({})

  useEffect(() => {
    getUserById(id)
      .then(data => setMemberData(data))
      .catch(console.error)
  }, [id])

  const handleShowEditModal = () => {
    navigate("/edit")
  }

  const handleNavigate = url => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <Box
      width="50%"
      marginInline="auto"
      marginTop={5}
      bg="rgba(255,255,255,0.2)"
      padding="2rem"
      borderRadius={10}
    >
      <Flex justify="space-between">
        <Flex gap={3}>
          <Avatar borderRadius="5px" size="2xl" src={memberData.imageURL} />
          <Box>
            <Heading>
              {memberData.firstname} {memberData.lastname}
            </Heading>
            <Heading size="sm">@{memberData.username}</Heading>
            <Heading size="md">dev</Heading>
          </Box>
        </Flex>
        {userData?.username === memberData.username && (
          <IconButton icon={<EditIcon />} onClick={handleShowEditModal} />
        )}
      </Flex>
      <Box marginTop={5}>
        <Text>{memberData?.description}</Text>
      </Box>
      <Flex gap={2} marginTop={5}>
        {memberData?.linkedInURL && (
          <Button onClick={() => handleNavigate(memberData?.linkedInURL)}>LinkedIn</Button>
        )}
        {memberData?.gitLabURL && (
          <Button onClick={() => handleNavigate(memberData?.gitLabURL)}>GitLab</Button>
        )}
        {memberData?.gitHubURL && (
          <Button onClick={() => handleNavigate(memberData?.gitHubURL)}>GitHub</Button>
        )}
        <Button flexGrow={1}>
          <DownloadIcon marginRight={2} />
          CV
        </Button>
      </Flex>
    </Box>
  )
}

export default DetailedMember
