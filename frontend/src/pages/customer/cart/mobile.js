/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import ContainerBase from "./../../../components/common/container.customer.base";
import { useSelector } from "react-redux";
import Overview from "./overview";
import CartOrders from "./cart.orders";
import InvoiceOrder from "./invoice.order";
import InvoiceTransaction from "./invoice.transaction";

const Content = () => {
  const Cart = useSelector((state) => state.Cart);

  if (Cart.order) {
    return <InvoiceOrder />;
  }

  if (Cart.transaction) {
    return <InvoiceTransaction />;
  }

  if (Cart.data.length > 0 && !Cart.transaction && !Cart.order) {
    return <CartOrders />;
  }
  return <div />;
};

const MobilePage = () => {
  return (
    <ContainerBase navigationActive={0}>
      <div style={{ paddingLeft: "0.5rem", paddingRight: "0.5rem" }}>
        <Overview />
        <Content title />
      </div>
    </ContainerBase>
  );
};

export default MobilePage;
