import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Flex,
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  ButtonGroup,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { auth } from "../../config/firebase-config";
import { useNavigate } from "react-router-dom/dist";
import "./NavBar.css";
import { TagSearch } from "../TagSearch/TagSearch";

const NavLink = (props) => {
  const { children } = props;
  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: useColorModeValue("gray.200", "gray.700"),
      }}
      href={"#"}
    >
      {children}
    </Box>
  );
};

export function Nav() {
  const { colorMode, toggleColorMode } = useColorMode();
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
const user=auth.currentUser;

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
    navigate("/");
  };

  // const user=auth.currentUser;
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
              <Button as={Link} to="/post-list" className="menu-button">
                Post List
              </Button>
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
                
              as={Button}
                    rounded={"full"}
                    variant={"link"}
                    cursor={"pointer"}
                    minW={0}
                  >
                    <Avatar
                      size={"sm"}
                      src={""}
                    />
                  </MenuButton>
                  <MenuList  alignItems={"center"}>
                    <br />
                    <Center>
                      <Avatar
                        size={"2xl"}
                        src={
                          ""
                        }
                      />
                    </Center>
                    <br />
                    <Center>
                    <p>{user.email}</p>
                    </Center>
                    <br />
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
