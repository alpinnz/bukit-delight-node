/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  useMediaQuery,
  useTheme,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  makeStyles,
  TextField,
  Slide,
} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import Actions from "./../../../actions";
import CloseIcon from "@material-ui/icons/Close";
import InvoiceOverview from "./../../../components/common/invoice.overview";

const useStyles = makeStyles({
  title: {
    flexGrow: 1,
  },
});

const CssTextField = makeStyles({
  root: {
    borderRadius: 4,
    border: "none", // - For demonstration: set the TextField-root border
    // (Note: space or no space after & matters. See SASS "parent selector".)
    "& .MuiOutlinedInput-root": {
      // - The Input-root, inside the TextField-root
      "& fieldset": {
        border: "none", //
      },
      "&:hover fieldset": {
        border: "none", //
      },
      "&.Mui-focused fieldset": {
        border: "none", //
      },
    },
  },
});

const AppBarDialog = () => {
  const classes = useStyles();

  const dispatch = useDispatch();
  const onClose = () => dispatch(Actions.Orders.hideDialogPayment());

  const handleClose = () => {
    onClose();
  };

  return (
    <AppBar
      position="static"
      style={{ backgroundColor: "#CF672E", boxShadow: "none" }}
    >
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          Payment
        </Typography>
        <IconButton autoFocus onClick={handleClose}>
          <CloseIcon style={{ color: "#FFF" }} />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DialogPayment = () => {
  const classes = CssTextField();
  const open = useSelector((state) => state.Orders.dialog_payment.open);
  const order = useSelector((state) => state.Orders.order);
  const dispatch = useDispatch();
  const onClose = () => dispatch(Actions.Orders.hideDialogPayment());
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [select, setSelect] = useState(null);
  const [money, setMoney] = useState([0, 50000, 100000, 200000, 0]);
  const [value, setValue] = useState("");

  const colorActive = "#CF672E";
  const color = "#FFFFFF";

  const onSelect = (num) => {
    setSelect(num);
  };

  useEffect(() => {
    if (select !== 4) {
      setValue(0);
    }
  }, [select]);

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);
  useEffect(() => {
    if (order) {
      const uang_pas = Number(order["total_price"]);
      setMoney([uang_pas, 50000, 100000, 200000, value]);
    }
  }, [value]);
  useEffect(() => {
    if (order) {
      const uang_pas = Number(order["total_price"]);
      setMoney([uang_pas, 50000, 100000, 200000, 0]);
      setSelect(null);
    }
  }, [order]);

  const onSubmit = () => {
    if (select >= 0) {
      if (change >= 0) {
        const payment = "cash";
        dispatch(Actions.Transactions.onCreate({ payment }));
      } else {
        dispatch(
          Actions.Service.pushInfoNotification("Pilih kembalian yang sesuai")
        );
      }
    } else {
      dispatch(
        Actions.Service.pushInfoNotification(
          "Pilih salah satu pembayaran tunai"
        )
      );
    }
  };

  const onChange = async (e) => {
    setValue(parseInt(e));
  };

  const handleClose = () => {
    onClose();
  };

  if (!order) {
    return <div />;
  }

  const change = Number(money[select]) - Number(order["total_price"]);

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        TransitionComponent={Transition}
        open={open}
        onClose={handleClose}
        scroll="body"
        aria-labelledby="responsive-dialog-title"
      >
        <AppBarDialog />
        <div
          style={{
            paddingLeft: "0.5rem",
            paddingRight: "0.5rem",
            paddingTop: "0.5rem",
            paddingButton: "0.5rem",
          }}
        >
          <InvoiceOverview data={order} change={change || 0} />

          <div
            style={{
              marginTop: "1rem",
            }}
          >
            <div>
              <Typography style={{ fontWeight: "bold" }} variant="h6">
                Pembayaran Tunai
              </Typography>
            </div>
            <div
              style={{
                marginTop: "0.5rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  paddingTop: "0.5rem",
                  paddingBottom: "0.5rem",
                }}
              >
                <div
                  style={{
                    paddingLeft: "0.5rem",
                    paddingRight: "0.5rem",
                    display: "flex",
                    width: "50%",
                  }}
                >
                  <Button
                    onClick={() => onSelect(0)}
                    style={{
                      textTransform: "none",
                      height: "3.5rem",
                      backgroundColor: select === 0 ? colorActive : color,
                    }}
                    variant="contained"
                    fullWidth
                  >
                    <Typography
                      style={{
                        fontWeight: "bold",
                        color: select === 0 ? color : colorActive,
                      }}
                    >
                      Uang Pas
                    </Typography>
                  </Button>
                </div>
                <div
                  style={{
                    paddingLeft: "0.5rem",
                    paddingRight: "0.5rem",
                    display: "flex",
                    width: "50%",
                  }}
                >
                  <Button
                    onClick={() => onSelect(1)}
                    style={{
                      textTransform: "none",
                      height: "3.5rem",
                      backgroundColor: select === 1 ? colorActive : color,
                    }}
                    variant="contained"
                    fullWidth
                  >
                    <Typography
                      style={{
                        fontWeight: "bold",
                        color: select === 1 ? color : colorActive,
                      }}
                    >
                      50.000
                    </Typography>
                  </Button>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  paddingTop: "0.5rem",
                  paddingBottom: "0.5rem",
                }}
              >
                <div
                  style={{
                    paddingLeft: "0.5rem",
                    paddingRight: "0.5rem",
                    display: "flex",
                    width: "50%",
                  }}
                >
                  <Button
                    onClick={() => onSelect(2)}
                    style={{
                      textTransform: "none",
                      height: "3.5rem",
                      backgroundColor: select === 2 ? colorActive : color,
                    }}
                    variant="contained"
                    fullWidth
                  >
                    <Typography
                      style={{
                        fontWeight: "bold",
                        color: select === 2 ? color : colorActive,
                      }}
                    >
                      100.000
                    </Typography>
                  </Button>
                </div>
                <div
                  style={{
                    paddingLeft: "0.5rem",
                    paddingRight: "0.5rem",
                    display: "flex",
                    width: "50%",
                  }}
                >
                  <Button
                    onClick={() => onSelect(3)}
                    style={{
                      textTransform: "none",
                      height: "3.5rem",
                      backgroundColor: select === 3 ? colorActive : color,
                    }}
                    variant="contained"
                    fullWidth
                  >
                    <Typography
                      style={{
                        fontWeight: "bold",
                        color: select === 3 ? color : colorActive,
                      }}
                    >
                      200.000
                    </Typography>
                  </Button>
                </div>
              </div>
              <div
                style={{
                  marginTop: "0.5rem",
                  paddingLeft: "0.5rem",
                  paddingRight: "0.5rem",
                }}
              >
                <TextField
                  onClick={() => onSelect(4)}
                  align="right"
                  value={value.toString()}
                  fullWidth
                  id="number"
                  type="number"
                  onChange={(e) => onChange(e.target.value)}
                  InputLabelProps={{
                    style: {
                      textAlign: "right",
                    },
                  }}
                  inputMode="numeric"
                  inputProps={{
                    style: {
                      textAlign: "right",
                      color: select === 4 ? color : colorActive,
                    },
                  }}
                  style={{
                    backgroundColor: select === 4 ? colorActive : color,
                    color: select === 4 ? color : colorActive,
                  }}
                  classes={classes}
                  placeholder="Rp 0"
                  variant="outlined"
                />
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: "1rem",
              marginBottom: "1rem",
              paddingLeft: "0.5rem",
              paddingRight: "0.5rem",
              display: "flex",
              width: "100%",
            }}
          >
            <Button
              onClick={() => onSubmit()}
              style={{
                textTransform: "none",
                height: "3rem",
                backgroundColor: colorActive,
              }}
              variant="contained"
              fullWidth
            >
              <Typography
                style={{
                  fontWeight: "bold",
                  color: color,
                }}
              >
                Bayar
              </Typography>
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default DialogPayment;
