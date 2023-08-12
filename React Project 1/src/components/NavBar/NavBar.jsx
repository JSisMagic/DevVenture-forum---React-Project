import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  useColorMode,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom/dist";
import { auth } from "../../config/firebase-config";
import { AuthContext } from "../../context/AuthContext";
import { TagSearch } from "../TagSearch/TagSearch";
import "./NavBar.css";


export function Nav() {
  const { colorMode, toggleColorMode } = useColorMode();
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const { userData, setContext } = useContext(AuthContext);
  useEffect(() => {
    // Check if the user is signed in when the component mounts
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    // Unsubscribe from the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const userSignOut = () => {
    auth.signOut();
    setContext({ user: null, userData: null });
    navigate("/");
  };

  return (
    <React.Fragment>
      <Box>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <Flex alignItems={"center"}>
            <ButtonGroup spacing={5}>
              <Button as={Link} to="/" className="menu-button">
                Home
              </Button>
              <Button as={Link} to="/new-post" className="menu-button">
                New Post
              </Button>
              <Button as={Link} to="/members" className="menu-button">
                Members
              </Button>
            </ButtonGroup>
          </Flex>

          <Flex  alignItems={"center"}>
            <Stack  direction={"row"} spacing={5}>
              <TagSearch />

              <Button onClick={toggleColorMode}>
                {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              </Button>

              {!currentUser ? (
                // User is not signed in, show "Join Us" and "Sign In" buttons
                <>
                  <Button className="right-button" as={Link} to="/sign-up">
                    Join Us
                  </Button>
                  <Button className="right-button" as={Link} to="/sign-in">
                    Sign In
                  </Button>
                </>
              ) : (
                // User is signed in, show user menu

    <Menu className="men-container"> 
                  <MenuButton  className='number'
                
              as={Button}
                    rounded={"full"}
                    variant={"link"}
                    cursor={"pointer"}
                    minW={0}
                  >
                    <Avatar
                      size={"sm"}
                      src={"https://avatars.dicebear.com/api/male/username.svg"}
                    />
                  </MenuButton>
                  <MenuList  alignItems={"center"}>
                    <br/>
                    <Center >
                      <Avatar
                        size={"2xl"}
                        src={
                          "https://avatars.dicebear.com/api/male/username.svg"
                        }
                      />
                    </Center>
                    <br />
                    <Center>
                      <p>{userData?.username}</p>
                    </Center>
                    <br />
                    {userData?.isAdmin && (
                      <>
                        <Center>
                          <p>ADMIN</p>
                          <br />
                        </Center>
                        <br />
                      </>
                    )}
                    {userData?.isBlock && (
                      <>
                        <Center>
                          <p>BLOCKED ACCOUNT</p>
                          <br />
                        </Center>
                        <br />
                      </>
                    )}
                    <MenuDivider />
                    <MenuItem as={Link} to="/edit">
                      Edit User
                    </MenuItem>
                    <MenuItem onClick={userSignOut}>Logout</MenuItem>
                  </MenuList>
                </Menu>
              )}
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </React.Fragment>
  );
}
