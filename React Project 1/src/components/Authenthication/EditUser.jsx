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
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../services/database-services";
import { auth } from "../../config/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { database } from "../../config/firebase-config";
import "./EditUser.css";
import { endAt } from "firebase/database";
import { storage } from "../../config/firebase-config";
import { ref } from "firebase/storage";
//   const idWeNeed=user.uid

const Edit = () => {
  const [upload, setImage] = useState(null);
  const uploadImg = () => {
    if (upload === null) return;
    const kadeShteQSavnem = ref(storage);
  };
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
              <Avatar size="xl" src="">
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
                onChange={(katoGoNat) => {
                  setImage(katoGoNat.target.files[0]);
                }}
              />
              <button onClick={uploadImg}>Upload</button>
            </div>
          </Stack>
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
