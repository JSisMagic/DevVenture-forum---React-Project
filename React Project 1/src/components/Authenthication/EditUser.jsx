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
import { useState,useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../services/database-services";
import { auth } from "../../config/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { database } from "../../config/firebase-config";
import "./EditUser.css";
import { endAt, set } from "firebase/database";
import { storage } from "../../config/firebase-config";
import { getDownloadURL,ref,uploadBytes } from "firebase/storage";
//   const idWeNeed=user.uid

const Edit = () => {
  const [upload, setUpload] = useState(null);
  const [URL, setURL] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setUpload(selectedFile);
  };

  const uploadImg = () => {
    if (upload === null) return;

    const storageRef = ref(storage, `AuthenticatedUserImages/${upload.name + "abc"}`);

    uploadBytes(storageRef, upload)
      .then(() => {
        getDownloadURL(storageRef)
          .then((downloadURL) => {
            setURL(downloadURL);
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
  // useEffect(()=>{

  // },[]) 
  // const [editbox,setEditbox] = useState(false);
  // const user = auth.currentUser;
  // const idWeNeed=user.uid

  // console.log(user)
  // console.log(idWeNeed)
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
                />
              </Avatar>
            </Center>
            <div>
              <input
                type="file"
                onChange={handleFileChange}
              />
              <button onClick={uploadImg}>Upload</button>
            </div>
          </Stack>
        </FormControl>
        <FormControl id="name" >
          <FormLabel>Firstname</FormLabel>
          <Input
            placeholder={"Firstname"}
            _placeholder={{ color: "white" }}
            type="text"
          />
        </FormControl>
        <FormControl id="name" >
          <FormLabel>Lastname</FormLabel>
          <Input
            placeholder={"Lastname"}
            _placeholder={{ color: "white" }}
            type="name"
          />
        </FormControl>
        <FormControl id="email" isRequired>
          <FormLabel>Email address</FormLabel>
          <Input
            placeholder={"Email address"}
            _placeholder={{ color: "white" }}
            type="email"
          />
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            placeholder="password"
            _placeholder={{ color: "white" }}
            type="password"
          />
        </FormControl>
        <Stack>
          <button className="submit-button">Submit</button>
          <button className="can-button">Cancel</button>
        </Stack>
      </Stack>
    </Flex>
  );
};

export default Edit;
