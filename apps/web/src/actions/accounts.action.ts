import axios from "axios";
import type {
  ApiResponse,
  AccountRecord,
  CreateAccountRequest,
  UpdateAccountRequest,
} from "@bukit-delight/shared";
import type { AnyAction } from "redux";
import type { ThunkAction } from "redux-thunk";
import Const from "../constant/const";
import Actions from "./";
import type { RootState } from "../reducers";

export const MOUNT = "ACCOUNTS/MOUNT";
export const LOADING = "ACCOUNTS/LOADING";
export const SET_ACCOUNTS = "ACCOUNTS/SET_ACCOUNTS";

type AccountThunk = ThunkAction<void, RootState, unknown, AnyAction>;
type StoredAccount = { accessToken: string; refreshToken: string };
type AccountsResponse = ApiResponse<AccountRecord[]>;
type AccountForm =
  Partial<CreateAccountRequest> | Partial<UpdateAccountRequest>;

const localGetAccount = (): StoredAccount | null => {
  const serializedAccount = localStorage.getItem("account");
  return serializedAccount
    ? (JSON.parse(serializedAccount) as StoredAccount)
    : null;
};

const requestHeaders = (account: StoredAccount | null) => ({
  "x-api-key": Const.X_API_KEY,
  "x-app-key": Const.X_APP_KEY,
  "x-access-token": account?.accessToken ?? "",
  "x-refresh-token": account?.refreshToken ?? "",
});

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

const responseBody = (response: { data: unknown }): AccountsResponse =>
  response.data as AccountsResponse;

const mount = () => ({ type: MOUNT });
const loading = (isLoading: boolean) => ({ type: LOADING, payload: isLoading });

const loadAccounts = (isInitialLoad: boolean): AccountThunk => {
  const URL_PATH = "api/v1/accounts/";
  return (dispatch) => {
    if (!isInitialLoad) dispatch(loading(true));
    axios({
      method: "GET",
      url: URL_PATH,
      baseURL: Const.BASE_URL,
      headers: requestHeaders(localGetAccount()),
    })
      .then((response) => {
        const body = responseBody(response);
        if (body.name && `${body.name}`.toLowerCase() === "success") {
          if (!body.data) {
            dispatch(Actions.Service.pushErrorNotification("error"));
            dispatch(loading(false));
            return;
          }
          dispatch(setAccounts(body.data));
          if (isInitialLoad) setTimeout(() => dispatch(mount()), 1000);
          return;
        }
        if (body.name) {
          dispatch(
            Actions.Service.pushInfoNotification(body.message ?? "error"),
          );
        } else {
          dispatch(Actions.Service.pushErrorNotification("error"));
        }
        dispatch(loading(false));
      })
      .catch((cause: unknown) => {
        dispatch(Actions.Service.pushErrorNotification(errorMessage(cause)));
        dispatch(loading(false));
      });
  };
};

const onMount = (): AccountThunk => loadAccounts(true);
const onLoad = (): AccountThunk => loadAccounts(false);

const submitAccount = (
  method: "POST" | "PUT",
  url: string,
  input: AccountForm,
  successMessage: string,
): AccountThunk => {
  return (dispatch) => {
    dispatch(loading(true));
    const formData = new FormData();
    formData.append("username", input.username ?? "");
    formData.append("email", input.email ?? "");
    formData.append("id_role", input.id_role ?? "");
    if (method === "POST" || (input.password && input.repeat_password)) {
      formData.append("password", input.password ?? "");
      formData.append("repeat_password", input.repeat_password ?? "");
    }

    axios({
      method,
      url,
      baseURL: Const.BASE_URL,
      data: formData,
      headers: requestHeaders(localGetAccount()),
    })
      .then((response) => {
        const body = responseBody(response);
        if (body.name && `${body.name}`.toLowerCase() === "success") {
          dispatch(onLoad());
          dispatch(Actions.Service.pushSuccessNotification(successMessage));
          dispatch(Actions.Service.hideFormDialog());
          dispatch(loading(false));
          return;
        }
        if (body.name) {
          dispatch(
            Actions.Service.pushInfoNotification(body.message ?? "error"),
          );
        } else {
          dispatch(Actions.Service.pushErrorNotification("error"));
        }
        dispatch(loading(false));
      })
      .catch((cause: unknown) => {
        dispatch(Actions.Service.pushErrorNotification(errorMessage(cause)));
        dispatch(loading(false));
      });
  };
};

const onCreate = (input: Partial<CreateAccountRequest>): AccountThunk =>
  submitAccount("POST", "api/v1/accounts/", input, "Create Account");

const onUpdate = (
  id: string | undefined,
  input: Partial<UpdateAccountRequest>,
): AccountThunk =>
  submitAccount("PUT", `api/v1/accounts/${id}`, input, "Update Account");

const onDelete = (id: string): AccountThunk => {
  return (dispatch) => {
    dispatch(loading(true));
    axios({
      method: "DELETE",
      url: `api/v1/accounts/${id}`,
      baseURL: Const.BASE_URL,
      headers: requestHeaders(localGetAccount()),
    })
      .then((response) => {
        const body = responseBody(response);
        if (body.name && `${body.name}`.toLowerCase() === "success") {
          dispatch(onLoad());
          dispatch(Actions.Service.pushSuccessNotification("Delete Account"));
          dispatch(Actions.Service.hideFormDialog());
          dispatch(loading(false));
          return;
        }
        if (body.name) {
          dispatch(
            Actions.Service.pushInfoNotification(body.message ?? "error"),
          );
        } else {
          dispatch(Actions.Service.pushErrorNotification("error"));
        }
        dispatch(loading(false));
      })
      .catch((cause: unknown) => {
        dispatch(Actions.Service.pushErrorNotification(errorMessage(cause)));
        dispatch(loading(false));
      });
  };
};

const setAccounts = (accounts: AccountRecord[]) => ({
  type: SET_ACCOUNTS,
  payload: accounts,
});

const AccountsAction = { onMount, onLoad, onCreate, onUpdate, onDelete };

export default AccountsAction;
