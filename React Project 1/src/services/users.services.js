import { equalTo, get, orderByKey, query, ref } from "firebase/database"
import { database } from "../config/firebase-config"

export const getAllUsers = async () => {
  const snapshot = await get(ref(database, "users"))

  if (!snapshot.exists()) {
    return []
  }
  const data = snapshot.val();
  return Object.keys(data).map(key => ({
    uid: key,
    ...data[key]
  }))
}

export const getUserById = async uid => {
  const snapshot = await get(query(ref(database, "users"), orderByKey("uid"), equalTo(uid)));
  const value = snapshot.val();
  return value ? {
    ...Object.values(value)[0],
    comments: Object.values(value)[0]?.comments ?
      Object.keys(Object.values(value)[0].comments) : [],
    posts: Object.values(value)[0]?.posts ?
      Object.keys(Object.values(value)[0].posts) : [],
    likedPosts: Object.values(value)[0]?.likedPosts ?
      Object.keys(Object.values(value)[0].likedPosts) : [],
  } : value;
}
