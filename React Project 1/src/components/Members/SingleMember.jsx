import { Avatar, Box, Button, Flex, Heading, Text } from "@chakra-ui/react"
import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import { db } from "../../services/database-services"

const SingleMember = ({
  uid,
  firstName,
  lastName,
  userName,
  email,
  isBlock = false,
  setBlocked,
  imageURL,
}) => {
  const { userData } = useContext(AuthContext)
  const navigate = useNavigate()

  const blockUser = async () => {
    console.log(userName, isBlock)
    await db.update(`users/${uid}`, {
      isBlock: !isBlock,
    })
    setBlocked(blocked => [...blocked, userName])
  }

  const handleNavigate = () => {
    navigate(`/member/${uid}`)
  }

  return (
    <Flex
      justify="space-between"
      align="center"
      bg="rgba(255,255,255, 0.2)"
      borderRadius="md"
      marginInline="auto"
      width="100%"
      padding="0.5rem 1rem"
    >
      <Flex gap={2} onClick={handleNavigate}>
        <Avatar src={imageURL} />
        <Box>
          <Heading size="md">
            {firstName} {lastName}
          </Heading>
          <Text size="sm">@{userName}</Text>
        </Box>
      </Flex>
      {userData?.isAdmin && (
        <Flex align="center" gap={2}>
          <Heading size="sm">{email}</Heading>
          <Button onClick={blockUser}>{isBlock ? "Unblock" : "Block"}</Button>
        </Flex>
      )}
    </Flex>
  )
}

export default SingleMember
