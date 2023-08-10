import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import * as ReactRouterDOM from 'react-router-dom';
import { Route, Routes, Link} from 'react-router-dom';
import { db } from './services/database-services.js';
import { NewPost } from './views/NewPostForm/NewPostForm';
import { PostList } from './components/PostList/PostList';
import Home from './Pages/Home';
import SignIn from './components/Authenthication/SignIn';
import SignUp from './components/Authenthication/SignUp';
import { PostPage } from './components/PostPage/PostPage';
import {Nav} from './components/NavBar/NavBar';
import { ChakraProvider } from '@chakra-ui/react'
import Edit from './components/Authenthication/EditUser';
import { TagSearchResults } from './components/TagSearchResults/TagSearchResults';
import { AuthenticationVer } from './components/Authenthication/AuthenticationVer';
import { ParticlesBackground } from './components/ParticlesBackground/ParticlesBackground';
import { EditPostPage } from './components/EditPostPage/EditPostPage';

function App() {
  async function forTest() {
    const newPost = {
      title: "New Post",
      content: "This is the content of the new post."
    };
  
    // The 'push' method generates a unique key and stores the new post under that key
    await db.push('posts', newPost);
  }

  return (
    <>
    <ChakraProvider>
    <Nav/>
    <AuthenticationVer/>
    <ParticlesBackground/>
    {/* <SignUp/> */}
      <Routes>
        <Route index element={<Home/>} />
        <Route exact path="/new-post" element={<NewPost/>} />
        <Route exact path="/post-list" element={<PostList/>} />
        <Route exact path="/sign-in" element={<SignIn/>} />
        <Route exact path="/sign-up" element={<SignUp/>} />
        <Route exact path="/edit" element={<Edit/>} />
        <Route exact path="/post-list/:id" element={<PostPage/>} />
        <Route exact path="/searched-tag/:tag/:id" element={<PostPage />} />
        <Route exact path="/searched-tag/:tag" element={<TagSearchResults />} />
        <Route exact path="/edit/:id" element={<EditPostPage />} />
        {/* <Route exact path="/sign-out" element={<AuthenticationVer/>} /> */}
      </Routes>
     
      </ChakraProvider> 
    {/* <button onClick={forTest}>Test for adding post!</button> */}
    </>
  );
}

export default App;
