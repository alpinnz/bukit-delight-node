import axios from "axios";
import Const from "./../constant/const";
import Actions from "./";

export const MOUNT = "TRANSACTIONS/MOUNT";
export const LOADING = "TRANSACTIONS/LOADING";
export const SET_TRANSACTIONS = "TRANSACTIONS/SET_TRANSACTIONS";
export const SET_TRANSACTION = "TRANSACTIONS/SET_TRANSACTION";
export const CLEAN_TRANSACTION = "TRANSACTIONS/CLEAN_TRANSACTION";
export const DIALOG_STATUS_OPEN = "TRANSACTIONS/DIALOG_STATUS_OPEN";
export const DIALOG_STATUS_HIDE = "TRANSACTIONS/DIALOG_STATUS_HIDE";
export const DIALOG_REVIEW_OPEN = "TRANSACTIONS/DIALOG_REVIEW_OPEN";
export const DIALOG_REVIEW_HIDE = "TRANSACTIONS/DIALOG_REVIEW_HIDE";

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
  const URL_PATH = `api/v1/transactions`;
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
      .then((res) => {
        if (res["data"]["name"]) {
          const name = `${res["data"]["name"]}`.toLowerCase();
          if (name === "success") {
            const transactions = res["data"]["data"];
            dispatch(setTransactions(transactions));
            setTimeout(() => {
              dispatch(onLoadSelectors());
            }, 2000);
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

// const onCartTransaction = () => {
//   return async (dispatch, getState) => {
//     const state = await getState();
//     const Customers = state.Customers;
//     const Transactions = state.Transactions;

//     if (Customers.customer) {
//       const transaction = await Transactions.data.find(
//         (e) =>
//           e.id_order.id_customer._id === Customers.customer._id &&
//           e.status !== "done"
//       );
//       if (transaction) {
//         dispatch(Actions.Tables.setTable(transaction.id_order.id_table));
//         dispatch(Actions.Cart.setTransaction(transaction));
//       } else {
//         dispatch(Actions.Tables.cleanTable());
//         dispatch(Actions.Cart.cleanTransaction());
//       }
//     }

//     setTimeout(() => {
//       dispatch(loading(false));
//       dispatch(mount());
//     }, 1000);
//   };
// };

const onLoad = () => {
  const URL_PATH = `api/v1/transactions`;
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
            const transactions = res["data"]["data"];
            dispatch(setTransactions(transactions));
            setTimeout(() => {
              dispatch(onLoadSelectors());
            }, 2000);
            // dispatch(onLoadSelectors());
            // dispatch(onCheckOrder());
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
    const Transactions = state.Transactions;

    const Customers = state.Customers;
    // Kasir Transactions
    if (Transactions.transaction && Transactions.transaction._id) {
      let _id = Transactions.transaction._id;
      const transaction = Transactions.data.find((e) => e._id === _id);
      if (transaction) {
        dispatch(Actions.Transactions.setTransaction(transaction));
      }
    }
    // Customers Transactions
    if (Customers.customer) {
      const transaction = await Transactions.data.find(
        (e) =>
          e.id_order.id_customer._id === Customers.customer._id &&
          e.status !== "done"
      );
      if (transaction) {
        dispatch(Actions.Tables.setTable(transaction.id_order.id_table));
        dispatch(Actions.Cart.setTransaction(transaction));
      } else {
        const new_state = await getState();
        const Cart = new_state.Cart;
        if (Cart.order) {
          dispatch(Actions.Cart.cleanTransaction());
        } else {
          dispatch(Actions.Tables.cleanTable());
          dispatch(Actions.Cart.cleanTransaction());
        }
      }
    }
    setTimeout(() => {
      if (Transactions.loading) {
        dispatch(loading(false));
      }
      if (!Transactions.mount) {
        dispatch(mount());
      }
    }, 1000);
    // if (Cart.transaction && Cart.transaction._id) {
    //   let _id = Cart.transaction._id;
    //   const transaction = Transactions.data.find((e) => e._id === _id);
    //   if (transaction) {
    //     dispatch(Actions.Cart.setTransaction(transaction));
    //   } else {
    //     dispatch(Actions.Cart.cleanTransaction());
    //   }
    // } else {
    //   dispatch(Actions.Cart.cleanTransaction());
    // }
  };
};

const onCreate = (props) => {
  const { note, payment } = props;
  const URL_PATH = `api/v1/transactions`;

  return async (dispatch, getState) => {
    dispatch(loading(true));
    const state = await getState();
    const id_account = state.Authentication.account._id;
    const id_order = state.Orders.order._id;

    const formData = new FormData();
    formData.append("id_account", id_account);
    formData.append("id_order", id_order);
    if (note) {
      formData.append("note", note);
    }

    formData.append("payment", payment);

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
            dispatch(Actions.Orders.onLoad());
            dispatch(
              Actions.Service.pushSuccessNotification("Create Transactions")
            );
            dispatch(Actions.Orders.hideDialogPayment());
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
  const URL_PATH = `api/v1/transactions/${_id}`;
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

const onUpdateStatus = (props) => {
  const { status } = props;

  return async (dispatch, getState) => {
    dispatch(loading(true));
    const state = await getState();
    const _id = state.Transactions.transaction._id;
    const URL_PATH = `api/v1/transactions/status/${_id}`;

    const formData = new FormData();
    formData.append("status", status);

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
            dispatch(
              Actions.Service.pushSuccessNotification(
                "Update status transaction"
              )
            );
            dispatch(Actions.Service.hideFormDialog());
            dispatch(Actions.Transactions.hideDialogStatus());
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
  const URL_PATH = `api/v1/transactions/${_id}`;
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

const setTransactions = (transactions) => {
  return {
    type: SET_TRANSACTIONS,
    payload: transactions,
  };
};

const loading = (bool) => {
  return {
    type: LOADING,
    payload: bool,
  };
};

const setTransaction = (transaction) => {
  return {
    type: SET_TRANSACTION,
    payload: transaction,
  };
};

const cleanTransaction = () => {
  return {
    type: CLEAN_TRANSACTION,
  };
};

const openDialogStatus = () => {
  return {
    type: DIALOG_STATUS_OPEN,
  };
};

const hideDialogStatus = () => {
  return {
    type: DIALOG_STATUS_HIDE,
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

const TransactionsAction = {
  onMount,
  onLoad,
  onCreate,
  onUpdate,
  onUpdateStatus,
  onDelete,
  setTransaction,
  cleanTransaction,
  openDialogStatus,
  hideDialogStatus,
  openDialogReview,
  hideDialogReview,
};

export default TransactionsAction;
