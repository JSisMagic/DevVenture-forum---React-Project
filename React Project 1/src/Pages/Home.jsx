import React from "react"
import "./Home.css"
import { UpperBody } from "../components/UpperBody/UpperBody"
import { PostList } from "../components/PostList/PostList"
import HomeStats from "../components/HomeStats/HomeStats"

function Home() {
  return (
    <>
      <UpperBody />
      <HomeStats />
    </>
  )
}

export default Home
