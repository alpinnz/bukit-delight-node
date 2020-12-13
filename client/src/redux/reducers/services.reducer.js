const initialState = {
  notification: { open: false, title: "" },
};

const ServicesReducer = (state = initialState, action) => {
  if (action.type === "Services/popupNotification") {
    return {
      ...state,
      notification: { open: true, title: action.payload },
    };
  }
  if (action.type === "Services/closeNotification") {
    return { ...state, notification: { open: false, title: "" } };
  }
  return state;
};
export default ServicesReducer;
