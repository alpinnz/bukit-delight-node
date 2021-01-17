import React from "react";
import ContainerBase from "./../container.kasir";
import ListTransactions from "./list.transactions";
import DialogReview from "./dialog.review";
import DialogStatus from "./dialog.status";

const Mobile = () => {
  return (
    <ContainerBase tabActive={2}>
      <ListTransactions />
      <DialogReview />
      <DialogStatus />
    </ContainerBase>
  );
};

export default Mobile;
