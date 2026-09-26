import { IconButton, Typography } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import { useDispatch, useSelector } from "react-redux";
import Actions from "../../../../actions";
import Icons from "../../../../assets/icons";
import ButtonCustom from "../../../../components/common/button.custom";
import CustomerCartOverview from "./overview";
import CustomerDesktopCartOrders from "./desktop-cart-orders";
import CustomerOrderInvoice from "./invoice-order";
import CustomerTransactionInvoice from "./invoice-transaction";

type CartMenu = {
  _id?: string;
  name?: string;
  image?: string;
  promo?: number;
  price?: number;
  desc?: string;
};
type SelectedCartItem = {
  bool: boolean;
  id_cart?: string | null;
  quality: number;
  note: string;
  menu: CartMenu;
};
type CartLine = {
  _id: string;
  menu: CartMenu;
  quality: number;
  note?: string;
  total_promo?: number;
  total_price?: number;
};
type CustomerDesktopCartState = {
  Cart: {
    loading: boolean;
    selected: SelectedCartItem;
    order: unknown;
    transaction: unknown;
    data: CartLine[];
  };
};

const SelectedMenuPanel = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state: CustomerDesktopCartState) => state.Cart);
  const { selected } = cart;
  const { quality, note, menu } = selected;

  const onClean = () => dispatch(Actions.Cart.selectedClean());
  const onSubmit = () => {
    if (quality <= 0) {
      if (selected.id_cart) dispatch(Actions.Cart.onDelete(selected.id_cart));
      onClean();
      return;
    }

    if (selected.id_cart) {
      dispatch(Actions.Cart.onUpdate(menu, selected.id_cart, quality, note));
    } else {
      dispatch(Actions.Cart.onCreate(menu, quality, note));
    }
    onClean();
  };

  const price = menu.price ?? 0;
  const displayPrice =
    Math.abs(price) > 999
      ? `${Math.sign(price) * Number((Math.abs(price) / 1000).toFixed(1))}k`
      : Math.sign(price) * Math.abs(price);

  return (
    <div
      style={{
        height: "90vh",
        position: "relative",
        backgroundColor: "#FFECEC",
        padding: "3vh 3vw",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "5vh",
          alignItems: "center",
        }}
      >
        <div style={{ width: "50%" }}>
          <Typography variant="h4" style={{ color: "#37929E" }}>
            {displayPrice}
          </Typography>
        </div>
        <div
          style={{
            width: "50%",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "flex-end",
          }}
        >
          <IconButton aria-label="Tutup pilihan menu" onClick={onClean}>
            <img style={{ height: "2.5vh" }} src={Icons.close} alt="" />
          </IconButton>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "5vh",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" style={{ color: "#AD3737" }}>
          {menu.name || "Name"}
        </Typography>
      </div>
      <div
        style={{
          width: "100%",
          height: "40vh",
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
        }}
      >
        <div
          role="img"
          aria-label={menu.name ?? "Menu"}
          style={{
            borderRadius: 8,
            width: "100%",
            height: "30vh",
            backgroundImage: `url(${menu.image ?? ""})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            position: "relative",
          }}
        >
          {menu.promo ? (
            <div
              style={{
                position: "absolute",
                bottom: -17,
                right: 0,
                alignContent: "center",
              }}
            >
              <img src={Icons.star} alt="Promo" />
            </div>
          ) : null}
        </div>
      </div>
      <div style={{ display: "flex", width: "100%", height: "10vh" }}>
        <Typography>{menu.desc || "Desc"}</Typography>
      </div>
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "20vh",
          justifyContent: "flex-end",
        }}
      >
        <div style={{ width: "70%" }}>
          <input
            aria-label="Catatan menu"
            placeholder="Klik untuk menambahkan catatan"
            value={note}
            onChange={(event) =>
              dispatch(Actions.Cart.selectedChangeNote(event.target.value))
            }
            style={{
              borderColor: "transparent",
              backgroundColor: "#ECFDFE",
              height: 35,
              width: "100%",
              border: "none",
              borderRadius: 10,
              boxShadow: "none",
              outline: "none",
            }}
          />
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <IconButton
              aria-label="Tambah jumlah"
              onClick={() => dispatch(Actions.Cart.selectedIncrementQuality())}
            >
              <AddIcon style={{ color: "#AD3636" }} />
            </IconButton>
            <Typography style={{ color: "#AD3636" }}>{quality}</Typography>
            <IconButton
              aria-label="Kurangi jumlah"
              onClick={() => dispatch(Actions.Cart.selectedDescrementQuality())}
            >
              <RemoveIcon style={{ color: "#AD3636" }} />
            </IconButton>
          </div>
          <ButtonCustom
            label={
              quality > 0
                ? selected.id_cart
                  ? "Edit"
                  : "Add"
                : selected.id_cart
                  ? "Remove"
                  : "Cancel"
            }
            style={{
              borderRadius: 10,
              backgroundColor: "#A42121",
              color: "#FFFFFF",
            }}
            disabled={cart.loading}
            loading={cart.loading}
            onClick={onSubmit}
            fullWidth
          />
        </div>
      </div>
    </div>
  );
};

const CartContent = () => {
  const cart = useSelector((state: CustomerDesktopCartState) => state.Cart);

  if (cart.order) return <CustomerOrderInvoice />;
  if (cart.transaction) return <CustomerTransactionInvoice />;
  if (cart.data.length > 0) return <CustomerDesktopCartOrders />;
  return null;
};

const CustomerDesktopCartContent = () => {
  const cart = useSelector((state: CustomerDesktopCartState) => state.Cart);

  if (cart.selected.bool) return <SelectedMenuPanel />;
  if (cart.loading) return null;

  return (
    <div
      style={{
        height: "90vh",
        position: "relative",
        backgroundColor: "#FFFFFF",
        overflow: "scroll",
      }}
    >
      <div
        style={{ backgroundColor: "#FFA472", height: "0.5rem", width: "100%" }}
      />
      <div
        style={{
          width: "100%",
          paddingLeft: "1rem",
          paddingRight: "1rem",
          paddingBottom: "1rem",
        }}
      >
        <CustomerCartOverview />
        <CartContent />
      </div>
    </div>
  );
};

export default CustomerDesktopCartContent;
