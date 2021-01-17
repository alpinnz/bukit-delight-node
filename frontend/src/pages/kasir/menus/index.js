import React from "react";
import { withRouter } from "react-router-dom";
import ContainerBase from "./../../../components/templates/kasir/container.base";

const MenusPage = () => {
  return (
    <ContainerBase title="Menus" tabActive={0}>
      Menus
    </ContainerBase>
  );
};

export default withRouter(MenusPage);
