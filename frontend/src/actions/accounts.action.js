import axios from "axios";
import Const from "./../constant/const";
import Actions from "./";

export const MOUNT = "ACCOUNTS/MOUNT";
export const LOADING = "ACCOUNTS/LOADING";
export const SET_ACCOUNTS = "ACCOUNTS/SET_ACCOUNTS";

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
  const URL_PATH = `api/v1/accounts/`;
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
            const accounts = res["data"]["data"];
            dispatch(setAccounts(accounts));
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
  const URL_PATH = `api/v1/accounts/`;
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
            dispatch(setAccounts(accounts));
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

const onCreate = (props) => {
  const { username, email, id_role, password, repeat_password } = props;
  const URL_PATH = `api/v1/accounts/`;

  return async (dispatch) => {
    dispatch(loading(true));

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("id_role", id_role);
    formData.append("password", password);
    formData.append("repeat_password", repeat_password);

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
            dispatch(Actions.Service.pushSuccessNotification("Create Account"));
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
  const { username, email, id_role, password, repeat_password } = props;
  const URL_PATH = `api/v1/accounts/${_id}`;
  return async (dispatch) => {
    dispatch(loading(true));

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("id_role", id_role);
    if (password && repeat_password) {
      formData.append("password", password);
      formData.append("repeat_password", repeat_password);
    }

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
            dispatch(Actions.Service.pushSuccessNotification("Update Account"));
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
  const URL_PATH = `api/v1/accounts/${_id}`;
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
            dispatch(Actions.Service.pushSuccessNotification("Delete Account"));
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

const setAccounts = (accounts) => {
  return {
    type: SET_ACCOUNTS,
    payload: accounts,
  };
};

const loading = (bool) => {
  return {
    type: LOADING,
    payload: bool,
  };
};

const AccountsAction = {
  onMount,
  onLoad,
  onCreate,
  onUpdate,
  onDelete,
};

export default AccountsAction;
