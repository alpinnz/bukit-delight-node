import React, { useEffect } from "react";
import { Container } from "@material-ui/core";

const ContainerCustom = ({ title, children, ...props }) => {
  useEffect(() => {
    document.title = `${title || ""}`;
  }, [title]);
  return (
    <Container style={{ minHeight: "100vh" }} component="main" {...props}>
      {children}
    </Container>
  );
};

export default ContainerCustom;
