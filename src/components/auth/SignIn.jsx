import React, { useState } from "react";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import LogInStatus from "./LogInStatus";
import authErrors from "./AuthErrorsLocal";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(null);

  const navigate = useNavigate();

  const signIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        //console.log(userCredential);
        navigate("/Chat");
      })
      .catch((error) => {
        //console.log(error);
        let errorKey = error.code.split("/")[1];
        setAuthError(authErrors[errorKey]);
      });
  };
  return (
    <div className="sign-container">
      <form onSubmit={signIn}>
        <h1>SIGN IN</h1>
        <h2>Email</h2>
        <input
          className="sign-input"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <h2>Password</h2>
        <input
          className="sign-input"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <button type="submit" className="sign-button">
          SIGN IN
        </button>
      </form>
      <p className="sign-p">
        You don't have an account? <Link to="/Sign-up">Sign up</Link>
      </p>
      <LogInStatus text={authError} />
    </div>
  );
};

export default SignIn;
