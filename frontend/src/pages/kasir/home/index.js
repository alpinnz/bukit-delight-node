import React from "react";
import { withRouter } from "react-router-dom";
import ContainerBase from "./../../../components/templates/kasir/container.base";

const HomePage = () => {
  return (
    <ContainerBase title="Home" tabActive={0}>
      home
    </ContainerBase>
  );
};

export default withRouter(HomePage);
