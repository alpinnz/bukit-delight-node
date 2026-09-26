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
  id_account: { _id: string; username: string };
  id_order: {
    id_customer: { _id: string; username: string };
    id_table: { _id: string; name: string };
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
        account_id: transaction.id_account._id,
        account_username: transaction.id_account.username,
        order_customer_id: transaction.id_order.id_customer._id,
        order_customer_username: transaction.id_order.id_customer.username,
        order_table_id: transaction.id_order.id_table._id,
        order_table_name: transaction.id_order.id_table.name,
        order_quality: transaction.id_order.quality,
        order_promo: transaction.id_order.promo,
        order_price: transaction.id_order.price,
        order_total_price: transaction.id_order.total_price,
        order_status: transaction.id_order.status,
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
