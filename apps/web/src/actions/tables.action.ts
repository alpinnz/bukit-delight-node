import axios from "axios";
import type {
  ApiResponse,
  CreateTableRequest,
  TableRecord,
  UpdateTableRequest,
} from "@bukit-delight/shared";
import type { AnyAction } from "redux";
import type { ThunkAction } from "redux-thunk";
import Const from "../constant/const";
import Actions from "./";

export const MOUNT = "TABLES/MOUNT";
export const LOADING = "TABLES/LOADING";
export const SET_TABLES = "TABLES/_SET_TABLES";
export const SET_TABLE = "TABLES/SET_TABLE";
export const CLEAN_TABLE = "TABLES/CLEAN_TABLE";

type TableThunk = ThunkAction<void, unknown, unknown, AnyAction>;
type StoredAccount = { accessToken: string; refreshToken: string };
type TableForm = Partial<CreateTableRequest>;
type TablesResponse = ApiResponse<TableRecord[]>;

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

const responseBody = (response: { data: unknown }): TablesResponse =>
  response.data as TablesResponse;

const mount = () => ({ type: MOUNT });

const onMount = (): TableThunk => {
  const URL_PATH = "api/v1/tables";
  return async (dispatch) => {
    const account = localGetAccount();
    axios({
      method: "GET",
      url: URL_PATH,
      baseURL: Const.BASE_URL,
      headers: requestHeaders(account),
    })
      .then((response) => {
        const body = responseBody(response);
        if (body.name && `${body.name}`.toLowerCase() === "success") {
          if (!body.data) {
            dispatch(Actions.Service.pushErrorNotification("error"));
            return;
          }
          dispatch(setTables(body.data));
          setTimeout(() => dispatch(mount()), 1000);
          return;
        }

        if (body.name) {
          dispatch(
            Actions.Service.pushInfoNotification(body.message ?? "error"),
          );
        } else {
          dispatch(Actions.Service.pushErrorNotification("error"));
        }
      })
      .catch((cause: unknown) => {
        dispatch(Actions.Service.pushErrorNotification(errorMessage(cause)));
      });
  };
};

const onLoad = (): TableThunk => {
  const URL_PATH = "api/v1/tables";
  return async (dispatch) => {
    dispatch(loading(true));
    const account = localGetAccount();
    axios({
      method: "GET",
      url: URL_PATH,
      baseURL: Const.BASE_URL,
      headers: requestHeaders(account),
    })
      .then((response) => {
        const body = responseBody(response);
        if (body.name && `${body.name}`.toLowerCase() === "success") {
          if (!body.data) {
            dispatch(Actions.Service.pushErrorNotification("error"));
            dispatch(loading(false));
            return;
          }
          dispatch(setTables(body.data));
          dispatch(onLoadSelectors());
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

const onLoadSelectors = (): TableThunk => {
  return async (dispatch, getState) => {
    const state = getState() as {
      Tables: { table: TableRecord | null; data: TableRecord[] };
    };
    const selectedTable = state.Tables.table;
    if (!selectedTable?._id) return;
    const table = state.Tables.data.find(
      ({ _id }) => _id === selectedTable._id,
    );
    if (table) dispatch(Actions.Tables.setTable(table));
  };
};

const saveTable = (
  method: "POST" | "PUT",
  url: string,
  form: TableForm,
  successMessage: string,
): TableThunk => {
  return async (dispatch) => {
    dispatch(loading(true));
    const formData = new FormData();
    const request: CreateTableRequest | UpdateTableRequest = {
      name: form.name ?? "",
    };
    formData.append("name", request.name);
    const account = localGetAccount();
    axios({
      method,
      url,
      baseURL: Const.BASE_URL,
      data: formData,
      headers: requestHeaders(account),
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

const onCreate = (form: TableForm): TableThunk =>
  saveTable("POST", "api/v1/tables", form, "Create Tables");

const onUpdate = (id: string | undefined, form: TableForm): TableThunk =>
  saveTable("PUT", `api/v1/tables/${id}`, form, "Update Tables");

const onDelete = (id: string): TableThunk => {
  const URL_PATH = `api/v1/tables/${id}`;
  return async (dispatch) => {
    dispatch(loading(true));
    const account = localGetAccount();
    axios({
      method: "DELETE",
      url: URL_PATH,
      baseURL: Const.BASE_URL,
      headers: requestHeaders(account),
    })
      .then((response) => {
        const body = responseBody(response);
        if (body.name && `${body.name}`.toLowerCase() === "success") {
          dispatch(onLoad());
          dispatch(Actions.Service.pushSuccessNotification("Delete Tables"));
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

const setTables = (tables: TableRecord[]) => ({
  type: SET_TABLES,
  payload: tables,
});
const setTable = (table: TableRecord) => ({ type: SET_TABLE, payload: table });
const cleanTable = () => ({ type: CLEAN_TABLE });
const loading = (isLoading: boolean) => ({ type: LOADING, payload: isLoading });

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
