import type { AnyAction } from "redux";
import type { TransactionRecord } from "@bukit-delight/shared";
import {
  CLEAN_TRANSACTION,
  DIALOG_REVIEW_HIDE,
  DIALOG_REVIEW_OPEN,
  DIALOG_STATUS_HIDE,
  DIALOG_STATUS_OPEN,
  LOADING,
  MOUNT,
  SET_TRANSACTION,
  SET_TRANSACTIONS,
} from "../actions/transactions.action";

export type { TransactionRecord } from "@bukit-delight/shared";

type ApiTransactionRecord = {
  user_id: { id: string; username: string };
  order_id: {
    customer_id: { id: string; username: string };
    table_id: { id: string; name: string };
    quality: unknown;
    promo: unknown;
    price: unknown;
    total_price: unknown;
    status: string;
  };
  [key: string]: unknown;
};

export type TransactionsState = {
  mount: boolean;
  loading: boolean;
  transaction: TransactionRecord | null;
  data: TransactionRecord[];
  dialog_review: { open: boolean };
  dialog_status: { open: boolean };
};

const initialState: TransactionsState = {
  mount: false,
  loading: false,
  transaction: null,
  data: [],
  dialog_review: { open: false },
  dialog_status: { open: false },
};

const TransactionsReducer = (
  state: TransactionsState = initialState,
  action: AnyAction,
): TransactionsState => {
  if (action.type === MOUNT) return { ...state, mount: true };
  if (action.type === LOADING) {
    return { ...state, loading: action.payload as boolean };
  }
  if (action.type === SET_TRANSACTIONS) {
    const transactions = action.payload as ApiTransactionRecord[];
    return {
      ...state,
      mount: true,
      loading: false,
      data: transactions.map((transaction): TransactionRecord => ({
        ...transaction,
        user_id: transaction.user_id.id,
        user_username: transaction.user_id.username,
        order_customer_id: transaction.order_id.customer_id.id,
        order_customer_username: transaction.order_id.customer_id.username,
        order_table_id: transaction.order_id.table_id.id,
        order_table_name: transaction.order_id.table_id.name,
        order_quality: transaction.order_id.quality,
        order_promo: transaction.order_id.promo,
        order_price: transaction.order_id.price,
        order_total_price: transaction.order_id.total_price,
        order_status: transaction.order_id.status,
      })),
    };
  }
  if (action.type === SET_TRANSACTION) {
    return {
      ...state,
      loading: false,
      transaction: action.payload as TransactionRecord,
    };
  }
  if (action.type === CLEAN_TRANSACTION) {
    return { ...state, loading: false, transaction: null };
  }
  if (action.type === DIALOG_STATUS_OPEN) {
    return { ...state, dialog_status: { open: true } };
  }
  if (action.type === DIALOG_STATUS_HIDE) {
    return { ...state, dialog_status: { open: false } };
  }
  if (action.type === DIALOG_REVIEW_OPEN) {
    return { ...state, dialog_review: { open: true } };
  }
  if (action.type === DIALOG_REVIEW_HIDE) {
    return { ...state, dialog_review: { open: false } };
  }
  return state;
};

export default TransactionsReducer;
