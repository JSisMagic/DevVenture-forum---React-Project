// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBob-bKa3R-FoxcSSViMMSD735VTZ77NRM",
  authDomain: "react-project-8-756ce.firebaseapp.com",
  projectId: "react-project-8-756ce",
  storageBucket: "react-project-8-756ce.appspot.com",
  messagingSenderId: "894765322672",
  appId: "1:894765322672:web:7f57779917aeb18bbec675"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const database = getDatabase(app);

export { app, analytics };
