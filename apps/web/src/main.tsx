import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element was not found");

ReactDOM.render(<App />, rootElement);
