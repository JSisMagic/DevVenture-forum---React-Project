// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getDatabase } from 'firebase/database';
import { getAuth } from '@firebase/auth';
import {getStorage} from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBob-bKa3R-FoxcSSViMMSD735VTZ77NRM",
  authDomain: "react-project-8-756ce.firebaseapp.com",
  projectId: "react-project-8-756ce",
  storageBucket: "react-project-8-756ce.appspot.com",
  messagingSenderId: "894765322672",
  appId: "1:894765322672:web:7f57779917aeb18bbec675",
  databaseURL: "https://react-project-8-756ce-default-rtdb.europe-west1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app)
 export const storage=getStorage(app);
export const database = getDatabase(app);

export { app, analytics, auth };
