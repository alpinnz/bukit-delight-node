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

type CashierOrder = InvoiceRecord & { categories?: OrderedCategory[] };
type CashierOrderState = {
  Orders: {
    dialog_review: { open: boolean };
    order: CashierOrder | null;
  };
};

const useStyles = makeStyles({ title: { flexGrow: 1 } });

const Transition = React.forwardRef<unknown, { children?: React.ReactElement }>(
  function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  },
);

const CashierOrderReviewDialog = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { open, order } = useSelector((state: CashierOrderState) => ({
    open: state.Orders.dialog_review.open,
    order: state.Orders.order,
  }));
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  React.useEffect(() => {
    if (open) {
      document.getElementById("cashier-order-review-content")?.focus();
    }
  }, [open]);

  const closeReview = () => dispatch(Actions.Orders.hideDialogReview());
  const openPayment = () => {
    dispatch(Actions.Orders.openDialogPayment());
    closeReview();
  };

  if (!order) return null;

  return (
    <Dialog
      fullScreen={fullScreen}
      TransitionComponent={Transition}
      open={open}
      onClose={closeReview}
      scroll="body"
      aria-labelledby="cashier-order-review-title"
    >
      <AppBar
        position="static"
        style={{ backgroundColor: "#CF672E", boxShadow: "none" }}
      >
        <Toolbar>
          <Typography
            id="cashier-order-review-title"
            variant="h6"
            className={classes.title}
          >
            Review
          </Typography>
          <IconButton autoFocus onClick={closeReview} aria-label="Tutup review">
            <CloseIcon style={{ color: "#FFF" }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <div
        id="cashier-order-review-content"
        tabIndex={-1}
        style={{ padding: "0.5rem" }}
      >
        <CustomerInvoiceOverview data={order} />
        <div style={{ marginTop: "1rem" }} />
        <CustomerAccordionListCategories data={order.categories ?? []} />
        <div
          style={{
            margin: "1rem 0",
            padding: "0 0.5rem",
            display: "flex",
            width: "100%",
          }}
        >
          <Button
            onClick={openPayment}
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

export default CashierOrderReviewDialog;
