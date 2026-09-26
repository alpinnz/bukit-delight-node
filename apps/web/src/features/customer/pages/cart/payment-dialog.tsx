import type { ComponentProps } from "react";
import { forwardRef } from "react";
import { Button, Dialog, Slide, Typography } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import Actions from "../../../../actions";
import Icons from "../../../../assets/icons";

type PaymentDialogState = {
  Cart: { dialog_payment: { open: boolean } };
  Orders: { loading: boolean };
};

const Transition = forwardRef<unknown, ComponentProps<typeof Slide>>(
  function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  },
);

const CustomerPaymentDialog = () => {
  const dispatch = useDispatch();
  const open = useSelector(
    (state: PaymentDialogState) => state.Cart.dialog_payment.open,
  );
  const loading = useSelector(
    (state: PaymentDialogState) => state.Orders.loading,
  );
  const onClose = () => dispatch(Actions.Cart.dialogPaymentHide());
  const onOrderCash = () => dispatch(Actions.Orders.onCreate({}));
  const onOrderEMoney = () => alert("onOrderE_Money");

  return (
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
        }}
      >
        <Typography
          style={{ color: "#000000", padding: "0.25rem" }}
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
            disabled={loading}
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
            onClick={onOrderEMoney}
            style={{
              backgroundColor: "#D6A4A4",
              borderRadius: 13,
              padding: "0.25rem",
              display: "block",
            }}
            disabled={loading}
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
  );
};

export default CustomerPaymentDialog;
