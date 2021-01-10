import React from "react";
import { withRouter } from "react-router-dom";
import Template from "./../../../components/templates/admin";
import Table from "./table";

const AccountsPage = () => {
  return (
    <Template title="Menus">
      <Table />
    </Template>
  );
};

export default withRouter(AccountsPage);
