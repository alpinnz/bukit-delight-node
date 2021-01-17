import axios from "axios";
import Const from "./../constant/const";
import Actions from "./";

export const MOUNT = "TABLES/MOUNT";
export const LOADING = "TABLES/LOADING";
export const SET_TABLES = "TABLES/_SET_TABLES";
export const SET_TABLE = "TABLES/SET_TABLE";
export const CLEAN_TABLE = "TABLES/CLEAN_TABLE";

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
  const URL_PATH = `api/v1/tables`;
  return async (dispatch) => {
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
            const tables = res["data"]["data"];
            dispatch(setTables(tables));
            setTimeout(() => {
              dispatch(mount());
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
  const URL_PATH = `api/v1/tables`;
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
            const accounts = res["data"]["data"];
            dispatch(setTables(accounts));
            dispatch(onLoadSelectors());
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

const onLoadSelectors = () => {
  return async (dispatch, getState) => {
    const state = await getState();
    const Tables = state.Tables;
    if (Tables.table && Tables.table._id) {
      let _id = Tables.table._id;
      const table = Tables.data.find((e) => e._id === _id);
      if (table) {
        dispatch(Actions.Tables.setTable(table));
      }
    }
  };
};

const onCreate = (props) => {
  const { name } = props;
  const URL_PATH = `api/v1/tables`;

  return async (dispatch) => {
    dispatch(loading(true));

    const formData = new FormData();
    formData.append("name", name);

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
            dispatch(Actions.Service.pushSuccessNotification("Create Tables"));
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

const onUpdate = (_id, props) => {
  const { name } = props;
  const URL_PATH = `api/v1/tables/${_id}`;
  return async (dispatch) => {
    dispatch(loading(true));

    const formData = new FormData();
    formData.append("name", name);

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
            dispatch(Actions.Service.pushSuccessNotification("Update Tables"));
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
  const URL_PATH = `api/v1/tables/${_id}`;
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
            dispatch(Actions.Service.pushSuccessNotification("Delete Tables"));
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

const setTables = (tables) => {
  return {
    type: SET_TABLES,
    payload: tables,
  };
};

const setTable = (table) => {
  return {
    type: SET_TABLE,
    payload: table,
  };
};

const cleanTable = () => {
  return {
    type: CLEAN_TABLE,
  };
};

const loading = (bool) => {
  return {
    type: LOADING,
    payload: bool,
  };
};

const TablesAction = {
  onMount,
  onLoad,
  onCreate,
  onUpdate,
  onDelete,
  setTable,
  cleanTable,
};

export default TablesAction;
