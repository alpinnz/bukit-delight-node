import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Actions from "../../actions";
import type { RootState } from "../../reducers";
import type { AppDispatch } from "../../store";

const NotificationCustom = () => {
  const notification = useSelector(
    (state: RootState) => state.Service.notification,
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!notification.open) return;

    const timeoutId = window.setTimeout(() => {
      dispatch(Actions.Service.hideNotification());
    }, 6000);

    return () => window.clearTimeout(timeoutId);
  }, [dispatch, notification]);

  return notification.open ? (
    <div
      role={notification.type === "error" ? "alert" : "status"}
      className={`fixed right-4 top-4 z-[60] max-w-sm rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg ${notification.type === "error" ? "bg-red-700" : notification.type === "success" ? "bg-emerald-700" : "bg-slate-800"}`}
    >
      {notification.message || ""}
    </div>
  ) : null;
};

export default NotificationCustom;
