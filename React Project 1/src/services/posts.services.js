import { get, ref } from "firebase/database"
import { database } from "../config/firebase-config"

export const getAllPosts = async () => {
  const snapshot = await get(ref(database, "posts"))

  if (!snapshot.exists()) {
    return []
  }

  return Object.values(snapshot.val())
}
