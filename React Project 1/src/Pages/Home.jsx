import React from "react";
import './Home.css';
import { GlassContainerPost } from "./GlassContainerPost";
import { HeaderUp } from "../HeaderUp/HeaderUp";

function Home() {
  const titles = ["How to write JS", "What is .Net Core", "Don't learn Java","How to write JS", "What is .Net Core", "Don't learn Java","How to write JS", "What is .Net Core", "Don't learn Java","How to write JS", "What is .Net Core", "Don't learn Java"];

  const posts = titles.map((post, i) => (
    <li key={i}>
        <>
        <GlassContainerPost>
          <h1>{post}</h1>
          <p>aslkjfsadksadjaldhjlfkhdfjhskfsldfhsdfkjfakjfgkhjdsfafqefgqiyugfquigqufgqiwugfwqdbvhjqdvhqwvfuq3yfvhwdbjqwdvqujdv</p>
          </GlassContainerPost>
        </>
    </li>
  ));

  return (
    <div className="home-container">
      <HeaderUp/>
      <ul className="post-list">
        {posts}
      </ul>
    </div>
  );
}

export default Home;