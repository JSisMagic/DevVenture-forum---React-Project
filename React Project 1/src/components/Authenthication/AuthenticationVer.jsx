import { useEffect } from 'react';
import { auth } from '../../config/firebase-config';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';


export const AuthenticationVer = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        logAuthenticationStatus(`User ${user.email} logged in`);
      } else {
        logAuthenticationStatus('User logged out');
        navigate("/")
      }
    });

    const logAuthenticationStatus = (message) => {
      console.log(message);
    };

    return () => unsubscribe();
  }, []);


  return null; // This is an empty JSX element
};
