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
import Nav from './components/NavBar/NavBar';
import { ChakraProvider } from '@chakra-ui/react'
import Edit from './components/Authenthication/EditUser';
import AuthenticationVer from './components/Authenthication/AuthenticationVer';
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
    {/* <SignUp/> */}
  
    <nav>
      <ul>
        <li>
          <Link className='nav-links' to="/">Home</Link>
        </li>
        <li>
          <Link className='nav-links' to="/new-post">New Post</Link>
        </li>
        <li>
          <Link className='nav-links' to="/post-list">Post List</Link>
        </li>
      </ul>
    </nav>
      <Routes>
        <Route index element={<Home/>} />
        <Route exact path="/new-post" element={<NewPost/>} />
        <Route exact path="/post-list" element={<PostList/>} />
        <Route exact path="/sign-in" element={<SignIn/>} />
        <Route exact path="/sign-up" element={<SignUp/>} />
        <Route exact path="/edit" element={<Edit/>} />
        <Route exact path="/post-list/:id" element={<PostPage/>} />
        {/* <Route exact path="/sign-out" element={<AuthenticationVer/>} /> */}
      </Routes>
     
      </ChakraProvider> 
    {/* <button onClick={forTest}>Test for adding post!</button> */}
    </>
  );
}

export default App;
