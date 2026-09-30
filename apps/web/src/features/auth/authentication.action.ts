import axios from "axios";
import type { ApiResponse } from "@bukit-delight/shared";
import type { AnyAction } from "redux";
import type { ThunkAction } from "redux-thunk";
import apiConfig from "../../config/api-config";
import Actions from "../../actions";
import type { RootState } from "../../reducers";
import type { AuthenticationAccount } from "./authentication.reducer";

export const MOUNT = "AUTHENTICATION/MOUNT";
export const LOADING = "AUTHENTICATION/LOADING";
export const SET_ACCOUNT = "AUTHENTICATION/SET_ACCOUNT";
export const REMOVE_ACCOUNT = "AUTHENTICATION/REMOVE_ACCOUNT";

type AuthenticationThunk<T = void> = ThunkAction<
  Promise<T>,
  RootState,
  unknown,
  AnyAction
>;

type AuthenticationResponse<T> = ApiResponse<T>;

export type LoginCredentials = {
  username: string;
  password: string;
};

export type LoginResult = "success" | "active-session" | "failed";

export type RegistrationCredentials = {
  email: string;
  password: string;
  repeatPassword: string;
};

const accountHasRole = (account: AuthenticationAccount, role: string) =>
  (account.roles ?? [account.role]).some(
    (accountRole) => accountRole.toLowerCase() === role,
  );

const localGetAccount = async (): Promise<AuthenticationAccount | null> => {
  const account = localStorage.getItem("account");
  return account ? (JSON.parse(account) as AuthenticationAccount) : null;
};

const localRemoveAccount = (): void => {
  localStorage.removeItem("account");
  localStorage.removeItem("customer");
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
  const URL_PATH = "api/v1/auth/refresh-token";
  return async (dispatch) => {
    const account = await localGetAccount();
    if (!account) {
      localStorage.removeItem("customer");
      dispatch(Actions.Customers.cleanCustomer());
      dispatch(mount());
      return;
    }

    const headers = {
      "x-api-key": apiConfig.apiKey,
      "x-app-key": apiConfig.appKey,
      "x-access-token": account.access_token,
      "x-refresh-token": account.refresh_token,
    };

    try {
      const response = await axios({
        method: "post",
        url: URL_PATH,
        baseURL: apiConfig.baseUrl,
        headers,
      });
      const body =
        response.data as AuthenticationResponse<AuthenticationAccount>;
      const refreshedAccount = body.data;
      const isSuccessful =
        body.name && `${body.name}`.toLowerCase() === "success";
      if (!isSuccessful || !refreshedAccount) {
        localRemoveAccount();
        dispatch(removeAccount());
        dispatch(Actions.Customers.cleanCustomer());
        dispatch(mount());
        return;
      }

      await localSetAccount(refreshedAccount);
      dispatch(setAccount(refreshedAccount));
      if (accountHasRole(refreshedAccount, "customer")) {
        dispatch(
          Actions.Customers.setCustomer({
            id: refreshedAccount.id,
            username: refreshedAccount.username,
          }),
        );
      } else {
        dispatch(Actions.Customers.cleanCustomer());
      }
      dispatch(mount());
    } catch (cause: unknown) {
      localRemoveAccount();
      dispatch(removeAccount());
      dispatch(Actions.Customers.cleanCustomer());
      dispatch(Actions.Service.pushErrorNotification(errorMessage(cause)));
      dispatch(mount());
    }
  };
};

const onLogin = (
  credentials: LoginCredentials,
  replaceActiveSession = false,
): AuthenticationThunk<LoginResult> => {
  const URL_PATH = "api/v1/auth/login";
  return async (dispatch) => {
    dispatch(loading(true));

    const account = await localGetAccount();
    const headers = {
      "x-api-key": apiConfig.apiKey,
      "x-app-key": apiConfig.appKey,
      "x-access-token": account ? account.access_token : "",
      "x-refresh-token": account ? account.refresh_token : "",
      "Content-Type": "multipart/form-data",
    };
    const formData = new FormData();
    formData.append("username", credentials.username);
    formData.append("password", credentials.password);
    formData.append("replace_session", String(replaceActiveSession));

    try {
      const response = await axios({
        method: "post",
        url: URL_PATH,
        data: formData,
        baseURL: apiConfig.baseUrl,
        headers,
      });
      const body =
        response.data as AuthenticationResponse<AuthenticationAccount>;
      if (body.name && `${body.name}`.toLowerCase() === "success") {
        const loggedInAccount = body.data;
        if (!loggedInAccount) {
          dispatch(loading(false));
          dispatch(Actions.Service.pushErrorNotification("error"));
          return "failed";
        }

        await localSetAccount(loggedInAccount);
        dispatch(setAccount(loggedInAccount));
        if (accountHasRole(loggedInAccount, "customer")) {
          dispatch(
            Actions.Customers.setCustomer({
              id: loggedInAccount.id,
              username: loggedInAccount.username,
            }),
          );
        } else {
          dispatch(Actions.Customers.cleanCustomer());
        }
        dispatch(Actions.Service.pushSuccessNotification("Login"));
        return "success";
      }

      dispatch(loading(false));
      if (body.name) {
        dispatch(
          Actions.Service.pushInfoNotification(body.message ?? "error"),
        );
      } else {
        dispatch(Actions.Service.pushErrorNotification("error"));
      }
      return "failed";
    } catch (cause: unknown) {
      dispatch(loading(false));
      if (axios.isAxiosError(cause)) {
        const responseBody = cause.response?.data as
          | { code?: string; error?: { code?: string } }
          | undefined;
        if (
          responseBody?.code === "ACTIVE_SESSION" ||
          responseBody?.error?.code === "ACTIVE_SESSION"
        ) {
          return "active-session";
        }
      }
      dispatch(Actions.Service.pushErrorNotification(errorMessage(cause)));
      return "failed";
    }
  };
};

const onRegister = (
  credentials: RegistrationCredentials,
): AuthenticationThunk<boolean> => {
  const URL_PATH = "api/v1/auth/register";
  return async (dispatch) => {
    dispatch(loading(true));
    const email = credentials.email.trim().toLowerCase();
    const formData = new FormData();
    formData.append("username", email);
    formData.append("email", email);
    formData.append("password", credentials.password);
    formData.append("repeat_password", credentials.repeatPassword);

    try {
      const response = await axios({
        method: "post",
        url: URL_PATH,
        data: formData,
        baseURL: apiConfig.baseUrl,
        headers: {
          "x-api-key": apiConfig.apiKey,
          "x-app-key": apiConfig.appKey,
          "Content-Type": "multipart/form-data",
        },
      });
      const body = response.data as AuthenticationResponse<unknown>;
      if (body.name && `${body.name}`.toLowerCase() === "success") {
        dispatch(loading(false));
        dispatch(Actions.Service.pushSuccessNotification("Pendaftaran berhasil"));
        return true;
      }

      dispatch(loading(false));
      dispatch(Actions.Service.pushInfoNotification(body.message ?? "error"));
      return false;
    } catch (cause: unknown) {
      dispatch(loading(false));
      dispatch(Actions.Service.pushErrorNotification(errorMessage(cause)));
      return false;
    }
  };
};

const onForgotPassword = (email: string): AuthenticationThunk<boolean> => {
  const URL_PATH = "api/v1/auth/forgot-password";
  return async (dispatch) => {
    dispatch(loading(true));
    const formData = new FormData();
    formData.append("email", email);

    try {
      const response = await axios({
        method: "post",
        url: URL_PATH,
        data: formData,
        baseURL: apiConfig.baseUrl,
        headers: {
          "x-api-key": apiConfig.apiKey,
          "x-app-key": apiConfig.appKey,
          "Content-Type": "multipart/form-data",
        },
      });
      const body = response.data as AuthenticationResponse<unknown>;
      if (body.name && `${body.name}`.toLowerCase() === "success") {
        dispatch(loading(false));
        return true;
      }

      dispatch(loading(false));
      dispatch(Actions.Service.pushInfoNotification(body.message ?? "error"));
      return false;
    } catch (cause: unknown) {
      dispatch(loading(false));
      dispatch(Actions.Service.pushErrorNotification(errorMessage(cause)));
      return false;
    }
  };
};

const onResetPassword = (
  token: string,
  password: string,
  repeatPassword: string,
): AuthenticationThunk<boolean> => {
  const URL_PATH = "api/v1/auth/reset-password";
  return async (dispatch) => {
    dispatch(loading(true));
    const formData = new FormData();
    formData.append("token", token);
    formData.append("password", password);
    formData.append("repeat_password", repeatPassword);

    try {
      const response = await axios({
        method: "post",
        url: URL_PATH,
        data: formData,
        baseURL: apiConfig.baseUrl,
        headers: {
          "x-api-key": apiConfig.apiKey,
          "x-app-key": apiConfig.appKey,
          "Content-Type": "multipart/form-data",
        },
      });
      const body = response.data as AuthenticationResponse<unknown>;
      if (body.name && `${body.name}`.toLowerCase() === "success") {
        dispatch(loading(false));
        return true;
      }

      dispatch(loading(false));
      dispatch(Actions.Service.pushInfoNotification(body.message ?? "error"));
      return false;
    } catch (cause: unknown) {
      dispatch(loading(false));
      dispatch(Actions.Service.pushErrorNotification(errorMessage(cause)));
      return false;
    }
  };
};

const onLogout = (): AuthenticationThunk => {
  const URL_PATH = "api/v1/auth/logout";
  return async (dispatch) => {
    dispatch(loading(true));

    const account = await localGetAccount();
    const headers = {
      "x-api-key": apiConfig.apiKey,
      "x-app-key": apiConfig.appKey,
      "x-access-token": account ? account.access_token : "",
      "x-refresh-token": account ? account.refresh_token : "",
    };

    axios({
      method: "post",
      url: URL_PATH,
      baseURL: apiConfig.baseUrl,
      headers,
    })
      .then((response) => {
        const body = response.data as AuthenticationResponse<unknown>;
        if (body.name && `${body.name}`.toLowerCase() === "success") {
          localRemoveAccount();
          dispatch(removeAccount());
          dispatch(Actions.Customers.cleanCustomer());
          dispatch(Actions.Tables.cleanTable());
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
  onRegister,
  onLogin,
  onLogout,
  onMount,
  onForgotPassword,
  onResetPassword,
};

export default AuthenticationAction;
