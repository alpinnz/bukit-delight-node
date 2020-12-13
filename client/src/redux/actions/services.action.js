export const popupNotification = (title) => {
  return {
    type: "Services/popupNotification",
    payload: title,
  };
};

export const closeNotification = () => {
  return {
    type: "Services/closeNotification",
  };
};

const ServicesAction = { popupNotification, closeNotification };
export default ServicesAction;
