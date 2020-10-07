import React from "react";
import "./Login.css";
import { Button } from "@material-ui/core";
import { auth, provider } from "../firebase";
import { useStateValue } from "../StateProvider";

function Login() {
  const [{}, dispatch] = useStateValue();

  const signIn = () => {
    auth
      .signInWithPopup(provider)
      .then((result) =>
        dispatch({
          type: "SET_USER",
          user: result.user,
        })
      )
      .catch((error) => alert(error.message));
  };
  return (
    <div className="login">
      <div className="login__container">
        <img src="/logo.png" alt="" />
        <div className="login__text">
          <h1>Sign in to use Application</h1>
        </div>
        <Button type="submit" onClick={signIn}>
          Sign In
        </Button>
      </div>
    </div>
  );
}

export default Login;
