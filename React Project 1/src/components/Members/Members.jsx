import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getAllUsers } from "../../services/users.services";
import SingleMember from "./SingleMember";

const Members = () => {
  const { userData } = useContext(AuthContext);
  const [members, setMembers] = useState([]);
  const [blocked, setBlocked] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    getAllUsers()
      .then((data) => {
        setMembers(data);
      })
      .catch((error) => {
        console.error("Error fetching members:", error);
      });
  }, []);

  useEffect(() => {
    getAllUsers().then(setMembers).catch(console.error);
  }, [blocked]);

  const membersToDisplay = searchResult.map((member) => {
    return (
      <SingleMember
        key={member.id}
        uid={member.uid}
        firstName={member.firstname}
        lastName={member.lastname}
        userName={member.username}
        email={member.email}
        setBlocked={setBlocked}
        isBlock={member.isBlock}
        imageURL={member.imageURL}
      />
    );
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      const filtered = members.filter(
        (member) =>
          member.firstname.toLowerCase().includes(searchKeyword) ||
          member.lastname.toLowerCase().includes(searchKeyword) ||
          member.username.toLowerCase().includes(searchKeyword)
      );

      setSearchResult(filtered);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [members, searchKeyword]);

  const handleChangeSearch = (event) => {
    setSearchKeyword(event.target.value.toLowerCase());
  };

  return (
    <Box width="50%" marginInline="auto">
      {userData?.isAdmin && (
        <InputGroup>
          <InputLeftElement>
            <SearchIcon />
          </InputLeftElement>
          <Input
            placeholder="Search members by username or email"
            value={searchKeyword}
            onChange={handleChangeSearch}
          />
        </InputGroup>
      )}
      <Stack marginTop={3} gap={3}>
        {membersToDisplay}
      </Stack>
    </Box>
  );
};

export default Members;
