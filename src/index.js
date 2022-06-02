import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
// css stylesheets can be created for each component
// place them in the src/style directory, and import them like this: [[ import './style/index.css' ]];
import "./style/LoginOrRegister.css";
import "./style/index.css";
import "./style/TitleNavFooter.css";
import "./style/AllPlants.css";
import "./style/Home.css";
import "./style/AddNewProduct.css";
import "./style/Cart.css";
import "./style/Profile.css";
import { AuthProvider } from "./context";

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
