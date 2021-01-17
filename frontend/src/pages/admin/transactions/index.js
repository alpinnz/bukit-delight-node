import React from "react";
import { withRouter } from "react-router-dom";
import Template from "./../../../components/templates/admin";
import Table from "./table";

const TransactionsPage = () => {
  return (
    <Template title="Transactions">
      <Table />
    </Template>
  );
};

export default withRouter(TransactionsPage);
