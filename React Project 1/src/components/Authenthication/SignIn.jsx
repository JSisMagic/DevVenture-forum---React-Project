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
  const [inputErrors, setInputErrors] = useState({});
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

        if (error.code === "auth/user-not-found") {
          setInputErrors({ ...inputErrors, email: "User not found." });
        } else if (error.code === "auth/wrong-password") {
          setInputErrors({ ...inputErrors, password: "Incorrect password." });
        } else if (error.code === "auth/invalid-email")
          setInputErrors({ ...inputErrors, email: "Invalid email address." });
        else if (error.code === "auth/too-many-requests")
          setInputErrors({
            ...inputErrors,
            password: "Too many failed attempts.",
          });
      });
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setInputErrors({ ...inputErrors, email: "" });
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setInputErrors({ ...inputErrors, password: "" });
  };

  return (
    <div className="sign-in-web">
      <form className="sign-in-container" onSubmit={signIn}>
        <h1 className="sign-in-header">Log in</h1>
        <input
          type="text"
          placeholder="Enter your email"
          value={email}
          onChange={handleEmailChange}
          className={inputErrors.email ? "error-input" : ""}
        />
        {inputErrors.email && (
          <p className="error-message">{inputErrors.email}</p>
        )}
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={handlePasswordChange}
          className={inputErrors.password ? "error-input" : ""}
        />
        {inputErrors.password && (
          <p className="error-message">{inputErrors.password}</p>
        )}
        <button className="sign-in-button" type="submit">
          LogIn
        </button>
        <p className="sign-in-tex">
          Don`t have an account?{" "}
          <Link
            to="/sign-up"
            style={{ fontWeight: "bold", textDecoration: "underline" }}
          >
            Sign up!
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
