import axios from "axios";
import Const from "./../constant/const";
import Actions from "./";

export const LOADING = "ROLES_LOADING";
export const SET_ROLES = "ROLES_SET_ROLES";

const localGetAccount = async () => {
  const account = await JSON.parse(localStorage.getItem("account"));
  return account;
};

const onLoad = () => {
  const URL_PATH = `api/v1/roles/`;
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
            const roles = res["data"]["data"];
            dispatch(setRoles(roles));
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

const setRoles = (roles) => {
  return {
    type: SET_ROLES,
    payload: roles,
  };
};

const loading = (bool) => {
  return {
    type: LOADING,
    payload: bool,
  };
};

const AccountsAction = {
  onLoad,
};

export default AccountsAction;
