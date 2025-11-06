import React from "react";
import ReactDOM from "react-dom/client";
// import { HashRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import env from "./envCheck";
console.log("ENV:", env);


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    {/* <HashRouter> */}
      <App />
    {/* </HashRouter> */}
  </React.StrictMode>
);