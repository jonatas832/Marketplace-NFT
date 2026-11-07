// @ts-ignore React types may be unavailable in this project.
import React from "react";
// @ts-ignore ReactDOM client types may be unavailable in this project.
import ReactDOM from "react-dom/client";
import App from "./App";
// @ts-ignore TypeScript may not have a declaration for CSS side-effect imports.
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  React.createElement(React.StrictMode, null, React.createElement(App))
);