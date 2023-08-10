import React from "react"
import { useState } from "react"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "../../config/firebase-config"
import { db } from "../../services/database-services"
import { useNavigate } from "react-router-dom"
import "./SignUp.css"

const SignUp = () => {
  const [firstname, setFirstname] = useState("")
  const [lastname, setLastname] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const navigate = useNavigate()

  const signUp = e => {
    e.preventDefault()

    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        const user = userCredential.user
        const userData = {
          email: user.email,
          username: username,
          firstname: firstname,
          lastname: lastname,
          role: "user",
        }

        // Create a new user document in the database using the user's UID as the key
        db.set(`users/${user.uid}`, userData)
        console.log("User data stored in the database:", userData)

        navigate("/")
      })
      .catch(error => {
        console.log(error)
      })
  }

  return (
    <div className="sign-up-web">
      <form className="sign-up-container" onSubmit={signUp}>
        <h1 className="sign-up-header">Create account</h1>
        <input
          type="text"
          placeholder="Enter your firstname"
          value={firstname}
          onChange={e => setFirstname(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter your lastname"
          value={lastname}
          onChange={e => setLastname(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button className="sign-up-button" type="submit">
          Sign Up
        </button>
        <p className="sign-up-tex">Already have an account? Sign in!</p>
      </form>
    </div>
  )
}

export default SignUp
