import React from "react";
import HomeStats from "../components/HomeStats/HomeStats";
import { UpperBody } from "../components/UpperBody/UpperBody";
import "./Home.css";

function Home() {
  return (
    <>
      <UpperBody />
      <HomeStats />
    </>
  );
}

export default Home;
