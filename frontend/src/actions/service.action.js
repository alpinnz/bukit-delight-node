export const SERVICE_INFO_NOTIFICATION = "SERVICE/INFO_NOTIFICATION";
export const SERVICE_SUCCESS_NOTIFICATION = "SERVICE/SUCCESS_NOTIFICATION";
export const SERVICE_WARNING_NOTIFICATION = "SERVICE/WARNING_NOTIFICATION";
export const SERVICE_ERROR_NOTIFICATION = "SERVICE/ERROR_NOTIFICATION";
export const SERVICE_HIDE_NOTIFICATION = "SERVICE/HIDE_NOTIFICATION";
export const SERVICE_OPEN_FORM_DIALOG = "SERVICE/OPEN_FORM_DIALOG";
export const SERVICE_HIDE_FORM_DIALOG = "SERVICE/HIDE_FORM_DIALOG";

const pushSuccessNotification = (message) => {
  return {
    type: SERVICE_SUCCESS_NOTIFICATION,
    payload: message,
  };
};
const pushWarningNotification = (message) => {
  return {
    type: SERVICE_WARNING_NOTIFICATION,
    payload: message,
  };
};
const pushInfoNotification = (message) => {
  return {
    type: SERVICE_INFO_NOTIFICATION,
    payload: message,
  };
};

const pushErrorNotification = (message) => {
  return {
    type: SERVICE_ERROR_NOTIFICATION,
    payload: message,
  };
};

const hideNotification = () => {
  return {
    type: SERVICE_HIDE_NOTIFICATION,
  };
};

const openFormDialog = (type, row) => {
  return {
    type: SERVICE_OPEN_FORM_DIALOG,
    payload: { type, row },
  };
};

const hideFormDialog = () => {
  return {
    type: SERVICE_HIDE_FORM_DIALOG,
  };
};

const ServiceAction = {
  pushSuccessNotification,
  pushWarningNotification,
  pushInfoNotification,
  pushErrorNotification,
  hideNotification,
  openFormDialog,
  hideFormDialog,
};

export default ServiceAction;
