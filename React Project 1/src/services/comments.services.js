import { db } from "./database-services";

export const getTotalCommentCount = async () => {
  const postsSnapshot = await db.get("posts");
  const postsSnapshotArray = Object.keys(postsSnapshot);

  let totalCommentCount = 0;

  for (const postId of postsSnapshotArray) {
    const postSnapshotReplies = await db.get(`posts/${postId}/replies`);
    if (postSnapshotReplies) {
      const countRepliesInPost = Object.keys(postSnapshotReplies).length;
      totalCommentCount += countRepliesInPost;
    }
  }

  return totalCommentCount;
};
