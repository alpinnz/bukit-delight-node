/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import ContainerBase from "./../components/container.base";
import useWindowDimensions from "./../components/hooks/useWindowDimensions";
import Actions from "./../redux/actions";
import Axios from "./../helpers/axios";
import { Typography, Button } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import PaymentDialog from "./../components/customer/cart/payment.dialog.js";
import ListItemVertical from "./../components/customer/cart/list.item.vertical";
import Overview from "./../components/customer/cart/overview";
import Recipe from "./../components/customer/cart/recipe";

const CardView = () => {
  const Cart = useSelector((state) => state.Cart);
  const [isDialog, setIsDialog] = React.useState(false);
  const dispatch = useDispatch();

  const { width } = useWindowDimensions();

  const margin = width * 0.025;

  React.useEffect(() => {
    LOAD_API_GET();
  }, []);

  const LOAD_API_GET = () => {
    Axios.get("api/v1/menus")
      .then((response) => {
        console.log(response);
        const data = response["data"]["data"];
        dispatch(Actions.Menus.UPDATE(data));
      })
      .catch((err) => {
        dispatch(Actions.Services.popupNotification(`Menus :${err}`));
        console.log(err);
      });
  };

  return (
    <ContainerBase title="Cart" navigationActive={0}>
      <div style={{ marginLeft: margin, marginRight: margin }}>
        <Overview />
        <Typography
          style={{ color: "#D95C17", margin: "1rem" }}
          variant="h6"
          align="center"
        >
          Sudah siap pesan ?
        </Typography>

        <ListItemVertical />

        {/* {Cart.length > 0 ? <Recipe data={data} /> : <div />} */}

        {Cart.length > 0 ? (
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
              onClick={() => setIsDialog(true)}
            >
              <Typography style={{ color: "#FFFFFF" }}>Pesan</Typography>
            </Button>
          </div>
        ) : (
          <div />
        )}
      </div>

      <PaymentDialog open={isDialog} onClose={() => setIsDialog(false)} />
    </ContainerBase>
  );
};

export default CardView;
