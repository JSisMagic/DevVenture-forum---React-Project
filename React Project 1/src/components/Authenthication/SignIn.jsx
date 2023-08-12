import { signInWithEmailAndPassword } from "firebase/auth";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../config/firebase-config";
import { AuthContext } from "../../context/AuthContext";
import "./SignIn.css";
import { Link } from "react-router-dom";

const SignIn = () => {
  const { setContext, ...appState } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signIn = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("USER CRED:", userCredential);
        setContext({
          ...appState,
          user: {
            email: userCredential.email,
            uid: userCredential.uid,
          },
        });
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="sign-in-web">
      <form className="sign-in-container" onSubmit={signIn}>
        <h1 className="sign-in-header">Log in</h1>
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
        <button className="sign-in-button" type="submit">
          LogIn
        </button>
        <p className="sign-in-tex">Don`t have an account? <Link to="/sign-up" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>Sign up!</Link></p>
      </form>
    </div>
  );
};

export default SignIn;
