import { get, query, ref } from "firebase/database"
import { database } from "../config/firebase-config"

export const getAllPosts = async () => {
  const snapshot = await get(ref(database, "posts"))

  const value = snapshot.val()
  return Object.values(value)
}

getAllPosts()
