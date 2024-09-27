import React, { useState } from "react";
import "./Css/home.css";

import Hnavbar from "./Components/Hnavbar";
import Liverequest from "./Components/Liverequest";
import Databank from "./Components/Databank";
import Campusbuzz from "./Components/Campusbuzz";
const Home = () => {
  const [frame, setframe] = useState("1");
  return (
    <>
      <div className="home-container">
        <Hnavbar />

        <div className="option-holder">
          <div
            className={`options ${frame == 1 ? "option-clicked" : ""}`}
            onClick={() => {
              setframe("1");
            }}
          >
            Live Requests
          </div>
          <div
            className={`options ${frame == 2 ? "option-clicked" : ""}`}
            onClick={() => {
              setframe("2");
            }}
          >
            Data Bank
          </div>
          <div
            className={`options ${frame == 3 ? "option-clicked" : ""}`}
            onClick={() => {
              setframe("3");
            }}
          >
            Campus Buzz
          </div>
          <div
            className={`options ${frame == 4 ? "option-clicked" : ""}`}
            onClick={() => {
              setframe("4");
            }}
          >
            Updates
          </div>
        </div>

        {frame == "1" ? (
          <>
            <div>
              <Liverequest />
            </div>
          </>
        ) : (
          ""
        )}
        {frame == "2" ? (
          <>
            <div className="options">
              <Databank />
            </div>
          </>
        ) : (
          ""
        )}
        {frame == "3" ? (
          <>
            <div className="options">
              <Campusbuzz />
            </div>
          </>
        ) : (
          ""
        )}
        {frame == "4" ? (
          <>
            <div className="options">wello</div>
          </>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default Home;
