import React from "react";
import { useState, useEffect } from "react";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const AuthDetails = ({ loggedUser, usersProp }) => {
  const [userNickname, setUserNickname] = useState("");

  useEffect(() => {
    if (usersProp.length > 0) {
      setUserNickname(
        usersProp.filter((item) => item[1] === loggedUser.email)[0][0]
      );
    }
  }, [usersProp, loggedUser]);

  const navigate = useNavigate();

  const userSignOut = () => {
    signOut(auth)
      .then(() => {
        //console.log("Sign out was successful");
        navigate("/");
      })
      .catch((error) => {
        //console.log(error)
      });
  };

  return (
    <div className="auth">
      {loggedUser ? (
        <>
          <p className="bold">
            {userNickname}&nbsp;<p className="email">({loggedUser.email})</p>
          </p>
          <button onClick={userSignOut}>Sign Out</button>
        </>
      ) : (
        <p>Signed Out {loggedUser}</p>
      )}
    </div>
  );
};

export default AuthDetails;
