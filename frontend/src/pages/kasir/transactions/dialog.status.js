/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
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
  Slide,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import Actions from "./../../../actions";
import CloseIcon from "@material-ui/icons/Close";
import Timeline from "./timeline";

const useStyles = makeStyles({
  title: {
    flexGrow: 1,
  },
});

const AppBarDialog = () => {
  const classes = useStyles();

  const dispatch = useDispatch();
  // const onOpen = () => dispatch(Actions.Transactions.openDialogReview());
  const onClose = () => dispatch(Actions.Transactions.hideDialogStatus());

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
          Transaction Update Status
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

const DialogStatus = () => {
  const open = useSelector((state) => state.Transactions.dialog_status.open);
  const Transactions = useSelector((state) => state.Transactions);
  const dispatch = useDispatch();
  const onOpen = () => dispatch(Actions.Transactions.openDialogReview());
  const onClose = () => dispatch(Actions.Transactions.hideDialogStatus());
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

  const [status, setStatus] = React.useState("");
  React.useEffect(() => {
    if (Transactions.transaction) {
      setStatus(Transactions["transaction"]["status"]);
    }
  }, [Transactions.transaction]);

  const onSubmit = () => {
    dispatch(Actions.Transactions.onUpdateStatus({ status }));
  };

  const handleClose = () => {
    onOpen();
    onClose();
  };

  if (!Transactions.transaction) {
    return <div />;
  }

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
          <div
            style={{
              // display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "100%",
              }}
            >
              <Timeline />
            </div>
            <div
              style={{
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
              }}
            >
              <FormControl
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                <RadioGroup
                  aria-label="quiz"
                  name="quiz"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <div
                  // style={{
                  //   alignItems: "center",
                  //   justifyContent: "space-around",
                  //   display: "flex",
                  // }}
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
                    <FormControlLabel
                      value="done"
                      control={<Radio />}
                      label="Done"
                    />
                  </div>
                </RadioGroup>
              </FormControl>
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
                Submit
              </Typography>
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default DialogStatus;
