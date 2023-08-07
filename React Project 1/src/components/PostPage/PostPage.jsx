import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../services/database-services';

export function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [reply, setReply] = useState('');
  const [replies, setReplies] = useState([]);
  const [likes, setLikes] = useState(0);

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
      const newReply = {
        content: reply,
        date: new Date().toISOString(),
        user: 'Anonymous', // You can change this to the user's username if you have user authentication.
      };

      // Update the post with the new reply
      await db.update(`posts/${id}`, { replies: [...replies, newReply] });

      // Update the local state with the new reply
      setReplies([...replies, newReply]);

      // Clear the reply input
      setReply('');
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

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <p>Likes: {post.likes}</p>
      <button onClick={handleLike}>Like button</button>
      <h3>Replies:</h3>
      <ul>
        {replies.map((reply, index) => (
          <li key={index}>{reply.content}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmitReply}>
        <textarea value={reply} onChange={handleReplyChange} />
        <button type="submit">Submit Reply</button>
      </form>
    </div>
  );
}
