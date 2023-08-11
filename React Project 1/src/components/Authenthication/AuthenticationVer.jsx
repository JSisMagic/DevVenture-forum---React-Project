import { useEffect } from 'react';
import { auth } from '../../config/firebase-config';
import { onAuthStateChanged } from 'firebase/auth';


export const AuthenticationVer = () => {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        logAuthenticationStatus(`User ${user.email} logged in`);
      } else {
        logAuthenticationStatus('User logged out');
      }
    });

    const logAuthenticationStatus = (message) => {
      console.log(message);
    };

    return () => unsubscribe();
  }, []);


  return null; // This is an empty JSX element
};
