import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../services/database-services';
import { auth } from '../../config/firebase-config';
import { useNavigate } from 'react-router-dom/dist';
import { Button, IconButton } from '@chakra-ui/react';
import './PostPage.css';
import { Link } from 'react-router-dom';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';

export function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [reply, setReply] = useState('');
  const [replies, setReplies] = useState([]);
  const [likes, setLikes] = useState(0);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editedReplyContent, setEditedReplyContent] = useState('');
  const [likedBy, setLikedBy] = useState([]);

  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await db.get(`posts/${id}`);
        setPost(postData);
        setReplies(postData.replies || []);
        setLikes(postData.likes || 0);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchPost();
  }, [id]);

  const handleReplyChange = (e) => {
    setReply(e.target.value);
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();

    if (reply.trim() !== '') {
      try {
        if (user) {
          const userUID = user.uid;
          const userData = await db.get(`users/${userUID}`);
          const username = userData.username;

          const newReply = {
            content: reply,
            date: new Date().toISOString(),
            user: username,
            userUID: userUID,
          };

          // Update the post with the new reply
          await db.update(`posts/${id}`, { replies: [...replies, newReply] });

          // Update the local state with the new reply
          setReplies([...replies, newReply]);

          // Clear the reply input
          setReply('');
        } else {
          navigate('/sign-up');
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  const handleLike = async () => {
    try {
      if (!user){
        navigate('/sign-up');
        return;
      }

      const currentUserUID = user.uid

      // Check if the user has already liked the post
      const userLiked = likedBy.includes(currentUserUID); // Replace with the appropriate value
  
      if (userLiked) {
        // User has already liked, so remove the like
        const updatedLikedBy = likedBy.filter((uid) => uid !== currentUserUID);
        setLikedBy(updatedLikedBy);
  
        // Decrement the likes count in the state and local state
        setLikes((prevLikes) => prevLikes - 1);
        setPost((prevPost) => ({
          ...prevPost,
          likes: prevPost.likes - 1,
        }));
  
        // Update the likes count in the database
        await db.update(`posts/${id}`, { likes: likes - 1, likedBy: updatedLikedBy });
      } else {
        // User has not liked, so add the like
        const updatedLikedBy = [...likedBy, currentUserUID];
        setLikedBy(updatedLikedBy);
  
        // Increment the likes count in the state and local state
        setLikes((prevLikes) => prevLikes + 1);
        setPost((prevPost) => ({
          ...prevPost,
          likes: prevPost.likes + 1,
        }));
  
        // Update the likes count and likedBy array in the database
        await db.update(`posts/${id}`, { likes: likes + 1, likedBy: updatedLikedBy });
      }
    } catch (error) {
      console.log(error.message);
    }
  };


  const handleDeleteComment = async (commentIndex) => {
    try {
      // Check if the comment index is valid
      if (commentIndex >= 0 && commentIndex < replies.length) {
        // Clone the current replies array
        const updatedReplies = [...replies];

        // Remove the comment from the cloned array
        updatedReplies.splice(commentIndex, 1);

        // Update the post's replies in the database
        await db.update(`posts/${id}`, { replies: updatedReplies });

        // Update the local state with the updated replies
        setReplies(updatedReplies);

        console.log('Comment deleted successfully.');
      } else {
        console.log('Invalid comment index.');
      }
    } catch (error) {
      console.error('Error deleting comment:', error.message);
    }
  };

  const handleStartEdit = (index, content) => {
    setEditingIndex(index);
    setEditedReplyContent(content);
  };

  const handleSaveEdit = async (index) => {
    try {
      // Clone the current replies array
      const updatedReplies = [...replies];

      // Update the content of the edited reply
      updatedReplies[index].content = editedReplyContent;

      // Update the post's replies in the database
      await db.update(`posts/${id}`, { replies: updatedReplies });

      // Update the local state with the updated replies
      setReplies(updatedReplies);

      // Reset editing state
      setEditingIndex(-1);
      setEditedReplyContent('');

      console.log('Reply edited and saved successfully.');
    } catch (error) {
      console.error('Error editing reply:', error.message);
    }
  };

  if (!post) {
    return <h1>There is no such post!</h1>;
  }
  

  return (
    <div className="create-viw">
      <div className="viw-container">
        <h1 className='viw-header'>{post.user}</h1>
        <h2 className='viw-Title'>{post.title}</h2>
        <p className='viw-description'>{post.description}</p>
        <p className='viw-count'>Likes: {post.likes}</p>
        <p className='viw-content'>{post.content}</p>
        <div className='viw-button-div'>
          <button className='viw-button' onClick={handleLike}>Like button</button>
        </div>
        <h3 className='viw-comment'>Replies:</h3>
        <ul>
          {replies.map((reply, index) => (
            <li className='viw-comment-box' key={index}>
              <div className='viw-ere'>
                <p className='viw-user'>{`Created by:${reply.user}`}</p>
                <span className='onn'>/</span>
                <p className='viw-dating'>{`Date: ${new Date(reply.date).toLocaleString()}`}</p>
              </div>
              <div className='viw-rep'>
                {editingIndex === index ? (
                  <input
                    type="text"
                    value={editedReplyContent}
                    onChange={(e) => setEditedReplyContent(e.target.value)}
                  />
                ) : (
                  <p>{`${reply.content}`}</p>
                )}
                {user && (user.uid === reply.userUID) && (user.uid === post.userUID)  && (
                  <div>
                    {editingIndex === index ? (
                      <Button
                        colorScheme="green"
                        variant="ghost"
                        onClick={() => handleSaveEdit(index)}
                      >
                        Save
                      </Button>
                    ) : (
                      <IconButton
                        icon={<EditIcon />}
                        colorScheme="blue"
                        variant="ghost"
                        aria-label="Edit"
                        onClick={() => handleStartEdit(index, reply.content)}
                      />
                    )}
                    <IconButton
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      variant="ghost"
                      aria-label="Delete"
                      onClick={() => handleDeleteComment(index)}
                    />
                  </div>
                )}
                {user && (user.uid === reply.userUID) && !(user.uid === post.userUID)  && (
                  <div>
                    {editingIndex === index ? (
                      <Button
                        colorScheme="green"
                        variant="ghost"
                        onClick={() => handleSaveEdit(index)}
                      >
                        Save
                      </Button>
                    ) : (
                      <IconButton
                        icon={<EditIcon />}
                        colorScheme="blue"
                        variant="ghost"
                        aria-label="Edit"
                        onClick={() => handleStartEdit(index, reply.content)}
                      />
                    )}
                    <IconButton
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      variant="ghost"
                      aria-label="Delete"
                      onClick={() => handleDeleteComment(index)}
                    />
                  </div>
                )}
              </div>
              {user && (user.uid === post.userUID) && !(user.uid === reply.userUID) && (
              <IconButton
                icon={<DeleteIcon />}
                colorScheme="red"
                variant="ghost"
                aria-label="Delete"
                onClick={() => handleDeleteComment(index)}
              />
            )}
            </li>
          ))}
        </ul>
        <form onSubmit={handleSubmitReply}>
          <textarea value={reply} onChange={handleReplyChange} />
          <button type="submit">Reply</button>
        </form>
        {user && (user.uid === post.userUID) && (
          <Button as={Link} to={`/edit/${post.id}`} colorScheme="blue">
            Edit
          </Button>
        )}
      </div>
    </div>
  );
}  