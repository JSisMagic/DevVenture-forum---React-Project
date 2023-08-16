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
import { db } from "../../services/database-services";
import { ref, onValue } from "firebase/database"; // Import from 'firebase/database'
import { database } from "../../config/firebase-config"; // Make sure you have the correct import for your database

export function Nav() {
  const { colorMode, toggleColorMode } = useColorMode();
  const [currentUser, setCurrentUser] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const navigate = useNavigate();
  const { user, userData, setContext } = useContext(AuthContext);

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

  useEffect(() => {
    if (user && user.uid) {
      const userImageRef = ref(database, `users/${user.uid}/imageURL`);

      const unsubscribe = onValue(userImageRef, (snapshot) => {
        const imageURL = snapshot.val();
        setImageURL(imageURL);
      });

      return () => {
        // Unsubscribe from the listener when the component unmounts or the user changes
        unsubscribe();
      };
    }
  }, [user]);

  return (
    <React.Fragment>
      <Box>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <Flex alignItems={"center"}>
            <ButtonGroup spacing={5}>
              <Button as={Link} to="/" className="menu-button">
                Home
              </Button>
              {currentUser ? (
                <Button as={Link} to="/new-post" className="menu-button">
                  New Post
                </Button>
              ) : (
                <Button as={Link} to="/about-us" className="menu-button">
                  About Us
                </Button>
              )}
              <Button as={Link} to="/members" className="menu-button">
                Members
              </Button>
            </ButtonGroup>
          </Flex>

          <Flex alignItems={"center"}>
            <Stack direction={"row"} spacing={5}>
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
                  <MenuButton
                    className="number"
                    as={Button}
                    rounded={"full"}
                    variant={"link"}
                    cursor={"pointer"}
                    minW={0}
                  >
                    <Avatar size={"sm"} src={imageURL} />
                  </MenuButton>
                  <MenuList
                    padding={"-1"}
                    bg={"rgba(255, 255, 255, 0.1)"}
                    backdropBlur={"blur(26px)"}
                    alignItems={"center"}
                    boxShadow={"0rem 1rem 3rem rgba(0, 0, 0, 0.8)"}
                    borderRadius={"16px"}
                    opacity={"0.8"}
                    border={"none"}
                    color={"white"}
                  >
                    <br />
                    <Center>
                      <Avatar size={"2xl"} src={imageURL} />
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
                        </Center>
                        <br />
                      </>
                    )}
                    {userData?.isBlock && (
                      <>
                        <Center>
                          <p>BLOCKED ACCOUNT</p>
                        </Center>
                        <br />
                      </>
                    )}
                    <Link to="/edit">
                      <Button rounded={"none"} className="edit-user">
                        Edit User
                      </Button>
                    </Link>
                    <Button
                      rounded="none"
                      borderRadius="0px 0px 16px 16px"
                      className="signout-user"
                      onClick={userSignOut}
                    >
                      Logout
                    </Button>
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
