import type { AnyAction } from "redux";
import type { OrderPaymentStatus, OrderRecord } from "@bukit-delight/shared";
import {
  DIALOG_PAYMENT_HIDE,
  DIALOG_PAYMENT_OPEN,
  DIALOG_REVIEW_HIDE,
  DIALOG_REVIEW_OPEN,
  CLEAN_ORDER,
  LOADING,
  MOUNT,
  SET_ORDER,
  SET_ORDERS,
} from "../actions/orders.action";

export type { OrderRecord } from "@bukit-delight/shared";

type ApiOrderRecord = {
  customer_id: { username: string };
  table_id: { name: string };
  [key: string]: unknown;
};

export type OrdersState = {
  mount: boolean;
  loading: boolean;
  order: OrderRecord | null;
  data: OrderRecord[];
  dialog_payment: { open: boolean };
  dialog_review: { open: boolean };
};

const initialState: OrdersState = {
  mount: false,
  loading: false,
  order: null,
  data: [],
  dialog_payment: { open: false },
  dialog_review: { open: false },
};

const OrdersReducer = (
  state: OrdersState = initialState,
  action: AnyAction,
): OrdersState => {
  if (action.type === MOUNT) return { ...state, mount: true };
  if (action.type === LOADING) {
    return { ...state, loading: action.payload as boolean };
  }
  if (action.type === SET_ORDERS) {
    const orders = action.payload as ApiOrderRecord[];
    return {
      ...state,
      data: orders.map((order): OrderRecord => ({
        ...order,
        customer_username: order.customer_id.username,
        table_name: order.table_id.name,
      })),
    };
  }
  if (action.type === SET_ORDER) {
    return {
      ...state,
      loading: false,
      order: action.payload as OrderRecord,
    };
  }
  if (action.type === CLEAN_ORDER) {
    return { ...state, loading: false, order: null };
  }
  if (action.type === DIALOG_PAYMENT_OPEN) {
    return { ...state, dialog_payment: { open: true } };
  }
  if (action.type === DIALOG_PAYMENT_HIDE) {
    return { ...state, dialog_payment: { open: false } };
  }
  if (action.type === DIALOG_REVIEW_OPEN) {
    return { ...state, dialog_review: { open: true } };
  }
  if (action.type === DIALOG_REVIEW_HIDE) {
    return { ...state, dialog_review: { open: false } };
  }
  return state;
};

export default OrdersReducer;
