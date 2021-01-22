import axios from "axios";
import Const from "./../constant/const";
import Actions from "./";

export const MOUNT = "CUSTOMERS/MOUNT";
export const LOADING = "CUSTOMERS/LOADING";
export const SET_CUSTOMERS = "CUSTOMERS/SET_CUSTOMERS";
export const SET_CUSTOMER = "CUSTOMERS/SET_CUSTOMER";
export const CLEAN_CUSTOMER = "CUSTOMERS/CLEAN_CUSTOMER";

const localGetAccount = async () => {
  const account = await JSON.parse(localStorage.getItem("account"));
  return account;
};

const localGetCustomer = async () => {
  const customer = await JSON.parse(localStorage.getItem("customer"));
  return customer;
};

const localSetCustomer = async (customer) => {
  localStorage.setItem("customer", JSON.stringify(customer));
};

const mount = () => {
  return {
    type: MOUNT,
  };
};

const onMount = () => {
  const URL_PATH = "api/v1/customers";
  return async (dispatch) => {
    const customer = await localGetCustomer();

    const account = await localGetAccount();
    const headers = {
      "x-api-key": Const.X_API_KEY,
      "x-app-key": Const.X_APP_KEY,
      "x-access-token": account ? account.accessToken : "",
      "x-refresh-token": account ? account.refreshToken : "",
    };

    axios({
      method: "get",
      url: URL_PATH,
      baseURL: Const.BASE_URL,
      headers: headers,
    })
      .then((res) => {
        if (res["data"]["name"]) {
          const name = `${res["data"]["name"]}`.toLowerCase();
          if (name === "success") {
            const customers = res["data"]["data"];
            dispatch(setCustomers(customers));
            if (customer) {
              const Customer = customers.find(
                (e) => e["_id"] === customer["_id"]
              );
              if (Customer) {
                dispatch(setCustomer(Customer));
              } else {
                dispatch(cleanCustomer());
              }
            }

            setTimeout(() => {
              dispatch(mount());
            }, 2000);
          } else {
            dispatch(Actions.Service.pushErrorNotification("error"));
          }
        }
      })
      .catch((err) => {
        if (err.message !== "Cannot read property '_id' of null") {
          dispatch(Actions.Service.pushErrorNotification(err.message));
        }
      });
  };
};

const onLoad = () => {
  const URL_PATH = `api/v1/customers`;
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
            const customers = res["data"]["data"];
            dispatch(setCustomers(customers));
            setTimeout(() => {
              dispatch(onLoadSelectors());
            }, 1000);
          } else {
            const err = res["data"]["message"];
            dispatch(Actions.Service.pushInfoNotification(err));
          }
          dispatch(loading(false));
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

const onLoadSelectors = () => {
  return async (dispatch, getState) => {
    const state = await getState();
    const Customers = state.Customers;
    if (Customers.customer && Customers.customer._id) {
      let _id = Customers.customer._id;
      const customer = Customers.data.find((e) => e._id === _id);
      if (customer) {
        dispatch(Actions.Customers.setCustomer(customer));
      }
    }
  };
};

const onCreate = (props) => {
  const { username } = props;
  const URL_PATH = `api/v1/customers`;

  return async (dispatch) => {
    dispatch(loading(true));

    const formData = new FormData();
    formData.append("username", username);

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
            // dispatch(onLoad());
            const customer = res["data"]["data"];
            localSetCustomer(customer);
            dispatch(setCustomer(customer));
          } else {
            const err = res["data"]["message"];
            dispatch(Actions.Service.pushInfoNotification(err));
          }
          dispatch(loading(false));
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
  const { username } = props;
  const URL_PATH = `api/v1/customers/${_id}`;
  return async (dispatch) => {
    dispatch(loading(true));

    const formData = new FormData();
    formData.append("username", username);

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
              Actions.Service.pushSuccessNotification("Update Customers")
            );
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
  const URL_PATH = `api/v1/customers/${_id}`;
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
            dispatch(
              Actions.Service.pushSuccessNotification("Delete Customers")
            );
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

const setCustomers = (customers) => {
  return {
    type: SET_CUSTOMERS,
    payload: customers,
  };
};

const loading = (bool) => {
  return {
    type: LOADING,
    payload: bool,
  };
};

const setCustomer = (customer) => {
  return {
    type: SET_CUSTOMER,
    payload: customer,
  };
};

const cleanCustomer = (customer) => {
  return {
    type: CLEAN_CUSTOMER,
    payload: customer,
  };
};

const CustomersAction = {
  onLoad,
  onCreate,
  onUpdate,
  onDelete,
  setCustomer,
  cleanCustomer,
  onMount,
};

export default CustomersAction;
