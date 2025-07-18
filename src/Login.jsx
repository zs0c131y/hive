import React, { useState } from "react";
import "./Css/login.css";
import Lnavbar from "./Components/Lnavbar";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth as firebaseAuth } from "./firebase";

const Login = ({ setlogin }) => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [signup, setSignup] = useState(false);

  const signin = () => {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    if (email.trim() === "" || password.trim() === "") {
      alert("Please fill in all fields.");
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        // Check if the email is verified
        if (user.emailVerified) {
          Cookies.set("userSession", "loggedIn", { expires: 7 });
          Cookies.set("userEmail", email, { expires: 7 });
          setlogin(true);
          navigate("/Home");
        } else {
          alert("Please verify your email before logging in.");
          // Optionally, you can resend the verification email here
          sendEmailVerification(user)
            .then(() => {
              alert(
                "Verification email has been sent again. Please check your inbox."
              );
            })
            .catch((error) => {
              console.error("Error sending email verification:", error);
            });
        }
      })
      .catch((error) => {
        console.error("Login failed:", error.code, error.message);
        alert("Login failed.");
      });
  };

  const saveToMongo = async (email, name) => {
    try {
      const response = await fetch("/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name }),
      });

      if (!response.ok) {
        throw new Error("Failed to save user data");
      }
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  const signupUser = () => {
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const name = document.getElementById("name").value;

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (email.trim() === "" || password.trim() === "" || name.trim() === "") {
      alert("Please fill in all fields.");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        // Save the user data to MongoDB after successful sign up
        saveToMongo(email, name);

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
  };

  return (
    <>
      <div className="main-container">
        <Lnavbar />
        <div className="main-auth-box">
          <div className={`auth ${signup ? "signcss" : ""}`}>
            <div className="choice">
              <div
                className={`login auth-common ${!signup ? "activelogin" : ""}`}
                onClick={() => setSignup(false)}
              >
                Login
              </div>
              <div
                className={`login auth-common ${signup ? "activesignup" : ""}`}
                onClick={() => setSignup(true)}
              >
                Signup
              </div>
            </div>

            {!signup && (
              <form
                className={`auth-form ${signup ? "signcssform" : ""}`}
                onSubmit={(e) => e.preventDefault()}
              >
                <div className={`inputs ${signup ? "signcssinputs" : ""}`}>
                  <input
                    type="email"
                    id="login-email"
                    placeholder="Email"
                    className="input-field"
                  />
                  <input
                    type="password"
                    id="login-password"
                    placeholder="Password"
                    className="input-field"
                  />
                </div>
                <button className="login-btn" onClick={signin}>
                  Login
                </button>
              </form>
            )}

            {signup && (
              <form
                className={`auth-form ${signup ? "signcssform" : ""}`}
                onSubmit={(e) => e.preventDefault()}
              >
                <div className={`inputs ${signup ? "signcssinputs" : ""}`}>
                  <input
                    type="name"
                    id="name"
                    placeholder="Full Name"
                    className="input-field"
                  />
                  <input
                    type="email"
                    id="signup-email"
                    placeholder="Email"
                    className="input-field"
                  />
                  <input
                    type="password"
                    id="signup-password"
                    placeholder="Password"
                    className="input-field"
                  />
                  <input
                    type="password"
                    id="confirmPassword"
                    placeholder="Confirm Password"
                    className="input-field"
                  />
                </div>
                <button
                  className="login-btn"
                  onClick={() => {
                    signupUser();
                  }}
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
