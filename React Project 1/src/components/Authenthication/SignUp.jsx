import { useContext } from "react";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase-config";
import { db } from "../../services/database-services";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const SignUp = () => {
  const { setContext, ...appState } = useContext(AuthContext);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setContextname] = useState("");
  const navigate = useNavigate();

  const signUp = (e) => {
    e.preventDefault();

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const userData = {
          email: user.email,
          username: username,
          firstname: firstname,
          lastname: lastname,
          isAdmin: false,
        };

        // Create a new user document in the database using the user's UID as the key
        db.set(`users/${user.uid}`, userData);

        setContext({
          ...appState,
          user: {
            email: user.email,
            uid: user.uid,
          },
          userData,
        });
        console.log("USER GERGANA:", user);
        console.log("USER DATA GERGANA:", userData);

        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="sign-up-web">
      <form className="sign-up-container" onSubmit={signUp}>
        <h1 className="sign-up-header">Create account</h1>
        <input
          type="text"
          placeholder="Enter your firstname"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter your lastname"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setContextname(e.target.value)}
        />
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
        <button className="sign-up-button" type="submit">
          Sign Up
        </button>
        <p className="sign-up-tex">Already have an account? <Link to="/sign-in" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>Sign in!</Link></p>
      </form>
    </div>
  );
};

export default SignUp;
