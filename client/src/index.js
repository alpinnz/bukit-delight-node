import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import Routes from "./routes";
import Store from "./redux";

render(
  <Provider store={Store}>
    <Routes />
  </Provider>,
  document.getElementById("root")
);
