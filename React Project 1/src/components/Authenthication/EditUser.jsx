import React from "react";
import {
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Avatar,
  AvatarBadge,
  IconButton,
  Center,
} from "@chakra-ui/react";
import { SmallCloseIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "../../services/database-services";
import { auth } from "../../config/firebase-config";
import "./EditUser.css";
import { storage } from "../../config/firebase-config";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  updatePassword,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Edit = () => {
  const [upload, setUpload] = useState(null);
  const [URL, setURL] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const userCur = auth.currentUser;

  useEffect(() => {
    if (user) {
      // Fetch the user's image URL and update the URL state
      const userImageRef = ref(storage, `AuthenticatedUserImages/${user.uid}`);
      getDownloadURL(userImageRef)
        .then((downloadURL) => {
          setURL(downloadURL);
        })
        .catch((error) => {
          // Handle errors if necessary
          console.log(error);
        });
    }
  }, [user]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setUpload(selectedFile);
  };

  const uploadImg = () => {
    if (upload === null) return;

    const userImageRef = ref(storage, `AuthenticatedUserImages/${user.uid}`);
    uploadBytes(userImageRef, upload)
      .then(() => {
        getDownloadURL(userImageRef)
          .then((downloadURL) => {
            // Save the image URL to the database under the user's node
            db.set(`/users/${user.uid}/imageURL`, downloadURL);

            setURL(downloadURL); // Update the URL state with the new image URL

            clearInput();
          })
          .catch((error) => {
            alert(error.message, "Error");
          });

        setUpload(null);
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const removeImage = () => {
    // Remove the image from Firebase Storage
    const userImageRef = ref(storage, `AuthenticatedUserImages/${user.uid}`);
    deleteObject(userImageRef)
      .then(() => {
        // Remove the image URL from Firebase Database
        db.set(`/users/${user.uid}/imageURL`, null);
        // Clear the URL state
        setURL(null);

        clearInput();
      })
      .catch((error) => {
        console.error("Error removing image:", error);
      });
  };

  const clearInput = () => {
    const inputElement = document.getElementById("fileInput");
    if (inputElement) {
      inputElement.value = "";
    }
  };

  const updateUserProfile = async () => {
    const newFirstname = document.getElementById("firstname").value;
    const newLastname = document.getElementById("lastname").value;
    const newEmail = document.getElementById("newEmail").value;
    const newPassword = document.getElementById("newPassword").value;
    const currentPassword = document.getElementById("currentPassword").value;

    try {
      // Reauthenticate the user
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(userCur, credential);

      // Update user information in the database
      await db.update(`/users/${user.uid}`, {
        firstname: newFirstname,
        lastname: newLastname,
        email: newEmail,
      });

      // Update email and password
      const promises = [];

      if (newEmail !== user.email) {
        promises.push(updateEmail(userCur, newEmail));
        console.log("Email updated successfully");
      }

      if (newPassword) {
        promises.push(updatePassword(userCur, newPassword));
        console.log("Password updated successfully");
      }

      await Promise.all(promises);

      console.log("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

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
              <button onClick={uploadImg}>Upload</button>
            </div>
          </Stack>
        </FormControl>
        <FormControl id="firstname">
          <FormLabel>Firstname</FormLabel>
          <Input
            placeholder="Enter your firstname"
            _placeholder={{ color: "gray.500" }}
            type="text"
          />
        </FormControl>
        <FormControl id="lastname">
          <FormLabel>Lastname</FormLabel>
          <Input
            placeholder="Enter your lastname"
            _placeholder={{ color: "gray.500" }}
            type="text"
          />
        </FormControl>
        <FormControl id="newEmail" isRequired>
          <FormLabel>Email address</FormLabel>
          <Input
            placeholder="Enter your email address"
            _placeholder={{ color: "gray.500" }}
            type="email"
          />
        </FormControl>
        <FormControl id="currentPassword" isRequired>
          <FormLabel>Current Password</FormLabel>
          <Input
            placeholder="Enter your current password"
            _placeholder={{ color: "gray.500" }}
            type="password"
          />
        </FormControl>
        <FormControl id="newPassword" isRequired>
          <FormLabel>New Password</FormLabel>
          <Input
            placeholder="Enter your new password"
            _placeholder={{ color: "gray.500" }}
            type="password"
          />
        </FormControl>
        <Stack>
        <Link to="/">
          <button className="submit-button" onClick={updateUserProfile}>
            Submit
          </button>
          </Link>
          <Link to="/">
            <button className="can-button">Cancel</button>
          </Link>
        </Stack>
      </Stack>
    </Flex>
  );
};

export default Edit;
