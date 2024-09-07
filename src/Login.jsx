import React, { useState } from "react";
import "./Css/login.css";
import Lnavbar from "./Components/Lnavbar";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "./firebase"; // Ensure this path is correct

const Login = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [signup, setsignup] = useState(false);

  function signin() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    if (email.trim() === "" || password.trim() === "") {
      alert("Please fill in all fields.");
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        navigate("/forgot-password");
      })
      .catch((error) => {
        console.error("Login failed:", error.code, error.message);
        alert("Login failed.");
      });
  }

  function signupUser() {
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (email.trim() === "" || password.trim() === "") {
      alert("Please fill in all fields.");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        // Send verification email
        sendEmailVerification(user)
          .then(() => {
            alert("Verification email sent. Please check your inbox.");
          })
          .catch((error) => {
            console.error("Error sending email verification:", error);
            alert("Failed to send verification email.");
          });
      })
      .catch((error) => {
        console.error("Error during sign up:", error);
        alert("Sign up failed. Please try again.");
      });
  }

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
                    type="email"
                    name="email"
                    id="login-email"
                    placeholder="Email"
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
                  onClick={() => signin()}
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
                    type="email"
                    name="email"
                    id="signup-email"
                    placeholder="Email"
                    className="input-field"
                  />
                  <input
                    type="password"
                    name="password"
                    id="signup-password"
                    placeholder="Password"
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

                <button
                  className="login-btn"
                  type="submit"
                  onClick={() => signupUser()}
                >
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
