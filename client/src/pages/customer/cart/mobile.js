/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import ContainerBase from "./../../../components/common/container.customer.base";
import { Typography, Button } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import Actions from "./../../../actions";
import Overview from "./overview";
import Recipe from "./recipe";
import ListItemVertical from "./list.item.vertical";
import MenuDialog from "./../menu/menu.dialog";
import PaymentDialog from "./payment.dialog";

const Content = () => {
  const Cart = useSelector((state) => state.Cart.data);
  const dispatch = useDispatch();

  if (Cart.length <= 0 || Cart.loading) {
    return <div />;
  }
  return (
    <div>
      <Typography
        style={{ color: "#D95C17", margin: "1rem" }}
        variant="h6"
        align="center"
      >
        Sudah siap pesan ?
      </Typography>
      <ListItemVertical />
      <Recipe />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "1rem",
          marginBottom: "1rem",
        }}
      >
        <Button
          style={{
            paddingLeft: 125,
            paddingRight: 125,
            borderRadius: 9,
            backgroundColor: "#A42121",
            color: "#FFFFFF",
          }}
          variant="contained"
          onClick={() => dispatch(Actions.Cart.dialogPaymentOpen())}
        >
          <Typography style={{ color: "#FFFFFF" }}>Pesan</Typography>
        </Button>
      </div>
      <MenuDialog />
      <PaymentDialog />
    </div>
  );
};

const MobilePage = () => {
  return (
    <ContainerBase navigationActive={0}>
      <div style={{ marginLeft: "0.5rem", marginRight: "0.5rem" }}>
        <Overview />
        <Content title />
      </div>
    </ContainerBase>
  );
};

export default MobilePage;
