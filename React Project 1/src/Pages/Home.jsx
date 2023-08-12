import React from "react";
import HomeStats from "../components/HomeStats/HomeStats";
import "./Home.css";
import { PostList } from "../components/PostList/PostList";
import { UpperBody } from "../components/UpperBody/UpperBody";

function Home() {
  return (
    <>
      <UpperBody />
      <HomeStats />
      <PostList />
    </>
  );
}

export default Home;
