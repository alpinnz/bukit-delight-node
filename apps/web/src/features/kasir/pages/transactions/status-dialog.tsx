import React, { useEffect, useState } from "react";
import {
  AppBar,
  Button,
  Dialog,
  FormControl,
  FormControlLabel,
  IconButton,
  makeStyles,
  Radio,
  RadioGroup,
  Slide,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { useDispatch, useSelector } from "react-redux";
import type { TransactionStatus } from "@bukit-delight/shared";
import Actions from "../../../../actions";
import CashierTransactionTimeline from "./timeline";

type CashierStatusState = {
  Transactions: {
    dialog_status: { open: boolean };
    transaction: { status: TransactionStatus } | null;
  };
};

const useStyles = makeStyles({ title: { flexGrow: 1 } });

const Transition = React.forwardRef<unknown, { children?: React.ReactElement }>(
  function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  },
);

const CashierTransactionStatusDialog = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { open, transaction } = useSelector((state: CashierStatusState) => ({
    open: state.Transactions.dialog_status.open,
    transaction: state.Transactions.transaction,
  }));
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [status, setStatus] = useState<TransactionStatus | "">("");

  useEffect(() => {
    if (transaction) setStatus(transaction.status);
  }, [transaction]);

  const closeStatus = () => {
    dispatch(Actions.Transactions.openDialogReview());
    dispatch(Actions.Transactions.hideDialogStatus());
  };

  const submitStatus = () => {
    if (status) dispatch(Actions.Transactions.onUpdateStatus({ status }));
  };

  if (!transaction) return null;

  return (
    <Dialog
      fullScreen={fullScreen}
      TransitionComponent={Transition}
      open={open}
      onClose={closeStatus}
      scroll="body"
      aria-labelledby="cashier-transaction-status-title"
    >
      <AppBar
        position="static"
        style={{ backgroundColor: "#CF672E", boxShadow: "none" }}
      >
        <Toolbar>
          <Typography
            id="cashier-transaction-status-title"
            variant="h6"
            className={classes.title}
          >
            Transaction Update Status
          </Typography>
          <IconButton
            autoFocus
            onClick={closeStatus}
            aria-label="Tutup pembaruan status"
          >
            <CloseIcon style={{ color: "#FFF" }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <div style={{ padding: "0.5rem" }}>
        <CashierTransactionTimeline status={transaction.status} />
        <FormControl
          style={{
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
          }}
        >
          <RadioGroup
            aria-label="Status transaksi"
            name="transaction-status"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as TransactionStatus)
            }
          >
            <FormControlLabel
              value="pending"
              control={<Radio />}
              label="Pending"
              disabled={status !== "pending"}
            />
            <FormControlLabel
              value="proses"
              control={<Radio />}
              label="Proses"
              disabled={status === "done"}
            />
            <FormControlLabel value="done" control={<Radio />} label="Done" />
          </RadioGroup>
        </FormControl>
        <div
          style={{
            margin: "1rem 0",
            padding: "0 0.5rem",
            display: "flex",
            width: "100%",
          }}
        >
          <Button
            onClick={submitStatus}
            style={{
              textTransform: "none",
              height: "3rem",
              backgroundColor: "#CF672E",
            }}
            variant="contained"
            fullWidth
          >
            <Typography style={{ fontWeight: "bold", color: "#FFFFFF" }}>
              Submit
            </Typography>
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default CashierTransactionStatusDialog;
