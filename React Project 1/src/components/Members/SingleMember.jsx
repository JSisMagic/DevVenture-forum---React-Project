import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import { db } from "../../services/database-services"
import { Avatar, Box, Button, Flex, Heading, Text } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import { getDownloadURL, ref } from "firebase/storage" // Import necessary functions from firebase storage
import { storage } from "../../config/firebase-config"

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
  const [imageURL, setImageURL] = useState(null) // State to store the user's image URL

  useEffect(() => {
    // Fetch the user's image URL and update the state
    const userImageRef = ref(storage, `AuthenticatedUserImages/${uid}`)
    getDownloadURL(userImageRef)
      .then(downloadURL => {
        setImageURL(downloadURL)
      })
      .catch(error => {
        // Handle errors if necessary
        console.log(error)
      })
  }, [uid])

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
