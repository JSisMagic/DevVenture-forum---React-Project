import { equalTo, get, orderByChild, query, ref } from "firebase/database"
import { database } from "../config/firebase-config"

export const getAllPosts = async () => {
  const snapshot = await get(ref(database, "posts"))

  if (!snapshot.exists()) {
    return []
  }

  return Object.values(snapshot.val())
}

export const getUserPosts = async username => {
  const snapshot = await get(query(ref(database, "posts"), orderByChild("user"), equalTo(username)))

  const value = snapshot.val()

  return value
    ? Object.keys(value).map(key => ({
        ...value[key],
        id: key,
      }))
    : []
}
