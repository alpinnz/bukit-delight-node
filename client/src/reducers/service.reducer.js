import {
  SERVICE_ERROR_NOTIFICATION,
  SERVICE_INFO_NOTIFICATION,
  SERVICE_SUCCESS_NOTIFICATION,
  SERVICE_WARNING_NOTIFICATION,
  SERVICE_HIDE_NOTIFICATION,
  SERVICE_HIDE_FORM_DIALOG,
  SERVICE_OPEN_FORM_DIALOG,
} from "./../actions/service.action";

const initialState = {
  notification: { open: false, message: "", type: "" },
  form_dialog: { open: false, type: "", row: {} },
};

const ServiceReducer = (state = initialState, action) => {
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
    const { type, row } = action.payload;
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
