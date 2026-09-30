import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Actions from "../../actions";
import type { RootState } from "../../reducers";
import type { AppDispatch } from "../../store";

const Toast = () => {
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

  if (!notification.open) return null;

  const notificationStyles = {
    success: {
      Icon: CheckCircleIcon,
      label: "Berhasil",
      iconClassName: "text-emerald-700",
    },
    error: {
      Icon: ExclamationCircleIcon,
      label: "Terjadi kesalahan",
      iconClassName: "text-red-700",
    },
    warning: {
      Icon: ExclamationTriangleIcon,
      label: "Perhatian",
      iconClassName: "text-amber-700",
    },
    info: {
      Icon: InformationCircleIcon,
      label: "Informasi",
      iconClassName: "text-[#6C0087]",
    },
  } as const;
  const style = notificationStyles[notification.type || "info"];
  const Icon = style.Icon;

  return (
    <div
      role={notification.type === "error" ? "alert" : "status"}
      aria-live={notification.type === "error" ? "assertive" : "polite"}
      aria-atomic="true"
      className="fixed right-4 top-4 z-[60] flex w-[calc(100%-2rem)] max-w-sm items-start gap-3 rounded-xl border border-[#6C0087]/15 border-l-4 border-l-[#6C0087] bg-white p-4 text-slate-900 shadow-xl shadow-[#6C0087]/10 sm:right-6 sm:top-6"
    >
      <Icon
        aria-hidden="true"
        className={`mt-0.5 size-5 shrink-0 ${style.iconClassName}`}
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[#6C0087]">{style.label}</p>
        <p className="mt-1 break-words text-sm leading-5 text-slate-600">
          {notification.message}
        </p>
      </div>
      <button
        type="button"
        aria-label="Tutup notifikasi"
        onClick={() => dispatch(Actions.Service.hideNotification())}
        className="-mr-1 -mt-1 rounded-md p-1 text-slate-400 transition hover:bg-[#F9F7E8] hover:text-[#6C0087] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6C0087]"
      >
        <XMarkIcon aria-hidden="true" className="size-4" />
      </button>
    </div>
  );
};

export default Toast;
