import axios from "axios";
import type { ApiResponse } from "@bukit-delight/shared";
import type { AnyAction } from "redux";
import type { ThunkAction } from "redux-thunk";
import Const from "../../constant/const";
import Actions from "../../actions";
import type { RootState } from "../../reducers";
import type { AuthenticationAccount } from "./authentication.reducer";

export const MOUNT = "AUTHENTICATION/MOUNT";
export const LOADING = "AUTHENTICATION/LOADING";
export const SET_ACCOUNT = "AUTHENTICATION/SET_ACCOUNT";
export const REMOVE_ACCOUNT = "AUTHENTICATION/REMOVE_ACCOUNT";

type AuthenticationThunk = ThunkAction<void, RootState, unknown, AnyAction>;

type AuthenticationResponse<T> = ApiResponse<T>;

export type LoginCredentials = {
  username: string;
  password: string;
};

const localGetAccount = async (): Promise<AuthenticationAccount | null> => {
  const account = localStorage.getItem("account");
  return account ? (JSON.parse(account) as AuthenticationAccount) : null;
};

const localRemoveAccount = (): void => {
  localStorage.removeItem("account");
};

const localSetAccount = async (
  account: AuthenticationAccount,
): Promise<void> => {
  localStorage.setItem("account", JSON.stringify(account));
};

const errorMessage = (cause: unknown): string => {
  if (
    typeof cause === "object" &&
    cause !== null &&
    "message" in cause &&
    typeof cause.message === "string"
  ) {
    return cause.message;
  }
  return "error";
};

const mount = () => ({ type: MOUNT });

const onMount = (): AuthenticationThunk => {
  const URL_PATH = "api/v1/authentication/refresh-token";
  return async (dispatch) => {
    const account = await localGetAccount();
    if (!account) {
      dispatch(mount());
      return;
    }

    const headers = {
      "x-api-key": Const.X_API_KEY,
      "x-app-key": Const.X_APP_KEY,
      "x-access-token": account.accessToken,
      "x-refresh-token": account.refreshToken,
    };

    axios({
      method: "post",
      url: URL_PATH,
      baseURL: Const.BASE_URL,
      headers,
    })
      .then((response) => {
        const body =
          response.data as AuthenticationResponse<AuthenticationAccount>;
        if (body.name && `${body.name}`.toLowerCase() === "success") {
          const newAccount = body.data;
          if (!newAccount) {
            localRemoveAccount();
            dispatch(removeAccount());
            return;
          }

          void localSetAccount(newAccount);
          dispatch(setAccount(newAccount));
          setTimeout(() => {
            dispatch(mount());
          }, 1000);
          localStorage.setItem("account", JSON.stringify(newAccount));
          return;
        }

        localRemoveAccount();
        dispatch(removeAccount());
      })
      .catch((cause: unknown) => {
        localRemoveAccount();
        dispatch(removeAccount());
        dispatch(Actions.Service.pushErrorNotification(errorMessage(cause)));
      });
  };
};

const onLogin = (credentials: LoginCredentials): AuthenticationThunk => {
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
    const formData = new FormData();
    formData.append("username", credentials.username);
    formData.append("password", credentials.password);

    axios({
      method: "post",
      url: URL_PATH,
      data: formData,
      baseURL: Const.BASE_URL,
      headers,
    })
      .then((response) => {
        const body =
          response.data as AuthenticationResponse<AuthenticationAccount>;
        if (body.name && `${body.name}`.toLowerCase() === "success") {
          const loggedInAccount = body.data;
          if (!loggedInAccount) {
            dispatch(loading(false));
            dispatch(Actions.Service.pushErrorNotification("error"));
            return;
          }

          void localSetAccount(loggedInAccount);
          dispatch(setAccount(loggedInAccount));
          dispatch(Actions.Service.pushSuccessNotification("Login"));
          return;
        }

        if (body.name) {
          dispatch(loading(false));
          dispatch(
            Actions.Service.pushInfoNotification(body.message ?? "error"),
          );
        } else {
          dispatch(loading(false));
          dispatch(Actions.Service.pushErrorNotification("error"));
        }
      })
      .catch((cause: unknown) => {
        dispatch(loading(false));
        dispatch(Actions.Service.pushErrorNotification(errorMessage(cause)));
      });
  };
};

const onLogout = (): AuthenticationThunk => {
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
      headers,
    })
      .then((response) => {
        const body = response.data as AuthenticationResponse<unknown>;
        if (body.name && `${body.name}`.toLowerCase() === "success") {
          localRemoveAccount();
          dispatch(removeAccount());
          dispatch(Actions.Service.pushSuccessNotification("Logout"));
          return;
        }

        if (body.name) {
          dispatch(loading(false));
          dispatch(
            Actions.Service.pushInfoNotification(body.message ?? "error"),
          );
        } else {
          dispatch(loading(false));
          dispatch(Actions.Service.pushErrorNotification("error"));
        }
      })
      .catch((cause: unknown) => {
        dispatch(loading(false));
        dispatch(Actions.Service.pushErrorNotification(errorMessage(cause)));
      });
  };
};

const setAccount = (account: AuthenticationAccount) => ({
  type: SET_ACCOUNT,
  payload: account,
});

const removeAccount = () => ({ type: REMOVE_ACCOUNT });

const loading = (isLoading: boolean) => ({ type: LOADING, payload: isLoading });

const AuthenticationAction = {
  onLogin,
  onLogout,
  onMount,
};

export default AuthenticationAction;
