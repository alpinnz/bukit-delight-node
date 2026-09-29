import axios from "axios";
import type { ApiResponse, TransactionRecord } from "@bukit-delight/shared";
import type { AnyAction } from "redux";
import type { ThunkAction } from "redux-thunk";
import type {
  TransactionPaymentMethod,
  TransactionStatus,
} from "@bukit-delight/shared";
import Const from "../constant/const";
import Actions from "./";
import type { RootState } from "../reducers";

export const MOUNT = "TRANSACTIONS/MOUNT";
export const LOADING = "TRANSACTIONS/LOADING";
export const SET_TRANSACTIONS = "TRANSACTIONS/SET_TRANSACTIONS";
export const SET_TRANSACTION = "TRANSACTIONS/SET_TRANSACTION";
export const CLEAN_TRANSACTION = "TRANSACTIONS/CLEAN_TRANSACTION";
export const DIALOG_STATUS_OPEN = "TRANSACTIONS/DIALOG_STATUS_OPEN";
export const DIALOG_STATUS_HIDE = "TRANSACTIONS/DIALOG_STATUS_HIDE";
export const DIALOG_REVIEW_OPEN = "TRANSACTIONS/DIALOG_REVIEW_OPEN";
export const DIALOG_REVIEW_HIDE = "TRANSACTIONS/DIALOG_REVIEW_HIDE";

type TransactionThunk = ThunkAction<void, RootState, unknown, AnyAction>;
type StoredAccount = { accessToken: string; refreshToken: string };
type TransactionsResponse = ApiResponse<TransactionRecord[]>;
type CreateTransactionInput = {
  note?: string;
  payment: TransactionPaymentMethod;
};

const localGetAccount = (): StoredAccount | null => {
  const account = localStorage.getItem("account");
  return account ? (JSON.parse(account) as StoredAccount) : null;
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

const responseBody = (response: { data: unknown }): TransactionsResponse =>
  response.data as TransactionsResponse;

const mount = () => ({ type: MOUNT });
const loading = (isLoading: boolean) => ({ type: LOADING, payload: isLoading });

const loadTransactions = (isInitialLoad: boolean): TransactionThunk => {
  const URL_PATH = "api/v1/transactions";
  return (dispatch) => {
    if (isInitialLoad) dispatch(loading(true));
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
          dispatch(setTransactions(body.data));
          setTimeout(() => dispatch(onLoadSelectors()), 2000);
          return;
        }
        if (body.name) {
          dispatch(
            Actions.Service.pushInfoNotification(body.message ?? "error"),
          );
        } else {
          dispatch(Actions.Service.pushErrorNotification("error"));
        }
        if (isInitialLoad) dispatch(loading(false));
      })
      .catch((cause: unknown) => {
        dispatch(Actions.Service.pushErrorNotification(errorMessage(cause)));
        if (isInitialLoad) dispatch(loading(false));
      });
  };
};

const onMount = (): TransactionThunk => loadTransactions(true);
const onLoad = (): TransactionThunk => loadTransactions(false);

const onLoadSelectors = (): TransactionThunk => {
  return (dispatch, getState) => {
    const state = getState();
    const transactions = state.Transactions;

    if (transactions.transaction?._id) {
      const selectedTransaction = transactions.data.find(
        ({ _id }) => _id === transactions.transaction?._id,
      );
      if (selectedTransaction) dispatch(setTransaction(selectedTransaction));
    }

    setTimeout(() => {
      if (transactions.loading) dispatch(loading(false));
      if (!transactions.mount) dispatch(mount());
    }, 1000);
  };
};

const onCreate = (input: CreateTransactionInput): TransactionThunk => {
  const URL_PATH = "api/v1/transactions";
  return (dispatch, getState) => {
    dispatch(loading(true));
    const state = getState();
    const accountId = state.Authentication.account?._id;
    const orderId = state.Orders.order?._id;
    if (!accountId || !orderId) {
      dispatch(
        Actions.Service.pushErrorNotification("Account and order are required"),
      );
      dispatch(loading(false));
      return;
    }

    const formData = new FormData();
    formData.append("id_account", accountId);
    formData.append("id_order", orderId);
    if (input.note) formData.append("note", input.note);
    formData.append("payment", input.payment);

    axios({
      method: "POST",
      url: URL_PATH,
      baseURL: Const.BASE_URL,
      data: formData,
      headers: requestHeaders(localGetAccount()),
    })
      .then((response) => {
        const body = responseBody(response);
        if (body.name && `${body.name}`.toLowerCase() === "success") {
          dispatch(onLoad());
          dispatch(Actions.Orders.onLoad());
          dispatch(
            Actions.Service.pushSuccessNotification("Create Transactions"),
          );
          dispatch(Actions.Orders.hideDialogPayment());
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

const onUpdateStatus = (input: {
  status: TransactionStatus;
}): TransactionThunk => {
  return (dispatch, getState) => {
    dispatch(loading(true));
    const transactionId = getState().Transactions.transaction?._id;
    if (!transactionId) {
      dispatch(
        Actions.Service.pushErrorNotification("Transaction is required"),
      );
      dispatch(loading(false));
      return;
    }

    const formData = new FormData();
    formData.append("status", input.status);
    axios({
      method: "PUT",
      url: `api/v1/transactions/status/${transactionId}`,
      baseURL: Const.BASE_URL,
      data: formData,
      headers: requestHeaders(localGetAccount()),
    })
      .then((response) => {
        const body = responseBody(response);
        if (body.name && `${body.name}`.toLowerCase() === "success") {
          dispatch(onLoad());
          dispatch(
            Actions.Service.pushSuccessNotification(
              "Update status transaction",
            ),
          );
          dispatch(Actions.Service.hideFormDialog());
          dispatch(Actions.Transactions.hideDialogStatus());
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

const setTransactions = (transactions: TransactionRecord[]) => ({
  type: SET_TRANSACTIONS,
  payload: transactions,
});
const setTransaction = (transaction: TransactionRecord) => ({
  type: SET_TRANSACTION,
  payload: transaction,
});
const cleanTransaction = () => ({ type: CLEAN_TRANSACTION });
const openDialogStatus = () => ({ type: DIALOG_STATUS_OPEN });
const hideDialogStatus = () => ({ type: DIALOG_STATUS_HIDE });
const openDialogReview = () => ({ type: DIALOG_REVIEW_OPEN });
const hideDialogReview = () => ({ type: DIALOG_REVIEW_HIDE });

const TransactionsAction = {
  onMount,
  onLoad,
  onCreate,
  onUpdateStatus,
  setTransaction,
  cleanTransaction,
  openDialogStatus,
  hideDialogStatus,
  openDialogReview,
  hideDialogReview,
};

export default TransactionsAction;
