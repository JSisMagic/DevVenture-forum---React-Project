import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../services/database-services';
import "./EditPostPage.css";
export function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedTags, setEditedTags] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [oldTags, setOldTags] = useState([]);

  useEffect(() => {
    // Fetch the post data based on the ID from the route parameter
    const fetchPost = async () => {
      try {
        const postData = await db.get(`posts/${id}`);
        const oldTags = postData.tags;

        setPost(postData);
        setEditedTitle(postData.title);
        setEditedDescription(postData.description);
        setEditedTags(postData.tags.join(' ')); // Convert tags array to a string
        setEditedContent(postData.content);
        setOldTags(oldTags);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchPost();
  }, [id]);

  const handleTitleChange = (e) => {
    setEditedTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setEditedDescription(e.target.value);
  };

  const handleTagsChange = (e) => {
    setEditedTags(e.target.value);
  };

  const handleContentChange = (e) => {
    setEditedContent(e.target.value);
  };

  const handleSubmit = async () => {
    try {
        const updatedTagsArray = editedTags.split(' ').map(tag => tag.trim());
        const uniqueUpdatedTagsArray = Array.from(new Set(updatedTagsArray));

      // Update the post with the edited title, description, tags, and content
      await db.update(`posts/${id}`, {
        title: editedTitle,
        description: editedDescription,
        tags: uniqueUpdatedTagsArray, 
        content: editedContent,
      });

    // Remove old tags from tags in database
    for (const tag of oldTags) {
        await db.remove(`tags/${tag}/${id}`);
      }
    
    // Add new tags in tags in database
    for (const tag of uniqueUpdatedTagsArray) {
        await db.set(`tags/${tag}/${id}`, true);
      }


      // Redirect back to the post page after editing
      navigate(`/post-list/${id}`);
    } catch (error) {
      console.log(error.message);
    }
  };
  
  const handleDelete = async () => {
    try {
      // Remove the post from the database
      await db.remove(`posts/${id}`);

      // Remove the post from tags in the database
      for (const tag of oldTags) {
        await db.remove(`tags/${tag}/${id}`);
      }

      // Redirect back to the post list page after deleting
      navigate('/');
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="edi-web">
      <div className="edi-container" >
      <h2 className="edi-header">Edit Post</h2>
      <div className="edi-header-box">
        <label>Title:</label>
        <input
          type="text"
          value={editedTitle}
          onChange={handleTitleChange}
        />
      </div>
      <div>
        <label>Description:</label>
        <input
          type="text"
          value={editedDescription}
          onChange={handleDescriptionChange}
        />
      </div>
      <div>
        <label>Tags:</label>
        <input
        placeholder='Split by space'
          type="text"
          value={editedTags}
          onChange={handleTagsChange}
        />
      </div>
      <div>
        <label>Content:</label>
        <textarea
          value={editedContent}
          onChange={handleContentChange}
        />
      </div>
      <button onClick={handleSubmit}>Save Changes</button>
      <button onClick={handleDelete}>Delete Post</button>

      </div>
    </div>
  );
}
