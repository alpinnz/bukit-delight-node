import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import AppBar from "./app.bar.js";

const ContainerBase = (props) => {
  const { children, title } = props;
  useEffect(() => {
    document.title = title;
  }, [title]);
  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      <AppBar title="Kasir" />
      {children}
    </div>
  );
};

export default withRouter(ContainerBase);
