// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDJWbPZWZL0eHKJlXqrIdrFqNYqmNHmucI",
    authDomain: "1st-react-project.firebaseapp.com",
    projectId: "1st-react-project",
    storageBucket: "1st-react-project.appspot.com",
    messagingSenderId: "421846175867",
    appId: "1:421846175867:web:4baf4e718bd175751c92de",
    measurementId: "G-JDXRN06FKF",
    databaseURL: "https://st-react-project-d2c31-default-rtdb.europe-west1.firebasedatabase.app"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

export { app, analytics };
