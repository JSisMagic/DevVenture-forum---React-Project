import React from 'react';
import { useState } from 'react';
import { createUserWithEmailAndPassword} from "firebase/auth";
import { auth } from '../../config/firebase-config';
import { db } from '../../services/database-services';


const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const signUp = (e) => {
    e.preventDefault();

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const userData = {
          email: user.email,
          username: username,
        };

        // Create a new user document in the database using the user's UID as the key
        db.set(`users/${user.uid}`, userData);
        console.log('User data stored in the database:', userData);
      })
      .catch((error) => {
        console.log(error);
      });
  };


  return (
    <div className='sign-in-container'>
      <form onSubmit={signUp}>
        <h1>Create account</h1>
        <input type='email' placeholder='Enter your email' value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type='password' placeholder='Enter your password' value={password} onChange={(e) => setPassword(e.target.value)} />
        <input type='text' placeholder='Enter your username' value={username} onChange={(e) => setUsername(e.target.value)} />
        <button type='submit'>Sign Up</button>
      </form>
    </div>
  )
}


export default SignUp ;