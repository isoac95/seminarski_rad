import React, { useState } from "react";
import { auth, colRefUsers } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import LogInStatus from "./LogInStatus";
import authErrors from "./AuthErrorsLocal";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userNickname, setUserNickname] = useState("");
  const [authError, setAuthError] = useState(null);

  const navigate = useNavigate();
  const addUser = () => {
    //console.log("Dodavanje novog usera u database");
    addDoc(colRefUsers, {
      username: email.toLowerCase(),
      nickname: userNickname,
    })
      .then((id) => {
        //console.log(id)
      })
      .catch((error) => {
        //console.log(error)
      });
  };

  const signUp = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        //console.log(userCredential);
        navigate("/");
        //add user to database
        /*addDoc(colRefUsers, {
          username: email,
        });*/
        addUser();
      })
      .catch((error) => {
        //console.log(error);
        let errorKey = error.code.split("/")[1];
        setAuthError(authErrors[errorKey]);
      });
  };
  return (
    <div className="sign-container">
      <form onSubmit={signUp}>
        <h1>SIGN UP</h1>
        <h2>Nickname</h2>
        <input
          required
          className="sign-input"
          type="text"
          placeholder="Enter your nickname"
          value={userNickname}
          onChange={(e) => setUserNickname(e.target.value)}
        ></input>
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
          SIGN UP
        </button>
      </form>
      <p className="sign-p">
        You already have an account? <Link to="/">Sign in</Link>
      </p>
      <LogInStatus text={authError} />
    </div>
  );
};

export default SignUp;
