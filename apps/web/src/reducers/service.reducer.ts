import type { AnyAction } from "redux";
import {
  SERVICE_ERROR_NOTIFICATION,
  SERVICE_HIDE_FORM_DIALOG,
  SERVICE_HIDE_NOTIFICATION,
  SERVICE_INFO_NOTIFICATION,
  SERVICE_OPEN_FORM_DIALOG,
  SERVICE_SUCCESS_NOTIFICATION,
  SERVICE_WARNING_NOTIFICATION,
} from "../actions/service.action";

export type NotificationSeverity = "success" | "error" | "info" | "warning";

export type ServiceState = {
  notification: {
    open: boolean;
    message: string;
    type: NotificationSeverity | "";
  };
  form_dialog: { open: boolean; type: string; row: unknown };
  dialog_payment: { open: boolean };
  dialog_review: { open: boolean };
};

const initialState: ServiceState = {
  notification: { open: false, message: "", type: "" },
  form_dialog: { open: false, type: "", row: {} },
  dialog_payment: { open: false },
  dialog_review: { open: false },
};

const ServiceReducer = (
  state: ServiceState = initialState,
  action: AnyAction,
): ServiceState => {
  if (action.type === SERVICE_SUCCESS_NOTIFICATION) {
    return {
      ...state,
      notification: {
        open: true,
        message: `${action.payload} Success`,
        type: "success",
      },
    };
  }
  if (action.type === SERVICE_ERROR_NOTIFICATION) {
    return {
      ...state,
      notification: {
        open: true,
        message: `${action.payload}`,
        type: "error",
      },
    };
  }
  if (action.type === SERVICE_INFO_NOTIFICATION) {
    return {
      ...state,
      notification: {
        open: true,
        message: `${action.payload}`,
        type: "info",
      },
    };
  }
  if (action.type === SERVICE_WARNING_NOTIFICATION) {
    return {
      ...state,
      notification: {
        open: true,
        message: `${action.payload}`,
        type: "warning",
      },
    };
  }
  if (action.type === SERVICE_HIDE_NOTIFICATION) {
    return { ...state, notification: { open: false, message: "", type: "" } };
  }
  if (action.type === SERVICE_OPEN_FORM_DIALOG) {
    const { type, row } = action.payload as { type: string; row: unknown };
    return {
      ...state,
      form_dialog: { ...state.form_dialog, open: true, type, row },
    };
  }
  if (action.type === SERVICE_HIDE_FORM_DIALOG) {
    return {
      ...state,
      form_dialog: { ...state.form_dialog, open: false, type: "", row: {} },
    };
  }

  return state;
};

export default ServiceReducer;
