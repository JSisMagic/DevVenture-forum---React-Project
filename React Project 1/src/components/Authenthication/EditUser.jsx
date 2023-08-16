import { SmallCloseIcon } from "@chakra-ui/icons"
import {
  Avatar,
  AvatarBadge,
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Stack,
  Textarea,
} from "@chakra-ui/react"
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
  updatePassword,
} from "firebase/auth"
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  FIRST_NAME_MAX_LENGTH,
  FIRST_NAME_MIN_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "../../common/constants"
import { auth, storage } from "../../config/firebase-config"
import { AuthContext } from "../../context/AuthContext"
import { db } from "../../services/database-services"
import "./EditUser.css"

const Edit = () => {
  const { userData } = useContext(AuthContext)
  const [upload, setUpload] = useState(null)
  const [URL, setURL] = useState(null)
  const { user } = useContext(AuthContext)
  const [formState, setFormState] = useState({
    firstname: {
      value: "",
      error: "",
    },
    lastname: {
      value: "",
      error: "",
    },
    email: {
      value: "",
      error: "",
    },
    currentPassword: {
      value: "",
      error: "",
    },
    newPassword: {
      value: "",
      error: "",
    },
    description: {
      value: "",
    },
    linkedInURL: {
      value: "",
    },
    gitLabURL: {
      value: "",
    },
    gitHubURL: {
      value: "",
    },
  })

  const navigate = useNavigate()

  const userCur = auth.currentUser

  useEffect(() => {
    if (user) {
      // Fetch the user's image URL and update the URL state
      const userImageRef = ref(storage, `AuthenticatedUserImages/${user.uid}`)
      getDownloadURL(userImageRef)
        .then(downloadURL => {
          setURL(downloadURL)
        })
        .catch(error => {
          // Handle errors if necessary
          console.log(error)
        })
    }
  }, [user])

  useEffect(() => {
    if (userData !== null) {
      setFormState(prev => ({
        ...prev,
        firstname: { value: userData.firstname, error: "" },
        lastname: { value: userData.lastname, error: "" },
        email: { value: userData.email, error: "" },
        description: { value: userData?.description },
        linkedInURL: { value: userData.linkedInURL },
        gitLabURL: { value: userData.gitLabURL },
        gitHubURL: { value: userData.gitHubURL },
      }))
    }
  }, [userData])

  const handleFormChange = event => {
    const { id, value } = event.target

    if (id === "firstname" || id === "lastname") {
      if (value.length < FIRST_NAME_MIN_LENGTH || value.length > FIRST_NAME_MAX_LENGTH) {
        return setFormState(prev => ({
          ...prev,
          [id]: {
            value: value,
            error: `Length should be between ${FIRST_NAME_MIN_LENGTH} and ${FIRST_NAME_MAX_LENGTH} characters`,
          },
        }))
      }
    } else if (id === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        return setFormState(prev => ({
          ...prev,
          [id]: { value: value, error: "Should be valid email." },
        }))
      }
    } else if (id === "newPassword") {
      const passwordRegex = new RegExp(
        `(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*_=\\-+]).{${PASSWORD_MIN_LENGTH},}`
      )
      if (!passwordRegex.test(value)) {
        return setFormState(prev => ({
          ...prev,
          [id]: {
            value: value,
            error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters long and contain an uppercase letter, a lowercase letter, a number, and a special character.`,
          },
        }))
      }
    }

    setFormState(prev => ({ ...prev, [id]: { value: value, error: "" } }))
  }

  const handleFileChange = event => {
    const selectedFile = event.target.files[0]
    setUpload(selectedFile)
  }

  const uploadImg = () => {
    if (upload === null) return

    const userImageRef = ref(storage, `AuthenticatedUserImages/${user.uid}`)
    uploadBytes(userImageRef, upload)
      .then(() => {
        getDownloadURL(userImageRef)
          .then(downloadURL => {
            // Save the image URL to the database under the user's node
            db.set(`/users/${user.uid}/imageURL`, downloadURL)

            setURL(downloadURL) // Update the URL state with the new image URL

            clearInput()
          })
          .catch(error => {
            alert(error.message, "Error")
          })

        setUpload(null)
      })
      .catch(error => {
        alert(error.message)
      })
  }

  const removeImage = () => {
    // Remove the image from Firebase Storage
    const userImageRef = ref(storage, `AuthenticatedUserImages/${user.uid}`)
    deleteObject(userImageRef)
      .then(() => {
        // Remove the image URL from Firebase Database
        db.set(`/users/${user.uid}/imageURL`, null)
        // Clear the URL state
        setURL(null)

        clearInput()
      })
      .catch(error => {
        console.error("Error removing image:", error)
      })
  }

  const clearInput = () => {
    const inputElement = document.getElementById("fileInput")
    if (inputElement) {
      inputElement.value = ""
    }
  }
  console.log(URL);
  const navigateBackwards = () => {
    navigate(-1)
  }

  const updateUserProfile = async () => {
    try {
      // Reauthenticate the user
      const credential = EmailAuthProvider.credential(user.email, formState.currentPassword.value)
      await reauthenticateWithCredential(userCur, credential)
      // Update user information in the database
      await db.update(`/users/${user.uid}`, {
        firstname: formState.firstname.value,
        lastname: formState.lastname.value,
        email: formState.email.value,
        description: formState.description.value,
        linkedInURL: formState.linkedInURL.value,
        gitLabURL: formState.gitLabURL.value,
        gitHubURL: formState.gitHubURL.value,
        imageURL: URL,
      })

      // Update email and password
      const promises = []

      if (formState.email.value !== user.email) {
        promises.push(updateEmail(userCur, formState.email.value))
        console.log("Email updated successfully")
      }

      if (formState.newPassword.value) {
        promises.push(updatePassword(userCur, formState.newPassword.value))
        console.log("Password updated successfully")
      }

      await Promise.all(promises)

      console.log("Profile updated successfully")
      navigateBackwards()
    } catch (error) {
      console.error("Error updating profile:", error)
    }
  }

  return (
    <Flex minH={"100vh"} align={"center"} justify={"center"}>
      <Stack
        className="edit-web"
        spacing={4}
        w={"full"}
        maxW={"md"}
        rounded={"xl"}
        boxShadow={"lg"}
        p={6}
        my={12}
      >
        <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
          User Profile Edit
        </Heading>
        <FormControl id="userName">
          <FormLabel>User Icon</FormLabel>
          <Stack direction={["column", "row"]} spacing={6}>
            <Center>
              <Avatar size="xl" src={URL}>
                <AvatarBadge
                  as={IconButton}
                  size="sm"
                  rounded="full"
                  top="-10px"
                  colorScheme="red"
                  aria-label="remove Image"
                  icon={<SmallCloseIcon />}
                  onClick={removeImage}
                />
              </Avatar>
            </Center>
            <div>
              <input type="file" id="fileInput" onChange={handleFileChange} />
              <Button onClick={uploadImg}>Upload</Button>
            </div>
          </Stack>
        </FormControl>
        <FormControl id="firstname" isInvalid={formState.firstname.error}>
          <FormLabel>Firstname</FormLabel>
          <Input
            value={formState.firstname.value}
            onChange={handleFormChange}
            placeholder="Enter your firstname"
            _placeholder={{ color: "gray.500" }}
            type="text"
          />
          <FormErrorMessage>{formState.firstname.error}</FormErrorMessage>
        </FormControl>
        <FormControl id="lastname" isInvalid={formState.lastname.error}>
          <FormLabel>Lastname</FormLabel>
          <Input
            value={formState.lastname.value}
            onChange={handleFormChange}
            placeholder="Enter your lastname"
            _placeholder={{ color: "gray.500" }}
            type="text"
          />
          <FormErrorMessage>{formState.lastname.error}</FormErrorMessage>
        </FormControl>
        <FormControl id="email" isRequired isInvalid={formState.email.error}>
          <FormLabel>Email address</FormLabel>
          <Input
            value={formState.email.value}
            onChange={handleFormChange}
            placeholder="Enter your email address"
            _placeholder={{ color: "gray.500" }}
            type="email"
          />
          <FormErrorMessage>{formState.email.error}</FormErrorMessage>
        </FormControl>
        <FormControl id="currentPassword" isRequired>
          <FormLabel>Current Password</FormLabel>
          <Input
            value={formState.currentPassword.value}
            onChange={handleFormChange}
            placeholder="Enter your current password"
            _placeholder={{ color: "gray.500" }}
            type="password"
          />
        </FormControl>
        <FormControl id="newPassword" isRequired isInvalid={formState.newPassword.error}>
          <FormLabel>New Password</FormLabel>
          <Input
            value={formState.newPassword.value}
            onChange={handleFormChange}
            placeholder="Enter your new password"
            _placeholder={{ color: "gray.500" }}
            type="password"
          />
          <FormErrorMessage>{formState.newPassword.error}</FormErrorMessage>
        </FormControl>
        <FormControl id="description">
          <FormLabel>Description</FormLabel>
          <Textarea
            value={formState.description.value}
            onChange={handleFormChange}
            placeholder="Enter your profile description"
            _placeholder={{ color: "gray.500" }}
            type="password"
          />
        </FormControl>
        <FormControl id="linkedInURL" isRequired>
          <FormLabel>LinkedIn</FormLabel>
          <Input
            value={formState.linkedInURL.value}
            onChange={handleFormChange}
            placeholder="URL to your LinkedIn profile"
            _placeholder={{ color: "gray.500" }}
            type="text"
          />
        </FormControl>
        <FormControl id="gitLabURL" isRequired>
          <FormLabel>GitLab</FormLabel>
          <Input
            value={formState.gitLabURL.value}
            onChange={handleFormChange}
            placeholder="URL to your GitLab profile"
            _placeholder={{ color: "gray.500" }}
            type="text"
          />
        </FormControl>
        <FormControl id="gitHubURL" isRequired>
          <FormLabel>GitHub</FormLabel>
          <Input
            value={formState.gitHubURL.value}
            onChange={handleFormChange}
            placeholder="URL to your GitHub profile"
            _placeholder={{ color: "gray.500" }}
            type="text"
          />
        </FormControl>
        <Stack>
          <button
            className="submit-button"
            onClick={updateUserProfile}
            disabled={
              formState.firstname.error ||
              formState.lastname.error ||
              formState.email.error ||
              formState.newPassword.error
            }
          >
            Submit
          </button>
          <button className="can-button" onClick={navigateBackwards}>
            Cancel
          </button>
        </Stack>
      </Stack>
    </Flex>
  )
}

export default Edit
