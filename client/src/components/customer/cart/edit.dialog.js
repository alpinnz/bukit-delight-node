import * as React from "react";
import {
  Dialog,
  Slide,
  Typography,
  Grid,
  Button,
  IconButton,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import Actions from "./../../../redux/actions";
import { useDispatch } from "react-redux";
import useWindowDimensions from "./../../hooks/useWindowDimensions";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function EditDialog({ data, open, onClose, prevCount }) {
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();
  const [qty, setQty] = React.useState(prevCount ? prevCount : 0);
  const [note, setNote] = React.useState("");

  React.useEffect(() => {
    setQty(0);
    setNote("");
  }, [data]);

  const onAdd = () => setQty(qty + 1);
  const onRemove = () => {
    if (qty > 0) {
      setQty(qty - 1);
    }
  };
  const onSubmit = () => {
    if (qty > 0) {
      dispatch(
        Actions.Cart.ADD({
          _id: `${data._id}-${new Date().getTime()}`,
          id_menu: data._id,
          note: note,
          qty: qty,
        })
      );
      onClose();
    }
  };

  function convertPrice(num) {
    return Math.abs(num) > 999
      ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k"
      : Math.sign(num) * Math.abs(num);
  }

  const margin = width * 0.015;
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
            // height: 420,
            // width: 320,
            borderRadius: 10,
            backgroundColor: "#FFFFFF",
            padding: margin,
            position: "relative",
          }}
        >
          <img
            src={`${data.image}`}
            alt={data.name}
            style={{
              borderRadius: 7,
              width: "100%",
              height: 166,
            }}
          />
          <div style={{ padding: margin * 2 }}>
            <div>
              <Typography align="center">{data.name}</Typography>
            </div>
            <div style={{ padding: margin, height: 55 }}>
              <Typography variant="subtitle1">{data.desc}</Typography>
            </div>
            <Grid container>
              <Grid item xs={2} sm={2}>
                <Typography variant="h6" style={{ color: "#37929E" }}>
                  {convertPrice(data.price)}
                </Typography>
              </Grid>
              <Grid item xs={1} sm={1}></Grid>
              <Grid item xs={9} sm={9}>
                <input
                  placeholder="Klik untuk menambahkan catatan"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
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
                marginTop: margin,
                justifyContent: "center",
                textAlign: "center",
                alignItems: "center",
              }}
              container
            >
              <Grid item xs={3} sm={3}>
                <IconButton onClick={onAdd}>
                  <AddIcon style={{ color: "#000000" }} />
                </IconButton>
              </Grid>
              <Grid item xs={6} sm={6}>
                <Typography
                  align="center"
                  variant="h6"
                  style={{ color: "#000000" }}
                >
                  {qty}
                </Typography>
              </Grid>
              <Grid item xs={3} sm={3}>
                <IconButton onClick={onRemove}>
                  <RemoveIcon style={{ color: "#000000" }} />
                </IconButton>
              </Grid>

              <Button
                style={{
                  borderRadius: 10,
                  backgroundColor: "#A42121",
                  color: "#FFFFFF",
                }}
                onClick={onSubmit}
                variant="contained"
              >
                Tambah ke Keranjang
              </Button>
            </Grid>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
