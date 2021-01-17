import * as React from "react";
import { Dialog, Slide, Typography, Grid, IconButton } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import Actions from "./../../../actions";
import { useDispatch, useSelector } from "react-redux";
import ButtonCustom from "./../../../components/common/button.custom";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function MenuDialog() {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.Cart.dialog_menu.open);
  const loading = useSelector((state) => state.Cart.loading);
  const selected = useSelector((state) => state.Cart.selected);

  const quality = selected.quality;
  const note = selected.note;
  const menu = selected.menu;

  function convertPrice(num) {
    return Math.abs(num) > 999
      ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k"
      : Math.sign(num) * Math.abs(num);
  }

  const onIncrement = () => dispatch(Actions.Cart.selectedIncrementQuality());
  const onDescrement = () => dispatch(Actions.Cart.selectedDescrementQuality());
  const onClean = () => dispatch(Actions.Cart.selectedClean());
  const onDelete = (id_cart) => dispatch(Actions.Cart.onDelete(id_cart));
  const onChange = (e) => dispatch(Actions.Cart.selectedChangeNote(e));
  const onClose = () => dispatch(Actions.Cart.dialogMenuHide());
  const onRemove = () => {
    if (quality > 0) {
      onDescrement();
    }
  };

  const onSubmit = () => {
    if (quality <= 0) {
      if (selected.id_cart) {
        // Remove
        const id_cart = selected.id_cart;
        onDelete(id_cart);
        onClean();
        onClose();
      } else {
        // Cancel
        onClean();
        onClose();
      }
    } else {
      if (selected.id_cart) {
        // Edit
        const id_cart = selected.id_cart;
        dispatch(Actions.Cart.onUpdate(menu, id_cart, quality, note));
        onClean();
        onClose();
      } else {
        // Add
        dispatch(Actions.Cart.onCreate(menu, quality, note));
        onClean();
        onClose();
      }
    }
  };

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
                {menu.promo > 0 ? (
                  <div style={{ display: "flex" }}>
                    <Typography
                      variant="h6"
                      style={{
                        color: "#37929E",
                        textDecorationLine: "line-through",
                        marginRight: "0.5rem",
                      }}
                    >
                      {convertPrice(menu.price)}
                    </Typography>
                    <Typography variant="h6" style={{ color: "#37929E" }}>
                      {convertPrice(menu.price - menu.promo)}
                    </Typography>
                  </div>
                ) : (
                  <Typography variant="h6" style={{ color: "#37929E" }}>
                    {convertPrice(menu.price)}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={1} sm={1}></Grid>
              <Grid item xs={9} sm={9}>
                <input
                  placeholder="Klik untuk menambahkan catatan"
                  value={note}
                  onChange={(e) => onChange(e.target.value)}
                  style={{
                    borderColor: "transparent",
                    backgroundColor: "#ECFDFE",
                    height: 35,
                    width: "100%",
                    border: "none",
                    borderRadius: 10,
                    boxShadow: "none",
                    outline: "none",
                    "&:hover": {
                      border: "none",
                      outline: "none",
                    },
                    "&:focus": {
                      border: "none",
                    },
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
                <IconButton onClick={onIncrement}>
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
                <IconButton onClick={onRemove}>
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
                variant="contained"
                disabled={loading}
                loading={loading}
                onClick={() => onSubmit()}
                fullWidth
              />
            </Grid>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
