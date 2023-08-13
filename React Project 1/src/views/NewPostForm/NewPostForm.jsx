import React, { useState, useEffect } from "react";
import { db } from "../../services/database-services";
import { auth } from "../../config/firebase-config";
import { useNavigate, Link } from "react-router-dom";
import "./NewPostForm.css";

export function NewPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [description, setDescription] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is signed in when the component mounts
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    // Unsubscribe from the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleTagsChange = (e) => {
    setTags(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      if (!currentUser) {
        // If no user is logged in, redirect to the signup page
        navigate("/sign-up");
        return;
      }

      const currentUserUid = currentUser.uid;

      const userData = await db.get(`users/${currentUserUid}`);
      const username = userData && userData.username ? userData.username : "";

      const tagArray = tags.split(" ").map((tag) => tag.toLowerCase().trim());
      const uniqueTagsArray = Array.from(new Set(tagArray));

      const postId = await db.push("posts", {
        title: title,
        content: content,
        description: description,
        tags: uniqueTagsArray, // Convert comma-separated tags to an array
        date: new Date().toISOString(),
        likes: 0,
        userUID: currentUser.uid,
        user: username,
      });

      // Add the post's key as 'id' in the database
      await db.update(`posts/${postId}`, { id: postId });

      // Associate post IDs with tags
      for (const tag of uniqueTagsArray) {
        await db.set(`tags/${tag}/${postId}`, true);
      }

      // Redirect to the home page after submitting the new post
      navigate("/");
    } catch (error) {
      console.log(error.message);
      alert("Error submitting post. Please try again later.");
    }
  };

  return (
    <div className="create-web">
      <div className="create-container">
        <h1 className="Title-header">New Post</h1>
        <div className="Title-container">
          <label>Title:</label>
          <input
            type="text"
            placeholder="Enter your PostName"
            value={title}
            onChange={handleTitleChange}
          />
        </div>
        <div className="Description-container">
          <label>Description:</label>
          <input
            type="text"
            placeholder="Enter your PostName"
            value={description}
            onChange={handleDescriptionChange}
          />
        </div>
        <div className="Content-container">
          <label>Content:</label>
          <textarea
            placeholder="Begin to create"
            className="tex-container"
            value={content}
            onChange={handleContentChange}
          />
        </div>
        <div className="tag-container">
          <label>Tags:</label>
          <input
            placeholder="Split by space"
            type="text"
            value={tags}
            onChange={handleTagsChange}
          />
        </div>
        <button className="create-button" onClick={handleSubmit}>
          Submit
        </button>
        {!currentUser && (
          <p className="create-tex">
            You need to <Link to="/sign-up">sign up</Link> to create a new post.
          </p>
        )}
      </div>
    </div>
  );
}
