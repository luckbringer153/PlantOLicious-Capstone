import React from "react";
import { Link } from "react-router-dom";

function Copyright() {
  return (
    <div>
      {"Copyright © "}
      <Link color="inherit" to="/home" className="copyrightLink">
        <u>Plant-O-Licous</u>
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </div>
  );
}

export default function Footer() {
  return (
    <aside className="footerText">
      <Copyright />
    </aside>
  );
}
