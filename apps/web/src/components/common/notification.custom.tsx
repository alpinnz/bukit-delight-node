import { useEffect, type ComponentProps } from "react";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import { useDispatch, useSelector } from "react-redux";
import Actions from "../../actions";
import type { RootState } from "../../reducers";
import type { AppDispatch } from "../../store";

type AlertProps = ComponentProps<typeof MuiAlert>;

const Alert = (props: AlertProps) => (
  <MuiAlert elevation={6} variant="filled" {...props} />
);

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

const NotificationCustom = () => {
  const notification = useSelector(
    (state: RootState) => state.Service.notification,
  );
  const dispatch = useDispatch<AppDispatch>();
  const classes = useStyles();
  const anchorOrigin = {
    vertical: "top" as const,
    horizontal: "right" as const,
  };

  useEffect(() => {
    if (!notification.open) return;

    const timeoutId = window.setTimeout(() => {
      dispatch(Actions.Service.hideNotification());
    }, 6000);

    return () => window.clearTimeout(timeoutId);
  }, [dispatch, notification]);

  return (
    <div className={classes.root}>
      <Snackbar
        anchorOrigin={anchorOrigin}
        open={notification.open}
        key={`${anchorOrigin.vertical}${anchorOrigin.horizontal}`}
      >
        {notification.open ? (
          <Alert severity={notification.type || "info"}>
            {notification.message || ""}
          </Alert>
        ) : (
          <div />
        )}
      </Snackbar>
    </div>
  );
};

export default NotificationCustom;
