import { Button, Typography } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import Actions from "../../../../actions";
import Convert from "../../../../helpers/convert";

type CartMenu = { name?: string; promo?: number | string };
export type CartLine = {
  _id: string;
  menu: CartMenu;
  quality: number;
  note?: string;
  total_promo?: number | string;
  total_price?: number | string;
};
type CustomerCartState = { Cart: { data: CartLine[] } };

const CartItem = ({
  item,
  onEditItem,
}: {
  item: CartLine;
  onEditItem?: (item: CartLine) => void;
}) => {
  const dispatch = useDispatch();
  const onEdit = () => {
    if (onEditItem) {
      onEditItem(item);
      return;
    }

    dispatch(
      Actions.Cart.selectedEdit(item.menu, item._id, item.quality, item.note),
    );
    dispatch(Actions.Cart.dialogMenuOpen());
  };

  return (
    <div
      style={{
        marginTop: "1rem",
        marginBottom: "1rem",
        backgroundColor: "#FFFFFF66",
        borderRadius: 8,
        display: "flex",
        justifyItems: "center",
        padding: "0.25rem",
      }}
    >
      <div style={{ width: "20%", padding: "0 0.25rem" }}>
        <div
          style={{
            backgroundColor: "#FFBC03",
            width: 35,
            height: 35,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography style={{ color: "#FFFFFF" }} align="center">
            {`${item.quality || 0}x`}
          </Typography>
        </div>
        <Button
          aria-label={`Edit ${item.menu.name || "item"}`}
          style={{
            marginTop: "0.5rem",
            minWidth: 0,
            padding: 0,
            width: 40,
            height: 40,
          }}
          onClick={onEdit}
        >
          <Typography variant="h6" style={{ color: "#CF672E" }} align="center">
            Edit
          </Typography>
        </Button>
      </div>
      <div
        style={{
          width: "80%",
          textAlign: "right",
          padding: "0 0.25rem",
          position: "relative",
        }}
      >
        <Typography variant="h6" style={{ color: "#00000" }}>
          {item.menu.name || "name"}
        </Typography>
        {item.note && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "flex-end",
            }}
          >
            <Typography style={{ color: "#AEA2A2" }}>Note</Typography>
            <Typography style={{ color: "#000000", marginLeft: "1rem" }}>
              {item.note}
            </Typography>
          </div>
        )}
        {item.menu.promo && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "flex-end",
            }}
          >
            <Typography style={{ color: "#1FA845" }}>Promo</Typography>
            <Typography
              style={{
                color: "#000000",
                marginLeft: "1rem",
                textDecorationLine: "line-through",
              }}
            >
              {Convert.Rp(item.total_promo ?? 0)}
            </Typography>
          </div>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-end",
          }}
        >
          <Typography style={{ color: "#AEA2A2" }}>Total</Typography>
          <Typography style={{ color: "#000000", marginLeft: "1rem" }}>
            {Convert.Rp(item.total_price ?? 0)}
          </Typography>
        </div>
      </div>
    </div>
  );
};

const CustomerCartItemList = ({
  onEditItem,
}: {
  onEditItem?: (item: CartLine) => void;
}) => {
  const items = useSelector((state: CustomerCartState) => state.Cart.data);
  return (
    <>
      {items.map((item) => (
        <CartItem key={item._id} item={item} onEditItem={onEditItem} />
      ))}
    </>
  );
};

export default CustomerCartItemList;
