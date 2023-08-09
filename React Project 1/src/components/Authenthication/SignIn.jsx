import React from 'react';
import { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../config/firebase-config';
import { useNavigate } from 'react-router-dom';
import { AuthenticationVer } from './AuthenticationVer';
import './SignIn.css';

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signIn = (e) => {
    e.preventDefault();
    
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        navigate('/');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="sign-in-web">
      <form className='sign-in-container'  onSubmit={signIn}>
        <h1 className='sign-in-header'>Log in</h1>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className='sign-in-button'   type="submit">LogIn</button>
        <p className='sign-in-tex'>Don`t have an account? Sign up!</p>
      </form>
    </div>
  );
};

export default SignIn;
