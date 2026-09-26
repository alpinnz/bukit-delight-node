import React, { useState } from "react";
import {
  AppBar,
  Button,
  Dialog,
  IconButton,
  makeStyles,
  Slide,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { useDispatch, useSelector } from "react-redux";
import type { TransactionPaymentMethod } from "@bukit-delight/shared";
import Actions from "../../../../actions";
import CustomerInvoiceOverview, {
  type InvoiceRecord,
} from "../../../customer/components/invoice-overview";

type CashierPaymentState = {
  Orders: {
    dialog_payment: { open: boolean };
    order: (InvoiceRecord & { total_price: number | string }) | null;
  };
};

const useStyles = makeStyles({
  title: { flexGrow: 1 },
  amountField: {
    borderRadius: 4,
    border: "none",
    "& .MuiOutlinedInput-root": {
      "& fieldset, &:hover fieldset, &.Mui-focused fieldset": {
        border: "none",
      },
    },
  },
});

const Transition = React.forwardRef<unknown, { children?: React.ReactElement }>(
  function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  },
);

const PAYMENT_AMOUNTS = [50000, 100000, 200000] as const;

const CashierOrderPaymentDialog = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { open, order } = useSelector((state: CashierPaymentState) => ({
    open: state.Orders.dialog_payment.open,
    order: state.Orders.order,
  }));
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedAmount, setSelectedAmount] = useState<
    number | "custom" | null
  >(null);
  const [customAmount, setCustomAmount] = useState(0);

  const closePayment = () => dispatch(Actions.Orders.hideDialogPayment());
  const total = Number(order?.total_price ?? 0);
  const selectedPayment =
    selectedAmount === "custom"
      ? customAmount
      : selectedAmount === null
        ? null
        : selectedAmount === 0
          ? total
          : selectedAmount;
  const change = selectedPayment === null ? 0 : selectedPayment - total;

  const submitPayment = () => {
    if (selectedPayment === null) {
      dispatch(
        Actions.Service.pushInfoNotification(
          "Pilih salah satu pembayaran tunai",
        ),
      );
      return;
    }
    if (change < 0) {
      dispatch(
        Actions.Service.pushInfoNotification("Pilih kembalian yang sesuai"),
      );
      return;
    }
    const payment: TransactionPaymentMethod = "cash";
    dispatch(Actions.Transactions.onCreate({ payment }));
  };

  if (!order) return null;

  const selectQuickAmount = (amount: number) => {
    setCustomAmount(0);
    setSelectedAmount(amount);
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      TransitionComponent={Transition}
      open={open}
      onClose={closePayment}
      scroll="body"
      aria-labelledby="cashier-order-payment-title"
    >
      <AppBar
        position="static"
        style={{ backgroundColor: "#CF672E", boxShadow: "none" }}
      >
        <Toolbar>
          <Typography
            id="cashier-order-payment-title"
            variant="h6"
            className={classes.title}
          >
            Payment
          </Typography>
          <IconButton
            autoFocus
            onClick={closePayment}
            aria-label="Tutup pembayaran"
          >
            <CloseIcon style={{ color: "#FFF" }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <div style={{ padding: "0.5rem" }}>
        <CustomerInvoiceOverview data={order} change={change} />
        <section style={{ marginTop: "1rem" }}>
          <Typography style={{ fontWeight: "bold" }} variant="h6">
            Pembayaran Tunai
          </Typography>
          <div style={{ marginTop: "0.5rem" }}>
            <div style={{ display: "flex", padding: "0.5rem 0" }}>
              <QuickPaymentButton
                label="Uang Pas"
                selected={selectedAmount === 0}
                onClick={() => selectQuickAmount(0)}
              />
              <QuickPaymentButton
                label="50.000"
                selected={selectedAmount === PAYMENT_AMOUNTS[0]}
                onClick={() => selectQuickAmount(PAYMENT_AMOUNTS[0])}
              />
            </div>
            <div style={{ display: "flex", padding: "0.5rem 0" }}>
              <QuickPaymentButton
                label="100.000"
                selected={selectedAmount === PAYMENT_AMOUNTS[1]}
                onClick={() => selectQuickAmount(PAYMENT_AMOUNTS[1])}
              />
              <QuickPaymentButton
                label="200.000"
                selected={selectedAmount === PAYMENT_AMOUNTS[2]}
                onClick={() => selectQuickAmount(PAYMENT_AMOUNTS[2])}
              />
            </div>
            <div style={{ marginTop: "0.5rem", padding: "0 0.5rem" }}>
              <TextField
                id="cashier-custom-payment-amount"
                label="Jumlah pembayaran tunai"
                value={customAmount}
                fullWidth
                type="number"
                onFocus={() => setSelectedAmount("custom")}
                onChange={(event) => {
                  setSelectedAmount("custom");
                  setCustomAmount(Number(event.target.value) || 0);
                }}
                inputMode="numeric"
                inputProps={{ min: 0, style: { textAlign: "right" } }}
                style={{
                  backgroundColor:
                    selectedAmount === "custom" ? "#CF672E" : "#FFFFFF",
                  color: selectedAmount === "custom" ? "#FFFFFF" : "#CF672E",
                }}
                classes={{ root: classes.amountField }}
                placeholder="Rp 0"
                variant="outlined"
              />
            </div>
          </div>
        </section>
        <div
          style={{
            margin: "1rem 0",
            padding: "0 0.5rem",
            display: "flex",
            width: "100%",
          }}
        >
          <Button
            onClick={submitPayment}
            style={{
              textTransform: "none",
              height: "3rem",
              backgroundColor: "#CF672E",
            }}
            variant="contained"
            fullWidth
          >
            <Typography style={{ fontWeight: "bold", color: "#FFFFFF" }}>
              Bayar
            </Typography>
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

const QuickPaymentButton = ({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) => (
  <div style={{ padding: "0 0.5rem", display: "flex", width: "50%" }}>
    <Button
      onClick={onClick}
      style={{
        textTransform: "none",
        height: "3.5rem",
        backgroundColor: selected ? "#CF672E" : "#FFFFFF",
      }}
      variant="contained"
      fullWidth
    >
      <Typography
        style={{
          fontWeight: "bold",
          color: selected ? "#FFFFFF" : "#CF672E",
        }}
      >
        {label}
      </Typography>
    </Button>
  </div>
);

export default CashierOrderPaymentDialog;
