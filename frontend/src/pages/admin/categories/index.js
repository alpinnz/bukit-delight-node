import React from "react";
import { withRouter } from "react-router-dom";
import Template from "./../../../components/templates/admin";
import Table from "./table";

const CategoriesPage = () => {
  return (
    <Template title="Categories">
      <Table />
    </Template>
  );
};

export default withRouter(CategoriesPage);
