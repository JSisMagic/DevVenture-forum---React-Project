import React, { useState, useEffect } from 'react';
import { auth } from '../../config/firebase-config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const AuthenticationVer = () => {
  const [authenticationUser, setAuthenticationUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthenticationUser(user);
      } else {
        setAuthenticationUser(null);
      }
    });

    return () => unsubscribe();
  }, []);


  return (
    <div>
      {authenticationUser ? (
        <>
          <p>{`Signed in as ${authenticationUser.email}`}</p>
        </>
      ) : (
        <p>Signed Out</p>
      )}
    </div>
  );
};

export default AuthenticationVer;
