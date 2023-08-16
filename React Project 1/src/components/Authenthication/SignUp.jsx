import { useContext } from "react";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase-config";
import { db } from "../../services/database-services";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import {
  FIRST_NAME_MAX_LENGTH,
  FIRST_NAME_MIN_LENGTH,
  LAST_NAME_MAX_LENGTH,
  LAST_NAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "../../common/constants";

const SignUp = () => {
  const { setContext, ...appState } = useContext(AuthContext);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [inputErrors, setInputErrors] = useState({});
  const navigate = useNavigate();

  const signUp = (e) => {
    e.preventDefault();

    // Validate inputs
    const errors = {};
    if (
      firstname.length < FIRST_NAME_MIN_LENGTH ||
      firstname.length > FIRST_NAME_MAX_LENGTH
    ) {
      errors.firstname = `First name must be between ${FIRST_NAME_MIN_LENGTH} and ${FIRST_NAME_MAX_LENGTH} characters.`;
    }
    if (
      lastname.length < LAST_NAME_MIN_LENGTH ||
      lastname.length > LAST_NAME_MAX_LENGTH
    ) {
      errors.lastname = `Last name must be between ${LAST_NAME_MIN_LENGTH} and ${LAST_NAME_MAX_LENGTH} characters.`;
    }
    if (
      username.length < USERNAME_MIN_LENGTH ||
      username.length > USERNAME_MAX_LENGTH
    ) {
      errors.username = `Username must be between ${USERNAME_MIN_LENGTH} and ${USERNAME_MAX_LENGTH} characters.`;
    }
    if (!isValidEmail(email)) {
      errors.email =
        "Please enter a valid email address in the format username@example.com.";
    }
    if (!isValidPassword(password)) {
      errors.password = `Password must be at least ${PASSWORD_MIN_LENGTH} characters long and contain an uppercase letter, a lowercase letter, a number, and a special character.`;
    }

    setInputErrors(errors);

    if (Object.keys(errors).length === 0) {
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

          db.set(`users/${user.uid}`, userData);

          setContext({
            ...appState,
            user: {
              email: user.email,
              uid: user.uid,
            },
            userData,
          });

          navigate("/");
        })
        .catch((error) => {
          console.log(error);

          if (error.code === "auth/email-already-in-use") {
            setInputErrors({
              ...errors,
              email: "This email address is already in use.",
            });
          }
        });
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password) => {
    const passwordRegex = new RegExp(
      `(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*_=\\-+]).{${PASSWORD_MIN_LENGTH},}`
    );
    return passwordRegex.test(password);
  };

  const handleFirstnameChange = (e) => {
    setFirstname(e.target.value);
    setInputErrors({ ...inputErrors, firstname: "" });
  };

  const handleLastnameChange = (e) => {
    setLastname(e.target.value);
    setInputErrors({ ...inputErrors, lastname: "" });
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setInputErrors({ ...inputErrors, username: "" });
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
    <div className="sign-up-web">
      <form className="sign-up-container" onSubmit={signUp}>
        <h1 className="sign-up-header">Create account</h1>
        <input
          type="text"
          placeholder="Enter your firstname"
          value={firstname}
          onChange={handleFirstnameChange}
          className={inputErrors.firstname ? "error-input" : ""}
        />
        {inputErrors.firstname && (
          <p className="error-message">{inputErrors.firstname}</p>
        )}
        <input
          type="text"
          placeholder="Enter your lastname"
          value={lastname}
          onChange={handleLastnameChange}
          className={inputErrors.lastname ? "error-input" : ""}
        />
        {inputErrors.lastname && (
          <p className="error-message">{inputErrors.lastname}</p>
        )}
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={handleUsernameChange}
          className={inputErrors.username ? "error-input" : ""}
        />
        {inputErrors.username && (
          <p className="error-message">{inputErrors.username}</p>
        )}
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
        <button className="sign-up-button" type="submit">
          Sign Up
        </button>
        <p className="sign-up-tex">
          Already have an account?{" "}
          <Link
            to="/sign-in"
            style={{ fontWeight: "bold", textDecoration: "underline" }}
          >
            Sign in!
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
