import { Button, Typography } from "@material-ui/core";
import { useDispatch } from "react-redux";
import Actions from "../../../../actions";
import CustomerCartItemList, { type CartLine } from "./cart-item-list";
import CustomerCartRecipe from "./recipe";
import CustomerPaymentDialog from "./payment-dialog";

const CustomerDesktopCartOrders = () => {
  const dispatch = useDispatch();
  const onEditItem = (item: CartLine) => {
    dispatch(
      Actions.Cart.selectedEdit(item.menu, item._id, item.quality, item.note),
    );
  };

  return (
    <div>
      <Typography
        style={{ color: "#D95C17", margin: "1rem" }}
        variant="h6"
        align="center"
      >
        Sudah siap pesan ?
      </Typography>
      <CustomerCartItemList onEditItem={onEditItem} />
      <CustomerCartRecipe />
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
      <CustomerPaymentDialog />
    </div>
  );
};

export default CustomerDesktopCartOrders;
