import type { ComponentProps } from "react";
import { forwardRef } from "react";
import { Dialog, Slide, Typography, Grid, IconButton } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import { useDispatch, useSelector } from "react-redux";
import Actions from "../../../actions";
import ButtonCustom from "../../../components/common/button.custom";
import Convert from "../../../helpers/convert";

type MenuCard = {
  image?: string;
  name?: string;
  desc?: string;
  price?: number;
  promo?: number;
  [key: string]: unknown;
};

type SelectedMenu = {
  quality: number;
  note: string;
  id_cart?: string | null;
  menu: MenuCard;
};

type CartDialogState = {
  Cart: {
    dialog_menu: { open: boolean };
    loading: boolean;
    selected: SelectedMenu;
  };
};

const Transition = forwardRef<unknown, ComponentProps<typeof Slide>>(
  function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  },
);

export default function MenuDialog() {
  const dispatch = useDispatch();
  const open = useSelector(
    (state: CartDialogState) => state.Cart.dialog_menu.open,
  );
  const loading = useSelector((state: CartDialogState) => state.Cart.loading);
  const selected = useSelector((state: CartDialogState) => state.Cart.selected);

  const { quality, note, menu } = selected;

  const onIncrement = () => dispatch(Actions.Cart.selectedIncrementQuality());
  const onDecrement = () => dispatch(Actions.Cart.selectedDescrementQuality());
  const onClean = () => dispatch(Actions.Cart.selectedClean());
  const onDelete = (cartId: string) => dispatch(Actions.Cart.onDelete(cartId));
  const onChange = (value: string) =>
    dispatch(Actions.Cart.selectedChangeNote(value));
  const onClose = () => dispatch(Actions.Cart.dialogMenuHide());

  const onRemove = () => {
    if (quality > 0) onDecrement();
  };

  const onSubmit = () => {
    if (quality <= 0) {
      if (selected.id_cart) onDelete(selected.id_cart);
      onClean();
      onClose();
      return;
    }

    if (selected.id_cart) {
      dispatch(Actions.Cart.onUpdate(menu, selected.id_cart, quality, note));
    } else {
      dispatch(Actions.Cart.onCreate(menu, quality, note));
    }

    onClean();
    onClose();
  };

  const price = menu.price ?? 0;
  const promo = menu.promo ?? 0;

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={onClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <div
          style={{
            borderRadius: 10,
            backgroundColor: "#FFFFFF",
            padding: "0.5rem",
            position: "relative",
          }}
        >
          <img
            src={`${menu.image}`}
            alt={menu.name}
            style={{
              borderRadius: 7,
              width: "100%",
              height: 166,
            }}
          />
          <div style={{ padding: "0.12rem" }}>
            <div>
              <Typography align="center">{menu.name}</Typography>
            </div>
            <div style={{ padding: "0.5rem", height: 55 }}>
              <Typography variant="subtitle1">{menu.desc}</Typography>
            </div>
            <Grid container>
              <Grid item xs={2} sm={2}>
                {promo > 0 ? (
                  <div style={{ display: "flex" }}>
                    <Typography
                      variant="h6"
                      style={{
                        color: "#37929E",
                        textDecorationLine: "line-through",
                        marginRight: "0.5rem",
                      }}
                    >
                      {Convert.Price(price)}
                    </Typography>
                    <Typography variant="h6" style={{ color: "#37929E" }}>
                      {Convert.Price(price - promo)}
                    </Typography>
                  </div>
                ) : (
                  <Typography variant="h6" style={{ color: "#37929E" }}>
                    {Convert.Price(price)}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={1} sm={1} />
              <Grid item xs={9} sm={9}>
                <input
                  placeholder="Klik untuk menambahkan catatan"
                  value={note}
                  onChange={(event) => onChange(event.target.value)}
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
              </Grid>
            </Grid>
            <Grid
              style={{
                marginTop: "0.5rem",
                justifyContent: "center",
                textAlign: "center",
                alignItems: "center",
              }}
              container
            >
              <Grid item xs={3} sm={3}>
                <IconButton aria-label="Tambah jumlah" onClick={onIncrement}>
                  <AddIcon style={{ color: "#000000" }} />
                </IconButton>
              </Grid>
              <Grid item xs={6} sm={6}>
                <Typography
                  align="center"
                  variant="h6"
                  style={{ color: "#000000" }}
                >
                  {quality}
                </Typography>
              </Grid>
              <Grid item xs={3} sm={3}>
                <IconButton aria-label="Kurangi jumlah" onClick={onRemove}>
                  <RemoveIcon style={{ color: "#000000" }} />
                </IconButton>
              </Grid>

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
                disabled={loading}
                loading={loading}
                onClick={onSubmit}
                fullWidth
              />
            </Grid>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
