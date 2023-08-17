import React, { useState, useEffect, useContext } from "react";
import { db } from "../../services/database-services";
import { auth } from "../../config/firebase-config";
import { useNavigate, Link } from "react-router-dom";
import "./NewPostForm.css";
import { AuthContext } from "../../context/AuthContext";
import { Heading } from "@chakra-ui/react";
import {
  isValidDescription,
  isValidPostContent,
  isValidPostTitle,
  isValidTagInput,
} from "../../services/validation.services";
import {
  TITLE_MAX_LENGTH,
  TITLE_MIN_LENGTH,
  DESCRIPTION_MAX_LENGTH,
  DESCRIPTION_MIN_LENGTH,
  CONTENT_MAX_LENGTH,
  CONTENT_MIN_LENGTH,
} from "../../common/constants";

export function NewPost() {
  const { userData } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [description, setDescription] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

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
        navigate("/sign-up");
        return;
      }

      const validationErrors = {};

      if (!isValidPostTitle(title)) {
        validationErrors.title = `Title must be between ${TITLE_MIN_LENGTH} and ${TITLE_MAX_LENGTH} characters.`;
      }

      if (!isValidPostContent(content)) {
        validationErrors.content = `Content must be between ${CONTENT_MIN_LENGTH} and ${CONTENT_MAX_LENGTH} characters.`;
      }

      if (!isValidDescription(description)) {
        validationErrors.description = `Description must be between ${DESCRIPTION_MIN_LENGTH} and ${DESCRIPTION_MAX_LENGTH} characters.`;
      }

      if (!isValidTagInput(tags)) {
        validationErrors.tags = `Invalid tags. Tags should be split by space and cannot start with symbols.`;
      }

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
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
        tags: uniqueTagsArray,
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

      navigate("/");
    } catch (error) {
      console.log(error.message);
      alert("Error submitting post. Please try again later.");
    }
  };

  if (userData?.isBlock) {
    return (
      <Heading size="lg" textAlign="center" marginTop="20rem">
        Blocked users are not allowed to create posts.
      </Heading>
    );
  }

  return (
    <div className="create-web">
      <div className="create-container">
        <h1 className="Title-header">New Post</h1>
        <div className="Title-container">
          <label>Title:</label>
          <input
            type="text"
            placeholder="Enter your post title"
            value={title}
            onChange={handleTitleChange}
          />
          {errors.title && <div className="error-message">{errors.title}</div>}
        </div>
        <div className="Description-container">
          <label>Description:</label>
          <input
            type="text"
            placeholder="Enter your post name"
            value={description}
            onChange={handleDescriptionChange}
          />
          {errors.description && (
            <div className="error-message">{errors.description}</div>
          )}
        </div>
        <div className="Content-container">
          <label>Content:</label>
          <textarea
            placeholder="Write your content here"
            className="tex-container"
            value={content}
            onChange={handleContentChange}
          />
          {errors.content && (
            <div className="error-message">{errors.content}</div>
          )}
        </div>
        <div className="tag-container">
          <label>Tags:</label>
          <input
            placeholder="Split by space"
            type="text"
            value={tags}
            onChange={handleTagsChange}
          />
          {errors.tags && <div className="error-message">{errors.tags}</div>}
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
