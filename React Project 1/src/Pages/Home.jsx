import React, { useContext } from "react";
import HomeStats from "../components/HomeStats/HomeStats";
import "./Home.css";
import { PostList } from "../components/PostList/PostList";
import { UpperBody } from "../components/UpperBody/UpperBody";
import Hero from "../components/Hero/Hero";
import { AuthContext } from "../context/AuthContext";

function Home() {
  const {user} = useContext(AuthContext)
  return (
    <>
     {!user && <Hero />}
     {/* <HomeStats /> */}
      <PostList />
    </>
  );
}

export default Home;
