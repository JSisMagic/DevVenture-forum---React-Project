import { useNavigate } from "react-router-dom";
import { auth } from "../../config/firebase-config";
import { db } from "../../services/database-services";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export function useLikePost() {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const { userData } = useContext(AuthContext)

  const handleLike = async (postId, posts, setPosts) => {
    try {
      if (!user) {
        navigate("/sign-up");
        return;
      }

      if (userData?.isBlock) {
        alert("Blocked users are not allowed to like posts.");
        return;
      }

      const currentUserUID = user.uid;

      // Find the post by ID
      const likedPostIndex = posts.findIndex((post) => post.id === postId);

      if (likedPostIndex !== -1) {
        const updatedPosts = [...posts];
        const likedPost = updatedPosts[likedPostIndex];

        // Check if the post has a likedBy array and if the current user liked it
        const userLiked = likedPost.likedBy?.includes(currentUserUID);

        // Update the likedBy array based on userLiked
        likedPost.likedBy = userLiked
          ? likedPost.likedBy.filter((uid) => uid !== currentUserUID)
          : likedPost.likedBy
          ? [...likedPost.likedBy, currentUserUID]
          : [currentUserUID]; // Initialize likedBy if it doesn't exist

        // Increment or decrement the likes count based on userLiked
        likedPost.likes = userLiked ? likedPost.likes - 1 : likedPost.likes + 1;

        // Update the posts array
        setPosts(updatedPosts);

        // Update the likes count and likedBy array in the database
        await db.update(`posts/${postId}`, {
          likes: likedPost.likes,
          likedBy: likedPost.likedBy,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return { handleLike };
}
