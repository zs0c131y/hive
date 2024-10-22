import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import Login from "./Login";
import "./App.css";
import Forgetpassword from "./Forgetpassword";
import Home from "./Home";
import Profile from "./Profile";
import Error from "./Error";
import LandingPage from "./LandingPage";

const App = () => {
  const [login, setlogin] = useState(!!Cookies.get("userSession"));
  const [email, setEmail] = useState(Cookies.get("userEmail") || "");
  const [history, setHistory] = useState([]);

  const addToHistory = (acceptedRequest) => {
    setHistory((prevHistory) => [...prevHistory, acceptedRequest]);
  };

  const handleLogout = () => {
    Cookies.remove("userSession");
    setlogin(false);
  };

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage/>}/>
          <Route path="/login" element={<Login setlogin={setlogin} />} />
          <Route path="/forgot-password" element={<Forgetpassword />} />
          <Route
            path="/Home"
            element={
              login ? <Home addToHistory={addToHistory} /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/Profile"
            element={
              login ? <Profile history={history} /> : <Navigate to="/login" />
            }
          />
          <Route path="*" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
