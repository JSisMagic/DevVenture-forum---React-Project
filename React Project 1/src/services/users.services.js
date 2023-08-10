import { get, ref } from "firebase/database"
import { database } from "../config/firebase-config"

export const getAllUsers = async () => {
  const snapshot = await get(ref(database, "users"))

  if (!snapshot.exists()) {
    return []
  }

  return Object.values(snapshot.val())
}
