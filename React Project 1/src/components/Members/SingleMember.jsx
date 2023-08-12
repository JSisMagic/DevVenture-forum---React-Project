import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import { db } from "../../services/database-services"
import { Avatar, Box, Button, Flex, Heading, Text } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"

const SingleMember = ({
  uid,
  firstName,
  lastName,
  userName,
  email,
  isBlock = false,
  setBlocked,
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
      width="50%"
      marginInline="auto"
      padding="0.5rem 1rem"
      onClick={handleNavigate}
    >
      <Flex gap={2}>
        <Avatar src="https://images.saymedia-content.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cq_auto:eco%2Cw_1200/MTk2NzY3MjA5ODc0MjY5ODI2/top-10-cutest-cat-photos-of-all-time.jpg" />
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
