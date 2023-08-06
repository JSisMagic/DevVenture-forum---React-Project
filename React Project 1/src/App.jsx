import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import * as ReactRouterDOM from 'react-router-dom';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { db } from './services/database-services.js';
import { NewPost } from './views/NewPostForm/NewPostForm';
import { PostList } from './components/PostList/PostList';
import Home from './Pages/Home';

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
    <Home/>
    <h1 className="text-3xl font-bold underline">
      Welcome to DevVentureJungle !
    </h1>
    <ReactRouterDOM.BrowserRouter>
        <Routes>
        <Route exact path="/" element={<PostList/>} />
        <Route exact path="/new" element={<NewPost/>} />
        </Routes>
      </ReactRouterDOM.BrowserRouter>
        <button onClick={forTest}>Test for adding post!</button>
    </>
  );
}

export default App;
