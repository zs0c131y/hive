import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import Login from "./Login";
import "./App.css";
import Forgetpassword from "./Forgetpassword";
import Home from "./Home";
import Profile from "./Profile";
import Error from "./Error";

const App = () => {
  const [login, setlogin] = useState(!!Cookies.get("userSession")); // Check if session cookie exists
  const [email, setEmail] = useState(Cookies.get("userEmail") || ""); // Retrieve email from cookie
  const [history, setHistory] = useState([]);

  const addToHistory = (acceptedRequest) => {
    setHistory((prevHistory) => [...prevHistory, acceptedRequest]);
  };

  // Optionally, handle logout by clearing the session cookie
  const handleLogout = () => {
    Cookies.remove("userSession"); // Remove the session cookie
    setlogin(false); // Update login state
  };

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login setlogin={setlogin} />} />
          <Route path="/forgot-password" element={<Forgetpassword />} />
          <Route
            path="/Home"
            element={
              login ? <Home addToHistory={addToHistory} /> : <Navigate to="/" />
            }
          />
          <Route
            path="/Profile"
            element={
              login ? <Profile history={history} /> : <Navigate to="/" />
            }
          />
          <Route path="*" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
