import React from "react";
import logo from "../assets/CloversForLogoBackground.jpg";

export default function Title() {
  return (
    <>
      <div className="logoDiv">
        <img src={logo} alt="logo pic" className="logoImage"></img>
        <div className="logoText">"Plant-O-Licious!"</div>
      </div>
    </>
  );
}
