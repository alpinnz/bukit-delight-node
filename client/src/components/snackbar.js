import * as React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import { useSelector, useDispatch } from "react-redux";
import Actions from "./../redux/actions";

export default function SnackbarCustom() {
  const Services = useSelector((state) => state.Services);
  const dispatch = useDispatch();

  const onOpen = Services.notification.open || false;
  const title = Services.notification.title || "";

  React.useEffect(() => {
    if (Services.notification.open) {
      setTimeout(() => {
        dispatch(Actions.Services.popupNotification());
      }, 3000);
      console.log("closeNotification");
    }
  }, [Services.notification, dispatch]);

  const vertical = "top";
  const horizontal = "right";

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={onOpen}
        // onClose={onClose}
        message={`${title}`}
        key={vertical + horizontal}
      />
    </div>
  );
}
