import { ChakraProvider } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { Route, Routes } from "react-router-dom"
import "./App.css"
import Home from "./Pages/Home"
import { AuthenticationVer } from "./components/Authenthication/AuthenticationVer"
import Edit from "./components/Authenthication/EditUser"
import SignIn from "./components/Authenthication/SignIn"
import SignUp from "./components/Authenthication/SignUp"
import { EditPostPage } from "./components/EditPostPage/EditPostPage"
import Members from "./components/Members/Members"
import { Nav } from "./components/NavBar/NavBar"
import { ParticlesBackground } from "./components/ParticlesBackground/ParticlesBackground"
import { AboutUs } from "./components/AboutUs/AboutUs"
import { PostPage } from "./components/PostPage/PostPage"
import { TagSearchResults } from "./components/TagSearchResults/TagSearchResults"
import { auth } from "./config/firebase-config"
import { AuthContext } from "./context/AuthContext"
import { db } from "./services/database-services.js"
import { getUserById } from "./services/users.services"
import { NewPost } from "./views/NewPostForm/NewPostForm"
import DetailedMember from "./views/DetailedMember/DetailedMember"
auth
function App() {
  const [user, loading] = useAuthState(auth)

  const [appState, setAppState] = useState({
    user: user ? { email: user.email, uid: user.uid } : null,
    userData: null,
  })

  useEffect(() => {
    setAppState(state => ({
      ...state,
      user: user ? { email: user.email, uid: user.uid } : null,
    }))
  }, [user])

  useEffect(() => {
    if (appState.user !== null) {
      getUserById(appState.user.uid)
        .then(userData => setAppState(prev => ({ ...prev, userData })))
        .catch(console.log)
    }
  }, [appState.user])
  async function forTest() {
    const newPost = {
      title: "New Post",
      content: "This is the content of the new post.",
    }

    // The 'push' method generates a unique key and stores the new post under that key
    await db.push("posts", newPost)
  }

  return (
    <>
      <AuthContext.Provider value={{ ...appState, setContext: setAppState }}>
        <ChakraProvider>
          <Nav />
          <AuthenticationVer />
          <ParticlesBackground />
          {/* <SignUp/> */}
          <Routes>
            <Route index element={<Home />} />
            <Route exact path="/new-post" element={<NewPost />} />
            <Route exact path="/about-us" element={<AboutUs />} />
            <Route exact path="/sign-in" element={<SignIn />} />
            <Route exact path="/sign-up" element={<SignUp />} />
            <Route exact path="/edit" element={<Edit />} />
            <Route exact path="/post-list/:id" element={<PostPage />} />
            <Route exact path="/searched-tag/:tag/:id" element={<PostPage />} />
            <Route exact path="/searched-tag/:tag" element={<TagSearchResults />} />
            <Route exact path="/edit/:id" element={<EditPostPage />} />
            <Route exact path="/members" element={<Members />} />
            <Route exact path="/member/:id" element={<DetailedMember />} />
            {/* <Route exact path="/sign-out" element={<AuthenticationVer/>} /> */}
          </Routes>
        </ChakraProvider>
      </AuthContext.Provider>
      {/* <button onClick={forTest}>Test for adding post!</button> */}
    </>
  )
}

export default App
