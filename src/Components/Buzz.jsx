import React from "react";
import "../Css/home.css";

const Buzz = (props) => {
  return (
    <div className="req-box">
      <img src="../Images/pp.png" alt="" className="req-box-profile" />
      <div className="req-desc">{props.title}</div>
      <button onClick={props.func} className="req-accept">
        View
      </button>
    </div>
  );
};

export default Buzz;
