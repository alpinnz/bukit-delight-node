import { Button, Typography } from "@material-ui/core";
import { useDispatch } from "react-redux";
import Actions from "../../../../actions";
import MenuDialog from "../../components/menu-dialog";
import PaymentDialog from "./payment-dialog";
import Recipe from "./recipe";
import ListItemVertical from "./cart-item-list";

const CustomerCartOrders = () => {
  const dispatch = useDispatch();

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

export default CustomerCartOrders;
