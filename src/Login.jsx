import React, { useState } from "react";
import "./Css/login.css";
import Lnavbar from "./Components/Lnavbar";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  function signin() {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    if (username.trim() === "" || password.trim() === "") {
      alert("Please fill in all fields.");
      return;
    }

    fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    }).then((res) => {
      if (res.status === 200) {
        navigate("/forgot-password");
      } else {
        alert("Login failed.");
      }
    });
  }

  const [signup, setsignup] = useState(false);
  return (
    <>
      <div className="main-container">
        <Lnavbar />
        <div className="main-auth-box">
          <div className={`auth  ${signup ? "signcss" : ""}`}>
            <div className="choice">
              <div
                className={`login auth-common ${!signup ? "activelogin" : ""}`}
                onClick={() => setsignup(false)}
              >
                Login
              </div>

              <div
                className={`login auth-common ${signup ? "activesignup" : ""}`}
                onClick={() => setsignup(true)}
              >
                Signup
              </div>
            </div>
            {!signup && (
              <form
                action=""
                className={`auth-form  ${signup ? "signcssform" : ""}`}
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <div className={`inputs  ${signup ? "signcssinputs" : ""}`}>
                  <input
                    type="text"
                    name="username"
                    id="login-username"
                    placeholder="Username"
                    className="input-field"
                  />
                  <input
                    type="password"
                    name="password"
                    id="login-password"
                    placeholder="Password"
                    className="input-field"
                  />
                </div>

                <button
                  className="login-btn"
                  type="submit"
                  onClick={() => {
                    signin();
                  }}
                >
                  Login
                </button>
              </form>
            )}

            {signup && (
              <form
                action=""
                className={`auth-form  ${signup ? "signcssform" : ""}`}
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <div className={`inputs  ${signup ? "signcssinputs" : ""}`}>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    placeholder="Username"
                    className="input-field"
                  />
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Password"
                    className="input-field"
                  />

                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Email"
                    className="input-field"
                  />
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    placeholder="Confirm Password"
                    className="input-field"
                  />
                </div>

                <button className="login-btn" type="submit">
                  Sign up
                </button>
              </form>
            )}
            <div className={`forgot-pass ${signup ? "hide" : ""}`}>
              <Link to="/forgot-password">Forgot Password</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
