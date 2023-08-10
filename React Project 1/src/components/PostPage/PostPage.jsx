import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../services/database-services';
import { auth } from '../../config/firebase-config';
import { useNavigate } from 'react-router-dom/dist';
import { Button, IconButton } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { DeleteIcon } from '@chakra-ui/icons';

export function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [reply, setReply] = useState('');
  const [replies, setReplies] = useState([]);
  const [likes, setLikes] = useState(0);
  const navigate = useNavigate()
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
            userUID: userUID 
          };

          // Update the post with the new reply
          await db.update(`posts/${id}`, { replies: [...replies, newReply] });

          // Update the local state with the new reply
          setReplies([...replies, newReply]);

          // Clear the reply input
          setReply('');
        } else {

          navigate('/sign-up')
        }

      } catch (error) {
        console.log(error.message);
      }
    }
  };


  const handleLike = async () => {
    try {
      // Increment the likes count in the state
      setLikes((prevLikes) => prevLikes + 1);

      // Update the likes count in the database
      await db.update(`posts/${id}`, { likes: likes + 1 });

      // Update the local state with the new likes count
      setPost((prevPost) => ({
        ...prevPost,
        likes: prevPost.likes + 1,
      }));
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

  if (!post) {
    return <h1>There is no such post!</h1>;
  }

  return (
    <div>
      <h1>{post.user}</h1>
      <h2>{post.title}</h2>
      <p>{post.description}</p>
      <p>{post.content}</p>
      <p>Likes: {post.likes}</p>
      <button onClick={handleLike}>Like button</button>
      <h3>Replies:</h3>
      <ul>
      {replies.map((reply, index) => (
        <li key={index}>
          <p>{`User: ${reply.user}`}</p>
          <p>{`Date: ${new Date(reply.date).toLocaleString()}`}</p>
          <p>{`Content: ${reply.content}`}</p>
          {user && (user.uid === post.userUID || user.uid === reply.userUID) &&
          <IconButton
          icon={<DeleteIcon />}
          colorScheme="red"
          variant="ghost"
          aria-label="Delete"
          onClick={() => handleDeleteComment(index)}
          />
        }
        </li>
        ))}
      </ul>
      <form onSubmit={handleSubmitReply}>
        <textarea value={reply} onChange={handleReplyChange} />
        <button type="submit">Submit Reply</button>
      </form>
      {user && user.uid === post.userUID && (
        <Button as={Link} to={`/edit/${post.id}`} colorScheme="blue">
          Edit
        </Button>
      )}
    </div>
  );
}