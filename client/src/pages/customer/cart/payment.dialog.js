import React from "react";
import { Dialog, Slide, Typography, Button } from "@material-ui/core";
import Actions from "./../../../actions";
import { useDispatch, useSelector } from "react-redux";
import Icons from "./../../../assets/icons";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const PaymentDialog = () => {
  const dispatch = useDispatch();
  const Cart = useSelector((state) => state.Cart);
  const open = Cart.dialog_payment.open;
  const onClose = () => dispatch(Actions.Cart.dialogPaymentHide());
  const data = {
    customer: "test",
    id_table: "5fd46ce76a91b32810ef1080",
    note: "Cash",
  };
  const onOrderCash = () => dispatch(Actions.Orders.onCreate(data));
  const onOrderE_Money = () => alert("onOrderE_Money");
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
            padding: "0.50rem",
          }}
        >
          <Typography
            style={{
              color: "#000000",
              padding: "0.25rem",
            }}
            variant="h6"
            align="center"
          >
            Pilih Metode Pembayaran
          </Typography>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "0.25rem",
            }}
          >
            <Button
              onClick={onOrderCash}
              style={{
                backgroundColor: "#D6A4A4",
                borderRadius: 13,
                padding: "0.25rem",
                display: "block",
              }}
            >
              <div
                style={{
                  backgroundColor: "#D6A4A4",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                  padding: "0.5rem",
                }}
              >
                <img
                  style={{ width: "4rem", height: "4rem" }}
                  src={Icons.cashier}
                  alt="cashier"
                />
              </div>
              <div
                style={{
                  backgroundColor: "#D6A4A4",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                <Typography
                  style={{
                    color: "#000000",
                    paddingTop: "0.25rem",
                    paddingBottom: "0.25rem",
                  }}
                  variant="h6"
                  align="center"
                >
                  Tunai
                </Typography>
              </div>
            </Button>
            <Button
              onClick={onOrderE_Money}
              style={{
                backgroundColor: "#D6A4A4",
                borderRadius: 13,
                padding: "0.25rem",
                display: "block",
              }}
            >
              <div
                style={{
                  backgroundColor: "#D6A4A4",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                  padding: "0.5rem",
                }}
              >
                <img
                  style={{ width: "4rem", height: "4rem" }}
                  src={Icons.e_money}
                  alt="e money"
                />
              </div>
              <div
                style={{
                  backgroundColor: "#D6A4A4",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                <Typography
                  style={{
                    color: "#000000",

                    paddingTop: "0.25rem",
                    paddingBottom: "0.25rem",
                  }}
                  variant="h6"
                  align="center"
                >
                  E-Money
                </Typography>
              </div>
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default PaymentDialog;
