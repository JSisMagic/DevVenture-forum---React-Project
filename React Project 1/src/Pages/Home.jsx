import { Box, Flex } from "@chakra-ui/react";
import Hero from "../components/Hero/Hero";
import { PostList } from "../components/PostList/PostList";
import "./Home.css";
import { TagList } from "../components/PostList/TagList";
import HomeStats from "../components/HomeStats/HomeStats";
import TopUsers from "../components/TopUsers/TopUsers";
import Footer from "../components/Footer/Footer";

function Home() {
  return (
    <>
      <Hero />
      <Flex justify="space-evenly" my={10}>
        <TagList />
        <PostList />
        <Box>
          <HomeStats />
          <TopUsers />
        </Box>
      </Flex>
      <Footer />
    </>
  );
}

export default Home;
