import React from "react";
import {
  AppBar,
  Button,
  Dialog,
  IconButton,
  makeStyles,
  Slide,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { useDispatch, useSelector } from "react-redux";
import Actions from "../../../../actions";
import CustomerAccordionListCategories, {
  type OrderedCategory,
} from "../../../customer/components/accordion-list-categories";
import CustomerInvoiceOverview, {
  type InvoiceRecord,
} from "../../../customer/components/invoice-overview";

type CompletedOrder = InvoiceRecord & { categories?: OrderedCategory[] };
type CashierTransaction = {
  _id: string;
  status: string;
  id_account?: { username?: string };
  id_order: CompletedOrder;
};
type TransactionReviewState = {
  Transactions: {
    dialog_review: { open: boolean };
    transaction: CashierTransaction | null;
  };
};

const useStyles = makeStyles({ title: { flexGrow: 1 } });

const Transition = React.forwardRef<unknown, { children?: React.ReactElement }>(
  function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  },
);

const CashierTransactionReviewDialog = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { open, transaction } = useSelector(
    (state: TransactionReviewState) => ({
      open: state.Transactions.dialog_review.open,
      transaction: state.Transactions.transaction,
    }),
  );
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const closeReview = () => dispatch(Actions.Transactions.hideDialogReview());
  const openStatus = () => {
    dispatch(Actions.Transactions.openDialogStatus());
    closeReview();
  };

  if (!transaction) return null;

  return (
    <Dialog
      fullScreen={fullScreen}
      TransitionComponent={Transition}
      open={open}
      onClose={closeReview}
      scroll="body"
      aria-labelledby="cashier-transaction-review-title"
    >
      <AppBar
        position="static"
        style={{ backgroundColor: "#CF672E", boxShadow: "none" }}
      >
        <Toolbar>
          <Typography
            id="cashier-transaction-review-title"
            variant="h6"
            className={classes.title}
          >
            Transaction Detail
          </Typography>
          <IconButton
            autoFocus
            onClick={closeReview}
            aria-label="Tutup detail transaksi"
          >
            <CloseIcon style={{ color: "#FFF" }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <div style={{ padding: "0.5rem" }}>
        <CustomerInvoiceOverview
          status={transaction.status}
          no_transaction={transaction._id}
          account={transaction.id_account}
          data={transaction.id_order}
        />
        <div style={{ marginTop: "1rem" }} />
        <CustomerAccordionListCategories
          data={transaction.id_order.categories ?? []}
        />
        <div
          style={{
            margin: "1rem 0",
            padding: "0 0.5rem",
            display: "flex",
            width: "100%",
          }}
        >
          <Button
            onClick={openStatus}
            style={{
              textTransform: "none",
              height: "3rem",
              backgroundColor: "#CF672E",
            }}
            variant="contained"
            fullWidth
          >
            <Typography style={{ fontWeight: "bold", color: "#FFFFFF" }}>
              Update Status
            </Typography>
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default CashierTransactionReviewDialog;
