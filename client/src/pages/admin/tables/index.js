import React from "react";
import { withRouter } from "react-router-dom";
import Template from "./../../../components/templates/admin";
import Table from "./table";

const TablesPage = () => {
  return (
    <Template title="Tables">
      <Table />
    </Template>
  );
};

export default withRouter(TablesPage);
