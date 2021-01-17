import React from "react";
import { withRouter } from "react-router-dom";
import ContainerBase from "./../../../components/templates/kasir/container.base";
import ListTransactions from "./list.transactions";
import DialogReview from "./dialog.review";
import DialogStatus from "./dialog.status";

const TransactionsPage = () => {
  return (
    <ContainerBase title="Transactions" tabActive={2}>
      <ListTransactions />
      <DialogReview />
      <DialogStatus />
    </ContainerBase>
  );
};

export default withRouter(TransactionsPage);
