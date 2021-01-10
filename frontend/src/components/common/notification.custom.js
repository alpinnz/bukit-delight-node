/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import { useDispatch, useSelector } from "react-redux";
import Actions from "./../../actions";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

const NotificationCustom = () => {
  const Service = useSelector((state) => state.Service);
  const dispatch = useDispatch();
  const classes = useStyles();

  const vertical = "top";
  const horizontal = "right";

  useEffect(() => {
    // dispatch(Actions.Service.pushNotification("success", "asdadadwdwdwdwdwwd"));
    if (Service.notification.open) {
      setTimeout(() => {
        dispatch(Actions.Service.hideNotification());
      }, 6000);
    }
  }, [Service]);

  return (
    <div className={classes.root}>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={Service.notification.open}
        // onClose={handleClose}
        key={vertical + horizontal}
      >
        {Service.notification.open ? (
          <Alert
            // onClose={handleClose}
            severity={Service.notification.type || ""}
          >
            {Service.notification.message || ""}
          </Alert>
        ) : (
          <div />
        )}
      </Snackbar>
    </div>
  );
};

export default NotificationCustom;
