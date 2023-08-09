import React from "react";
import "./Home.css";
import { UpperBody } from "../components/UpperBody/UpperBody";
import { PostList } from "../components/PostList/PostList";

function Home() {
  return (
    <>
      <UpperBody />
      <PostList />
    </>
  );
}

export default Home;
