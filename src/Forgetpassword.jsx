import React, { useState } from "react";
import "./Css/login.css";
import Lnavbar from "./Components/Lnavbar";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const Forgetpassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    try {
      await sendPasswordResetEmail(auth, email);
      alert("Reset link is sent to your email.");
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <div className="main-container">
        <Lnavbar />
        <div className="main-auth-box">
          <div className="auth">
            <div className="f-pass">Forgot Password</div>

            <form onSubmit={handlePasswordReset} className="f-pass-form">
              <input
                type="email"
                name="email"
                id="email"
                className="input-field"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Set email input
                required
              />

              <div className="continue">
                <button type="submit" className="send-reset-email">
                  Send Reset Email
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Forgetpassword;
