import React from "react";
import { withRouter } from "react-router-dom";
import DialogPayment from "./dialog.payment";
import DialogReview from "./dialog.review";
import ContainerBase from "./../../../components/templates/kasir/container.base";
import ListOrders from "./list.orders";

const OrdersPage = () => {
  return (
    <ContainerBase title="Orders" tabActive={1}>
      <ListOrders />
      <DialogPayment />
      <DialogReview />
    </ContainerBase>
  );
};

export default withRouter(OrdersPage);
