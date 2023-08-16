import { set, ref, get, push, remove, update } from "firebase/database";
import { database } from "../config/firebase-config.js";

export const db = {
  async set(path, data) {
    try {
      const reference = ref(database, path);

      await set(reference, data);
      console.log("Data set successfully.");
    } catch (error) {
      console.log(error.message);
    }
  },

  async get(path, ...constraints) {
    try {
      const reference = ref(database, path);
      let snapshot;

      if (constraints.length > 0) {
        snapshot = await get(reference, ...constraints);
      } else {
        snapshot = await get(reference);
      }

      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        console.log("No data available.");
        return null;
      }
    } catch (error) {
      console.log(error.message);
    }
  },

  async push(path, data) {
    try {
      const reference = ref(database, path);
      const key = (await push(reference, data)).key;

      console.log("Data pushed successfully.");
      return key;
    } catch (error) {
      console.log(error.message);
    }
  },

  async remove(path) {
    try {
      const reference = ref(database, path);

      await remove(reference);
      console.log("Data removed successfully.");
    } catch (error) {
      console.log(error.message);
    }
  },

  async update(path, newData) {
    try {
      const reference = ref(database, path);

      await update(reference, newData);

      console.log("Data updated successfully.");
    } catch (error) {
      console.log(error.message);
    }
  },
};
