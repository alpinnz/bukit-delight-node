import axios from "axios";
import Const from "./../constant/const";
import Actions from "./";

export const MOUNT = "AUTHENTICATION/MOUNT";
export const LOADING = "AUTHENTICATION/LOADING";
export const SET_ACCOUNT = "AUTHENTICATION/SET_ACCOUNT";
export const REMOVE_ACCOUNT = "AUTHENTICATION/REMOVE_ACCOUNT";

const localGetAccount = async () => {
  const account = await JSON.parse(localStorage.getItem("account"));
  return account;
};

const localRemoveAccount = () => {
  const account = localStorage.removeItem("account");
  return account;
};

const localSetAccount = async (account) => {
  localStorage.setItem("account", JSON.stringify(account));
};

const mount = () => {
  return {
    type: MOUNT,
  };
};

const onMount = () => {
  const URL_PATH = "api/v1/authentication/refresh-token";
  return async (dispatch) => {
    const account = await localGetAccount();
    const headers = {
      "x-api-key": Const.X_API_KEY,
      "x-app-key": Const.X_APP_KEY,
      "x-access-token": account ? account.accessToken : "",
      "x-refresh-token": account ? account.refreshToken : "",
    };

    axios({
      method: "post",
      url: URL_PATH,
      baseURL: Const.BASE_URL,
      headers: headers,
    })
      .then((res) => {
        if (res["data"]["name"]) {
          const name = `${res["data"]["name"]}`.toLowerCase();
          if (name === "success") {
            const newAccount = res["data"]["data"];
            localSetAccount(newAccount);
            dispatch(setAccount(newAccount));
            setTimeout(() => {
              dispatch(mount());
            }, 1000);

            localStorage.setItem("account", JSON.stringify(newAccount));
            // dispatch(Actions.Service.pushSuccessNotification("Login"));
          } else {
            // const err = res["data"]["message"];
            localRemoveAccount();
            dispatch(removeAccount());
            // dispatch(Actions.Service.pushInfoNotification(err));
          }
        } else {
          localRemoveAccount();
          dispatch(removeAccount());
          // dispatch(Actions.Service.pushErrorNotification("error"));
        }
      })
      .catch((err) => {
        localRemoveAccount();
        dispatch(removeAccount());
        dispatch(Actions.Service.pushErrorNotification(err.message));
      });
  };
};

const onLogin = (state) => {
  const URL_PATH = "api/v1/authentication/login";
  return async (dispatch) => {
    dispatch(loading(true));

    const account = await localGetAccount();
    const headers = {
      "x-api-key": Const.X_API_KEY,
      "x-app-key": Const.X_APP_KEY,
      "x-access-token": account ? account.accessToken : "",
      "x-refresh-token": account ? account.refreshToken : "",
      "Content-Type": "multipart/form-data",
    };
    const { username, password } = state;
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    axios({
      method: "post",
      url: URL_PATH,
      data: formData,
      baseURL: Const.BASE_URL,
      headers: headers,
    })
      .then((res) => {
        if (res["data"]["name"]) {
          const name = `${res["data"]["name"]}`.toLowerCase();
          if (name === "success") {
            const account = res["data"]["data"];
            localSetAccount(account);
            dispatch(setAccount(account));
            dispatch(Actions.Service.pushSuccessNotification("Login"));
          } else {
            const err = res["data"]["message"];
            dispatch(loading(false));
            dispatch(Actions.Service.pushInfoNotification(err));
          }
        } else {
          dispatch(loading(false));
          dispatch(Actions.Service.pushErrorNotification("error"));
        }
      })
      .catch((err) => {
        dispatch(loading(false));
        dispatch(Actions.Service.pushErrorNotification(err.message));
      });
  };
};

const onLogout = () => {
  const URL_PATH = "api/v1/authentication/logout";
  return async (dispatch) => {
    dispatch(loading(true));

    const account = await localGetAccount();
    const headers = {
      "x-api-key": Const.X_API_KEY,
      "x-app-key": Const.X_APP_KEY,
      "x-access-token": account ? account.accessToken : "",
      "x-refresh-token": account ? account.refreshToken : "",
    };

    axios({
      method: "post",
      url: URL_PATH,
      baseURL: Const.BASE_URL,
      headers: headers,
    })
      .then((res) => {
        if (res["data"]["name"]) {
          const name = `${res["data"]["name"]}`.toLowerCase();
          if (name === "success") {
            localRemoveAccount();
            dispatch(removeAccount());
            dispatch(Actions.Service.pushSuccessNotification("Logout"));
          } else {
            const err = res["data"]["message"];
            dispatch(loading(false));
            dispatch(Actions.Service.pushInfoNotification(err));
          }
        } else {
          dispatch(loading(false));
          dispatch(Actions.Service.pushErrorNotification("error"));
        }
      })
      .catch((err) => {
        dispatch(loading(false));
        dispatch(Actions.Service.pushErrorNotification(err.message));
      });
  };
};

const setAccount = (account) => {
  return {
    type: SET_ACCOUNT,
    payload: account,
  };
};

const removeAccount = () => {
  return {
    type: REMOVE_ACCOUNT,
  };
};

const loading = (bool) => {
  return {
    type: LOADING,
    payload: bool,
  };
};

const AuthenticationAction = {
  onLogin,
  onLogout,
  onMount,
};

export default AuthenticationAction;
