import React, { useEffect } from "react";
import AppBar from "./app.bar.js";
import TopTabs from "./top.tabs";

const ContainerBase = (props) => {
  const { tabActive, children, title } = props;
  useEffect(() => {
    document.title = title;
  }, [title]);
  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      <AppBar title="Kasir" />
      <TopTabs tabActive={tabActive} />
      {children}
    </div>
  );
};

export default ContainerBase;
