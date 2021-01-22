import axios from "axios";
import Const from "./../constant/const";
import Actions from "./";

export const MOUNT = "ORDERS/MOUNT";
export const LOADING = "ORDERS/LOADING";
export const SET_ORDERS = "ORDERS/SET_ORDERS";
export const SET_ORDER = "ORDERS/SET_ORDER";
export const CLEAN_ORDER = "ORDERS/CLEAN_ORDER";
export const DIALOG_PAYMENT_OPEN = "ORDERS/DIALOG_PAYMENT_OPEN";
export const DIALOG_PAYMENT_HIDE = "ORDERS/DIALOG_PAYMENT_HIDE";
export const DIALOG_REVIEW_OPEN = "ORDERS/DIALOG_REVIEW_OPEN";
export const DIALOG_REVIEW_HIDE = "ORDERS/DIALOG_REVIEW_HIDE";

const localGetAccount = async () => {
  const account = await JSON.parse(localStorage.getItem("account"));
  return account;
};

const mount = () => {
  return {
    type: MOUNT,
  };
};

const onMount = () => {
  const URL_PATH = `api/v1/orders`;
  return async (dispatch) => {
    dispatch(loading(true));
    const account = await localGetAccount();
    const HEADERS = {
      "x-api-key": Const.X_API_KEY,
      "x-app-key": Const.X_APP_KEY,
      "x-access-token": account ? account.accessToken : "",
      "x-refresh-token": account ? account.refreshToken : "",
    };

    axios({
      method: "GET",
      url: URL_PATH,
      baseURL: Const.BASE_URL,
      headers: HEADERS,
    })
      .then(async (res) => {
        if (res["data"]["name"]) {
          const name = `${res["data"]["name"]}`.toLowerCase();
          if (name === "success") {
            const orders = res["data"]["data"];
            dispatch(setOrders(orders));

            setTimeout(() => {
              dispatch(onLoadSelectors());
            }, 1000);
          } else {
            const err = res["data"]["message"];
            dispatch(Actions.Service.pushInfoNotification(err));
          }
        } else {
          dispatch(Actions.Service.pushErrorNotification("error"));
        }
      })
      .catch((err) => {
        dispatch(Actions.Service.pushErrorNotification(err.message));
      });
  };
};

const onLoad = () => {
  const URL_PATH = `api/v1/orders`;
  return async (dispatch) => {
    // dispatch(loading(true));

    const account = await localGetAccount();
    const HEADERS = {
      "x-api-key": Const.X_API_KEY,
      "x-app-key": Const.X_APP_KEY,
      "x-access-token": account ? account.accessToken : "",
      "x-refresh-token": account ? account.refreshToken : "",
    };

    axios({
      method: "GET",
      url: URL_PATH,
      baseURL: Const.BASE_URL,
      headers: HEADERS,
    })
      .then((res) => {
        if (res["data"]["name"]) {
          const name = `${res["data"]["name"]}`.toLowerCase();
          if (name === "success") {
            const orders = res["data"]["data"];
            dispatch(setOrders(orders));
            setTimeout(() => {
              dispatch(onLoadSelectors());
            }, 1000);
            // setTimeout(() => {
            //   dispatch(onCartOrder());
            // }, 1000);
          } else {
            const err = res["data"]["message"];
            dispatch(Actions.Service.pushInfoNotification(err));
            // dispatch(loading(false));
          }
        } else {
          dispatch(Actions.Service.pushErrorNotification("error"));
          // dispatch(loading(false));
        }
      })
      .catch((err) => {
        dispatch(Actions.Service.pushErrorNotification(err.message));
        // dispatch(loading(false));
      });
  };
};

const onLoadSelectors = () => {
  return async (dispatch, getState) => {
    const state = await getState();
    const Orders = state.Orders;
    // const Cart = state.Cart;
    const Customers = state.Customers;
    // Admin Order
    if (Orders.order && Orders.order._id) {
      let _id = Orders.order._id;
      const order = Orders.data.find((e) => e._id === _id);
      if (order) {
        await dispatch(Actions.Orders.setOrder(order));
      }
    }
    // Customer Cart
    if (Customers.customer) {
      const order = await Orders.data.find(
        (e) =>
          e.isExpired === false && e.id_customer._id === Customers.customer._id
      );
      if (order) {
        await dispatch(Actions.Tables.setTable(order.id_table));
        await dispatch(Actions.Cart.setOrder(order));
      } else {
        await dispatch(Actions.Cart.cleanOrder());
      }
    }
    setTimeout(() => {
      if (Orders.loading) {
        dispatch(loading(false));
      }
      if (!Orders.mount) {
        dispatch(mount());
      }
    }, 1000);
    // if (Cart.order && Cart.order._id) {
    //   let _id = Cart.order._id;
    //   const order = Orders.data.find((e) => e._id === _id);
    //   if (order) {
    //     dispatch(Actions.Cart.setOrder(order));
    //   } else {
    //     dispatch(Actions.Cart.cleanOrder());
    //   }
    // } else {
    //   dispatch(Actions.Cart.cleanOrder());
    // }
  };
};

const onCreate = (props) => {
  const { note } = props;
  const URL_PATH = `api/v1/orders`;

  return async (dispatch, getState) => {
    dispatch(loading(true));
    const state = await getState();
    const Cart = state.Cart;
    const id_customer = state.Customers.customer._id;
    const id_table = state.Tables.table._id;

    const formData = new FormData();
    formData.append("id_customer", id_customer);
    formData.append("id_table", id_table);
    if (note) {
      formData.append("note", note);
    }

    Cart.data.forEach((e, i) => {
      formData.append(`Menus[${i}][id_menu]`, e["menu"]["_id"]);
      formData.append(`Menus[${i}][quality]`, e["quality"]);
      if (e["note"]) {
        formData.append(`Menus[${i}][note]`, e["note"]);
      }
    });

    const account = await localGetAccount();
    const HEADERS = {
      "x-api-key": Const.X_API_KEY,
      "x-app-key": Const.X_APP_KEY,
      "x-access-token": account ? account.accessToken : "",
      "x-refresh-token": account ? account.refreshToken : "",
    };

    axios({
      method: "POST",
      url: URL_PATH,
      baseURL: Const.BASE_URL,
      data: formData,
      headers: HEADERS,
    })
      .then((res) => {
        if (res["data"]["name"]) {
          const name = `${res["data"]["name"]}`.toLowerCase();
          if (name === "success") {
            dispatch(onLoad());
            dispatch(Actions.Service.pushSuccessNotification("Create Orders"));
            dispatch(Actions.Cart.onClean());
            dispatch(Actions.Cart.dialogPaymentHide());

            dispatch(loading(false));
          } else {
            const err = res["data"]["message"];
            dispatch(Actions.Service.pushInfoNotification(err));
            dispatch(loading(false));
          }
        } else {
          dispatch(Actions.Service.pushErrorNotification("error"));
          dispatch(loading(false));
        }
      })
      .catch((err) => {
        dispatch(Actions.Service.pushErrorNotification(err.message));
        dispatch(loading(false));
      });
  };
};

const onUpdate = (_id, props) => {
  const { name, desc, image, price, id_category, promo } = props;
  const URL_PATH = `api/v1/menus/${_id}`;
  return async (dispatch) => {
    dispatch(loading(true));

    const formData = new FormData();
    formData.append("name", name);
    formData.append("desc", desc);
    formData.append("price", price);
    formData.append("promo", promo);
    if (image) {
      formData.append("image", image);
    }
    formData.append("id_category", id_category);

    const account = await localGetAccount();
    const HEADERS = {
      "x-api-key": Const.X_API_KEY,
      "x-app-key": Const.X_APP_KEY,
      "x-access-token": account ? account.accessToken : "",
      "x-refresh-token": account ? account.refreshToken : "",
    };

    axios({
      method: "PUT",
      url: URL_PATH,
      baseURL: Const.BASE_URL,
      data: formData,
      headers: HEADERS,
    })
      .then((res) => {
        if (res["data"]["name"]) {
          const name = `${res["data"]["name"]}`.toLowerCase();
          if (name === "success") {
            dispatch(onLoad());
            dispatch(Actions.Service.pushSuccessNotification("Update Menus"));
            dispatch(Actions.Service.hideFormDialog());
            dispatch(loading(false));
          } else {
            const err = res["data"]["message"];
            dispatch(Actions.Service.pushInfoNotification(err));
            dispatch(loading(false));
          }
        } else {
          dispatch(Actions.Service.pushErrorNotification("error"));
          dispatch(loading(false));
        }
      })
      .catch((err) => {
        dispatch(Actions.Service.pushErrorNotification(err.message));
        dispatch(loading(false));
      });
  };
};

const onDelete = (_id) => {
  const URL_PATH = `api/v1/menus/${_id}`;
  return async (dispatch) => {
    dispatch(loading(true));

    const account = await localGetAccount();
    const HEADERS = {
      "x-api-key": Const.X_API_KEY,
      "x-app-key": Const.X_APP_KEY,
      "x-access-token": account ? account.accessToken : "",
      "x-refresh-token": account ? account.refreshToken : "",
    };

    axios({
      method: "DELETE",
      url: URL_PATH,
      baseURL: Const.BASE_URL,
      headers: HEADERS,
    })
      .then((res) => {
        if (res["data"]["name"]) {
          const name = `${res["data"]["name"]}`.toLowerCase();
          if (name === "success") {
            dispatch(onLoad());
            dispatch(Actions.Service.pushSuccessNotification("Delete Menus"));
            dispatch(Actions.Service.hideFormDialog());
            dispatch(loading(false));
          } else {
            const err = res["data"]["message"];
            dispatch(Actions.Service.pushInfoNotification(err));
            dispatch(loading(false));
          }
        } else {
          dispatch(Actions.Service.pushErrorNotification("error"));
          dispatch(loading(false));
        }
      })
      .catch((err) => {
        dispatch(Actions.Service.pushErrorNotification(err.message));
        dispatch(loading(false));
      });
  };
};

const setOrders = (orders) => {
  return {
    type: SET_ORDERS,
    payload: orders,
  };
};

const loading = (bool) => {
  return {
    type: LOADING,
    payload: bool,
  };
};

const setOrder = (order) => {
  return {
    type: SET_ORDER,
    payload: order,
  };
};

const cleanOrder = () => {
  return {
    type: CLEAN_ORDER,
  };
};

const openDialogPayment = () => {
  return {
    type: DIALOG_PAYMENT_OPEN,
  };
};

const hideDialogPayment = () => {
  return {
    type: DIALOG_PAYMENT_HIDE,
  };
};

const openDialogReview = () => {
  return {
    type: DIALOG_REVIEW_OPEN,
  };
};

const hideDialogReview = () => {
  return {
    type: DIALOG_REVIEW_HIDE,
  };
};

const OrdersAction = {
  onMount,
  onLoad,
  onCreate,
  onUpdate,
  onDelete,
  setOrder,
  cleanOrder,
  openDialogPayment,
  hideDialogPayment,
  openDialogReview,
  hideDialogReview,
};

export default OrdersAction;
