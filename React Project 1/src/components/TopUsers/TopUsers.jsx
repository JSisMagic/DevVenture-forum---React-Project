import { useContext, useEffect, useState } from "react";
import { getAllPosts } from "../../services/posts.services";
import { getAllUsers } from "../../services/users.services";
import { AuthContext } from "../../context/AuthContext";
import {
  Avatar,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

const TopUsers = () => {
  const { userData } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [sortedUsers, setSortedUsers] = useState([]);

  useEffect(() => {
    getAllUsers().then(setUsers).catch(console.error);
  }, []);

  useEffect(() => {
    getAllPosts().then(setPosts).catch(console.error);
  }, [userData?.likedPosts]);

  useEffect(() => {
    const calculateRating = (user) => {
      const userPosts = posts?.filter((post) => post.user === user.username);

      let rating = 0;
      userPosts?.map((post) => {
        post.likedBy ? (rating += Object.keys(post.likedBy).length) : 0;
      });
      user.rating = rating;

      return user.rating > 0 ? rating : 0;
    };
    setSortedUsers(
      users.sort((a, b) => calculateRating(b) - calculateRating(a)).slice(0, 10)
    );
  }, [users, posts]);

  return (
    sortedUsers.length > 0 && (
      <TableContainer mt={10} bg="rgba(255,255,255,0.05)" borderRadius="md">
        <Heading size="md" textAlign="center" py={3}>
          Top Users
        </Heading>
        <Table>
          <Thead>
            <Tr>
              <Th>Photo</Th>
              <Th>Username</Th>
              <Th>Rating</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sortedUsers.map((user) => (
              <Tr key={user.username}>
                <Td>
                  <Link to={`/member/${user.uid}`}>
                    <Avatar size="sm" src={user.imageURL} />
                  </Link>
                </Td>
                <Td>{user.username}</Td>
                <Td>{user.rating}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    )
  );
};

export default TopUsers;
