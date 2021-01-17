/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import {
  Dialog,
  useMediaQuery,
  useTheme,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  makeStyles,
  Slide,
  Button,
} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import Actions from "./../../../actions";
import CloseIcon from "@material-ui/icons/Close";
import AccordionListCategories from "./../../../components/common/accordion.list.categories";
import InvoiceOverview from "./../../../components/common/invoice.overview";

const useStyles = makeStyles({
  title: {
    flexGrow: 1,
  },
});

const AppBarDialog = () => {
  const classes = useStyles();

  const dispatch = useDispatch();
  const onClose = () => dispatch(Actions.Transactions.hideDialogReview());

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
          Transaction Detail
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
  const open = useSelector((state) => state.Transactions.dialog_review.open);
  const Transactions = useSelector((state) => state.Transactions);
  const dispatch = useDispatch();
  const onClose = () => dispatch(Actions.Transactions.hideDialogReview());
  const onOpen = () => dispatch(Actions.Transactions.openDialogStatus());
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const colorActive = "#CF672E";
  const color = "#FFFFFF";

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  const handleClose = () => {
    onClose();
  };

  if (!Transactions.transaction) {
    return <div />;
  }

  const onSubmit = () => {
    onOpen();
    onClose();
  };

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
          <InvoiceOverview
            status={Transactions.transaction.status}
            no_transaction={Transactions.transaction._id}
            account={Transactions.transaction.id_account.username}
            data={Transactions.transaction.id_order}
          />

          <div
            style={{
              marginTop: "1rem",
            }}
          />

          <AccordionListCategories
            data={Transactions.transaction.id_order.categories}
          />

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
                Update Status
              </Typography>
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default DialogPayment;
