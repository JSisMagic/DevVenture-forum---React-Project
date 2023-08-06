import React, {useState,useEffect} from 'react';
import { auth } from '../../config/firebase-config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { set } from 'firebase/database';
const AuthenticationVer=()=>{
  const [authenticationUser,setAuthenticationUser]=useState(null);
 useEffect(()=>{
    const checking=onAuthStateChanged(auth,(user)=>
  {if(user){
      setAuthenticationUser(user);
    } else{
      setAuthenticationUser(null);
    }
  })
  return checking()
},[])
const userSignOut=()=>{
  signOut(auth).then(()=>{
    console.log("Signed out")
  }
  ).catch((error)=>console.log(error))
}
 
  return (
    <div>
      {
      authenticationUser ?( <>
      <p>{`Signed in as${authenticationUser.username}`}</p>
      <button onClick={userSignOut}>Sign Out</button>
      </>
      ):(
        <p>Sign Out</p>
    )}
    </div>
  )
}
export default AuthenticationVer;